<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Equipment;

class EquipmentController extends Controller
{
    public function index()
    {
        return response()->json([
            'equipment' => Equipment::active()->orderBy('name')->get(),
        ]);
    }
}
