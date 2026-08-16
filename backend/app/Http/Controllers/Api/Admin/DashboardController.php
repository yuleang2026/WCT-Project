<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Payment;
use App\Models\Space;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    public function stats()
    {
        $totalBookings = Booking::query()->count();
        $revenue = Payment::query()->where('status', 'confirmed')->sum('amount');
        $totalSpaces = Space::query()->count();
        $pending = Booking::query()->where('status', Booking::STATUS_PENDING)->count();

        $trend = collect(range(6, 0))->map(function ($daysAgo) {
            $date = Carbon::today()->subDays($daysAgo);

            return [
                'date' => $date->format('Y-m-d'),
                'label' => $date->format('M j'),
                'count' => Booking::query()->whereDate('created_at', $date)->count(),
            ];
        })->values();

        $recent = Booking::query()
            ->with(['space', 'user'])
            ->latest()
            ->limit(5)
            ->get(['id', 'booking_number', 'space_id', 'user_id', 'status', 'created_at']);

        return response()->json([
            'total_bookings' => $totalBookings,
            'revenue' => (float) $revenue,
            'total_spaces' => $totalSpaces,
            'pending_bookings' => $pending,
            'booking_trend' => $trend,
            'recent_bookings' => $recent,
        ]);
    }
}
