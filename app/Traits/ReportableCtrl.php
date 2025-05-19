<?php

namespace App\Traits;

use App\Enums\ReportReason;
use App\Http\Requests\StoreReportRequest;
use Illuminate\Http\RedirectResponse;

trait ReportableCtrl
{
    /**
     * Report the given reportable
     *
     * @param App\Traits\Reportable $reportable
     */
    public function report($reportable, StoreReportRequest $request): RedirectResponse
    {
        $data = (object) $request->validated();
        $reason = ReportReason::from($data->reason);

        $reportable
            ->report(auth()->user(), $reason, $data->explanation);

        return back();
    }

    /**
     * Clear all the reports of the given reportable
     *
     * @param App\Traits\Reportable $reportable
     */
    public function clearReports($reportable): RedirectResponse
    {
        $reportable->clearReports();

        return back();
    }
}
