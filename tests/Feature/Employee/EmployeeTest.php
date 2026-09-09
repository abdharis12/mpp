<?php

use App\Models\User;
use Spatie\Permission\Models\Role;

use function Pest\Laravel\actingAs;

it('employee index returns 200 for authorized user', function () {
    Role::firstOrCreate(['name' => 'tenant_staff']);
    Permission::firstOrCreate(['name' => 'view_employees']);

    $user = User::factory()->create(['is_active' => true]);
    $user->assignRole('tenant_staff');

    actingAs($user)
        ->getJson(route('employees.index'))
        ->assertOk();
});
