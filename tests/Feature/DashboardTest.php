<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Permission;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertOk();
});

test('shared auth context exposes combined role and direct permissions as all_permissions', function () {
    makeTenantStaffRole();

    Permission::firstOrCreate(['name' => 'request_leave']);

    $user = User::factory()->create();
    $user->assignRole('tenant_staff');

    Permission::firstOrCreate(['name' => 'direct_permission']);

    $user->givePermissionTo('direct_permission');

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->where('auth.user.all_permissions', function ($permissions) {
                $names = collect($permissions)->pluck('name')->all();

                return in_array('view_dashboard', $names) && in_array('direct_permission', $names);
            })
        );
});
