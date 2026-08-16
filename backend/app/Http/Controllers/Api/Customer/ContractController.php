<?php

namespace App\Http\Controllers\Api\Customer;

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
        $contracts = Contract::query()
            ->whereHas('booking', fn ($q) => $q->where('user_id', $request->user()->id))
            ->with('booking.space')
            ->latest()
            ->paginate($request->integer('per_page', 10));

        return response()->json($contracts);
    }

    public function show(Request $request, Contract $contract)
    {
        $this->authorizeOwnership($request, $contract);

        return response()->json(['contract' => $contract->load('booking.space')]);
    }

    public function sign(Request $request, Contract $contract)
    {
        $this->authorizeOwnership($request, $contract);

        if ($contract->status === Contract::STATUS_SIGNED) {
            return response()->json(['message' => 'Contract already signed.'], 422);
        }

        $contract = $this->contractService->sign($contract, $request->user()->id);

        AuditLog::record($request->user(), 'contract.signed', $contract);

        return response()->json(['contract' => $contract]);
    }

    public function download(Request $request, Contract $contract)
    {
        $this->authorizeOwnership($request, $contract);

        abort_unless($contract->pdf_path && Storage::disk('local')->exists($contract->pdf_path), 404);

        return Storage::disk('local')->download($contract->pdf_path, "{$contract->contract_number}.pdf");
    }

    private function authorizeOwnership(Request $request, Contract $contract): void
    {
        abort_unless($contract->booking->user_id === $request->user()->id, 403);
    }
}
