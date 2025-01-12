<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    /**
     * @return Collection<int,Model>
     */
    private function getRandomTags(): Collection
    {
        return Tag::inRandomOrder()->take(fake()->numberBetween(3, 6))->get();
    }

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::pluck("id")->each(function ($userId) {
            Post::factory(fake()->numberBetween(0, 5))
                ->create([
                    'user_id' => $userId
                ])
                ->each(function (Post $post) {
                    $post->tags()->attach(
                        $this->getRandomTags()
                    );
                });
        });
    }
}
