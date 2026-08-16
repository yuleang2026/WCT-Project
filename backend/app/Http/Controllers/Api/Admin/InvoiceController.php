<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Booking;
use App\Models\Invoice;
use App\Services\InvoiceService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    public function __construct(private readonly InvoiceService $invoiceService) {}

    public function index(Request $request)
    {
        $query = Invoice::query()->with(['booking.user', 'booking.space']);

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        return response()->json($query->latest()->paginate($request->integer('per_page', 15)));
    }

    public function show(Invoice $invoice)
    {
        return response()->json(['invoice' => $invoice->load(['booking.user', 'booking.space', 'payments'])]);
    }

    public function generateMonthly(Request $request, Booking $booking)
    {
        abort_unless($booking->isOffice() && $booking->status === Booking::STATUS_APPROVED, 422, 'Monthly invoices can only be generated for approved office bookings.');

        $invoice = $this->invoiceService->generateMonthly($booking);

        AuditLog::record($request->user(), 'invoice.generated', $invoice, 'Monthly invoice generated');

        return response()->json(['invoice' => $invoice], 201);
    }

    public function download(Invoice $invoice)
    {
        $pdf = Pdf::loadView('pdf.invoice', ['invoice' => $invoice->load('booking.user', 'booking.space')]);

        return $pdf->download("{$invoice->invoice_number}.pdf");
    }
}
