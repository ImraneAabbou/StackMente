<?php

namespace App\Observers;

use App\Actions\SyncEverything;
use App\Enums\VotableType;
use App\Enums\VoteType;
use App\Events\Voted;
use App\Models\Vote;
use App\Services\StatsService;

class VoteObserver
{
    /**
     * Handle the Vote "created" event.
     */
    public function created(Vote $vote): void
    {
        if ($vote->user_id !== $vote->votable->user_id) {
            event(new Voted($vote));

            if ($vote->type === VoteType::UP)
                (new StatsService($vote->votable->user))
                    ->incrementXPBy(
                        ($vote->votable->votable_type === VotableType::POST)
                            ? config('rewards.receive_post_vote')
                            : config('rewards.receive_comment_vote')
                    );

            (new StatsService($vote->user))
                ->incrementXPBy(
                    ($vote->votable->votable_type === VotableType::POST)
                        ? config('rewards.send_post_vote')
                        : config('rewards.send_comment_vote')
                );
        }

        SyncEverything::execute();
    }

    /**
     * Handle the Vote "updated" event.
     */
    public function updated(Vote $vote): void
    {
        if ($vote->type === VoteType::UP)
            (new StatsService($vote->votable->user))
                ->incrementXPBy(
                    ($vote->votable->votable_type === VotableType::POST)
                        ? config('rewards.receive_post_vote')
                        : config('rewards.receive_comment_vote')
                );
        else
            (new StatsService($vote->votable->user))
                ->incrementXPBy(
                    ($vote->votable->votable_type === VotableType::POST)
                        ? -config('rewards.receive_post_vote')
                        : -config('rewards.receive_comment_vote')
                );

        SyncEverything::execute();
    }

    /**
     * Handle the Vote "deleted" event.
     */
    public function deleted(Vote $vote): void
    {
        //
    }

    /**
     * Handle the Vote "restored" event.
     */
    public function restored(Vote $vote): void
    {
        //
    }

    /**
     * Handle the Vote "force deleted" event.
     */
    public function forceDeleted(Vote $vote): void
    {
        //
    }
}
