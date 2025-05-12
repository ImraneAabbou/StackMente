<?php

namespace App\Notifications;

use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Str;

class SeasonTopThreeCongratsNotification extends Notification
{
    use Queueable;

    private string $pdfPath;
    private string $period;
    private int $rank;

    /**
     * Create a new notification instance.
     */
    public function __construct(string $period, int $rank)
    {
        $this->pdfPath = '/tmp/' . Str::uuid() . '.pdf';
        $this->period = $period;
        $this->rank = $rank;
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
        Pdf::loadView(
            'pdf.certificate',
            [
                'title' => __('certificate.title'),
                'subtitle' => __('certificate.subtitle'),
                'text' => __('certificate.text', ['rank' => $this->rank, 'season' => __('certificate.' . Str::lower($this->period))]),
                'fullname' => $notifiable->fullname
            ]
        )
            ->setPaper('a4', 'landscape')
            ->save($this->pdfPath);

        return (new MailMessage)
            ->subject(__('certificate.title'))
            ->line(__('certificate.text', ['rank' => $this->rank, 'season' => __('certificate.' . Str::lower($this->period))]))
            ->line(__('certificate.check_attachments'))
            ->attach($this->pdfPath);
    }

    /**
     * @return void
     */
    public function __destruct()
    {
        file_exists($this->pdfPath) && unlink($this->pdfPath);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
