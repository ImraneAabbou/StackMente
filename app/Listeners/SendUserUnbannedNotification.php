<?php

namespace App\Listeners;

use App\Events\UserUnbanned;
use App\Notifications\UserUnbannedNotification;

class SendUserUnbannedNotification
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
    public function handle(UserUnbanned $event): void
    {
        $event->user->notify(new UserUnbannedNotification);
    }
}
