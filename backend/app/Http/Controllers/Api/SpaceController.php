<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Space;
use Illuminate\Http\Request;

class SpaceController extends Controller
{
    public function index(Request $request)
    {
        $query = Space::query()->active();

        if ($request->filled('type')) {
            $query->where('type', $request->string('type'));
        }

        if ($request->filled('search')) {
            $search = (string) $request->string('search');
            $query->where(function ($q) use ($search) {
                $q->whereLikeInsensitive('name', $search)->orWhereLikeInsensitive('description', $search);
            });
        }

        if ($request->filled('min_capacity')) {
            $query->where('capacity', '>=', (int) $request->input('min_capacity'));
        }

        $spaces = $query->orderBy('name')->paginate($request->integer('per_page', 12));

        return response()->json($spaces);
    }

    public function show(Space $space)
    {
        return response()->json(['space' => $space]);
    }

    public function availability(Request $request, Space $space)
    {
        $data = $request->validate([
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
        ]);

        $endDate = $data['end_date'] ?? $data['start_date'];

        $overlapping = Booking::query()
            ->where('space_id', $space->id)
            ->whereIn('status', [Booking::STATUS_PENDING, Booking::STATUS_APPROVED])
            ->where(function ($q) use ($data, $endDate) {
                $q->whereDate('start_date', '<=', $endDate)
                    ->where(function ($q2) use ($data) {
                        $q2->whereNull('end_date')->orWhereDate('end_date', '>=', $data['start_date']);
                    });
            })
            ->get(['id', 'start_date', 'end_date', 'start_time', 'end_time', 'status']);

        return response()->json([
            'space_id' => $space->id,
            'is_available' => $overlapping->isEmpty(),
            'conflicts' => $overlapping,
        ]);
    }
}
