<?php

namespace App\Exports;

use App\Models\Booking;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class BookingsExport implements FromCollection, WithHeadings
{
    public function __construct(private readonly ?string $startDate = null, private readonly ?string $endDate = null) {}

    public function collection(): Collection
    {
        $query = Booking::query()->with(['space', 'user']);

        if ($this->startDate) {
            $query->whereDate('start_date', '>=', $this->startDate);
        }

        if ($this->endDate) {
            $query->whereDate('start_date', '<=', $this->endDate);
        }

        return $query->latest()->get()->map(fn (Booking $booking) => [
            $booking->booking_number,
            $booking->user->name,
            $booking->space->name,
            $booking->type,
            $booking->start_date->format('Y-m-d'),
            $booking->end_date?->format('Y-m-d'),
            $booking->status,
            (float) $booking->total_price,
            $booking->created_at->format('Y-m-d H:i'),
        ]);
    }

    public function headings(): array
    {
        return ['Booking #', 'Customer', 'Space', 'Type', 'Start Date', 'End Date', 'Status', 'Total (USD)', 'Created At'];
    }
}
