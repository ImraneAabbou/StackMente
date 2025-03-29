<?php

namespace App\Rules;

use App\Models\Tag;
use Illuminate\Contracts\Validation\ValidationRule;
use Closure;
use Illuminate\Support\Facades\Validator;

class TagsExist implements ValidationRule
{
    protected array $missingTags = [];

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!is_array($value)) {
            return;
        }

        $tagNames = array_column($value, 'name');
        $existingTags = Tag::whereIn('name', $tagNames)->pluck('name')->toArray();

        // Loop through the tags and validate
        foreach ($value as $tag) {
            $tagName = $tag['name'];
            $description = $tag['description'] ?? '';

            // If the tag does not exist in the DB and it has no description or the description is invalid
            if (!in_array($tagName, $existingTags)) {
                if (empty($description)) {
                    // No description, so this is a missing tag
                    $this->missingTags[] = $tagName;
                } else {
                    // Validate description length (min: 25, max: 125)
                    $validator = Validator::make(
                        ['description' => $description],
                        ['description' => 'min:25|max:125']
                    );

                    // If validation fails, we add it to the missing tags
                    if ($validator->fails()) {
                        $this->missingTags[] = $tagName;
                        // Add the validation error message
                        $fail("tags.{$tagName}.description", $validator->errors()->first('description'));
                    }
                }
            }
        }
    }

    public function getMissingTags(): array
    {
        return $this->missingTags;
    }
}

