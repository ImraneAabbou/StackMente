<?php

namespace App\Rules;

use App\Models\Post;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Str;
use Closure;

class UniquePost implements ValidationRule
{
    protected $postId;

    /**
     * Create a new rule instance.
     *
     * @param int|null $postId The ID of the post being updated, if applicable
     */
    public function __construct($postId = null)
    {
        $this->postId = $postId;
    }

    /**
     * Run the validation rule.
     *
     * @param  string  $attribute
     * @param  mixed   $value
     * @param  \Closure  $fail
     * @return void
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $slug = Str::slug($value);

        $query = Post::where('slug', $slug);

        if ($this->postId) {
            $query->where('id', '!=', $this->postId);
        }

        if ($query->exists()) {
            $fail(__('validation.unique_post'));
        }
    }
}
