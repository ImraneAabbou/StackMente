<?php

namespace App\Observers;

use App\Enums\ReportableType;
use App\Models\Post;
use App\Models\Report;

class PostObserver
{
    /**
     * Handle the Post "created" event.
     */
    public function created(Post $post): void
    { }

    /**
     * Handle the Post "updated" event.
     */
    public function updated(Post $post): void
    {
        //
    }

    /**
     * Handle the Post "deleted" event.
     */
    public function deleted(Post $post): void
    {
        // clear reports
        Report::where('reportable_type', ReportableType::POST)
            ->where('reportable_id', $post->id)
            ->delete();
    }

    /**
     * Handle the Post "restored" event.
     */
    public function restored(Post $post): void
    {
        //
    }

    /**
     * Handle the Post "force deleted" event.
     */
    public function forceDeleted(Post $post): void
    {
        $this->deleted($post);
    }
}
