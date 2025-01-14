<?php

namespace App\Services;

use App\Enums\PostType;
use App\Models\Post;
use Illuminate\Database\Eloquent\Collection;

/**
 * Class PostService
 * @package App\Services
 */
class PostService
{
    public function __construct(
        private Post $post,
    ) {}

    /*
     * Increment views of a post
     */
    public function incrementViews(): void
    {
        $this->post->update(['views' => $this->post->views + 1]);
    }

    /**
     * @return Collection<int,Post>
     */
    static function getAllDiscussions(): Collection
    {
        return Post::where('type', PostType::SUBJECT->value)->get();
    }

    /**
     * @return Collection<int,Post>
     */
    static function getAllQuestions(): Collection
    {
        return Post::where('type', PostType::QUESTION->value)->get();
    }

    /**
     * @return Collection<int,Post>
     */
    static function getAllArticles(): Collection
    {
        return Post::where('type', PostType::ARTICLE->value)->get();
    }
}
