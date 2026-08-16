<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    public function index(Request $request)
    {
        $invoices = Invoice::query()
            ->whereHas('booking', fn ($q) => $q->where('user_id', $request->user()->id))
            ->with('booking.space')
            ->latest()
            ->paginate($request->integer('per_page', 10));

        return response()->json($invoices);
    }

    public function show(Request $request, Invoice $invoice)
    {
        $this->authorizeOwnership($request, $invoice);

        return response()->json(['invoice' => $invoice->load('booking.space', 'payments')]);
    }

    public function download(Request $request, Invoice $invoice)
    {
        $this->authorizeOwnership($request, $invoice);

        $pdf = Pdf::loadView('pdf.invoice', ['invoice' => $invoice->load('booking.user', 'booking.space')]);

        return $pdf->download("{$invoice->invoice_number}.pdf");
    }

    private function authorizeOwnership(Request $request, Invoice $invoice): void
    {
        abort_unless($invoice->booking->user_id === $request->user()->id, 403);
    }
}
