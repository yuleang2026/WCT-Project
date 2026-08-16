<?php

namespace App\Models;

use App\Models\Concerns\SerializesDatesWithOffset;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Contract extends Model
{
    use HasFactory, SerializesDatesWithOffset;

    public const STATUS_PENDING_SIGNATURE = 'pending_signature';

    public const STATUS_SIGNED = 'signed';

    public const STATUS_EXPIRED = 'expired';

    public const STATUS_CANCELLED = 'cancelled';

    protected $fillable = [
        'booking_id',
        'contract_number',
        'terms',
        'status',
        'pdf_path',
        'signed_by',
        'signed_at',
        'expiry_date',
    ];

    protected function casts(): array
    {
        return [
            'signed_at' => 'datetime',
            'expiry_date' => 'date',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Contract $contract) {
            $contract->contract_number ??= 'CT-'.now()->format('ymd').'-'.strtoupper(Str::random(5));
        });
    }

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    public function signer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'signed_by');
    }
}
