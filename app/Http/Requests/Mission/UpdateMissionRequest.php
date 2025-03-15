<?php

namespace App\Http\Requests\Mission;

use App\Enums\MissionType;
use App\Models\Mission;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;
use Illuminate\Validation\Rule;

class UpdateMissionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return is_int($this->route("mission")->id);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'image' => ['nullable', 'image', 'extensions:svg', 'mimes:svg', 'dimensions:ratio=1/1'],
            'translation_key' => [
                'required',
                'string',
                'max:255',
                'regex:/^[a-zA-Z0-9_-]+$/',
                Rule::unique(Mission::class, 'translation_key')->ignore($this->route('mission')->id),
            ],
            'type' => ['required', new Enum(MissionType::class)],
            'threshold' => [
                'required',
                'integer'
            ],
            'xp_reward' => [
                'required',
                'integer'
            ],
        ];
    }
}
