<?php

namespace Database\Seeders;

use App\Enums\VotableType;
use App\Enums\VoteType;
use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use App\Models\Vote;
use Illuminate\Database\Seeder;

class VoteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Post::pluck("id")->each(function ($postId) {
            $voters = User::inRandomOrder()->take(fake()->numberBetween(0, 7))->pluck('id');
            foreach ($voters as $userId) {
                Vote::create([
                    'user_id' => $userId,
                    'votable_id' => $postId,
                    'votable_type' => VotableType::POST->value,
                    'type' => fake()->numberBetween(0, 5) === 4 ? VoteType::DOWN->value : VoteType::UP->value,
                ]);
            }
        });

        Comment::pluck("id")->each(function ($commentId) {
            $voters = User::inRandomOrder()->take(fake()->numberBetween(0, 3))->pluck('id');
            foreach ($voters as $userId) {
                Vote::create([
                    'user_id' => $userId,
                    'votable_id' => $commentId,
                    'votable_type' => VotableType::COMMENT->value,
                    'type' => fake()->numberBetween(0, 5) === 4 ? VoteType::DOWN->value : VoteType::UP->value,
                ]);
            }
        });
    }
}
