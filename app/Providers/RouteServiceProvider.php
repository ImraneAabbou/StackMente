<?php

namespace App\Providers;

use App\Models\Comment;
use App\Models\Post;
use App\Models\Reply;
use App\Models\User;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        Route::bind('votable', function ($value) {
            if (request()->is('comments/*')) {
                return Comment::findOrFail($value);
            }

            if (request()->is('posts/*')) {
                return Post::where('slug', $value)->firstOrFail();
            }

            abort(404);
        });

        Route::bind('reportable', function ($value) {
            if (request()->is('comments/*') || request()->is('admin/reports/comments/*')) {
                return Comment::findOrFail($value);
            }

            if (request()->is('posts/*') || request()->is('admin/reports/posts/*')) {
                return Post::where('slug', $value)->firstOrFail();
            }

            if (request()->is('replies/*') || request()->is('admin/reports/replies/*')) {
                return Reply::findOrFail($value);
            }

            if (request()->is('profile/*') || request()->is('admin/reports/users/*')) {
                return User::where('username', $value)->firstOrFail();
            }

            abort(404);
        });
    }
}
