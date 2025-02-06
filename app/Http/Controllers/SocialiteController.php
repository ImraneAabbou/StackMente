<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

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

        return redirect()->intended();
    }

    public function redirect(string $provider): RedirectResponse
    {
        if ($this->user && $this->userService->isLinkedWith($provider))
            return redirect()->intended();

        return Socialite::driver($provider)->redirect();
    }
}
