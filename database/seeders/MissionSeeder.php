<?php

namespace Database\Seeders;

use App\Enums\MissionType;
use App\Models\Mission;
use Illuminate\Database\Seeder;

class MissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $missions = collect([
            [
                'image' => fake()->imageUrl(128),
                'title' => 'The Persistent',
                'description' => 'Log in daily for a whole week.',
                'type' => MissionType::LOGIN_STREAK,
                'threshold' => 7,
            ],
            [
                'image' => fake()->imageUrl(128),
                'title' => 'The Persistent Prime',
                'description' => 'Log in daily for a whole month.',
                'type' => MissionType::LOGIN_STREAK,
                'threshold' => 30,
            ],
            [
                'image' => fake()->imageUrl(128),
                'title' => 'The Collector',
                'description' => 'Earn XP by engaging with the platform.',
                'type' => MissionType::XP_TOTAL,
                'threshold' => 5000,
            ],
            [
                'image' => fake()->imageUrl(128),
                'title' => 'Content Creator',
                'description' => 'Create 20 posts to share your ideas.',
                'type' => MissionType::TOTAL_OWNED_POSTS,
                'threshold' => 20,
            ],
            [
                'image' => fake()->imageUrl(128),
                'title' => 'Active Commenter',
                'description' => 'Leave comments on posts.',
                'type' => MissionType::TOTAL_MADE_COMMENTS,
                'threshold' => 50,
            ],
            [
                'image' => fake()->imageUrl(128),
                'title' => 'Popular Posts',
                'description' => 'Get total of 100 upvotes on your posts.',
                'type' => MissionType::RECEIVED_POSTS_VOTE_UPS,
                'threshold' => 100,
            ],
            [
                'image' => fake()->imageUrl(128),
                'title' => 'Helpful Comments',
                'description' => 'Receive total of 75 upvotes on your comments.',
                'type' => MissionType::RECEIVED_COMMENTS_VOTE_UPS,
                'threshold' => 75,
            ],
        ]);

        $missions->each(fn ($m) => Mission::create($m));


    }
}
