<?php

namespace Database\Factories;

use App\Models\AttendanceCorrection;
use App\Models\Employee;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AttendanceCorrection>
 */
class AttendanceCorrectionFactory extends Factory
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
            'attendance_id' => null,
            'requested_by' => User::factory(),
            'correction_type' => fake()->randomElement([
                'MISSING_CLOCK_IN',
                'MISSING_CLOCK_OUT',
                'WRONG_CLOCK_IN',
                'WRONG_CLOCK_OUT',
                'OTHER',
            ]),
            'requested_clock_in' => fake()->dateTime(),
            'requested_clock_out' => null,
            'reason' => fake()->sentence(),
            'attachment_path' => null,
            'status' => 'PENDING',
            'reviewed_by' => null,
            'reviewed_at' => null,
            'rejection_reason' => null,
        ];
    }
}
