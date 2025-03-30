<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\DB;

/**
 * Class StatsService
 * @package App\Services
 */
class StatsService
{
    public function __construct(
        public User $user
    ) {}

    /*
     * Increments the xp of ther user by the given number
     * XP total after change
     *
     * @return int
     */
    public function incrementXPBy(int $n): int
    {
        $stats = $this->user->stats;
        $stats['xp']['total'] += $n;
        $this->user->stats = $stats;
        $this->user->save();
        $this->user->refresh();

        return $stats['xp']['total'];
    }

    /*
     * Sync timespent based on the last interaction of user
     * returns true if synced false if not
     * @return bool
     */
    public function syncTimespent(): bool
    {
        $willSync = $this->shouldSyncTimespent();
        $stats = $this->user->stats;

        if ($willSync) {
            $stats['timespent'] += now()->diffInSeconds(
                $stats['last_interaction'], true
            );
        }

        $stats['last_interaction'] = now();

        $this->user->stats = $stats;
        $this->user->save();
        $this->user->refresh();

        return $willSync;
    }

    /*
     * Returns either it's ok to sync the timespent or no
     * @return bool
     */
    public function shouldSyncTimespent(): bool
    {
        return now()->diffInMinutes($this->user->stats['last_interaction'], true) <= 5;
    }

    /*
     * Sync login streak
     * returns true if incremented and false if not
     *
     * @return bool
     */
    public function syncLoginStreak(): bool
    {
        $stats = $this->user->stats;

        if (!$this->shouldSyncLoginStreak())
            $stats['login']['streak_started_at'] = now();

        $stats['login']['streak'] = (int) now()->diffInDays(
            $stats['login']['streak_started_at'],
            true
        );

        $stats['login']['max_streak'] = $this->getSyncedMaxLoginStreak();

        $stats['last_interaction'] = now();

        $this->user->stats = $stats;
        $isChanged = $this->user->isDirty('stats');
        $this->user->save();
        $this->user->refresh();

        return $isChanged;
    }

    /*
     * Returns the synced login max streak
     */
    public function getSyncedMaxLoginStreak(): int
    {
        $stats = $this->user->stats;

        return (
            $stats['login']['max_streak'] > $stats['login']['streak']
                ? $stats['login']['max_streak']
                : $stats['login']['streak']
        );
    }

    /*
     * Returns either it's should sync the login streak or no
     * @return bool
     */
    public function shouldSyncLoginStreak(): bool
    {
        return now()->diffInHours($this->user->stats['last_interaction'], true) <= 24;
    }

    /*
     * Returns the rank of the user
     */
    public function getRank(string $period): int
    {
        return DB::selectOne('call getUserWithRankById(?, ?)', [$this->user->id, $period])->rank;
    }

    /*
     * Returns the rank of the user
     */
    static function getTopTenUsers(string $period): array
    {
        return DB::select('call getTopTenUsersBy(?)', [$period]);
    }

    /*
     * level up the user
     */
    public function levelUp(): void
    {
        $stats = $this->user->stats;
        $stats['level']++;
        $this->user->stats = $stats;
        $this->user->save();
    }

    /*
     * Sync user level according to xp
     * @return void
     */
    public function syncLevel(): void
    {
        if ($this->shouldSyncLevel())
            $this->levelUp();
    }

    /*
     * Either the level should be synced/up
     * @return bool
     */
    public function shouldSyncLevel(): bool
    {
        $currentTotal = $this->user->stats['xp']['total'];

        return $currentTotal >= $this->calcToNextLevelTotalXPByLevel($this->user->stats['level']);
    }

    /**
     * Calculates the needed xp total
     * To reach to pass the given level
     *
     * @return int
     */
    static function calcToNextLevelTotalXPByLevel(int $level): int
    {
        $curveLevel = 10;
        $base = 100;

        if ($level <= $curveLevel) {
            return $base * ($level - 1) + 100;
        }

        $growthFactor = 1 + ($level - $curveLevel) * 0.075;

        return $base * 10 + (($level * $level) * ($level - $curveLevel)) * $growthFactor;
    }

    /**
     * Reset user's stats
     *
     * @return void
     */
    public function resetStats(): void
    {
        $stats = [
            'xp' => [
                'total' => 0,
                'daily' => 0,
                'weekly' => 0,
                'monthly' => 0,
                'yearly' => 0,
            ],
            'login' => [
                'streak' => 0,
                'max_streak' => 0,
                'streak_started_at' => now(),
            ],
            'last_interaction' => now(),
            'timespent' => 0,
            'level' => 1,
        ];
        $this->user->stats = $stats;
        $this->user->save();
    }

    /**
     * Returns the current user's information
     */
    public function getUserStats(): ?array
    {
        $userXP = $this->user['stats->xp->total'];
        $currLevelTotal = static::calcToNextLevelTotalXPByLevel($this->user->stats['level'] - 1);
        $nextLevelTotal = static::calcToNextLevelTotalXPByLevel($this->user->stats['level']);

        $userStats = [
            'stats' => [
                'xp' => [
                    'curr_level_total' => $currLevelTotal,
                    'next_level_total' => $nextLevelTotal,
                    'percent_to_next_level' => ($currLevelTotal - $userXP) / ($nextLevelTotal - $userXP)
                ],
                'rank' => [
                    'total' => $this->getRank('total'),
                    'daily' => $this->getRank('daily'),
                    'weekly' => $this->getRank('weekly'),
                    'monthly' => $this->getRank('monthly'),
                    'yearly' => $this->getRank('yearly'),
                ]
            ]
        ];

        return $userStats;
    }
}
