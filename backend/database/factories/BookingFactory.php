<?php

namespace Database\Factories;

use App\Models\Booking;
use App\Models\Space;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Booking>
 */
class BookingFactory extends Factory
{
    protected $model = Booking::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'space_id' => Space::factory(),
            'type' => Booking::TYPE_EVENT,
            'start_date' => fake()->dateTimeBetween('+1 day', '+30 days')->format('Y-m-d'),
            'end_date' => null,
            'start_time' => '09:00',
            'end_time' => '11:00',
            'attendees' => fake()->numberBetween(5, 50),
            'purpose' => fake()->sentence(),
            'status' => Booking::STATUS_PENDING,
            'space_price' => fake()->randomFloat(2, 50, 500),
            'equipment_price' => 0,
            'total_price' => fake()->randomFloat(2, 50, 500),
            'deposit_amount' => fake()->randomFloat(2, 20, 200),
        ];
    }
}
