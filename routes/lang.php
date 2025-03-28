<?php

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;

$languages = collect(File::directories(lang_path()))->map(fn($dir) => basename($dir))->toArray();

Route::post(
    'lang/{lang}',
    fn(string $lang) => App::setLocale($lang) || session(['locale' => $lang])
)
    ->whereIn('lang', $languages)
    ->name('lang.store');
