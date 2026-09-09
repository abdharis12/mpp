<?php

namespace Database\Factories;

use App\Models\Holiday;
use App\Models\HolidayPeriod;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<HolidayPeriod>
 */
class HolidayPeriodFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'holiday_id' => Holiday::factory(),
            'holiday_date' => fake()->date(),
            'start_time' => null,
            'end_time' => null,
            'is_full_day' => true,
        ];
    }
}
