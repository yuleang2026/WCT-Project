<?php

namespace App\Notifications;

use App\Models\Payment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PaymentStatusUpdated extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Payment $payment) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("Payment {$this->payment->payment_number} {$this->payment->status}")
            ->greeting("Hello {$notifiable->name},")
            ->line("Your payment of {$this->payment->amount} {$this->payment->currency} has been {$this->payment->status}.")
            ->action('View Payments', config('app.frontend_url').'/dashboard/payments')
            ->line('Thank you for using NICC SmartSpace.');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'payment_status_updated',
            'payment_id' => $this->payment->id,
            'payment_number' => $this->payment->payment_number,
            'status' => $this->payment->status,
            'message' => "Payment {$this->payment->payment_number} is now {$this->payment->status}.",
        ];
    }
}
