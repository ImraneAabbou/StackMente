<?php

use App\Http\Controllers\AdminPanelController;
use App\Http\Controllers\BackupController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\MissionController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReplyController;
use App\Http\Controllers\TagController;
use App\Models\Comment;
use App\Models\Post;
use App\Models\Reply;
use App\Models\Report;

Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin', [AdminPanelController::class, 'dashboard'])->name('admin.index');
    Route::get('/admin/bans', [AdminPanelController::class, 'bans'])->name('admin.bans');

    // Reports
    Route::get('/admin/reports/users', [AdminPanelController::class, 'reportsUsers'])->name('reports.users');
    Route::get('/admin/reports/users/{reportable}', [AdminPanelController::class, 'reportMessages'])->name('reports.users.messages');
    Route::get('/admin/reports/comments', [AdminPanelController::class, 'reportsComments'])->name('reports.comments');
    Route::get('/admin/reports/comments/{reportable}', [AdminPanelController::class, 'reportMessages'])->name('reports.comments.messages');
    Route::get('/admin/reports/replies', [AdminPanelController::class, 'reportsReplies'])->name('reports.replies');
    Route::get('/admin/reports/replies/{reportable}', [AdminPanelController::class, 'reportMessages'])->name('reports.replies.messages');
    Route::get('/admin/reports/posts', [AdminPanelController::class, 'reportsPosts'])->name('reports.posts');
    Route::get('/admin/reports/posts/{reportable}', [AdminPanelController::class, 'reportMessages'])->name('reports.posts.messages');

    // Tags Management
    Route::put('/tags/{tag}', [TagController::class, 'update'])->name('tags.update');
    Route::delete('/tags/{tag}', [TagController::class, 'destroy'])->name('tags.destroy');

    Route::group(['middleware' => 'role:super-admin'], function () {
        // Privileges controle
        Route::post('/profile/{user:username}/admin', [ProfileController::class, 'elevate'])->name('users.elevate');
        Route::delete('/profile/{user:username}/admin', [ProfileController::class, 'delevate'])->name('users.delevate');

        // Missions
        Route::get('/admin/missions', [MissionController::class, 'index'])->name('missions.index');
        Route::get('/admin/missions/create', [MissionController::class, 'create'])->name('missions.create');
        Route::get('/admin/missions/{mission}/edit', [MissionController::class, 'edit'])->name('missions.edit');
        Route::put('/admin/missions/{mission}', [MissionController::class, 'update'])->name('missions.update');
        Route::delete('/admin/missions/{mission}', [MissionController::class, 'destroy'])->name('missions.destroy');

        // Backup and restore
        Route::get('/admin/backups/', [BackupController::class, 'index'])->name('backups.index');
        Route::post('/admin/backups/', [BackupController::class, 'store'])->name('backups.store');
        Route::get('/admin/backups/{backup}', [BackupController::class, 'show'])->name('backups.show');
        Route::delete('/admin/backups/{backup}', [BackupController::class, 'destroy'])->name('backups.destroy');
        Route::put('/admin/backups/{backup}', [BackupController::class, 'update'])->name('backups.update');
    });

    Route::delete('/profile/{reportable}/reports', [ProfileController::class, 'clearReports'])->name('profile.clearReports')->can('delete', [Report::class]);
    Route::delete('/profile/{user:username}/ban', [ProfileController::class, 'unban'])->name('profile.unban');
    Route::delete('/profile/{user:username}', [ProfileController::class, 'delete'])->name('users.delete');
    Route::delete('/replies/{reply}', [ReplyController::class, 'destroy'])->name('replies.destroy')->can('delete', [Reply::class]);
    Route::delete('/replies/{reportable}/reports', [ReplyController::class, 'clearReports'])->name('replies.clearReports')->can('delete', [Report::class]);
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy'])->name('comments.destroy')->can('delete', [Comment::class]);
    Route::delete('/posts/{reportable}/reports', [PostController::class, 'clearReports'])->name('posts.clearReports')->can('delete', [Report::class]);
    Route::delete('/posts/{post:slug}', [PostController::class, 'destroy'])->name('posts.destroy')->can('delete', [Post::class]);

    Route::delete('/profile/{reportable}/reports',
            [ProfileController::class, 'clearReports'])
        ->name('profile.clearReports')
        ->can('delete', [Report::class]);

    Route::delete('/profile/{user:username}/ban',
        [ProfileController::class, 'unban'])->name('profile.unban');

    Route::delete('/profile/{user:username}',
        [ProfileController::class, 'delete'])->name('users.delete');

    Route::delete('/replies/{reply}',
            [ReplyController::class, 'destroy'])
        ->name('replies.destroy')
        ->can('delete', [Reply::class]);

    Route::delete('/replies/{reportable}/reports',
            [ReplyController::class, 'clearReports'])
        ->name('replies.clearReports')
        ->can('delete', [Report::class]);

    Route::delete('/comments/{comment}',
            [CommentController::class, 'destroy'])
        ->name('comments.destroy')
        ->can('delete', [Comment::class]);

    Route::delete('/posts/{reportable}/reports',
            [PostController::class, 'clearReports'])
        ->name('posts.clearReports')
        ->can('delete', [Report::class]);

    Route::delete('/posts/{post:slug}',
            [PostController::class, 'destroy'])
        ->name('posts.destroy')
        ->can('delete', [Post::class]);
    Route::post('/profile/{user:username}/ban', [ProfileController::class, 'ban'])->name('profile.ban');
});
