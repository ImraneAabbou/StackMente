<?php

namespace App\Listeners;

use App\Events\Commented;
use App\Notifications\CommentNotification;

class SendCommentNotification
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
    public function handle(Commented $event): void
    {
        $comment = $event->comment;
        $commenter = $comment->user;
        $post = $comment->post;
        $postOwner = $comment->post->user;


        $postOwner->notify(
            new CommentNotification($comment, $commenter, $post)
        );
    }
}
