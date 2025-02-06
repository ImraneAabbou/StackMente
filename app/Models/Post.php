<?php

namespace App\Models;

use App\Enums\PostType;
use App\Traits\Reportable;
use App\Traits\Votable;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[ObservedBy([ObservedBy::class])]
class Post extends Model
{
    /** @use HasFactory<\Database\Factories\PostFactory> */
    use HasFactory, Votable, Reportable;

    protected $fillable = [
        'title',
        'user_id',
        'slug',
        'content',
        'views',
        'type',
    ];

    public function answer(): HasOne {
        return $this->hasOne(Comment::class)->where("is_marked", true);
    }

    /**
     * @return BelongsTo<User,Post>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsToMany<Tag,Post>
     */
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class);
    }

    /**
     * @return HasMany<Comment,Post>
     */
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    /**
     * @return HasMany<Reply,Post>
     */
    public function replies(): HasMany
    {
        return $this->hasMany(Reply::class);
    }
    /**
     * @return Builder<Post>
     */
    static function subjects(): Builder
    {
        return Post::where('type', PostType::SUBJECT);
    }
    /**
     * @return Builder<Post>
     */
    static function questions(): Builder
    {
        return Post::where('type', PostType::QUESTION);
    }
    /**
     * @return Builder<Post>
     */
    static function articles(): Builder
    {
        return Post::where('type', PostType::ARTICLE);
    }

}
