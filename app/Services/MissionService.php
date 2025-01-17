<?php

namespace App\Services;

use App\Enums\MissionType;
use App\Enums\PostType;
use App\Enums\VotableType;
use App\Enums\VoteType;
use App\Models\Comment;
use App\Models\Mission;
use App\Models\Post;
use App\Models\User;
use App\Models\Vote;
use Illuminate\Support\Collection;

/**
 * Class MissionService
 * @package App\Services
 */
class MissionService
{
    public function __construct(
        private User $user
    ) {}

    /**
     * Returns the non achieved missions
     * @return Collection<int,Mission>
     */
    public function getAchievedMissions(): Collection
    {
        return $this->user->missions()->get();
    }

    /**
     * Returns the non achieved missions
     * @return Collection<int,Mission>
     */
    public function getNonAchievedMissions(): Collection
    {
        return Mission::whereNotIn('id', $this->user->missions->pluck('id'))->get();
    }

    /*
     * Returns total of achieved missions
     *
     * @return int
     */
    public function getTotalAchievedMissions(): int
    {
        return $this->user->missions()->count();
    }

    /*
     * Returns if should mark accomplishement
     * of the given mission
     *
     * @return bool
     */
    public function shouldMarkAccomplishment(Mission $mission): bool
    {
        // In case mission is already marked accomplished
        if (
            $this
                ->getAchievedMissions()
                ->pluck('id')
                ->has($mission->id)
        )
            return false;

        $stats = $this->user->stats;

        switch ($mission->type) {
            // Non-configurable missions

            case MissionType::LINKING_WITH_PROVIDERS:
                $numOfLinkedProviders = collect($this->user->providers)->keys()->count();
                return $numOfLinkedProviders === $mission->threshold;

            case MissionType::PROFILE_SETUP:
                $u = $this->user;
                $isSetup =
                    $u->email &&
                    $u->email_verified_at &&
                    $u->bio &&
                    $u->password &&
                    $u->avatar;

                return $isSetup;

            case MissionType::EMAIL_VERIFICATION:
                $isEmailVerified = !!$this->user->email_verified_at;
                return $isEmailVerified;

                // Configurable missions

            case MissionType::LOGIN_STREAK:
                return $stats['login']['streak'] >= $mission->threshold;

            case MissionType::LEVEL:
                return $stats['level'] >= $mission->threshold;

            case MissionType::TIMESPENT:
                return $stats['timespent'] >= $mission->threshold;

            case MissionType::XP_TOTAL:
                return $stats['xp']['total'] >= $mission->threshold;

            case MissionType::XP_WEEKLY:
                return $stats['xp']['weekly'] >= $mission->threshold;

            case MissionType::XP_MONTHLY:
                return $stats['xp']['monthly'] >= $mission->threshold;

            case MissionType::XP_YEARLY:
                return $stats['xp']['yearly'] >= $mission->threshold;

            case MissionType::TOTAL_OWNED_POSTS:
                return $this->user->posts()->count() >= $mission->threshold;

            case MissionType::TOTAL_OWNED_ARTICLES:
                $totalOwned = $this->user->posts()->where('type', PostType::ARTICLE)->count();
                return $totalOwned >= $mission->threshold;

            case MissionType::TOTAL_OWNED_QUESTIONS:
                $totalOwned = $this->user->posts()->where('type', PostType::QUESTION)->count();
                return $totalOwned >= $mission->threshold;

            case MissionType::TOTAL_OWNED_SUBJECTS:
                $totalOwned = $this->user->posts()->where('type', PostType::SUBJECT)->count();
                return $totalOwned >= $mission->threshold;

            case MissionType::TOTAL_MADE_COMMENTS:
                return $this->user->comments()->count() >= $mission->threshold;

            case MissionType::RECEIVED_POSTS_VOTE_UPS:
                $totalMarkedComments = $this->user->posts->map(
                    fn(Post $p) => $p->totalUpVotes()
                )->sum();

                return $totalMarkedComments >= $mission->threshold;

            case MissionType::RECEIVED_COMMENTS_VOTE_UPS:
                $totalCommentsVoteUps = $this->user->comments->map(
                    fn(Comment $p) => $p->totalUpVotes()
                )->sum();

                return $totalCommentsVoteUps >= $mission->threshold;

            case MissionType::TOTAL_MARKED_COMMENTS:
                $totalMarkedComments = $this->user->comments->filter(
                    fn(Comment $p) => $p->is_marked
                )->count();

                return $totalMarkedComments >= $mission->threshold;

            case MissionType::MADE_POSTS_VOTE_UPS:
                $totalMadePostsVoteUps = Vote::where([
                    ['type', VoteType::UP],
                    ['votable_type', VotableType::POST],
                    ['user_id', $this->user->id]
                ])->count();

                return $totalMadePostsVoteUps >= $mission->threshold;

            case MissionType::MADE_POSTS_VOTE_DOWNS:
                $totalMadePostsVoteDowns = Vote::where([
                    ['type', VoteType::DOWN],
                    ['votable_type', VotableType::POST],
                    ['user_id', $this->user->id]
                ])->count();

                return $totalMadePostsVoteDowns >= $mission->threshold;

            case MissionType::MADE_COMMENTS_VOTE_UPS:
                $totalMadeCommentsVoteUps = Vote::where([
                    ['type', VoteType::UP],
                    ['votable_type', VotableType::COMMENT],
                    ['user_id', $this->user->id]
                ])->count();

                return $totalMadeCommentsVoteUps >= $mission->threshold;

            case MissionType::MADE_COMMENTS_VOTE_DOWNS:
                $totalMadeCommentsVoteDowns = Vote::where([
                    ['type', VoteType::DOWN],
                    ['votable_type', VotableType::COMMENT],
                    ['user_id', $this->user->id]
                ])->count();

                return $totalMadeCommentsVoteDowns >= $mission->threshold;
        }

        return false;
    }

    /*
     * Returns true if there are accomplished missions
     * that are not marked accomplished yet
     *
     * @return bool
     */
    public function shouldSyncMissions(): bool
    {
        return $this->getNonAchievedMissions()->some(
            fn(Mission $m) => $this->shouldMarkAccomplishment($m)
        );
    }

    /*
     * Syncs user's missions if needed
     * Returns the missions that were recently marked accomplished
     *
     * @return Collection<int,Mission>
     */
    public function syncMissions(): Collection
    {
        if (!$this->shouldSyncMissions())
            return collect();

        $missions = $this
            ->getNonAchievedMissions()
            ->filter(fn(Mission $m) => $this->shouldMarkAccomplishment($m));

        $missions->each(fn(Mission $m) => $this->markAccomplished($m));

        return $missions;
    }

    /*
     * Marks the given mission accomplished
     *
     * @return void
     */
    public function markAccomplished(Mission $mission): void
    {
        $this->user->missions()->attach($mission);
        $this->user->refresh();
    }
}
