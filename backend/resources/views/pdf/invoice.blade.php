<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; color: #1a2b4c; }
        h1 { font-size: 18px; color: #0F2A52; margin-bottom: 0; }
        .subtitle { color: #666; margin-top: 4px; margin-bottom: 20px; }
        table.meta { margin-bottom: 20px; }
        table.meta td { padding: 2px 8px 2px 0; }
        table.items { width: 100%; border-collapse: collapse; margin-top: 10px; }
        table.items th { background: #0F2A52; color: #fff; text-align: left; padding: 8px; }
        table.items td { padding: 8px; border-bottom: 1px solid #ddd; }
        .totals { margin-top: 10px; width: 100%; }
        .totals td { padding: 4px 8px; text-align: right; }
        .grand-total { font-size: 14px; font-weight: bold; color: #0F2A52; }
        .status { display: inline-block; padding: 4px 10px; border-radius: 4px; background: #FFA726; color: #fff; }
    </style>
</head>
<body>
    <h1>NICC SmartSpace</h1>
    <div class="subtitle">Invoice</div>

    <table class="meta">
        <tr><td><strong>Invoice No.</strong></td><td>{{ $invoice->invoice_number }}</td></tr>
        <tr><td><strong>Booking No.</strong></td><td>{{ $invoice->booking->booking_number }}</td></tr>
        <tr><td><strong>Billed To</strong></td><td>{{ $invoice->booking->user->name }} ({{ $invoice->booking->user->email }})</td></tr>
        <tr><td><strong>Issue Date</strong></td><td>{{ $invoice->issue_date->format('F j, Y') }}</td></tr>
        <tr><td><strong>Due Date</strong></td><td>{{ $invoice->due_date->format('F j, Y') }}</td></tr>
        <tr><td><strong>Status</strong></td><td><span class="status">{{ strtoupper($invoice->status) }}</span></td></tr>
    </table>

    <table class="items">
        <thead>
            <tr><th>Description</th><th style="text-align:right;">Amount (USD)</th></tr>
        </thead>
        <tbody>
            @foreach($invoice->items as $item)
                <tr>
                    <td>{{ $item['label'] }}</td>
                    <td style="text-align:right;">${{ number_format($item['amount'], 2) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <table class="totals">
        <tr><td>Subtotal</td><td>${{ number_format($invoice->subtotal, 2) }}</td></tr>
        <tr><td>Tax</td><td>${{ number_format($invoice->tax, 2) }}</td></tr>
        <tr class="grand-total"><td>Total Due</td><td>${{ number_format($invoice->total, 2) }}</td></tr>
    </table>
</body>
</html>
