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
        $isChanged = $this->user->isDirty("stats");
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

        return $currentTotal >= $this->calculateNextLevelTotalXp();
    }

    /*
     * Calculates the next total needed xp for next level
     * @return int
     */
    public function calculateNextLevelTotalXp(): int
    {
        $currentLevel = $this->user->stats['level'];
        $curveLevel = 10;
        $base = 100;

        if ($currentLevel <= $curveLevel) {
            return $base * ($currentLevel - 1) + 100;
        }

        $growthFactor = 1 + ($currentLevel - $curveLevel) * 0.075;

        return $base * 10 + (($currentLevel * $currentLevel) * ($currentLevel - $curveLevel)) * $growthFactor;
    }
}
