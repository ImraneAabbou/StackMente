<?php

namespace App\Listeners;

use App\Enums\VotableType;
use App\Events\Voted;
use App\Notifications\CommentVotedNotification;
use App\Notifications\PostVotedNotification;

class SendVotedNotification
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
    public function handle(Voted $event): void
    {
        $vote = $event->vote;
        $voter = $vote->user;
        $votable = $vote->votable;
        $votableOwner = $vote->votable->user;

        $votableOwner->notify(
            ($vote->votable_type === VotableType::POST)
                ? new PostVotedNotification($voter, $votable)
                : new CommentVotedNotification($voter, $votable, $votable->post)
        );
    }
}
