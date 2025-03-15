<?php

namespace App\Http\Requests\Mission;

use App\Enums\MissionType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class StoreMissionRequest extends FormRequest
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
        return [
            'image' => ['required', 'image', "extensions:svg", "mimes:svg", 'dimensions:ratio=1/1'],
            'translation_key' => [
                'required',
                'string',
                'max:255',
                'regex:/^[a-zA-Z0-9_-]+$/',
                'unique:missions,translation_key',
            ],
            'type' => ["required", new Enum(MissionType::class)],
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
