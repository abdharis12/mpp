<?php

use App\Models\User;
use Spatie\Permission\Models\Role;

use function Pest\Laravel\actingAs;

it('schedule index returns 200', function () {
    Role::firstOrCreate(['name' => 'super_admin']);
    Permission::firstOrCreate(['name' => 'manage_schedule']);
    Permission::firstOrCreate(['name' => 'view_attendance']);

    $user = User::factory()->create(['is_active' => true]);
    $user->assignRole('super_admin');

    actingAs($user)
        ->getJson(route('schedules.index'))
        ->assertOk();
});
