<?php

namespace App\Listeners;

use App\Events\Replied;
use App\Notifications\ReplyNotification;

class SendReplyNotification
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
    public function handle(Replied $event): void
    {
        $reply = $event->reply;
        $replier = $reply->user;
        $post = $reply->comment->post;
        $commentOwner = $reply->comment->user;

        $commentOwner->notify(
            new ReplyNotification($reply, $replier, $post)
        );
    }
}
