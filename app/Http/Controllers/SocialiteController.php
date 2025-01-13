<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class SocialiteController extends Controller
{
    private function _validateProvider(string $provider): string
    {
        $provider = Str::lower($provider);
        $isSupported = in_array($provider, config('services.providers'));

        abort_if(!$isSupported, 404);

        return $provider;
    }

    public function callback(string $provider): void
    {
        $provider = $this->_validateProvider($provider);
        $user = Socialite::driver($provider)->user();

        abort_if(!$user, 401);

        dd($user);
    }

    public function redirect(string $provider): RedirectResponse
    {
        $provider = $this->_validateProvider($provider);

        return Socialite::driver($provider)->redirect();
    }
}
