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
            MissionSeeder::class,
            MissionAttacherSeeder::class,
            TagSeeder::class,
            PostSeeder::class,
            CommentSeeder::class,
            VoteSeeder::class,
            ReportSeeder::class
        ]);
    }
}
