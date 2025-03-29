<?php

namespace App\Http\Middleware;

use App\Actions\SyncUserAchievementsAndLevel;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Closure;

class SyncUserAchievementsAndLevelMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        SyncUserAchievementsAndLevel::execute();
        return $next($request);
    }
}
