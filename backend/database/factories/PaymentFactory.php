<?php

namespace Database\Factories;

use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Payment>
 */
class PaymentFactory extends Factory
{
    protected $model = Payment::class;

    public function definition(): array
    {
        return [
            'booking_id' => Booking::factory(),
            'amount' => fake()->randomFloat(2, 20, 500),
            'currency' => 'USD',
            'method' => 'bank_transfer',
            'type' => 'deposit',
            'status' => Payment::STATUS_PENDING,
            'reference_note' => fake()->bothify('TXN-####??'),
        ];
    }
}
