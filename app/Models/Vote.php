<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Vote extends Model
{
    /** @use HasFactory<\Database\Factories\VoteFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'votable_id',
        'votable_type',
        'type',
    ];
    /**
     * @return MorphTo<Model,Vote>
     */
    public function votable(): MorphTo
    {
        return $this->morphTo();
    }
    /**
     * @return BelongsTo<User,Vote>
     */
    public function user(): BelongsTo {
        return $this->belongsTo(User::class);
    }
}
