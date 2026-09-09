<?php

use App\Models\AttendanceLocation;
use App\Models\AttendanceSchedule;
use App\Models\AttendanceScheduleDay;
use App\Models\Employee;
use App\Models\Holiday;
use App\Models\Tenant;
use App\Models\User;
use Carbon\CarbonImmutable;

use function Pest\Laravel\actingAs;

beforeEach(function () {
    CarbonImmutable::setTestNow(CarbonImmutable::parse('2026-09-10 08:05:00'));

    makeTenantStaffRole();
});

afterEach(function () {
    CarbonImmutable::setTestNow();
});

it('creates an attendance on successful clock-in with PRESENT status', function () {
    $user = User::factory()->create(['is_active' => true]);
    $tenant = Tenant::factory()->create(['is_active' => true]);
    $employee = Employee::factory()->create([
        'user_id' => $user->id,
        'tenant_id' => $tenant->id,
        'is_active' => true,
    ]);

    $schedule = AttendanceSchedule::factory()->create(['grace_period_minutes' => 10, 'is_active' => true]);
    AttendanceScheduleDay::factory()->create([
        'attendance_schedule_id' => $schedule->id,
        'day_of_week' => 3, // Wednesday (2026-09-10 is Wednesday)
        'start_time' => '08:00:00',
        'end_time' => '16:00:00',
        'is_working_day' => true,
    ]);

    AttendanceLocation::factory()->create([
        'latitude' => -3.6582,
        'longitude' => 103.9064,
        'radius_meter' => 20,
        'maximum_gps_accuracy' => 50,
        'is_active' => true,
    ]);

    $user->assignRole('tenant_staff');

    actingAs($user)
        ->postJson(route('attendance.clock-in'), [
            'latitude' => -3.6583,
            'longitude' => 103.9063,
            'accuracy' => 8.5,
        ])
        ->assertCreated()
        ->assertJson(['attendance' => ['status' => 'PRESENT', 'late_minutes' => 0]]);
});

it('returns 409 when employee already clocked in', function () {
    $user = User::factory()->create(['is_active' => true]);
    $tenant = Tenant::factory()->create(['is_active' => true]);
    $employee = Employee::factory()->create([
        'user_id' => $user->id,
        'tenant_id' => $tenant->id,
        'is_active' => true,
    ]);

    $schedule = AttendanceSchedule::factory()->create(['grace_period_minutes' => 10, 'is_active' => true]);
    AttendanceScheduleDay::factory()->create([
        'attendance_schedule_id' => $schedule->id,
        'day_of_week' => 3,
        'start_time' => '08:00:00',
        'end_time' => '16:00:00',
        'is_working_day' => true,
    ]);

    AttendanceLocation::factory()->create([
        'latitude' => -3.6582,
        'longitude' => 103.9064,
        'radius_meter' => 20,
        'maximum_gps_accuracy' => 50,
        'is_active' => true,
    ]);

    $user->assignRole('tenant_staff');

    actingAs($user)
        ->postJson(route('attendance.clock-in'), [
            'latitude' => -3.6583,
            'longitude' => 103.9063,
            'accuracy' => 8.5,
        ])
        ->assertCreated();

    actingAs($user)
        ->postJson(route('attendance.clock-in'), [
            'latitude' => -3.6583,
            'longitude' => 103.9063,
            'accuracy' => 8.5,
        ])
        ->assertStatus(409)
        ->assertJson(['code' => 'ALREADY_CLOCKED_IN']);
});

it('returns 422 when employee has no schedule defined', function () {
    $user = User::factory()->create(['is_active' => true]);
    $tenant = Tenant::factory()->create(['is_active' => true]);
    $employee = Employee::factory()->create([
        'user_id' => $user->id,
        'tenant_id' => $tenant->id,
        'is_active' => true,
    ]);

    AttendanceLocation::factory()->create([
        'latitude' => -3.6582,
        'longitude' => 103.9064,
        'radius_meter' => 20,
        'maximum_gps_accuracy' => 50,
        'is_active' => true,
    ]);

    $user->assignRole('tenant_staff');

    actingAs($user)
        ->postJson(route('attendance.clock-in'), [
            'latitude' => -3.6583,
            'longitude' => 103.9063,
            'accuracy' => 8.5,
        ])
        ->assertStatus(422)
        ->assertJson(['code' => 'NOT_WORKING_DAY']);
});

