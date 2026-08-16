<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEventBookingRequest;
use App\Http\Requests\StoreOfficeBookingRequest;
use App\Models\AuditLog;
use App\Models\Booking;
use App\Models\User;
use App\Notifications\NewBookingSubmitted;
use App\Services\BookingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;

class BookingController extends Controller
{
    public function __construct(private readonly BookingService $bookingService) {}

    public function index(Request $request)
    {
        $query = $request->user()->bookings()->with(['space']);

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        if ($request->filled('type')) {
            $query->where('type', $request->string('type'));
        }

        return response()->json(
            $query->latest()->paginate($request->integer('per_page', 10))
        );
    }

    public function show(Request $request, Booking $booking)
    {
        $this->authorizeOwnership($request, $booking);

        $booking->load(['space', 'equipment', 'companyProfile', 'documents', 'contract', 'invoices', 'payments']);

        return response()->json(['booking' => $booking]);
    }

    public function storeEvent(StoreEventBookingRequest $request)
    {
        $booking = $this->bookingService->createEventBooking($request->user(), $request->validated());

        $this->notifyAdmins($booking);

        AuditLog::record($request->user(), 'booking.created', $booking, 'Event booking submitted');

        return response()->json(['booking' => $booking], 201);
    }

    public function storeOffice(StoreOfficeBookingRequest $request)
    {
        $booking = $this->bookingService->createOfficeBooking(
            $request->user(),
            $request->validated(),
            $request->file('business_license'),
            $request->file('id_card'),
            $request->file('other_documents', [])
        );

        $this->notifyAdmins($booking);

        AuditLog::record($request->user(), 'booking.created', $booking, 'Office booking submitted');

        return response()->json(['booking' => $booking], 201);
    }

    public function cancel(Request $request, Booking $booking)
    {
        $this->authorizeOwnership($request, $booking);

        if (! in_array($booking->status, [Booking::STATUS_PENDING, Booking::STATUS_APPROVED], true)) {
            return response()->json(['message' => 'This booking can no longer be cancelled.'], 422);
        }

        $booking->update(['status' => Booking::STATUS_CANCELLED]);

        AuditLog::record($request->user(), 'booking.cancelled', $booking);

        return response()->json(['booking' => $booking]);
    }

    private function authorizeOwnership(Request $request, Booking $booking): void
    {
        abort_unless($booking->user_id === $request->user()->id, 403, 'You do not have access to this booking.');
    }

    private function notifyAdmins(Booking $booking): void
    {
        $admins = User::query()->whereIn('role', [User::ROLE_ADMIN, User::ROLE_SUPERADMIN])->get();

        if ($admins->isNotEmpty()) {
            Notification::send($admins, new NewBookingSubmitted($booking));
        }
    }
}
