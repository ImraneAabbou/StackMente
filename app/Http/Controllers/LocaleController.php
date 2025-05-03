<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class LocaleController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(string $lang, Request $request): void
    {
        app()->setLocale($lang);
        session(['locale' => $lang]);
        $user = $request->user();

        if (is_null($user)) {
            return;
        }
        $user->locale = $lang;
        $user->save();

        return;
    }
}
