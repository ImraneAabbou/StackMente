<?php

use App\Http\Controllers\CommentController;
use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;

Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/{post}', [PostController::class, 'show']);

Route::post('/posts/{votable}/vote', [PostController::class, 'vote']);
Route::delete('/posts/{votable}/vote', [PostController::class, 'unvote']);

Route::post('/posts/{post}/comments', [CommentController::class, 'store']);
Route::delete('/comments/{comment}', [CommentController::class, 'destroy']);

Route::post('/comments/{votable}/vote', [CommentController::class, 'vote']);
Route::delete('/comments/{votable}/vote', [CommentController::class, 'unvote']);

require __DIR__ . '/auth.php';
