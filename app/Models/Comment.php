<?php

namespace App\Models;

use App\Traits\Reportable;
use App\Traits\Votable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    /** @use HasFactory<\Database\Factories\CommentFactory> */
    use HasFactory, Votable, Reportable;

    protected $fillable = [
        'user_id',
        'post_id',
        'is_marked',
        'content',
    ];

    /**
     * @return BelongsTo<User,Comment>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<Post,Comment>
     */
    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }

    /**
     * @return HasMany<Reply,Comment>
     */
    public function replies(): HasMany
    {
        return $this->hasMany(Reply::class);
    }
}
