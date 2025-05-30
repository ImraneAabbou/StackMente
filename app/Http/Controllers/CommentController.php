<?php

namespace App\Http\Controllers;

use App\Http\Requests\MarkCommentRequest;
use App\Http\Requests\StoreCommentRequest;
use App\Http\Requests\UpdateCommentRequest;
use App\Models\Comment;
use App\Models\Post;
use App\Traits\ReportableCtrl;
use App\Traits\VotableCtrl;
use Illuminate\Http\RedirectResponse;

class CommentController extends Controller
{
    use VotableCtrl, ReportableCtrl;

    /**
     * Store a newly created resource in storage.
     */
    public function store(Post $post, StoreCommentRequest $request): RedirectResponse
    {
        $post->comments()->create([
            ...$request->validated(),
            'user_id' => auth()->user()->id,
        ]);

        return back()->with('status', 'commented');
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
        return back();
    }

    public function mark(MarkCommentRequest $request, Comment $comment): RedirectResponse
    {
        $comment->update(
            ['is_marked' => !$comment->is_marked]
        );

        return back()->with('status', $comment->is_marked ? 'marked' : 'unmarked');
    }
}
