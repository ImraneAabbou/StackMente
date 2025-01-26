<?php

use App\Http\Controllers\CommentController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ReplyController;
use Illuminate\Support\Facades\Route;

Route::inertia('/articles/create', 'Posts/CreateArticle')->name('articles.create');
Route::get('/articles', [PostController::class, 'index'])->name('articles.index');

Route::inertia('/subjects/create', 'Posts/CreateSubject')->name('subjects.create');
Route::get('/subjects', [PostController::class, 'index'])->name('subjects.index');

Route::inertia('/questions/create', 'Posts/CreateQuestion')->name('questions.create');
Route::get('/questions', [PostController::class, 'index'])->name('questions.index');

Route::get('/posts', [PostController::class, 'index'])->name('posts.index');
Route::post('/posts', [PostController::class, 'store'])->name('posts.store');
Route::get('/posts/{post}', [PostController::class, 'show'])->name('posts.show');

Route::post('/posts/{votable}/vote', [PostController::class, 'vote']);
Route::delete('/posts/{votable}/vote', [PostController::class, 'unvote']);

Route::post('/posts/{post}/comments', [CommentController::class, 'store'])->name('comments.store');
Route::delete('/comments/{comment}', [CommentController::class, 'destroy']);

Route::post('/comments/{votable}/vote', [CommentController::class, 'vote']);
Route::delete('/comments/{votable}/vote', [CommentController::class, 'unvote']);

Route::post('/comments/{comment}/replies', [ReplyController::class, 'store'])->name('comments.store');
Route::delete('/replies/{reply}', [ReplyController::class, 'destroy']);


require __DIR__ . '/auth.php';
