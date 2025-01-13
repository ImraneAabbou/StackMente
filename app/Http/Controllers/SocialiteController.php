<?php

namespace App\Http\Controllers;

use App\Services\UserService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class SocialiteController extends Controller
{
    public function callback(string $provider): RedirectResponse
    {
        $user = Socialite::driver($provider)->user();

        Auth::login(
            UserService::findOrCreateUserFromProvidedUser($provider, $user)
        );

        return to_route('dashboard');
    }

    public function redirect(string $provider): RedirectResponse
    {
        return Socialite::driver($provider)->redirect();
    }
}
