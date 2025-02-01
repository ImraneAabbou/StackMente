<?php

namespace App\Observers;

use App\Events\Replied;
use App\Models\Reply;

class ReplyObserver
{
    /**
     * Handle the Reply "created" event.
     */
    public function created(Reply $reply): void
    {
        if ($reply->user_id !== $reply->comment->user_id) {
            event(new Replied($reply));
        }
    }

    /**
     * Handle the Reply "updated" event.
     */
    public function updated(Reply $reply): void
    {
        //
    }

    /**
     * Handle the Reply "deleted" event.
     */
    public function deleted(Reply $reply): void
    {
        //
    }

    /**
     * Handle the Reply "restored" event.
     */
    public function restored(Reply $reply): void
    {
        //
    }

    /**
     * Handle the Reply "force deleted" event.
     */
    public function forceDeleted(Reply $reply): void
    {
        //
    }
}
