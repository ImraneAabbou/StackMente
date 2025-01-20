<?php

namespace App\Notifications;

use App\Enums\NotificationType;
use App\Models\Post;
use App\Models\Reply;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Str;

class ReplyNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        private Reply $reply,
        private User $replier,
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
        return NotificationType::REPLY_RECEIVED->value;
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
            'reply' => [
                'id' => $this->reply->id,
                'content' => Str::limit($this->reply->content)
            ],
            'replier' => [
                'id' => $this->replier->id,
                'fullname' => $this->replier->fullname,
                'avatar' => $this->replier->avatar,
            ],
        ];
    }
}
