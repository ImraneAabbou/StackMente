<?php

namespace App\Services;

use App\Exceptions\UserNotFound;
use App\Models\User;
use Illuminate\Support\Str;
use Laravel\Socialite\Two\User as SocialiteUser;

/**
 * Class UserService
 * @package App\Services
 */
class UserService
{
    public function __construct(
        public User $user
    ) {}

    /*
     * find a user by the given provided user
     * or create one if not exists
     * @return User
     */
    static function findOrCreateUserFromProvidedUser(string $provider, SocialiteUser $providedUser): User
    {
        try {
            $user = static::getUserFromProvidedEmail($provider, $providedUser->getEmail());
        } catch (UserNotFound) {
            $user = User::create(static::formatProvidedUser($provider, $providedUser));
        }

        return $user;
    }

    /**
     * @return array<string,string>
     */
    static function formatProvidedUser(string $provider, SocialiteUser $providedUser): array
    {
        $generatedUsername = Str::replace(' ', '', Str::headline($providedUser->getName()) . Str::random(8));
        $email = $providedUser->getEmail() ?? '';
        $email = static::isEmailReserved($email) ? null : $email;

        return [
            'fullname' => $providedUser->getName(),
            'username' => $generatedUsername,
            'email' => $email,
            'avatar' => $providedUser->getAvatar(),
            'providers' => [
                $provider => $providedUser
            ]
        ];
    }

    /*
     * it searches for a user that holds the given email in the specific provider
     * it returns that user or throws exception when it doesn't find it
     *
     * @throws UserNotFound
     * @return User
     */
    static function getUserFromProvidedEmail(string $provider, string $email): User
    {
        $user = User::where('providers->' . $provider . '->email', $email);

        $user = $user->first();

        if (!$user)
            throw new UserNotFound;

        return $user;
    }

    /*
     * Returns true if the provided user's email
     * exists in as user email or one of its providers
     *
     * @return bool
     */
    static function isEmailReserved(string $email): bool
    {
        if (!$email)
            return false;

        $supportedProviders = collect(config('services.providers'));

        $userQuery = User::where('email', $email);
        $supportedProviders
            ->each(fn($p) => $userQuery->orWhere('providers->' . $p . '->email', $email));

        return $userQuery->count();
    }

    public function linkWith(string $provider, SocialiteUser $providedUser): void
    {
        $newProviders = collect($this->user->providers);
        $newProviders[$provider] = $providedUser;
        $this->user->providers = $newProviders->toArray();
        $this->user->save();
    }

    public function isLinkedWith(string $provider): bool
    {
        $linkedProviders = collect($this->user->providers)->keys();
        return !($linkedProviders->count() == 3) && $linkedProviders->contains($provider);
    }
}
