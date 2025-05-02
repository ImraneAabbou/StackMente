<?php

namespace App\Providers;

use App\Enums\ReportableType;
use App\Enums\VotableType;
use App\Models\Comment;
use App\Models\Post;
use App\Models\Reply;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (env('APP_ENV') === 'production') {
            $this->app['request']->server->set('HTTPS', true);
        }

        Vite::prefetch(concurrency: 3);

        Relation::enforceMorphMap([
            VotableType::POST->value => Post::class,
            VotableType::COMMENT->value => Comment::class,
            ReportableType::USER->value => User::class,
            ReportableType::POST->value => Post::class,
            ReportableType::COMMENT->value => Comment::class,
            ReportableType::REPLY->value => Reply::class,
        ]);
    }
}
