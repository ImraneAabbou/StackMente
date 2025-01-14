<?php

namespace Database\Factories;

use App\Models\User;
use App\Services\StatsService;
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

    public function getLevelFromXp(int $xp): int
    {
        $curveLevel = 10;
        $base = 100;
        $i = 1;
        $requiredXP = 100;

        while (true) {
            if ($i <= $curveLevel) {
                $requiredXP = $base * ($i - 1) + 100;
            } else {
                $growthFactor = 1 + ($i - $curveLevel) * 0.075;
                $requiredXP = (int) ($base * 10 + (($i * $i) * ($i - $curveLevel)) * $growthFactor);
            }

            if ($requiredXP > $xp)
                return $i;

            $i++;
        }
    }

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
        $userImages = collect(File::files(public_path('images/users/')))->map(fn($f) => $f->getFilename());
        $totalXP = fake()->numberBetween(0, 1000000);
        $level = $this->getLevelFromXp($totalXP);

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
                    'total' => $totalXP,
                    'daily' => fake()->numberBetween(0, 500),
                    'weekly' => fake()->numberBetween(0, 2500),
                    'monthly' => fake()->numberBetween(0, 50000),
                    'yearly' => fake()->numberBetween(0, 100000),
                ],
                'login' => [
                    'streak' => $streak,
                    'max_streak' => $max_streak,
                    'streak_started_at' => $streak_started_at,
                ],
                'level' => $level,
                'timespent' => $timespent,
                'last_interaction' => $last_interaction,
            ],
        ];
    }
}
