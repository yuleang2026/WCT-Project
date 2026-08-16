<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Booking;
use App\Notifications\BookingStatusUpdated;
use App\Notifications\ContractReadyForSignature;
use App\Services\ContractService;
use App\Services\InvoiceService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BookingController extends Controller
{
    public function __construct(
        private readonly ContractService $contractService,
        private readonly InvoiceService $invoiceService,
    ) {}

    public function index(Request $request)
    {
        $query = Booking::query()->with(['space', 'user']);

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        if ($request->filled('type')) {
            $query->where('type', $request->string('type'));
        }

        if ($request->filled('space_id')) {
            $query->where('space_id', $request->integer('space_id'));
        }

        if ($request->filled('search')) {
            $search = (string) $request->string('search');
            $query->where(function ($q) use ($search) {
                $q->whereLikeInsensitive('booking_number', $search)
                    ->orWhereHas('user', fn ($u) => $u->whereLikeInsensitive('name', $search)->orWhereLikeInsensitive('email', $search));
            });
        }

        return response()->json(
            $query->latest()->paginate($request->integer('per_page', 15))
        );
    }

    public function show(Booking $booking)
    {
        $booking->load(['space', 'user', 'equipment', 'companyProfile', 'documents', 'contract', 'invoices', 'payments', 'reviewer']);

        return response()->json(['booking' => $booking]);
    }

    public function approve(Request $request, Booking $booking)
    {
        if ($booking->status !== Booking::STATUS_PENDING) {
            return response()->json(['message' => 'Only pending bookings can be approved.'], 422);
        }

        $data = $request->validate(['admin_note' => ['nullable', 'string', 'max:2000']]);

        DB::transaction(function () use ($booking, $request, $data) {
            $booking->update([
                'status' => Booking::STATUS_APPROVED,
                'admin_note' => $data['admin_note'] ?? null,
                'reviewed_by' => $request->user()->id,
                'reviewed_at' => now(),
            ]);

            $contract = $this->contractService->generateForBooking($booking);

            if ($booking->deposit_amount > 0) {
                $this->invoiceService->generateDeposit($booking);
            } else {
                $this->invoiceService->generateFinal($booking);
            }

            $booking->user->notify(new BookingStatusUpdated($booking));
            $booking->user->notify(new ContractReadyForSignature($contract));
        });

        AuditLog::record($request->user(), 'booking.approved', $booking);

        return response()->json(['booking' => $booking->fresh(['space', 'user', 'contract', 'invoices'])]);
    }

    public function reject(Request $request, Booking $booking)
    {
        if ($booking->status !== Booking::STATUS_PENDING) {
            return response()->json(['message' => 'Only pending bookings can be rejected.'], 422);
        }

        $data = $request->validate(['admin_note' => ['required', 'string', 'max:2000']]);

        $booking->update([
            'status' => Booking::STATUS_REJECTED,
            'admin_note' => $data['admin_note'],
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        $booking->user->notify(new BookingStatusUpdated($booking));

        AuditLog::record($request->user(), 'booking.rejected', $booking, $data['admin_note']);

        return response()->json(['booking' => $booking]);
    }

    public function complete(Request $request, Booking $booking)
    {
        if ($booking->status !== Booking::STATUS_APPROVED) {
            return response()->json(['message' => 'Only approved bookings can be marked completed.'], 422);
        }

        $booking->update(['status' => Booking::STATUS_COMPLETED]);

        $booking->user->notify(new BookingStatusUpdated($booking));

        AuditLog::record($request->user(), 'booking.completed', $booking);

        return response()->json(['booking' => $booking]);
    }
}
