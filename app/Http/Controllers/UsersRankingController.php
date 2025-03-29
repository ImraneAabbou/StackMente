<?php

namespace App\Http\Controllers;

use App\Enums\Period;
use App\Services\StatsService;
use Illuminate\Console\Scheduling\Event;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Str;

class UsersRankingController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, Schedule $schedule): Response
    {
        try {
            $period = Period::from(
                Str::upper($request->query('season', 'daily'))
            )->value;
        } catch (\Throwable $t) {
            $period = Period::DAILY->value;
        }

        $period = Str::lower($period);

        return Inertia::render('Rank/Index', [
            'rankings' => [
                'season_timeout' =>
                    collect($schedule->events())
                        ->first(function (Event $event) use ($period) {
                            return str_contains($event->command, "season:reset $period");
                        })
                        ?->nextRunDate(),
                'users' => collect(StatsService::getTopTenUsers($period))->map(
                    fn($u) => [
                        ...collect($u)->toArray(),
                        'stats' => json_decode($u->stats)
                    ]
                )
            ],
        ]);
    }
}
