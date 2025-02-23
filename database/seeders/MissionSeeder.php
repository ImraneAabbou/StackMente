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
                'image' => 'providers-linking.svg',
                'type' => MissionType::LINKING_WITH_PROVIDERS,
                'translation_key' => 'providers_linking',
                'xp_reward' => 75,
                'threshold' => collect(config('services.providers'))->keys()->count(),
            ],
            [
                'image' => 'email-verification.svg',
                'type' => MissionType::EMAIL_VERIFICATION,
                'translation_key' => 'email_verification',
                'xp_reward' => 25,
                'threshold' => 7,
            ],
            [
                'image' => 'profile-setup.svg',
                'type' => MissionType::PROFILE_SETUP,
                'translation_key' => 'profile_setup',
                'xp_reward' => 25,
                'threshold' => 7,
            ],
            [
                'image' => 'the-persistent.svg',
                'type' => MissionType::LOGIN_STREAK,
                'translation_key' => 'login_streak_week',
                'xp_reward' => 150,
                'threshold' => 7,
            ],
            [
                'image' => 'the-persistent-prime.svg',
                'type' => MissionType::LOGIN_STREAK,
                'translation_key' => 'login_streak_month',
                'threshold' => 30,
                'xp_reward' => 500,
            ],
            [
                'image' => 'the-collector.svg',
                'type' => MissionType::XP_TOTAL,
                'translation_key' => 'xp_collector',
                'threshold' => 5000,
                'xp_reward' => 450,
            ],
            [
                'image' => 'content-creator.svg',
                'type' => MissionType::TOTAL_OWNED_POSTS,
                'translation_key' => 'content_creator',
                'threshold' => 20,
                'xp_reward' => 350,
            ],
            [
                'image' => 'active-commenter.svg',
                'type' => MissionType::TOTAL_MADE_COMMENTS,
                'translation_key' => 'active_commenter',
                'threshold' => 50,
                'xp_reward' => 250,
            ],
            [
                'image' => 'popular-posts.svg',
                'type' => MissionType::RECEIVED_POSTS_VOTE_UPS,
                'translation_key' => 'popular_posts',
                'threshold' => 100,
                'xp_reward' => 250,
            ],
            [
                'image' => 'helpful-commenter.svg',
                'type' => MissionType::RECEIVED_COMMENTS_VOTE_UPS,
                'translation_key' => 'helpful_comments',
                'threshold' => 75,
                'xp_reward' => 250,
            ],
        ]);

        $missions->each(fn($m) => Mission::create($m));
    }
}
