<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Booking;
use App\Models\Payment;
use App\Models\User;
use App\Notifications\NewPaymentSubmitted;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        $payments = Payment::query()
            ->whereHas('booking', fn ($q) => $q->where('user_id', $request->user()->id))
            ->with(['booking.space', 'invoice'])
            ->latest()
            ->paginate($request->integer('per_page', 10));

        return response()->json($payments);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'booking_id' => ['required', 'integer', 'exists:bookings,id'],
            'invoice_id' => ['nullable', 'integer', 'exists:invoices,id'],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'method' => ['required', 'in:cash,bank_transfer,qr_payment,card,other'],
            'type' => ['required', 'in:deposit,full,monthly,other'],
            'reference_note' => ['nullable', 'string', 'max:255'],
            'proof' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:10240'],
        ]);

        $booking = Booking::query()->findOrFail($data['booking_id']);
        abort_unless($booking->user_id === $request->user()->id, 403);

        $proofPath = null;
        if ($request->hasFile('proof')) {
            $proofPath = $request->file('proof')->store("bookings/{$booking->id}/payments", 'local');
        }

        $payment = Payment::create([
            'booking_id' => $booking->id,
            'invoice_id' => $data['invoice_id'] ?? null,
            'amount' => $data['amount'],
            'method' => $data['method'],
            'type' => $data['type'],
            'status' => Payment::STATUS_PENDING,
            'reference_note' => $data['reference_note'] ?? null,
            'proof_path' => $proofPath,
        ]);

        $admins = User::query()->whereIn('role', [User::ROLE_ADMIN, User::ROLE_SUPERADMIN])->get();
        if ($admins->isNotEmpty()) {
            Notification::send($admins, new NewPaymentSubmitted($payment));
        }

        AuditLog::record($request->user(), 'payment.submitted', $payment);

        return response()->json(['payment' => $payment], 201);
    }

    public function show(Request $request, Payment $payment)
    {
        abort_unless($payment->booking->user_id === $request->user()->id, 403);

        return response()->json(['payment' => $payment->load(['booking.space', 'invoice'])]);
    }

    public function downloadProof(Request $request, Payment $payment)
    {
        abort_unless($payment->booking->user_id === $request->user()->id, 403);
        abort_unless($payment->proof_path && Storage::disk('local')->exists($payment->proof_path), 404);

        return Storage::disk('local')->download($payment->proof_path);
    }
}
