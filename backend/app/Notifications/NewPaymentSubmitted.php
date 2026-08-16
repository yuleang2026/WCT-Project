<?php

namespace App\Notifications;

use App\Models\Payment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewPaymentSubmitted extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Payment $payment) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("New payment submitted: {$this->payment->payment_number}")
            ->line("A payment of {$this->payment->amount} {$this->payment->currency} was submitted for booking {$this->payment->booking->booking_number}.")
            ->action('Review Payment', config('app.frontend_url').'/admin/payments/'.$this->payment->id);
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'new_payment_submitted',
            'payment_id' => $this->payment->id,
            'payment_number' => $this->payment->payment_number,
            'message' => "New payment {$this->payment->payment_number} needs review.",
        ];
    }
}
