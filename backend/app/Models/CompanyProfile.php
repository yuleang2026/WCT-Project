<?php

namespace App\Models;

use App\Models\Concerns\SerializesDatesWithOffset;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CompanyProfile extends Model
{
    use HasFactory, SerializesDatesWithOffset;

    protected $fillable = [
        'booking_id',
        'company_name',
        'registration_number',
        'contact_person',
        'contact_phone',
        'contact_email',
        'address',
    ];

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }
}
