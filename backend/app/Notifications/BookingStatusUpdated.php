<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BookingStatusUpdated extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Booking $booking) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $booking = $this->booking;

        return (new MailMessage)
            ->subject("Booking {$booking->booking_number} is now {$booking->status}")
            ->greeting("Hello {$notifiable->name},")
            ->line("Your booking {$booking->booking_number} for \"{$booking->space->name}\" has been {$booking->status}.")
            ->when($booking->admin_note, fn ($mail) => $mail->line("Note from admin: {$booking->admin_note}"))
            ->action('View Booking', config('app.frontend_url').'/dashboard/bookings/'.$booking->id)
            ->line('Thank you for using NICC SmartSpace.');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'booking_status_updated',
            'booking_id' => $this->booking->id,
            'booking_number' => $this->booking->booking_number,
            'status' => $this->booking->status,
            'message' => "Booking {$this->booking->booking_number} is now {$this->booking->status}.",
        ];
    }
}
