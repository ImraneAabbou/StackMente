<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCommentRequest;
use App\Http\Requests\UpdateCommentRequest;
use App\Models\Comment;
use App\Models\Post;
use App\Traits\VotableCtrl;
use Illuminate\Http\RedirectResponse;

class CommentController extends Controller
{
    use VotableCtrl;

    /**
     * Store a newly created resource in storage.
     */
    public function store(Post $post, StoreCommentRequest $request): void
    {
        $post->comments()->create([
            ...$request->validated(),
            'user_id' => auth()->user()->id,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCommentRequest $request, Comment $comment): RedirectResponse
    {
        $comment->update($request->validated());
        return back()->with('status', 'deleted');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Comment $comment): RedirectResponse
    {
        $comment->delete();
        return back()->with('status', 'deleted');
    }
}
