<?php

namespace App\Services;

use App\Exceptions\ProviderEmailAlreadyLinked;
use App\Exceptions\UserNotFound;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Str;
use Laravel\Socialite\Two\User as SocialiteUser;

/**
 * Class UserService
 * @package App\Services
 */
class UserService
{
    public function __construct(
        private User $user
    ) {}

    /*
     * find a user by the given provided user
     * or create one if not exists
     * @return User
     */
    static function findOrCreateUserFromProvidedUser(string $provider, SocialiteUser $providedUser): User
    {
        try {
            $user = static::getUserFromProvidedId($provider, $providedUser->getId());
        } catch (UserNotFound) {
            $user = User::create(static::formatProvidedUser($provider, $providedUser));
        }

        return $user;
    }

    /*
     * Generates a unique username based on the given name
     *
     * @return string
     */
    static function generateUsernameFromFullname(string $fullname): string
    {
        return Str::replace(' ', '', Str::headline($fullname) . Str::random(8));
    }

    /**
     * @return array<string,string>
     */
    static function formatProvidedUser(string $provider, SocialiteUser $providedUser): array
    {
        $generatedUsername = static::generateUsernameFromFullname($providedUser->getName());
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
    static function getUserFromProvidedId(string $provider, string $providerId): User
    {
        $user = User::withTrashed()  // For banned users
            ->where('providers->' . $provider . '->id', $providerId)
            ->first();

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

    /*
     * Returns true if the provided user's email
     * exists in specific users' provider
     *
     * @return bool
     */
    static function isEmailReservedByProvider(string $provider, string $email): bool
    {
        if (!$email)
            return false;

        $userQuery = User::where('providers->' . $provider . '->email', $email);

        return $userQuery->count();
    }

    public function linkWith(string $provider, SocialiteUser $providedUser): void
    {
        if (static::isEmailReservedByProvider($provider, $providedUser->email)) {
            throw new ProviderEmailAlreadyLinked('The provider is already linked to another account');
        }

        $newProviders = collect($this->user->providers);
        $newProviders[$provider] = $providedUser;
        $this->user->providers = $newProviders->toArray();
        $this->user->save();
    }

    public function isLinkedWith(string $provider): bool
    {
        $linkedProviders = collect($this->user->providers)->keys();
        if ($linkedProviders->count() == 3)
            return true;
        return $linkedProviders->contains($provider);
    }

    /**
     * @return Collection<int,User>
     */
    static function getBannedUsers(): Collection
    {
        return User::onlyTrashed()->get();
    }

    /*
     * Bans user (using soft delete)
     */
    public function ban(): ?bool
    {
        return $this->user->delete();
    }

    /*
     * Detects if user is banned or not
     */
    public function isBanned(): bool
    {
        return !!$this->user->deleted_at;
    }

    /*
     * Unban user
     */
    public function unban(): void
    {
        $this->user->restore();
    }
}
