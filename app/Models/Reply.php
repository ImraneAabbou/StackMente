<?php

namespace App\Models;

use App\Observers\ReplyObserver;
use App\Traits\Reportable;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

#[ObservedBy(ReplyObserver::class)]
class Reply extends Model
{
    /** @use HasFactory<\Database\Factories\ReplyFactory> */
    use HasFactory, Reportable;

    protected $fillable = [
        'content',
        'user_id',
        'comment_id',
    ];

    /**
     * @return BelongsTo<User,Reply>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<Comment,Reply>
     */
    public function comment(): BelongsTo
    {
        return $this->belongsTo(Comment::class);
    }

    /**
     * @return BelongsTo<Post,Reply>
     */
    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }
}
