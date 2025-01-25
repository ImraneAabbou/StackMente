<?php

namespace App\Services;

use App\Enums\PostType;
use App\Models\Post;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;

/**
 * Class PostService
 * @package App\Services
 */
class PostService
{
    public function __construct(
        private Post $post,
    ) {}

    /**
     * Increments the view if first time or key gets decayed
     * Returns either the view of the given request
     * was counted or not
     *
     * @param $request Request
     * @return bool
     */
    public function syncViews(Request $request): bool
    {
        $throttleKey = 'post_' . $this->post->id;
        $throttleKey .= 'viewer_' . ($request->user()?->email ?? $request->ip());

        // Count only 1 view per 10 mins on same post
        return RateLimiter::attempt(
            $throttleKey,
            1,
            fn() => $this->post->increment('views'),
            10 * 60
        );
    }

    /**
     * @return Collection<int,Post>
     */
    static function getAllDiscussions(): Collection
    {
        return Post::where('type', PostType::SUBJECT)->get();
    }

    /**
     * @return Collection<int,Post>
     */
    static function getAllQuestions(): Collection
    {
        return Post::where('type', PostType::QUESTION)->get();
    }

    /**
     * @return Collection<int,Post>
     */
    static function getAllArticles(): Collection
    {
        return Post::where('type', PostType::ARTICLE)->get();
    }
}
