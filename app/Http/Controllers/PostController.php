<?php

namespace App\Http\Controllers;

use App\Enums\Filters;
use App\Enums\PostType;
use App\Enums\Sorts;
use App\Http\Requests\Post\StorePostRequest;
use App\Http\Requests\Post\UpdatePostRequest;
use App\Models\Post;
use App\Models\Tag;
use App\Services\PostService;
use App\Traits\ReportableCtrl;
use App\Traits\VotableCtrl;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Str;

class PostController extends Controller
{
    use VotableCtrl, ReportableCtrl;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $type = $request->uri()->path();
        $querySearch = $request->query('q');
        $queryFilter = Str::upper($request->query('filter'));
        $querySort = Str::upper($request->query('sort', Sorts::NEW_TO_OLD->value));
        $includedTagsQuery = $request->query('included_tags', []);
        $excludedTagsQuery = $request->query('excluded_tags', []);

        $posts = match ($type) {
            'articles' => Post::articles(),
            'subjects' => Post::subjects(),
            'questions' => Post::questions(),
            default => Post::query()
        };

        // filtering options
        $posts->when(!is_null($querySearch), fn() => $posts->whereLike('title', "%$querySearch%"));
        $posts->when($queryFilter === Filters::HAS_MARKED_ANSWER->value, fn() => $posts->has('answer'));
        $posts->when($queryFilter === Filters::NO_MARKED_ANSWER->value, fn() => $posts->has('answer', 0));

        // sorting options
        $posts->when($querySort === Sorts::NEW_TO_OLD->value, fn() => $posts->orderByDesc('created_at'));
        $posts->when($querySort === Sorts::OLD_TO_NEW->value, fn() => $posts->orderBy('created_at'));
        $posts->when($querySort === Sorts::LESS_TO_MORE_VIEWS->value, fn() => $posts->orderBy('views'));
        $posts->when($querySort === Sorts::MORE_TO_LESS_VIEWS->value, fn() => $posts->orderByDesc('views'));
        $posts->when(
            $querySort === Sorts::MORE_TO_LESS_ACTIVITY->value,
            fn() => $posts
                ->orderByDesc('up_votes_count')
                ->orderByDesc('comments_count')
                ->orderByDesc('views')
        );
        $posts->when(
            $querySort === Sorts::MORE_TO_LESS_ACTIVITY->value,
            fn() => $posts
                ->orderBy('up_votes_count')
                ->orderBy('comments_count')
                ->orderBy('views')
        );

        // tags options
        $posts->when(
            $includedTagsQuery,
            fn() => $posts->whereHas('tags', fn($q) => $q->whereIn('name', $includedTagsQuery))
        );
        $posts->when(
            $excludedTagsQuery,
            fn() => $posts->whereDoesntHave('tags', fn($q) => $q->whereIn('name', $excludedTagsQuery))
        );

        $postsQuery = $posts
            ->clone()
            ->with(['tags', 'user'])
            ->withExists('answer')
            ->withCount(['comments', 'upVotes', 'downVotes']);

        $items = collect();

        for ($i = 1; $i <= $request->query('page', 1); $i++) {
            $items = $items->merge(
                collect(
                    (
                        $posts_pagination = $postsQuery
                            ->paginate(15, ['*'], 'page', $i)
                    )
                        ->items()
                )->map(fn($p) => [
                    ...$p->toArray(),
                    'content' => Str::limit($p->content, 255),
                    'user_vote' => auth()->user()
                        ? $p->getUserVote(auth()->user())
                        : null
                ])
            );
        }

        $posts_pagination
            ->appends('q', $querySearch)
            ->appends('filter', $queryFilter)
            ->appends('included_tags', $includedTagsQuery)
            ->appends('excluded_tags', $excludedTagsQuery)
            ->appends('sort', $querySort);

        return Inertia::render('Posts/Index', [
            'posts' => [
                'items' => $items,
                'next_page_url' => $posts_pagination->nextPageUrl(),
                'count' => $request->query() ? $posts->count() : Post::count(),
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePostRequest $request): RedirectResponse
    {
        $postData = $request->validated();

        $p = Post::create([
            ...$postData,
            'slug' => Str::slug($postData['title']),
            'user_id' => auth()->user()->id
        ]);

        foreach ($postData['tags'] as $tagData) {
            $tag = Tag::firstOrCreate(
                ['name' => $tagData['name']],
                ['description' => $tagData['description']]
            );

            if (!$p->tags->contains($tag->id)) {
                $p->tags()->attach($tag->id);
            }
        }

        return to_route(Str::lower($postData['type']) . 's.show', ['post' => $p->slug]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post, Request $request): Response
    {
        abort_if(request()->is('articles/*') && $post->type !== PostType::ARTICLE->value, 404);
        abort_if(request()->is('subjects/*') && $post->type !== PostType::SUBJECT->value, 404);
        abort_if(request()->is('questions/*') && $post->type !== PostType::QUESTION->value, 404);

        (new PostService($post))
            ->syncViews($request);

        return Inertia::render('Posts/Show', [
            'post' => [
                ...$post
                    ->load(['tags', 'user'])
                    ->loadCount(['comments', 'upVotes', 'downVotes'])
                    ->loadExists(['answer'])
                    ->toArray(),
                'user_vote' => auth()->user() ? $post->getUserVote(auth()->user()) : null,
                'comments' => $post
                    ->comments()
                    ->orderByDesc('is_marked')
                    ->orderByDesc('up_votes_count')
                    ->orderBy('down_votes_count')
                    ->with(['user', 'replies.user'])
                    ->withCount(['upVotes', 'downVotes', 'replies'])
                    ->get()
                    ->map(
                        fn($c) => [
                            ...$c->toArray(),
                            'user_vote' => auth()->user()
                                ? $c->getUserVote(auth()->user())
                                : null
                        ]
                    ),
                'is_commented' => auth()->user() ? $post->comments()->where('user_id', auth()->user()->id)->exists() : false
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePostRequest $request, Post $post): RedirectResponse
    {
        $post->update($request->validated());

        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post): RedirectResponse
    {
        $post->delete();
        return to_route('feed');
    }
}
