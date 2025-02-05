<?php

namespace App\Models;

use App\Enums\PostType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    protected $fillable = [
        'name',
    ];

    /** @use HasFactory<\Database\Factories\TagFactory> */
    use HasFactory;

    /**
     * @return BelongsToMany<Post,Tag>
     */
    public function posts(): BelongsToMany
    {
        return $this->belongsToMany(
            Post::class,
        );
    }

    public function articles(): BelongsToMany
    {
        return $this->posts()->where('type', PostType::ARTICLE);
    }

    public function questions(): BelongsToMany
    {
        return $this->posts()->where('type', PostType::QUESTION);
    }

    public function subjects(): BelongsToMany
    {
        return $this->posts()->where('type', PostType::SUBJECT);
    }
}
