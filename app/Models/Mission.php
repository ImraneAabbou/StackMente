<?php

namespace App\Models;

use App\Enums\MissionType;
use App\Observers\MissionObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Model;

#[ObservedBy(MissionObserver::class)]
class Mission extends Model
{
    protected $fillable = [
        'image',
        'translation_key',
        'type',
        'threshold',
        'xp_reward',
    ];

    protected $appends = ['title', 'description'];

    public function getTitleAttribute(): string
    {
        return __('missions.' . $this->translation_key . '.title');
    }

    public function getDescriptionAttribute(): string
    {
        return __('missions.' . $this->translation_key . '.description');
    }

    protected $casts = [
        'type' => MissionType::class
    ];
}
