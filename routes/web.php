<?php

use App\Actions\SyncEverything;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReplyController;
use App\Models\Mission;
use App\Models\Report;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'Index');

Route::inertia('/articles/create', 'Posts/CreateArticle')->name('articles.create');
Route::get('/articles', [PostController::class, 'index'])->name('articles.index');

Route::inertia('/subjects/create', 'Posts/CreateSubject')->name('subjects.create');
Route::get('/subjects', [PostController::class, 'index'])->name('subjects.index');

Route::inertia('/questions/create', 'Posts/CreateQuestion')->name('questions.create');
Route::get('/questions', [PostController::class, 'index'])->name('questions.index');

Route::get('/posts', [PostController::class, 'index'])->name('posts.index');
Route::post('/posts', [PostController::class, 'store'])->name('posts.store');
Route::get('/posts/{post:slug}', [PostController::class, 'show'])->name('posts.show');
Route::post('/posts/{reportable}/reports', [PostController::class, 'report']);
Route::delete('/posts/{reportable}/reports', [PostController::class, 'clearReports'])->can('delete', [Report::class]);

Route::post('/posts/{votable}/vote', [PostController::class, 'vote']);
Route::delete('/posts/{votable}/vote', [PostController::class, 'unvote']);

Route::post('/posts/{post:slug}/comments', [CommentController::class, 'store'])->name('comments.store');
Route::post('/comments/{reportable}/reports', [CommentController::class, 'report']);
Route::delete('/comments/{reportable}/reports', [CommentController::class, 'clearReports'])->can('delete', [Report::class]);
Route::put('/comments/{comment}/mark', [CommentController::class, 'mark']);
Route::put('/comments/{comment}', [CommentController::class, 'update']);
Route::delete('/comments/{comment}', [CommentController::class, 'destroy']);

Route::post('/comments/{votable}/vote', [CommentController::class, 'vote']);
Route::delete('/comments/{votable}/vote', [CommentController::class, 'unvote']);

Route::post('/comments/{comment}/replies', [ReplyController::class, 'store'])->name('comments.store');
Route::post('/replies/{reportable}/reports', [ReplyController::class, 'report']);
Route::delete('/replies/{reportable}/reports', [ReplyController::class, 'clearReports'])->can('delete', [Report::class]);
Route::put('/replies/{reply}', [ReplyController::class, 'update']);
Route::delete('/replies/{reply}', [ReplyController::class, 'destroy']);

Route::put('/notifications/{id}', [NotificationController::class, 'update']);
Route::delete('/notifications', [NotificationController::class, 'destroy']);
Route::inertia('/notifications', 'Notifications/Index');

Route::inertia('/profile/me', 'Profile/Me', ['missions' => Mission::all()])->name('profile.me');
Route::get('/profile/{user:username}', [ProfileController::class, 'show'])->name('profile.show');
Route::post('/profile/{user:username}/ban', [ProfileController::class, 'ban']);
Route::delete('/profile', [ProfileController::class, 'destroy']);
Route::delete('/profile/{user:username}/ban', [ProfileController::class, 'unban']);
Route::post('/profile/{reportable}/reports', [ProfileController::class, 'report']);
Route::delete('/profile/{reportable}/reports', [ProfileController::class, 'clearReports'])->can('delete', [Report::class]);

Route::get('/sync', fn() => SyncEverything::execute());

require __DIR__ . '/auth.php';
