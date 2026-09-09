<?php

namespace Database\Factories;

use App\Models\Holiday;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Holiday>
 */
class HolidayFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $start = fake()->dateTimeBetween('+1 month', '+2 months');

        return [
            'name' => fake()->sentence(3),
            'holiday_type' => fake()->randomElement([
                'NATIONAL_HOLIDAY',
                'JOINT_LEAVE',
                'SPECIAL_HOLIDAY',
                'MPP_CLOSURE',
                'OFFICIAL_EVENT',
                'OTHER',
            ]),
            'start_date' => $start->format('Y-m-d'),
            'end_date' => $start->format('Y-m-d'),
            'is_full_day' => true,
            'description' => null,
            'is_active' => true,
            'created_by' => null,
            'updated_by' => null,
        ];
    }
}
