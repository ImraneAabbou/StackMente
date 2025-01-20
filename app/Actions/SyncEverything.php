<?php

namespace App\Actions;

use App\Services\MissionService;
use App\Services\StatsService;

class SyncEverything
{
    static function execute(): void
    {
        if (!auth()->user()) return;
        $missionService = new MissionService(auth()->user());
        $statsService = new StatsService(auth()->user());

        do {
            $statsService->syncLevel();
            $statsService->syncLoginStreak();
            $missionService->syncMissions();

            $shouldSyncLevel = $statsService->shouldSyncLevel();
            $shouldSyncLoginStreak = $statsService->shouldSyncLoginStreak();
            $shouldSyncMissions = $missionService->shouldSyncMissions();

        } while ($shouldSyncLevel || $shouldSyncLoginStreak || $shouldSyncMissions);
    }
}
