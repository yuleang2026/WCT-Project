<?php

namespace Database\Factories;

use App\Models\Equipment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Equipment>
 */
class EquipmentFactory extends Factory
{
    protected $model = Equipment::class;

    public function definition(): array
    {
        return [
            'name' => fake()->randomElement(['Projector', 'Microphone Set', 'Extra Chairs (x10)', 'Stage Lighting', 'Podium', 'Video Camera']),
            'description' => fake()->sentence(),
            'price' => fake()->randomFloat(2, 5, 80),
            'stock' => fake()->numberBetween(1, 20),
            'is_active' => true,
        ];
    }
}
