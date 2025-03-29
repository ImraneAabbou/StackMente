<?php

use App\Actions\SyncUserAchievementsAndLevel;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReplyController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\UsersRankingController;
use App\Models\Comment;
use App\Models\Mission;
use App\Models\Post;
use App\Models\Reply;
use App\Models\Report;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::middleware('verified')->group(function () {
        Route::inertia('/articles/create', 'Posts/CreateArticle')->name('articles.create');
        Route::inertia('/subjects/create', 'Posts/CreateSubject')->name('subjects.create');
        Route::inertia('/questions/create', 'Posts/CreateQuestion')->name('questions.create');
        Route::post('/posts', [PostController::class, 'store'])->name('posts.store');
    });

    Route::put('/posts/{post:slug}', [PostController::class, 'update'])->name('posts.update');
    Route::delete('/posts/{post:slug}', [PostController::class, 'destroy'])->name('posts.destroy')->can('delete', [Post::class]);

    Route::post('/posts/{reportable}/reports', [PostController::class, 'report'])->name('posts.report');
    Route::delete('/posts/{reportable}/reports', [PostController::class, 'clearReports'])->name('posts.clearReports')->can('delete', [Report::class]);

    Route::post('/posts/{votable}/vote', [PostController::class, 'vote'])->name('posts.vote');
    Route::delete('/posts/{votable}/vote', [PostController::class, 'unvote'])->name('posts.unvote');

    Route::post('/posts/{post:slug}/comments', [CommentController::class, 'store'])->name('comments.store');
    Route::post('/comments/{reportable}/reports', [CommentController::class, 'report'])->name('comments.report');
    Route::delete('/comments/{reportable}/reports', [CommentController::class, 'clearReports'])->name('comments.clearReports')->can('delete', [Report::class]);
    Route::put('/comments/{comment}/mark', [CommentController::class, 'mark'])->name('comments.mark');
    Route::put('/comments/{comment}', [CommentController::class, 'update'])->name('comments.update');
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy'])->name('comments.destroy')->can('delete', [Comment::class]);

    Route::post('/comments/{votable}/vote', [CommentController::class, 'vote'])->name('comments.vote');
    Route::delete('/comments/{votable}/vote', [CommentController::class, 'unvote'])->name('comments.unvote');

    Route::post('/comments/{comment}/replies', [ReplyController::class, 'store'])->name('replies.store');
    Route::post('/replies/{reportable}/reports', [ReplyController::class, 'report'])->name('replies.report');
    Route::delete('/replies/{reportable}/reports', [ReplyController::class, 'clearReports'])->name('replies.clearReports')->can('delete', [Report::class]);
    Route::put('/replies/{reply}', [ReplyController::class, 'update'])->name('replies.update');
    Route::delete('/replies/{reply}', [ReplyController::class, 'destroy'])->name('replies.destroy')->can('delete', [Reply::class]);

    Route::put('/notifications/{id}', [NotificationController::class, 'update'])->name('notifications.update');
    Route::delete('/notifications', [NotificationController::class, 'destroy'])->name('notifications.destroy');

    Route::inertia('/profile', 'Profile/Index')->name('profile.index');
    Route::inertia('/profile/delete', 'Profile/Delete')->name('profile.delete');
    Route::inertia('/profile/settings', 'Profile/Edit')->name('profile.edit');
    Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

});

Route::inertia('/', 'Index', [
    'hero_stats' => [
        'questions_count' => Post::questions()->count(),
        'articles_count' => Post::articles()->count(),
        'subjects_count' => Post::subjects()->count(),
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
Route::delete('/profile/{user:username}', [ProfileController::class, 'delete'])->name('users.delete');
Route::post('/profile/{user:username}/ban', [ProfileController::class, 'ban'])->name('profile.ban');
Route::delete('/profile/{user:username}/ban', [ProfileController::class, 'unban'])->name('profile.unban');
Route::post('/profile/{reportable}/reports', [ProfileController::class, 'report'])->name('profile.report');
Route::delete('/profile/{reportable}/reports', [ProfileController::class, 'clearReports'])->name('profile.clearReports')->can('delete', [Report::class]);

Route::get('/rank', UsersRankingController::class)->name('rank');

Route::get('/tags', [TagController::class, 'index'])->name('tags.index');

Route::post('/sync', fn() => SyncUserAchievementsAndLevel::execute())->name('sync');

require __DIR__ . '/auth.php';
require __DIR__ . '/schedules.php';
require __DIR__ . '/admin.php';
require __DIR__ . '/lang.php';
