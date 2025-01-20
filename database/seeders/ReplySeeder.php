<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Reply;
use Illuminate\Database\Seeder;

class ReplySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Comment::pluck('id')->each(function ($commentId) {
            Reply::factory(fake()->numberBetween(0, 4))->create([
                'comment_id' => $commentId,
                'user_id' => fake()->numberBetween(1, 100)
            ]);
        });
    }
}
