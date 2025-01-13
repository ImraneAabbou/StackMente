<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Exception;

class SocialiteController extends Controller
{
    private User $user;
    private UserService $userService;

    public function __construct()
    {
        $this->user = Auth::user();
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

            return to_route('dashboard');
        }

        try {
            $this->userService->linkWith($provider, $providedUser);
        } catch (Exception) {
            return abort(401);
        }

        return redirect()->intended();
    }

    public function redirect(string $provider): RedirectResponse
    {
        if ($this->userService->isLinkedWith($provider))
            return redirect()->intended();

        return Socialite::driver($provider)->redirect();
    }
}
