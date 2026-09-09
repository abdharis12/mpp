<?php

namespace Database\Factories;

use App\Models\AuditLog;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AuditLog>
 */
class AuditLogFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'tenant_id' => Tenant::factory(),
            'event' => fake()->randomElement([
                'CLOCK_IN',
                'CLOCK_OUT',
                'LEAVE_CREATED',
                'TENANT_CREATED',
                'EMPLOYEE_CREATED',
            ]),
            'subject_type' => null,
            'subject_id' => null,
            'old_values' => null,
            'new_values' => null,
            'metadata' => null,
            'ip_address' => fake()->ipv4(),
            'user_agent' => fake()->userAgent(),
            'created_at' => fake()->dateTimeBetween('-1 year', 'now'),
        ];
    }
}
