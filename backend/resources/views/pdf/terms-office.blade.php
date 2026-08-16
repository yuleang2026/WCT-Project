OFFICE RENTAL AGREEMENT

This agreement is made between NICC SmartSpace ("the Provider") and {{ $booking->companyProfile->company_name ?? $customer->name }}
("the Tenant"), represented by {{ $customer->name }}, for the lease of "{{ $space->name }}"
beginning {{ \Illuminate\Support\Carbon::parse($booking->start_date)->format('F j, Y') }}
@if($booking->end_date)
through {{ \Illuminate\Support\Carbon::parse($booking->end_date)->format('F j, Y') }}.
@else
on an ongoing monthly basis until either party provides written notice of termination.
@endif

1. PREMISES
   {{ $space->name }}, capacity {{ $space->capacity }}, located at {{ $space->location }}.

2. RENT & DEPOSIT
   Monthly rent: ${{ number_format($booking->space_price, 2) }}
   Security deposit: ${{ number_format($booking->deposit_amount, 2) }} (refundable, due before move-in)
   Rent is payable monthly in advance, on or before the 5th day of each month.

3. TENANT INFORMATION
   Company: {{ $booking->companyProfile->company_name ?? 'N/A' }}
   Registration No.: {{ $booking->companyProfile->registration_number ?? 'N/A' }}
   Contact: {{ $booking->companyProfile->contact_person ?? $customer->name }} ({{ $booking->companyProfile->contact_phone ?? $customer->phone }})

4. RENEWAL
   This lease may be renewed by mutual written agreement prior to expiry.

5. TERMINATION
   Either party may terminate this agreement with 30 days' written notice.

6. GOVERNING TERMS
   This agreement is governed by the policies of NICC (Royal University of Phnom Penh) and Cambodian law.

By signing below (digitally, through the NICC SmartSpace platform), the Tenant acknowledges and
agrees to the terms above.
