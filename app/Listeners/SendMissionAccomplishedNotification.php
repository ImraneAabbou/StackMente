<?php

namespace App\Listeners;

use App\Events\MissionAccomplished;
use App\Notifications\MissionAccomplishedNotification;

class SendMissionAccomplishedNotification
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
    public function handle(MissionAccomplished $event): void
    {
        $mission = $event->mission;

        auth()->user()->notify(
            new MissionAccomplishedNotification($mission)
        );
    }
}
