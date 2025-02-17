<?php

namespace App\Http\Requests\Post;

use App\Enums\PostType;
use App\Rules\UniquePost;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePostRequest extends FormRequest
{
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
                new UniquePost($this->route('post')->id)
            ],
            'content' => ['required', 'string', "max:$maxContentLength", "min:$minContentLength"],
            'type' => ['required', Rule::enum(PostType::class)],
        ];
    }
}
