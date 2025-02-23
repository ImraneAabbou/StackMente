<?php

namespace App\Models;

use App\Enums\MissionType;
use Illuminate\Database\Eloquent\Model;

class Mission extends Model
{
    protected $fillable = [
        'image',
        'translation_key',
        'type',
        'threshold',
        'xp_reward',
    ];
    protected $hidden = ["translation_key"];

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
