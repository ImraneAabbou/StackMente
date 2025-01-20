<?php

namespace App\Models;

use App\Enums\VotableType;
use App\Enums\VoteType;
use App\Models\Scopes\NoNullVoteScope;
use Illuminate\Database\Eloquent\Attributes\ScopedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\Model;
use App\Observers\VoteObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;

#[ObservedBy([VoteObserver::class])]
#[ScopedBy([NoNullVoteScope::class])]
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

    protected $casts = [
        'type' => VoteType::class,
        'votable_type' => VotableType::class,
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
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
