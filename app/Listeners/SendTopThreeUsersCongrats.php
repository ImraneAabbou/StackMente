<?php

namespace App\Listeners;

use App\Events\SeasonEnded;
use App\Models\User;
use App\Notifications\SeasonTopThreeCongratsNotification;
use App\Services\StatsService;
use Str;

class SendTopThreeUsersCongrats
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
    public function handle(SeasonEnded $event): void
    {
        $period = Str::lower($event->period->value);

        $topTens = collect(StatsService::getTopTenUsers($period));

        $topTens
            ->where(fn($u) => in_array($u->rank, [1, 2, 3]))
            ->map(fn($u) => User::find($u->id)->notify(new SeasonTopThreeCongratsNotification($period, $u->rank)));
    }
}
