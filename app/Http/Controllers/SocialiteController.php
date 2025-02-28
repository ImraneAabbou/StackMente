<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Laravel\Socialite\Facades\Socialite;
use Symfony\Component\HttpFoundation\Response;

class SocialiteController extends Controller
{
    private ?User $user;
    private UserService $userService;

    public function __construct()
    {
        $this->user = Auth::user();
        if ($this->user)
            $this->userService = new UserService($this->user);
    }

    public function callback(string $provider): RedirectResponse
    {
        $providedUser = Socialite::driver($provider)->user();

        if (!$this->user) {
            // login / registering action

            Auth::login(
                UserService::findOrCreateUserFromProvidedUser($provider, $providedUser)
            );

            return to_route('feed');
        }

        // linking action
        $this->userService->linkWith($provider, $providedUser);

        return redirect()->back();
    }

    public function redirect(string $provider): RedirectResponse|Response
    {
        if ($this->user && $this->userService->isLinkedWith($provider))
            return redirect()->intended();

        return Inertia::location(Socialite::driver($provider)->redirect());
    }
}
