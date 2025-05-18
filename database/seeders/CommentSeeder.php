<?php

namespace Database\Seeders;

use App\Enums\PostType;
use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;
use TKey;
use TValue;

class CommentSeeder extends Seeder
{
    /**
     * @return Collection<TKey,TValue>
     */
    private function getRandomUserIds(): Collection
    {
        return User::inRandomOrder()->take(fake()->numberBetween(1, 8))->pluck('id');
    }

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Post::pluck('id')->each(function ($postId) {
            $this->getRandomUserIds()->each(fn($id) =>
                Comment::factory(1)->create([
                    'post_id' => $postId,
                    'user_id' => $id,
                ]));
        });

        Post::where('type', PostType::QUESTION)
            ->inRandomOrder()
            ->take(fake()->numberBetween(5, 10))
            ->each(function (Post $post) {
                $is_marked = fake()->numberBetween(0, 25) === 11;
                $post->comments->random()->update(["is_marked" => $is_marked]);
            });

    }
}
