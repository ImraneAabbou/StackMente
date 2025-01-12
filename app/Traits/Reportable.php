<?php

namespace App\Traits;

use App\Models\Report;
use Illuminate\Database\Eloquent\Relations\MorphMany;

trait Reportable
{
    public function reports(): MorphMany
    {
        /* @var Illuminate\Database\Eloquent\Model $this */
        return $this->morphMany(Report::class, 'reportable');
    }
}
