<?php

namespace App\Http\Controllers;

use App\Enums\PostType;
use App\Http\Requests\Post\StorePostRequest;
use App\Http\Requests\Post\UpdatePostRequest;
use App\Models\Post;
use App\Services\PostService;
use App\Traits\VotableCtrl;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Str;

class PostController extends Controller
{
    use VotableCtrl;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $type = $request->uri()->path();

        $posts = match ($type) {
            'articles' => Post::articles(),
            'subjects' => Post::subjects(),
            'questions' => Post::questions(),
            default => Post::query()
        };

        $posts_pagination = $posts
            ->with('tags')
            ->withCount(['comments', 'upVotes', 'downVotes'])
            ->cursorPaginate(15);

        return Inertia::render('Posts/Index', [
            'next_page_url' => $posts_pagination->nextPageUrl(),
            'posts' => collect($posts_pagination->items())
                ->map(fn($p) => [
                    ...$p->toArray(),
                    'user_vote' => auth()->user()
                        ? $p->getUserVote(auth()->user())
                        : null
                ])
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

        return to_route("posts.show", ["post" => $p->id])
            ->withFragment("hfaisdfk")
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
