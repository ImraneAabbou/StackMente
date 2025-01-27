<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Reply;
use App\Models\User;
use Illuminate\Database\Seeder;

class ReplySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Comment::pluck('id')->each(function ($commentId) {
            collect(range(0, fake()->numberBetween(0, 4)))
                ->each(fn() =>
                    Reply::factory()->create([
                        'comment_id' => $commentId,
                        'user_id' => User::inRandomOrder()->first()
                    ]));
        });
    }
}
