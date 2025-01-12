<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Post;
use App\Models\Reply;
use App\Models\Report;
use App\Models\User;
use Illuminate\Database\Seeder;

class ReportSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::inRandomOrder()->take(3)->get();
        $posts = Post::inRandomOrder()->take(8)->get();
        $comments = Comment::inRandomOrder()->take(12)->get();
        $replies = Reply::inRandomOrder()->take(18)->get();

        $reportables = $posts->merge($comments)->merge($replies)->merge($users);

        $reportables->each(function ($reportable) {
            $numReports = fake()->numberBetween(1, 3);

            Report::factory($numReports)->create([
                'user_id' => User::inRandomOrder()->first()->id,
                'reportable_id' => $reportable->id,
                'reportable_type' => $reportable->getMorphClass(),
            ]);
        });
    }
}
