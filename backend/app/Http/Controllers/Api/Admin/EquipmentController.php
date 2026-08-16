<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Equipment;
use Illuminate\Http\Request;

class EquipmentController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(Equipment::query()->orderBy('name')->paginate($request->integer('per_page', 20)));
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);
        $equipment = Equipment::create($data);

        AuditLog::record($request->user(), 'equipment.created', $equipment);

        return response()->json(['equipment' => $equipment], 201);
    }

    public function update(Request $request, Equipment $equipment)
    {
        $equipment->update($this->validated($request));

        AuditLog::record($request->user(), 'equipment.updated', $equipment);

        return response()->json(['equipment' => $equipment]);
    }

    public function destroy(Request $request, Equipment $equipment)
    {
        $equipment->delete();

        AuditLog::record($request->user(), 'equipment.deleted', $equipment);

        return response()->json(['message' => 'Equipment deleted.']);
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'price' => ['required', 'numeric', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
            'is_active' => ['boolean'],
        ]);
    }
}
