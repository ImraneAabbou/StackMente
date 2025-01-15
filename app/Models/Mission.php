<?php

namespace App\Models;

use App\Enums\MissionType;
use Illuminate\Database\Eloquent\Model;

class Mission extends Model
{
    protected $fillable = [
        'image',
        'title',
        'description',
        'type',
        'threshold',
    ];

    protected $casts = [
        'type' => MissionType::class
    ];
}
