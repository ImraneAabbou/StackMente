<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MarkCommentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->id === $this->route('comment')->post->user_id &&
            $this
                ->route('comment')
                ->post
                ->comments
                ->pluck('id')
                ->contains(
                    $this->route('comment')->id
                );
    }
}
