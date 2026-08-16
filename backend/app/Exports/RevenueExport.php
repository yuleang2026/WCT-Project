<?php

namespace App\Exports;

use App\Models\Payment;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class RevenueExport implements FromCollection, WithHeadings
{
    public function __construct(private readonly ?string $startDate = null, private readonly ?string $endDate = null) {}

    public function collection(): Collection
    {
        $query = Payment::query()->with(['booking.space', 'booking.user'])->where('status', 'confirmed');

        if ($this->startDate) {
            $query->whereDate('paid_at', '>=', $this->startDate);
        }

        if ($this->endDate) {
            $query->whereDate('paid_at', '<=', $this->endDate);
        }

        return $query->latest('paid_at')->get()->map(fn (Payment $payment) => [
            $payment->payment_number,
            $payment->booking->booking_number,
            $payment->booking->user->name,
            $payment->booking->space->name,
            $payment->type,
            $payment->method,
            (float) $payment->amount,
            $payment->paid_at?->format('Y-m-d H:i'),
        ]);
    }

    public function headings(): array
    {
        return ['Payment #', 'Booking #', 'Customer', 'Space', 'Type', 'Method', 'Amount (USD)', 'Paid At'];
    }
}
