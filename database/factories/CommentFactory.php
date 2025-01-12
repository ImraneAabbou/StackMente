<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Comment>
 */
class CommentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $is_marked = fake()->numberBetween(0, 50) === 42;

        return [
            'content' => fake()->realTextBetween(500, 1500),
            'is_marked' => $is_marked,
        ];
    }
}
