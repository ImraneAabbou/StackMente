<?php

namespace App\Notifications;

use App\Enums\NotificationType;
use App\Models\Post;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class PostVotedNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        private User $voter,
        private Post $post,
    ) {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the notification's database type.
     *
     * @return string
     */
    public function databaseType(object $notifiable): string
    {
        return NotificationType::POST_VOTE_RECEIVED->value;
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'post' => [
                'slug' => $this->post->slug
            ],
            'voter' => [
                'id' => $this->voter->id,
                'fullname' => $this->voter->fullname,
                'avatar' => $this->voter->avatar,
            ],
        ];
    }
}
