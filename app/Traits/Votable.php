<?php

namespace App\Traits;

use App\Models\Vote;
use Illuminate\Database\Eloquent\Relations\MorphMany;

trait Votable
{
    public function votes(): MorphMany
    {
        /* @var Illuminate\Database\Eloquent\Model $this */
        return $this->morphMany(Vote::class, 'votable');
    }
}
