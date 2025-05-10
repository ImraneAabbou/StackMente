<?php

namespace App\Providers;

use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\ServiceProvider;

class I18nVerificationMail extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        VerifyEmail::toMailUsing(function (object $notifiable, string $url) {
        return (new MailMessage)

            ->subject(__('mail.verify_email_subject'))
            ->line(__('mail.verify_email_header'))
            ->line(__('mail.verify_email_body'))
            ->action(__('mail.verify_email_action'), $url);

    });
    }
}
