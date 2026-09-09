<?php

namespace Database\Factories;

use App\Models\AttendanceSchedule;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AttendanceSchedule>
 */
class AttendanceScheduleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => 'Default Schedule',
            'description' => null,
            'tenant_id' => null,
            'employee_id' => null,
            'grace_period_minutes' => 10,
            'is_active' => true,
            'created_by' => null,
            'updated_by' => null,
        ];
    }
}
