<?php

namespace App\Observers;

use App\Enums\Path;
use App\Models\Mission;
use File;

class MissionObserver
{
    /**
     * Handle the Mission "created" event.
     */
    public function created(Mission $mission): void
    {
        //
    }

    /**
     * Handle the Mission "updated" event.
     */
    public function updated(Mission $mission): void
    {
        //
    }

    /**
     * Handle the Mission "deleted" event.
     */
    public function deleted(Mission $mission): void
    {
        File::delete(public_path(Path::MISSION_IMAGES->value . $mission->image));
    }

    /**
     * Handle the Mission "restored" event.
     */
    public function restored(Mission $mission): void
    {
        //
    }

    /**
     * Handle the Mission "force deleted" event.
     */
    public function forceDeleted(Mission $mission): void
    {
        //
    }
}
