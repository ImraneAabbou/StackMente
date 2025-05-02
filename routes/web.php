<?php

use App\Http\Controllers\CommentController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReplyController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\UsersRankingController;
use App\Models\Post;
use App\Models\Report;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::middleware('verified')->group(function () {
        Route::get('/articles/create', [PostController::class, 'create'])->name('articles.create');
        Route::get('/subjects/create', [PostController::class, 'create'])->name('subjects.create');
        Route::get('/questions/create', [PostController::class, 'create'])->name('questions.create');
        Route::post('/posts', [PostController::class, 'store'])->name('posts.store');
    });

    Route::put('/posts/{post:slug}', [PostController::class, 'update'])->name('posts.update');

    Route::post('/posts/{reportable}/reports', [PostController::class, 'report'])->name('posts.report');

    Route::post('/posts/{votable}/vote', [PostController::class, 'vote'])->name('posts.vote');
    Route::delete('/posts/{votable}/vote', [PostController::class, 'unvote'])->name('posts.unvote');

    Route::post('/posts/{post:slug}/comments', [CommentController::class, 'store'])->name('comments.store');
    Route::post('/comments/{reportable}/reports', [CommentController::class, 'report'])->name('comments.report');
    Route::delete('/comments/{reportable}/reports', [CommentController::class, 'clearReports'])->name('comments.clearReports')->can('delete', [Report::class]);
    Route::put('/comments/{comment}/mark', [CommentController::class, 'mark'])->name('comments.mark');
    Route::put('/comments/{comment}', [CommentController::class, 'update'])->name('comments.update');

    Route::post('/comments/{votable}/vote', [CommentController::class, 'vote'])->name('comments.vote');
    Route::delete('/comments/{votable}/vote', [CommentController::class, 'unvote'])->name('comments.unvote');

    Route::post('/comments/{comment}/replies', [ReplyController::class, 'store'])->name('replies.store');
    Route::post('/replies/{reportable}/reports', [ReplyController::class, 'report'])->name('replies.report');

    Route::put('/replies/{reply}', [ReplyController::class, 'update'])->name('replies.update');

    Route::put('/notifications/{id}', [NotificationController::class, 'update'])->name('notifications.update');
    Route::delete('/notifications', [NotificationController::class, 'destroy'])->name('notifications.destroy');

    Route::post('/profile/{reportable}/reports', [ProfileController::class, 'report'])->name('profile.report');
    Route::inertia('/profile', 'Profile/Index')->name('profile.index');
    Route::inertia('/profile/delete', 'Profile/Delete')->name('profile.delete');
    Route::inertia('/profile/settings', 'Profile/Edit')->name('profile.edit');
    Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::inertia('/', 'Index', [
    'hero_stats' => [
        'questions_count' => fn() => Post::questions()->count(),
        'articles_count' => fn() => Post::articles()->count(),
        'subjects_count' => fn() => Post::subjects()->count(),
    ]
]);

Route::get('/articles', [PostController::class, 'index'])->name('articles.index');
Route::get('/articles/{post:slug}', [PostController::class, 'show'])->name('articles.show');

Route::get('/subjects', [PostController::class, 'index'])->name('subjects.index');
Route::get('/subjects/{post:slug}', [PostController::class, 'show'])->name('subjects.show');

Route::get('/questions', [PostController::class, 'index'])->name('questions.index');
Route::get('/questions/{post:slug}', [PostController::class, 'show'])->name('questions.show');

Route::get('/posts', [PostController::class, 'index'])->name('feed');

Route::get('/profile/{user:username}', [ProfileController::class, 'show'])->name('profile.show');

Route::get('/rank', UsersRankingController::class)->name('rank');

Route::get('/tags', [TagController::class, 'index'])->name('tags.index');

require __DIR__ . '/auth.php';
require __DIR__ . '/schedules.php';
require __DIR__ . '/admin.php';
require __DIR__ . '/lang.php';
