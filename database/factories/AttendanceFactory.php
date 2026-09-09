<?php

namespace Database\Factories;

use App\Models\Attendance;
use App\Models\Employee;
use App\Models\Tenant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Attendance>
 */
class AttendanceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'tenant_id' => Tenant::factory(),
            'employee_id' => Employee::factory(),
            'attendance_date' => fake()->date(),
            'attendance_location_id' => null,
            'clock_in' => fake()->dateTime(),
            'clock_out' => null,
            'clock_in_latitude' => -3.6582,
            'clock_in_longitude' => 103.9064,
            'clock_in_accuracy' => 8.0,
            'clock_in_distance' => 5.0,
            'clock_out_latitude' => null,
            'clock_out_longitude' => null,
            'clock_out_accuracy' => null,
            'clock_out_distance' => null,
            'status' => 'PRESENT',
            'late_minutes' => 0,
            'early_leave_minutes' => 0,
            'work_duration_minutes' => null,
            'clock_in_ip' => fake()->ipv4(),
            'clock_out_ip' => null,
            'clock_in_user_agent' => fake()->userAgent(),
            'clock_out_user_agent' => null,
            'notes' => null,
        ];
    }
}
