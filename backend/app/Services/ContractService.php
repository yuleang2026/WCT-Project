<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Contract;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

class ContractService
{
    public function generateForBooking(Booking $booking): Contract
    {
        $booking->loadMissing(['space', 'user', 'companyProfile', 'equipment']);

        $terms = $this->buildTerms($booking);

        $contract = Contract::updateOrCreate(
            ['booking_id' => $booking->id],
            [
                'terms' => $terms,
                'status' => Contract::STATUS_PENDING_SIGNATURE,
                'expiry_date' => $booking->end_date ?? $booking->start_date,
            ]
        );

        $pdf = Pdf::loadView('pdf.contract', ['booking' => $booking, 'contract' => $contract]);
        $path = "contracts/{$contract->contract_number}.pdf";
        Storage::disk('local')->put($path, $pdf->output());

        $contract->update(['pdf_path' => $path]);

        return $contract;
    }

    public function sign(Contract $contract, int $userId): Contract
    {
        $contract->update([
            'status' => Contract::STATUS_SIGNED,
            'signed_by' => $userId,
            'signed_at' => now(),
        ]);

        return $contract;
    }

    private function buildTerms(Booking $booking): string
    {
        $space = $booking->space;
        $customer = $booking->user;

        if ($booking->isEvent()) {
            return view('pdf.terms-event', compact('booking', 'space', 'customer'))->render();
        }

        return view('pdf.terms-office', compact('booking', 'space', 'customer'))->render();
    }
}
