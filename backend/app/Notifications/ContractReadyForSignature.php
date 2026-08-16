<?php

namespace App\Notifications;

use App\Models\Contract;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ContractReadyForSignature extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Contract $contract) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("Contract {$this->contract->contract_number} is ready for signature")
            ->greeting("Hello {$notifiable->name},")
            ->line('Your booking has been approved and a digital contract has been generated.')
            ->action('Review & Sign', config('app.frontend_url').'/dashboard/contracts/'.$this->contract->id)
            ->line('Please review and sign the contract to proceed with payment.');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'contract_ready',
            'contract_id' => $this->contract->id,
            'contract_number' => $this->contract->contract_number,
            'message' => "Contract {$this->contract->contract_number} is ready for your signature.",
        ];
    }
}
