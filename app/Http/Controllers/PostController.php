<?php

namespace App\Http\Controllers;

use App\Http\Requests\Post\StorePostRequest;
use App\Http\Requests\Post\UpdatePostRequest;
use App\Models\Post;
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

        $posts = match ($type) {
            'articles' => Post::articles(),
            'subjects' => Post::subjects(),
            'questions' => Post::questions(),
            default => Post::query()
        };

        $posts->when(!is_null($querySearch), fn() => $posts->whereLike('title', "%$querySearch%"));

        $postsQuery = $posts
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

        return Inertia::render('Posts/Index', [
            'posts' => [
                'items' => $items,
                'next_page_url' => $posts_pagination->nextPageUrl(),
                'count' => $querySearch ? $posts->count() : Post::count(),
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

        return to_route('posts.show', ['post' => $p->id])
            ->withFragment('hfaisdfk')
            ->with('status', 'posted-successfuly');
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post, Request $request): Response
    {
        (new PostService($post))
            ->syncViews($request);

        return Inertia::render('Posts/Show', [
            'post' => [
                ...$post
                    ->load(['tags', 'user'])
                    ->loadCount(['comments', 'upVotes', 'downVotes'])
                    ->toArray(),
                'user_vote' => auth()->user() ? $post->getUserVote(auth()->user()) : null
            ],
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
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePostRequest $request, Post $post): void
    {
        $post->update($request->validated());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post): RedirectResponse
    {
        $post->delete();
        return back()->with('status', 'deleted-successfuly');
    }
}
