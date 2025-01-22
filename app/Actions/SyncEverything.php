<?php

namespace App\Actions;

use App\Events\MissionAccomplished;
use App\Services\MissionService;
use App\Services\StatsService;

class SyncEverything
{
    static function execute(): void
    {
        if (!auth()->user())
            return;
        $missionService = new MissionService(auth()->user());
        $statsService = new StatsService(auth()->user());

        do {
            $statsService->syncLevel();
            $missionService
                ->syncMissions()
                ->each(
                    fn($m) => event(new MissionAccomplished($m))
                );

            $shouldSyncLevel = $statsService->shouldSyncLevel();
            $shouldSyncMissions = $missionService->shouldSyncMissions();
        } while ($shouldSyncLevel || $shouldSyncMissions);
    }
}
