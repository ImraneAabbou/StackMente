<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class UserBannedNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct()
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
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject(__('ban.banned_subject'))
            ->line(__('ban.banned_greeting', ['name' => $notifiable->fullname]))
            ->line(__('ban.banned_intro'))
            ->line(__('ban.banned_action_taken'))
            ->line(__('ban.banned_contact_support'))
            ->line(__('ban.banned_review_case'))
            ->line(__('ban.banned_thank_you'));
    }
}
