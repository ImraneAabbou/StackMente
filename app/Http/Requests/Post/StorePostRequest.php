<?php

namespace App\Http\Requests\Post;

use App\Enums\PostType;
use App\Rules\TagsExist;
use App\Rules\UniquePost;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StorePostRequest extends FormRequest
{
    protected TagsExist $tagsExistRule;

    public function __construct()
    {
        $this->tagsExistRule = new TagsExist();
    }

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $maxContentLength = $this->input('type') === PostType::ARTICLE->value ? 10000000 : 65000;
        $minContentLength = $this->input('type') === PostType::ARTICLE->value ? 5000 : 255;

        return [
            'title' => [
                'required',
                'string',
                'max:200',
                new UniquePost
            ],
            'tags' => ['required', 'array', 'min:3', 'max:6', $this->tagsExistRule],
            'tags.*.name' => ['required', 'string', 'max:50'],
            'tags.*.description' => ['string', 'nullable'],
            'content' => ['required', 'string', "max:$maxContentLength", "min:$minContentLength"],
            'type' => ['required', Rule::enum(PostType::class)],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function ($validator) {
            $missingTags = $this->tagsExistRule->getMissingTags();
            if (!empty($missingTags)) {
                $validator->errors()->add('tags', collect($missingTags));
            }
        });
    }

}
