<?php

namespace Database\Factories;

use App\Models\Tenant;
use App\Models\TenantService;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TenantService>
 */
class TenantServiceFactory extends Factory
{
    protected $model = TenantService::class;

    public function definition(): array
    {
        return [
            'tenant_id' => Tenant::factory(),
            'name' => fake()->sentence(3),
            'description' => fake()->sentence(),
            'sort_order' => fake()->numberBetween(1, 100),
            'is_active' => true,
        ];
    }
}
