<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ResetPassword extends Notification
{
    /**
     * The password reset token.
     *
     * @var string
     */
    public $token;

    /**
     * Fullname for user.
     *
     * @var string
     */
    public $fullname;

    /**
     * Create a notification instance.
     *
     * @param  string  $token
     * @param  string  $fullname
     * @return void
     */
    public function __construct($token, $fullname)
    {
        $this->token = $token;
        $this->fullname = $fullname;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Build the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject(__('passwords.forget_password_subject'))
            ->greeting(__('passwords.forget_password_greeting', ['fullname' => $this->fullname]))
            ->line(__('passwords.forget_password_received_bcz'))
            ->action(__('passwords.forget_password_reset_action'), url('password/reset', $this->token))
            ->line(__('passwords.forget_password_expires_in'))
            ->line(__('passwords.forget_password_if_didnt_request'));
    }
}
