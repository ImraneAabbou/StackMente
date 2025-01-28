<?php

namespace App\Http\Requests\Profile;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
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
        $userHasPassword = !!$this->user()?->password;

        return [
            'fullname' => ['required', 'string', 'max:255'],
            'username' => [
                'required',
                'string',
                'max:25',
                'regex:/^[a-zA-Z0-9_-]+$/',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
            'email' => [
                $this->user()?->email ? 'required' : 'nullable',
                'string',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
            'avatar' => ['nullable', 'image'],
            'current_password' => array_filter([
                'nullable',
                $userHasPassword ? 'required_with:password' : null,
                $userHasPassword ? 'current_password' : null,
            ]),
            'password' => [
                'nullable',
                'confirmed',
                'required_with:current_password',
                Password::defaults()
            ]
        ];
    }
}
