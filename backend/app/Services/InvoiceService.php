<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Invoice;
use Carbon\Carbon;

class InvoiceService
{
    public function generateDeposit(Booking $booking): Invoice
    {
        $items = [
            ['label' => 'Deposit for '.$booking->space->name, 'amount' => (float) $booking->deposit_amount],
        ];

        return $this->create($booking, $items, (float) $booking->deposit_amount, dueInDays: 3);
    }

    public function generateFinal(Booking $booking): Invoice
    {
        $items = [
            ['label' => $booking->space->name.' rental', 'amount' => (float) $booking->space_price],
        ];

        if ($booking->equipment_price > 0) {
            $items[] = ['label' => 'Equipment & add-ons', 'amount' => (float) $booking->equipment_price];
        }

        $total = (float) $booking->total_price;
        $alreadyInvoiced = (float) $booking->deposit_amount;
        $remaining = max($total - $alreadyInvoiced, 0);

        return $this->create($booking, $items, $remaining, dueInDays: 7, subtotalOverride: $total);
    }

    public function generateMonthly(Booking $booking): Invoice
    {
        $items = [
            ['label' => 'Monthly rent - '.$booking->space->name, 'amount' => (float) $booking->space_price],
        ];

        return $this->create($booking, $items, (float) $booking->space_price, dueInDays: 5);
    }

    private function create(Booking $booking, array $items, float $total, int $dueInDays, ?float $subtotalOverride = null): Invoice
    {
        return Invoice::create([
            'booking_id' => $booking->id,
            'issue_date' => Carbon::today(),
            'due_date' => Carbon::today()->addDays($dueInDays),
            'items' => $items,
            'subtotal' => $subtotalOverride ?? $total,
            'tax' => 0,
            'total' => $total,
            'status' => Invoice::STATUS_UNPAID,
        ]);
    }
}