it('returns 422 when today is a full day holiday', function () {
    $user = User::factory()->create(['is_active' => true]);
    $tenant = Tenant::factory()->create(['is_active' => true]);
    $employee = Employee::factory()->create([
        'user_id' => $user->id,
        'tenant_id' => $tenant->id,
        'is_active' => true,
    ]);

    $schedule = AttendanceSchedule::factory()->create(['grace_period_minutes' => 10, 'is_active' => true]);
    AttendanceScheduleDay::factory()->create([
        'attendance_schedule_id' => $schedule->id,
        'day_of_week' => 3,
        'start_time' => '08:00:00',
        'end_time' => '16:00:00',
        'is_working_day' => true,
    ]);

    AttendanceLocation::factory()->create([
        'latitude' => -3.6582,
        'longitude' => 103.9064,
        'radius_meter' => 20,
        'maximum_gps_accuracy' => 50,
        'is_active' => true,
    ]);

    Holiday::factory()->create([
        'start_date' => '2026-09-10',
        'end_date' => '2026-09-10',
        'is_full_day' => true,
        'is_active' => true,
    ]);

    $user->assignRole('tenant_staff');

    actingAs($user)
        ->postJson(route('attendance.clock-in'), [
            'latitude' => -3.6583,
            'longitude' => 103.9063,
            'accuracy' => 8.5,
        ])
        ->assertStatus(422)
        ->assertJson(['code' => 'HOLIDAY']);
});

it('returns 422 when clock-in is outside attendance window', function () {
    CarbonImmutable::setTestNow(CarbonImmutable::parse('2026-09-10 06:00:00'));

    $user = User::factory()->create(['is_active' => true]);
    $tenant = Tenant::factory()->create(['is_active' => true]);
    $employee = Employee::factory()->create([
        'user_id' => $user->id,
        'tenant_id' => $tenant->id,
        'is_active' => true,
    ]);

    $schedule = AttendanceSchedule::factory()->create(['grace_period_minutes' => 10, 'is_active' => true]);
    AttendanceScheduleDay::factory()->create([
        'attendance_schedule_id' => $schedule->id,
        'day_of_week' => 3,
        'start_time' => '08:00:00',
        'end_time' => '16:00:00',
        'is_working_day' => true,
    ]);

    AttendanceLocation::factory()->create([
        'latitude' => -3.6582,
        'longitude' => 103.9064,
        'radius_meter' => 20,
        'maximum_gps_accuracy' => 50,
        'is_active' => true,
    ]);

    $user->assignRole('tenant_staff');

    actingAs($user)
        ->postJson(route('attendance.clock-in'), [
            'latitude' => -3.6583,
            'longitude' => 103.9063,
            'accuracy' => 8.5,
        ])
        ->assertStatus(422)
        ->assertJson(['code' => 'OUTSIDE_ATTENDANCE_WINDOW']);
});

it('returns 422 when GPS is outside radius', function () {
    $user = User::factory()->create(['is_active' => true]);
    $tenant = Tenant::factory()->create(['is_active' => true]);
    $employee = Employee::factory()->create([
        'user_id' => $user->id,
        'tenant_id' => $tenant->id,
        'is_active' => true,
    ]);

    $schedule = AttendanceSchedule::factory()->create(['grace_period_minutes' => 10, 'is_active' => true]);
    AttendanceScheduleDay::factory()->create([
        'attendance_schedule_id' => $schedule->id,
        'day_of_week' => 3,
        'start_time' => '08:00:00',
        'end_time' => '16:00:00',
        'is_working_day' => true,
    ]);

    AttendanceLocation::factory()->create([
        'latitude' => -3.6582,
        'longitude' => 103.9064,
        'radius_meter' => 20,
        'maximum_gps_accuracy' => 50,
        'is_active' => true,
    ]);

    $user->assignRole('tenant_staff');

    actingAs($user)
        ->postJson(route('attendance.clock-in'), [
            'latitude' => -3.75,
            'longitude' => 103.91,
            'accuracy' => 8.5,
        ])
        ->assertStatus(422)
        ->assertJson(['code' => 'OUTSIDE_RADIUS']);
});

it('creates LATE attendance when clock-in is after grace period', function () {
    CarbonImmutable::setTestNow(CarbonImmutable::parse('2026-09-10 08:16:00'));

    $user = User::factory()->create(['is_active' => true]);
    $tenant = Tenant::factory()->create(['is_active' => true]);
    $employee = Employee::factory()->create([
        'user_id' => $user->id,
        'tenant_id' => $tenant->id,
        'is_active' => true,
    ]);

    $schedule = AttendanceSchedule::factory()->create(['grace_period_minutes' => 10, 'is_active' => true]);
    AttendanceScheduleDay::factory()->create([
        'attendance_schedule_id' => $schedule->id,
        'day_of_week' => 3,
        'start_time' => '08:00:00',
        'end_time' => '16:00:00',
        'is_working_day' => true,
    ]);

    AttendanceLocation::factory()->create([
        'latitude' => -3.6582,
        'longitude' => 103.9064,
        'radius_meter' => 20,
        'maximum_gps_accuracy' => 50,
        'is_active' => true,
    ]);

    $user->assignRole('tenant_staff');

    actingAs($user)
        ->postJson(route('attendance.clock-in'), [
            'latitude' => -3.6583,
            'longitude' => 103.9063,
            'accuracy' => 8.5,
        ])
        ->assertCreated()
        ->assertJson(['attendance' => ['status' => 'LATE', 'late_minutes' => 16]]);
});
