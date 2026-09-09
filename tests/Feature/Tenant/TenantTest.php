<?php

use App\Models\Tenant;
use App\Models\User;
use Spatie\Permission\Models\Role;

use function Pest\Laravel\actingAs;

it('index returns 200 for authorized user', function () {
    $role = Role::firstOrCreate(['name' => 'tenant_staff']);
    $role->givePermissionTo(['view_tenants', 'view_employees', 'view_attendance']);

    $user = User::factory()->create(['is_active' => true]);
    $user->assignRole('tenant_staff');

    actingAs($user)
        ->getJson(route('tenants.index'))
        ->assertOk();
});

it('can create a tenant via store', function () {
    $role = Role::firstOrCreate(['name' => 'super_admin']);
    $role->givePermissionTo(['view_tenants', 'create_tenants']);

    $user = User::factory()->create(['is_active' => true]);
    $user->assignRole('super_admin');

    actingAs($user)
        ->postJson(route('tenants.store'), [
            'code' => 'TEST123',
            'name' => 'Tenant Test',
            'is_active' => true,
        ])
        ->assertRedirect(route('tenants.index'));

    $this->assertDatabaseHas('tenants', ['code' => 'TEST123']);
});

it('can edit a tenant', function () {
    $role = Role::firstOrCreate(['name' => 'super_admin']);
    $role->givePermissionTo(['view_tenants', 'create_tenants', 'update_tenants']);

    $user = User::factory()->create(['is_active' => true]);
    $user->assignRole('super_admin');

    $tenant = Tenant::factory()->create();

    actingAs($user)
        ->putJson(route('tenants.update', $tenant), [
            'name' => 'Tenant Updated',
            'is_active' => true,
        ])
        ->assertRedirect(route('tenants.index'));

    $this->assertDatabaseHas('tenants', ['id' => $tenant->id, 'name' => 'Tenant Updated']);
});
