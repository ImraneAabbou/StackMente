<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Closure;

class LocaleMiddleware
{
    /**
     * @return mixed
     * @param Closure(): void $next
     */
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        $locale = ($user?->locale) ?? session('locale');

        App::setLocale($locale);

        return $next($request);
    }
}
