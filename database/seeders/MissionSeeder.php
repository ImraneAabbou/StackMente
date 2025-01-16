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
                'title' => 'Providers Linking',
                'description' => 'Link Up Your Account With Github, Google and Facebook.',
                'type' => MissionType::LINKING_WITH_PROVIDERS,
                'xp_reward' => 75,
                'threshold' => collect(config('services.providers'))->keys()->count(),
            ],
            [
                'image' => fake()->imageUrl(128),
                'title' => 'Email Verification',
                'description' => 'Verify your email, That will help you recover your account in case you forget your password.',
                'type' => MissionType::EMAIL_VERIFICATION,
                'xp_reward' => 25,
                'threshold' => 7,
            ],
            [
                'image' => fake()->imageUrl(128),
                'title' => 'Profile Setup',
                'description' => 'Setup your profile, it includes adding bio, avatar, (email, password in case registred with a provider) as well as email verification.',
                'type' => MissionType::PROFILE_SETUP,
                'xp_reward' => 25,
                'threshold' => 7,
            ],
            [
                'image' => fake()->imageUrl(128),
                'title' => 'The Persistent',
                'description' => 'Log in daily for a whole week.',
                'type' => MissionType::LOGIN_STREAK,
                'xp_reward' => 150,
                'threshold' => 7,
            ],
            [
                'image' => fake()->imageUrl(128),
                'title' => 'The Persistent Prime',
                'description' => 'Log in daily for a whole month.',
                'type' => MissionType::LOGIN_STREAK,
                'threshold' => 30,
                'xp_reward' => 500,
            ],
            [
                'image' => fake()->imageUrl(128),
                'title' => 'The Collector',
                'description' => 'Earn XP by engaging with the platform.',
                'type' => MissionType::XP_TOTAL,
                'threshold' => 5000,
                'xp_reward' => 450,
            ],
            [
                'image' => fake()->imageUrl(128),
                'title' => 'Content Creator',
                'description' => 'Create 20 posts to share your ideas.',
                'type' => MissionType::TOTAL_OWNED_POSTS,
                'threshold' => 20,
                'xp_reward' => 350,
            ],
            [
                'image' => fake()->imageUrl(128),
                'title' => 'Active Commenter',
                'description' => 'Leave comments on posts.',
                'type' => MissionType::TOTAL_MADE_COMMENTS,
                'threshold' => 50,
                'xp_reward' => 250,
            ],
            [
                'image' => fake()->imageUrl(128),
                'title' => 'Popular Posts',
                'description' => 'Get total of 100 upvotes on your posts.',
                'type' => MissionType::RECEIVED_POSTS_VOTE_UPS,
                'threshold' => 100,
                'xp_reward' => 250,
            ],
            [
                'image' => fake()->imageUrl(128),
                'title' => 'Helpful Comments',
                'description' => 'Receive total of 75 upvotes on your comments.',
                'type' => MissionType::RECEIVED_COMMENTS_VOTE_UPS,
                'threshold' => 75,
                'xp_reward' => 250,
            ],
        ]);

        $missions->each(fn($m) => Mission::create($m));
    }
}
