RENTAL AGREEMENT - EVENT SPACE

This agreement is made between NICC SmartSpace ("the Provider") and {{ $customer->name }} ("the Client")
for the use of "{{ $space->name }}" on {{ \Illuminate\Support\Carbon::parse($booking->start_date)->format('F j, Y') }}
from {{ $booking->start_time }} to {{ $booking->end_time }}.

1. SPACE & CAPACITY
   The Client is permitted a maximum of {{ $booking->attendees }} attendees in {{ $space->name }}
   (rated capacity: {{ $space->capacity }}).

2. FEES
   Space rental fee: ${{ number_format($booking->space_price, 2) }}
   Equipment & add-ons: ${{ number_format($booking->equipment_price, 2) }}
   Total fee: ${{ number_format($booking->total_price, 2) }}
   Required deposit: ${{ number_format($booking->deposit_amount, 2) }} (due prior to the event date)

3. CANCELLATION
   Cancellations made less than 48 hours before the event date forfeit the deposit.

4. CLIENT RESPONSIBILITIES
   The Client agrees to leave the space in its original condition and is liable for any damages
   incurred during the rental period.

5. GOVERNING TERMS
   This agreement is governed by the policies of NICC (Royal University of Phnom Penh) and Cambodian law.

By signing below (digitally, through the NICC SmartSpace platform), the Client acknowledges and
agrees to the terms above.
