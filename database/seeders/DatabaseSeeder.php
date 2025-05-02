<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // seed missions
        $this->call([
            UserSeeder::class,
            TagSeeder::class,
            PostSeeder::class,
            CommentSeeder::class,
            ReplySeeder::class,
            VoteSeeder::class,
            ReportSeeder::class,
            MissionSeeder::class,
        ]);
    }
}
