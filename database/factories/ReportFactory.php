<?php

namespace Database\Factories;

use App\Enums\ReportReason;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Report>
 */
class ReportFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'reason' => fake()->randomElement(array_column(ReportReason::cases(), 'value')),
            'explanation' => fake()->sentence(),
            'created_at' => fake()->dateTimeThisDecade(),
        ];
    }
}
