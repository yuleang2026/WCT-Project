<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; color: #1a2b4c; }
        h1 { font-size: 18px; color: #0F2A52; margin-bottom: 0; }
        .subtitle { color: #666; margin-top: 4px; margin-bottom: 20px; }
        .meta { margin-bottom: 16px; }
        .meta td { padding: 2px 8px 2px 0; }
        pre { white-space: pre-wrap; font-family: DejaVu Sans, sans-serif; font-size: 12px; line-height: 1.6; }
        .signature { margin-top: 40px; }
        .signature-box { border-top: 1px solid #333; width: 250px; margin-top: 40px; padding-top: 4px; }
    </style>
</head>
<body>
    <h1>NICC SmartSpace</h1>
    <div class="subtitle">Digital Rental Contract</div>

    <table class="meta">
        <tr><td><strong>Contract No.</strong></td><td>{{ $contract->contract_number }}</td></tr>
        <tr><td><strong>Booking No.</strong></td><td>{{ $booking->booking_number }}</td></tr>
        <tr><td><strong>Date Issued</strong></td><td>{{ now()->format('F j, Y') }}</td></tr>
        <tr><td><strong>Status</strong></td><td>{{ ucfirst(str_replace('_', ' ', $contract->status)) }}</td></tr>
    </table>

    <pre>{{ strip_tags($contract->terms) }}</pre>

    <div class="signature">
        @if($contract->status === 'signed')
            <p><strong>Digitally signed by:</strong> {{ $contract->signer->name ?? '' }} on {{ optional($contract->signed_at)->format('F j, Y g:i A') }}</p>
        @else
            <div class="signature-box">Client Signature</div>
        @endif
    </div>
</body>
</html>
