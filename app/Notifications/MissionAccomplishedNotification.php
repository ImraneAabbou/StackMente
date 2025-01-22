<?php

namespace App\Notifications;

use App\Enums\NotificationType;
use App\Models\Mission;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class MissionAccomplishedNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public Mission $mission)
    {
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
    public function databaseType(object $notifiable): NotificationType
    {
        return NotificationType::MISSION_ACCOMPLISHED;
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'mission_id' => $this->mission->id,
        ];
    }
}
