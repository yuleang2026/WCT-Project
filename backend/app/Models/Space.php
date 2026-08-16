<?php

namespace App\Models;

use App\Models\Concerns\SerializesDatesWithOffset;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Space extends Model
{
    use HasFactory, SerializesDatesWithOffset, SoftDeletes;

    public const TYPE_EVENT = 'event';

    public const TYPE_OFFICE = 'office';

    protected $fillable = [
        'name',
        'slug',
        'type',
        'description',
        'capacity',
        'price',
        'price_unit',
        'deposit_amount',
        'location',
        'amenities',
        'images',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'deposit_amount' => 'decimal:2',
            'amenities' => 'array',
            'images' => 'array',
        ];
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}
