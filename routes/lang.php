<?php

use App\Http\Controllers\LocaleController;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;

$languages = collect(File::directories(lang_path()))->map(fn($dir) => basename($dir))->toArray();

Route::post(
    'lang/{lang}',
    LocaleController::class
)
    ->whereIn('lang', $languages)
    ->name('lang.store');
