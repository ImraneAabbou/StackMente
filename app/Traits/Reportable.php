<?php

namespace App\Traits;

use App\Models\Report;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\MorphMany;

trait Reportable
{
    public function reports(): MorphMany
    {
        /* @var Illuminate\Database\Eloquent\Model $this */
        return $this->morphMany(Report::class, 'reportable');
    }


    /*
     * report the reportable
     */
    public function report(User $user, string $reason, string $explanation): void
    {
        $this->reports()->create([
            'user_id' => $user->id,
            'reason' => $reason,
            'explanation' => $explanation,
        ]);
    }

    /*
     * did the user already reported the reportable
     */
    public function isReportedBy(User $user): bool
    {
        return $this->reports()->where('user_id', $user->id)->count();
    }

    /*
     * returns total up reports of the reportable
     */
    public function totalReports(): int
    {
        return $this->reports()->count();
    }

    /*
     * clears the reports about the reportable
     */
    public function clearReports(): void
    {
        $this->reports()->delete();
    }
}
