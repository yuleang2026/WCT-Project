<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Contract;
use App\Services\ContractService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ContractController extends Controller
{
    public function __construct(private readonly ContractService $contractService) {}

    public function index(Request $request)
    {
        $query = Contract::query()->with(['booking.user', 'booking.space']);

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        return response()->json($query->latest()->paginate($request->integer('per_page', 15)));
    }

    public function show(Contract $contract)
    {
        return response()->json(['contract' => $contract->load(['booking.user', 'booking.space'])]);
    }

    public function regenerate(Request $request, Contract $contract)
    {
        $contract = $this->contractService->generateForBooking($contract->booking);

        AuditLog::record($request->user(), 'contract.regenerated', $contract);

        return response()->json(['contract' => $contract]);
    }

    public function download(Contract $contract)
    {
        abort_unless($contract->pdf_path && Storage::disk('local')->exists($contract->pdf_path), 404);

        return Storage::disk('local')->download($contract->pdf_path, "{$contract->contract_number}.pdf");
    }
}
