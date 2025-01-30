<?php

namespace App\Providers;

use App\Models\Comment;
use App\Models\Post;
use App\Models\Reply;
use App\Models\User;
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
                return Post::findOrFail($value);
            }

            abort(404);
        });

        Route::bind('reportable', function ($value) {
            if (request()->is('comments/*')) {
                return Comment::findOrFail($value);
            }

            if (request()->is('posts/*')) {
                return Post::findOrFail($value);
            }

            if (request()->is('replies/*')) {
                return Reply::findOrFail($value);
            }

            if (request()->is('profile/*')) {
                return User::findOrFail($value);
            }

            abort(404);
        });

    }
}
