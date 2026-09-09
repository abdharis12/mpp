<?php

namespace Database\Factories;

use App\Models\LeaveType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<LeaveType>
 */
class LeaveTypeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'code' => 'LEAVE-'.fake()->unique()->lexify('???'),
            'name' => fake()->words(2, true),
            'description' => null,
            'requires_attachment' => false,
            'is_active' => true,
        ];
    }
}
