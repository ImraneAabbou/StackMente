<?php

namespace App\Http\Controllers;

use App\Http\Requests\Reply\StoreReplyRequest;
use App\Http\Requests\Reply\UpdateReplyRequest;
use App\Models\Comment;
use App\Models\Reply;

class ReplyController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreReplyRequest $request, Comment $comment)
    {
        $comment->replies()->create([
            ...$request->validated(),
            'user_id' => auth()->user()->id
        ]);

        return back()->with('status', 'replied');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateReplyRequest $request, Reply $reply)
    {
        $reply->update($request->validated());
        return back()->with('status', 'updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Reply $reply)
    {
        $reply->delete();

        return back()->with('status', 'deleted');
    }
}
