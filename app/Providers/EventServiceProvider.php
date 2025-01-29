<?php

namespace App\Providers;

use App\Events\Commented;
use App\Events\CommentMarked;
use App\Events\MissionAccomplished;
use App\Events\Replied;
use App\Events\Voted;
use App\Listeners\SendCommentMarkedNotification;
use App\Listeners\SendCommentNotification;
use App\Listeners\SendMissionAccomplishedNotification;
use App\Listeners\SendReplyNotification;
use App\Listeners\SendVotedNotification;
use Illuminate\Support\ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        Commented::class => [
            SendCommentNotification::class,
        ],
        Replied::class => [
            SendReplyNotification::class,
        ],
        Voted::class => [
            // for post/comment voting
            SendVotedNotification::class,
        ],
        MissionAccomplished::class => [
            SendMissionAccomplishedNotification::class
        ],
        CommentMarked::class => [
            SendCommentMarkedNotification::class
        ]
    ];

    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
