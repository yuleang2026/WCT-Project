<?php

namespace App\Http\Controllers\Api\Admin;

use App\Exports\BookingsExport;
use App\Exports\RevenueExport;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Payment;
use App\Models\Space;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class ReportController extends Controller
{
    public function summary(Request $request)
    {
        $data = $request->validate([
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date'],
        ]);

        $bookings = Booking::query()
            ->when($data['start_date'] ?? null, fn ($q, $v) => $q->whereDate('start_date', '>=', $v))
            ->when($data['end_date'] ?? null, fn ($q, $v) => $q->whereDate('start_date', '<=', $v));

        $revenue = Payment::query()
            ->where('status', 'confirmed')
            ->when($data['start_date'] ?? null, fn ($q, $v) => $q->whereDate('paid_at', '>=', $v))
            ->when($data['end_date'] ?? null, fn ($q, $v) => $q->whereDate('paid_at', '<=', $v));

        return response()->json([
            'total_bookings' => (clone $bookings)->count(),
            'by_status' => (clone $bookings)->selectRaw('status, count(*) as count')->groupBy('status')->pluck('count', 'status'),
            'by_type' => (clone $bookings)->selectRaw('type, count(*) as count')->groupBy('type')->pluck('count', 'type'),
            'total_revenue' => (float) (clone $revenue)->sum('amount'),
            'occupancy_by_space' => Space::query()->withCount(['bookings' => function ($q) use ($data) {
                $q->whereIn('status', [Booking::STATUS_APPROVED, Booking::STATUS_COMPLETED])
                    ->when($data['start_date'] ?? null, fn ($qq, $v) => $qq->whereDate('start_date', '>=', $v))
                    ->when($data['end_date'] ?? null, fn ($qq, $v) => $qq->whereDate('start_date', '<=', $v));
            }])->get(['id', 'name', 'type']),
        ]);
    }

    public function exportBookingsExcel(Request $request)
    {
        $data = $request->validate(['start_date' => ['nullable', 'date'], 'end_date' => ['nullable', 'date']]);

        return Excel::download(
            new BookingsExport($data['start_date'] ?? null, $data['end_date'] ?? null),
            'bookings-report.xlsx'
        );
    }

    public function exportRevenueExcel(Request $request)
    {
        $data = $request->validate(['start_date' => ['nullable', 'date'], 'end_date' => ['nullable', 'date']]);

        return Excel::download(
            new RevenueExport($data['start_date'] ?? null, $data['end_date'] ?? null),
            'revenue-report.xlsx'
        );
    }

    public function exportBookingsPdf(Request $request)
    {
        $data = $request->validate(['start_date' => ['nullable', 'date'], 'end_date' => ['nullable', 'date']]);

        $bookings = Booking::query()
            ->with(['space', 'user'])
            ->when($data['start_date'] ?? null, fn ($q, $v) => $q->whereDate('start_date', '>=', $v))
            ->when($data['end_date'] ?? null, fn ($q, $v) => $q->whereDate('start_date', '<=', $v))
            ->latest()
            ->get();

        $pdf = Pdf::loadView('pdf.bookings-report', [
            'bookings' => $bookings,
            'startDate' => $data['start_date'] ?? null,
            'endDate' => $data['end_date'] ?? null,
        ]);

        return $pdf->download('bookings-report.pdf');
    }
}
