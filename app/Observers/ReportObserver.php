<?php

namespace App\Observers;

use App\Enums\ReportableType;
use App\Events\UserBanned;
use App\Models\Report;
use App\Services\UserService;

class ReportObserver
{
    /**
     * Handle the Report "created" event.
     */
    public function created(Report $report): void
    {
        if (!($report->reportable()->reports()->count() + 1 >= config('reports.report_threshold')))
            return;

        if ($report->reportable_type === ReportableType::USER->value) {
            $u = new UserService($report->reportable);
            event(new UserBanned($report->reportable));
            $u->ban();
        } elseif ($report->reportable_type === ReportableType::POST->value) {
            $report->reportable()->delete();
        } elseif ($report->reportable_type === ReportableType::COMMENT->value) {
            $report->reportable()->delete();
        } elseif ($report->reportable_type === ReportableType::REPLY->value) {
            $report->reportable()->delete();
        }

        // clean reportable's reports
        Report::where('reportable_type', $report->reportable_type)
            ->where('reportable_id', $report->reportable_id)
            ->delete();
    }

    /**
     * Handle the Report "updated" event.
     */
    public function updated(Report $report): void
    {
        //
    }

    /**
     * Handle the Report "deleted" event.
     */
    public function deleted(Report $report): void
    {
        //
    }

    /**
     * Handle the Report "restored" event.
     */
    public function restored(Report $report): void
    {
        //
    }

    /**
     * Handle the Report "force deleted" event.
     */
    public function forceDeleted(Report $report): void
    {
        //
    }
}
