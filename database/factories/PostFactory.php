<?php

namespace Database\Factories;

use App\Enums\PostType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Post>
 */
class PostFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->unique()->realText(fake()->numberBetween(10, 25));
        $slug = fake()->unique()->slug();
        $type = fake()->randomElement(array_column(PostType::cases(), 'value'));
        $maxContentChars = $type === PostType::ARTICLE
            ? fake()->numberBetween(2500, 3500)
            : fake()->numberBetween(250, 700);

        return [
            'title' => $title,
            'slug' => $slug,
            'content' => fake()->realText($maxContentChars),
            'views' => fake()->numberBetween(100, 1000),
            'type' => $type,
        ];
    }
}
