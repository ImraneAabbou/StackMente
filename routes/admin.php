<?php

use App\Http\Controllers\AdminPanelController;
use App\Http\Controllers\BackupController;
use App\Http\Controllers\MissionController;
use App\Http\Controllers\RestoreController;

Route::middleware('auth')->group(function () {
    Route::get('/admin', [AdminPanelController::class, 'dashboard'])->name('admin.index');
    Route::get('/admin/bans', [AdminPanelController::class, 'bans'])->name('admin.bans');

    // Reports
    Route::get('/admin/reports/users', [AdminPanelController::class, 'reportsUsers'])->name('reports.users');
    Route::get('/admin/reports/comments', [AdminPanelController::class, 'reportsComments'])->name('reports.comments');
    Route::get('/admin/reports/replies', [AdminPanelController::class, 'reportsReplies'])->name('reports.replies');
    Route::get('/admin/reports/questions', [AdminPanelController::class, 'reportsQuestions'])->name('reports.questions');
    Route::get('/admin/reports/subjects', [AdminPanelController::class, 'reportsSubjects'])->name('reports.subjects');
    Route::get('/admin/reports/articles', [AdminPanelController::class, 'reportsArticles'])->name('reports.articles');

    // Missions
    Route::get('/admin/missions', [MissionController::class, 'index'])->name('missions.index');
    Route::get('/admin/missions/create', [MissionController::class, 'create'])->name('missions.create');
    Route::get('/admin/missions/{mission}/edit', [MissionController::class, 'edit'])->name('missions.edit');

    // Backup and restore
    Route::get('/admin/backups/', [BackupController::class, 'index'])->name('backups.index');
    Route::post('/admin/backups/', [BackupController::class, 'store'])->name('backups.store');
    Route::get('/admin/backups/{backup}', [BackupController::class, 'show'])->name('backups.show');
    Route::delete('/admin/backups/{backup}', [BackupController::class, 'destroy'])->name('backups.destroy');
    Route::put('/admin/backups/{backup}', [BackupController::class, 'update'])->name('backups.update');
});
