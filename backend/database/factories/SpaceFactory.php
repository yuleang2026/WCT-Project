<?php

namespace Database\Factories;

use App\Models\Space;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Space>
 */
class SpaceFactory extends Factory
{
    protected $model = Space::class;

    public function definition(): array
    {
        $name = fake()->unique()->company().' Hall';

        return [
            'name' => $name,
            'slug' => Str::slug($name).'-'.fake()->unique()->randomNumber(4),
            'type' => Space::TYPE_EVENT,
            'description' => fake()->paragraph(),
            'capacity' => fake()->numberBetween(10, 500),
            'price' => fake()->randomFloat(2, 20, 300),
            'price_unit' => 'hour',
            'deposit_amount' => fake()->randomFloat(2, 50, 500),
            'location' => 'NICC, Royal University of Phnom Penh',
            'amenities' => fake()->randomElements(['Wi-Fi', 'Projector', 'Air Conditioning', 'Sound System', 'Whiteboard', 'Parking'], 3),
            'images' => [],
            'status' => 'active',
        ];
    }

    public function office(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => Space::TYPE_OFFICE,
            'price_unit' => 'month',
            'price' => fake()->randomFloat(2, 150, 1500),
        ]);
    }
}
