<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Invoice;
use App\Models\Payment;
use App\Notifications\PaymentStatusUpdated;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        $query = Payment::query()->with(['booking.user', 'booking.space', 'invoice']);

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        return response()->json($query->latest()->paginate($request->integer('per_page', 15)));
    }

    public function show(Payment $payment)
    {
        return response()->json(['payment' => $payment->load(['booking.user', 'booking.space', 'invoice'])]);
    }

    public function downloadProof(Payment $payment)
    {
        abort_unless($payment->proof_path && Storage::disk('local')->exists($payment->proof_path), 404);

        return Storage::disk('local')->download($payment->proof_path);
    }

    public function confirm(Request $request, Payment $payment)
    {
        if ($payment->status !== Payment::STATUS_PENDING) {
            return response()->json(['message' => 'Only pending payments can be confirmed.'], 422);
        }

        DB::transaction(function () use ($payment, $request) {
            $payment->update([
                'status' => Payment::STATUS_CONFIRMED,
                'confirmed_by' => $request->user()->id,
                'confirmed_at' => now(),
                'paid_at' => now(),
            ]);

            if ($payment->invoice_id) {
                $this->syncInvoiceStatus($payment->invoice);
            }

            $payment->booking->user->notify(new PaymentStatusUpdated($payment));
        });

        AuditLog::record($request->user(), 'payment.confirmed', $payment);

        return response()->json(['payment' => $payment->fresh(['booking', 'invoice'])]);
    }

    public function reject(Request $request, Payment $payment)
    {
        if ($payment->status !== Payment::STATUS_PENDING) {
            return response()->json(['message' => 'Only pending payments can be rejected.'], 422);
        }

        $data = $request->validate(['reference_note' => ['nullable', 'string', 'max:255']]);

        $payment->update([
            'status' => Payment::STATUS_REJECTED,
            'confirmed_by' => $request->user()->id,
            'confirmed_at' => now(),
            'reference_note' => $data['reference_note'] ?? $payment->reference_note,
        ]);

        $payment->booking->user->notify(new PaymentStatusUpdated($payment));

        AuditLog::record($request->user(), 'payment.rejected', $payment);

        return response()->json(['payment' => $payment]);
    }

    private function syncInvoiceStatus(Invoice $invoice): void
    {
        $paid = $invoice->amountPaid();

        $status = match (true) {
            $paid <= 0 => Invoice::STATUS_UNPAID,
            $paid < (float) $invoice->total => Invoice::STATUS_PARTIALLY_PAID,
            default => Invoice::STATUS_PAID,
        };

        $invoice->update(['status' => $status]);
    }
}
