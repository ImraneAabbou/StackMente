<?php

namespace App\Observers;

use App\Actions\SyncEverything;
use App\Models\Vote;

class VoteObserver
{
    /**
     * Handle the Vote "created" event.
     */
    public function created(Vote $vote): void
    {
        // TODO: voted event (postvoted/commentvoted)
        // TODO: reward voter
        // TODO: reward post owner (only if up vote)

        SyncEverything::execute();
    }

    /**
     * Handle the Vote "updated" event.
     */
    public function updated(Vote $vote): void
    {
        // TODO: reward voter
        // TODO: reward post owner (only if up vote)
        // TODO: decrese increased xp for post owner (only if down vote or unvote)

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
