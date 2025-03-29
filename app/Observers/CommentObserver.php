<?php

namespace App\Observers;

use App\Enums\ReportableType;
use App\Events\Commented;
use App\Events\CommentMarked;
use App\Models\Comment;
use App\Models\Report;
use App\Services\StatsService;

class CommentObserver
{
    /**
     * Handle the Comment "created" event.
     */
    public function created(Comment $comment): void
    {
        if ($comment->post->user_id !== $comment->user_id) {
            event(new Commented($comment));

            (new StatsService($comment->post->user))
                ->incrementXPBy(
                    config('rewards.receive_comment')
                );
        }

    }

    /**
     * Handle the Comment "updated" event.
     */
    public function updated(Comment $comment): void
    {
        if ((!$comment->is_marked))
            return;

        // unmark old marked comments
        Comment::whereIn(
            'id',
            $comment
                ->post
                ->comments
                ->pluck('id')
                ->filter(fn(int $id) => $id !== $comment->id)
        )->update(['is_marked' => false]);

        // notify and reward if not the author
        if ($comment->post->user_id !== $comment->user_id) {
            event(new CommentMarked($comment));

            (new StatsService($comment->user))
                ->incrementXPBy(
                    config('rewards.comment_marked')
                );
        }

    }

    /**
     * Handle the Comment "deleted" event.
     */
    public function deleted(Comment $comment): void
    {
        // clear reports
        Report::where('reportable_type', ReportableType::COMMENT)
            ->where('reportable_id', $comment->id)
            ->delete();
    }

    /**
     * Handle the Comment "restored" event.
     */
    public function restored(Comment $comment): void
    {
        //
    }

    /**
     * Handle the Comment "force deleted" event.
     */
    public function forceDeleted(Comment $comment): void
    {
        $this->deleted($comment);
    }
}
