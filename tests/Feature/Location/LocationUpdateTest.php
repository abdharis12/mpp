<?php

use App\Models\AttendanceLocation;
use App\Models\User;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

use function Pest\Laravel\actingAs;

beforeEach(function () {
    $superAdmin = Role::firstOrCreate(['name' => 'super_admin']);
    $permission = Permission::firstOrCreate(['name' => 'manage_location']);
    $superAdmin->syncPermissions([$permission]);

    $this->user = User::factory()->create(['is_active' => true]);
    $this->user->assignRole('super_admin');
});

it('can update a location via PATCH', function () {
    $location = AttendanceLocation::factory()->create();

    actingAs($this->user)
        ->patchJson(route('locations.update', $location), [
            'latitude' => -3.6600,
            'longitude' => 103.9100,
            'radius_meter' => 25,
            'maximum_gps_accuracy' => 40,
            'is_active' => false,
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('attendance_locations', [
        'id' => $location->id,
        'latitude' => -3.66,
        'longitude' => 103.91,
        'radius_meter' => 25,
        'maximum_gps_accuracy' => 40,
        'is_active' => false,
    ]);
});

it('rejects invalid coordinates', function () {
    $location = AttendanceLocation::factory()->create();

    actingAs($this->user)
        ->patchJson(route('locations.update', $location), [
            'latitude' => 100,
            'longitude' => 103.91,
            'radius_meter' => 25,
            'maximum_gps_accuracy' => 40,
            'is_active' => true,
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('latitude');

    $this->assertDatabaseHas('attendance_locations', [
        'id' => $location->id,
        'latitude' => $location->latitude,
    ]);
});
