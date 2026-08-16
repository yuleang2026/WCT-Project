<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewBookingSubmitted extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Booking $booking) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("New booking request {$this->booking->booking_number}")
            ->line("A new {$this->booking->type} booking was submitted for \"{$this->booking->space->name}\".")
            ->action('Review Booking', config('app.frontend_url').'/admin/bookings/'.$this->booking->id);
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'new_booking_submitted',
            'booking_id' => $this->booking->id,
            'booking_number' => $this->booking->booking_number,
            'message' => "New booking request {$this->booking->booking_number} needs review.",
        ];
    }
}
