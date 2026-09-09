<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\Leave;
use App\Models\LeaveType;
use App\Models\Tenant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Leave>
 */
class LeaveFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $start = fake()->dateTimeBetween('-1 month', '+1 month');

        return [
            'tenant_id' => Tenant::factory(),
            'employee_id' => Employee::factory(),
            'leave_type_id' => LeaveType::factory(),
            'start_date' => $start->format('Y-m-d'),
            'end_date' => $start->format('Y-m-d'),
            'reason' => fake()->sentence(),
            'attachment_path' => null,
            'status' => 'PENDING',
            'approved_by' => null,
            'approved_at' => null,
            'rejection_reason' => null,
        ];
    }
}
