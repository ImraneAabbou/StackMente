<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $streak = fake()->numberBetween(0, 25);
        $max_streak = fake()->numberBetween($streak, $streak + fake()->numberBetween(0, 15));
        $streak_started_at = now()->subDays($streak);
        $timespent = (int) (($streak + $max_streak) * (60 ** 2) * fake()->randomFloat(0.5, 2.5));
        $last_interaction = now()->subHours(fake()->numberBetween(-23, 0));
        $userImages = collect(File::files(public_path("images/users/")))->map(fn ($f) => $f->getFilename());

        return [
            'fullname' => fake()->name(),
            'username' => fake()->unique()->userName(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => fake()->randomElement([null, now()]),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'avatar' => fake()->unique()->randomElement($userImages),
            'stats' => [
                'xp' => [
                    'total' => fake()->numberBetween(0, 200000),
                    'daily' => fake()->numberBetween(0, 500),
                    'weekly' => fake()->numberBetween(0, 1500),
                    'monthly' => fake()->numberBetween(0, 5000),
                    'yearly' => fake()->numberBetween(0, 15000),
                ],
                'login' => [
                    'streak' => $streak,
                    'max_streak' => $max_streak,
                    'streak_started_at' => $streak_started_at,
                ],
                'level' => fake()->numberBetween(25, 80),
                'timespent' => $timespent,
                'last_interaction' => $last_interaction,
            ],
        ];
    }
}
