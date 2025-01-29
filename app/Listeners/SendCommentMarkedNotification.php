<?php

namespace App\Listeners;

use App\Events\CommentMarked;
use App\Notifications\CommentMarkedNotification;

class SendCommentMarkedNotification
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(CommentMarked $event): void
    {
        $comment = $event->comment;
        $commenter = $event->comment->user;

        $commenter->notify(
            new CommentMarkedNotification($comment)
        );
    }
}
