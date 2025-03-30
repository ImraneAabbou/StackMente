<?php

namespace App\Observers;

use App\Enums\ReportableType;
use App\Events\UserUnbanned;
use App\Models\Report;
use App\Models\User;
use App\Services\StatsService;
use Illuminate\Support\Facades\DB;

class UserObserver
{
    /**
     * Handle the User "created" event.
     */
    public function created(User $user): void
    {
        //
    }

    /**
     * Handle the User "updated" event.
     */
    public function updated(User $user): void
    {
        //
    }

    /**
     * Handle the User "deleted" event.
     */
    public function deleted(User $user): void
    {
        $statsService = new StatsService($user);

        $statsService->resetStats();
        $statsService->resetStats();

        // clear reports
        Report::where('reportable_type', ReportableType::USER)
            ->where('reportable_id', $user->id)
            ->delete();
    }

    /**
     * Handle the User "restored" event.
     */
    public function restored(User $user): void
    {
        event(new UserUnbanned($user));
    }

    /**
     * Handle the User "force deleted" event.
     */
    public function forceDeleted(User $user): void
    {
        $this->deleted($user);

        DB::delete('delete from users where id = ?', [$user->id]);
    }
}
