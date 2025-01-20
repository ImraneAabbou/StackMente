<?php

namespace App\Observers;

use App\Actions\SyncEverything;
use App\Events\Commented;
use App\Models\Comment;
use App\Services\StatsService;

class CommentObserver
{
    /**
     * Handle the Comment "created" event.
     */
    public function created(Comment $comment): void
    {
        event(new Commented($comment));

        (new StatsService($comment->post->user))
            ->incrementXPBy(
                config('rewards.receive_comment')
            );

        SyncEverything::execute();
    }

    /**
     * Handle the Comment "updated" event.
     */
    public function updated(Comment $comment): void
    {
        //
    }

    /**
     * Handle the Comment "deleted" event.
     */
    public function deleted(Comment $comment): void
    {
        //
    }

    /**
     * Handle the Comment "restored" event.
     */
    public function restored(Comment $comment): void
    {
        //
    }

    /**
     * Handle the Comment "force deleted" event.
     */
    public function forceDeleted(Comment $comment): void
    {
        //
    }
}
