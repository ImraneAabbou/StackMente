<?php

namespace App\Providers;

use App\Events\Commented;
use App\Events\CommentMarked;
use App\Events\MissionAccomplished;
use App\Events\Replied;
use App\Events\SeasonEnded;
use App\Events\UserBanned;
use App\Events\UserUnbanned;
use App\Events\Voted;
use App\Listeners\SendCommentMarkedNotification;
use App\Listeners\SendCommentNotification;
use App\Listeners\SendMissionAccomplishedNotification;
use App\Listeners\SendReplyNotification;
use App\Listeners\SendTopThreeUsersCongrats;
use App\Listeners\SendUserBannedNotification;
use App\Listeners\SendUserUnbannedNotification;
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
        SeasonEnded::class => [
            SendTopThreeUsersCongrats::class,
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
        ],
        UserBanned::class => [
            SendUserBannedNotification::class
        ],
        UserUnbanned::class => [
            SendUserUnbannedNotification::class
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
