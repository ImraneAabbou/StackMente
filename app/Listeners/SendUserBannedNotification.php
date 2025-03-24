<?php

namespace App\Listeners;

use App\Events\UserBanned;
use App\Notifications\UserBannedNotification;

class SendUserBannedNotification
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
    public function handle(UserBanned $event): void
    {
        $event->user->notify(new UserBannedNotification);
    }
}
