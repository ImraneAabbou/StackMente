<?php

namespace App\Http\Middleware;

use App\Enums\Role;
use Illuminate\Http\Request;
use Closure;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param Closure(): void $next
     */
    public function handle(Request $request, Closure $next, string $role)
    {
        abort_if(!(collect([Role::ADMIN, Role::SUPER_ADMIN])->contains($request->user()?->role)), 403);

        if ($role == 'super-admin') {
            abort_if(Role::SUPER_ADMIN != $request->user()?->role, 403);
        }

        return $next($request);
    }
}
