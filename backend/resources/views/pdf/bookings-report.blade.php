<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 11px; color: #1a2b4c; }
        h1 { font-size: 18px; color: #0F2A52; margin-bottom: 0; }
        .subtitle { color: #666; margin-top: 4px; margin-bottom: 16px; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #0F2A52; color: #fff; text-align: left; padding: 6px; }
        td { padding: 6px; border-bottom: 1px solid #ddd; }
    </style>
</head>
<body>
    <h1>NICC SmartSpace</h1>
    <div class="subtitle">
        Bookings Report
        @if($startDate || $endDate)
            ({{ $startDate ?? 'earliest' }} &ndash; {{ $endDate ?? 'latest' }})
        @endif
        &middot; Generated {{ now()->format('F j, Y g:i A') }}
    </div>

    <table>
        <thead>
            <tr>
                <th>Booking #</th><th>Customer</th><th>Space</th><th>Type</th>
                <th>Start</th><th>Status</th><th>Total (USD)</th>
            </tr>
        </thead>
        <tbody>
            @foreach($bookings as $booking)
                <tr>
                    <td>{{ $booking->booking_number }}</td>
                    <td>{{ $booking->user->name }}</td>
                    <td>{{ $booking->space->name }}</td>
                    <td>{{ ucfirst($booking->type) }}</td>
                    <td>{{ $booking->start_date->format('Y-m-d') }}</td>
                    <td>{{ ucfirst($booking->status) }}</td>
                    <td>${{ number_format($booking->total_price, 2) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
