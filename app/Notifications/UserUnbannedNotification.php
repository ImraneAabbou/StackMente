<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class UserUnbannedNotification extends Notification
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
            ->subject(__('ban.unbanned_subject'))
            ->line(__('ban.unbanned_greeting', ['name' => $notifiable->fullname]))
            ->line(__('ban.unbanned_intro'))
            ->line(__('ban.unbanned_action_taken'))
            ->line(__('ban.unbanned_contact_support'))
            ->line(__('ban.unbanned_review_case'))
            ->line(__('ban.unbanned_thank_you'));
    }
}
