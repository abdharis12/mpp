<?php

use App\Models\Attendance;
use App\Models\AttendanceLocation;
use App\Models\AttendanceSchedule;
use App\Models\AttendanceScheduleDay;
use App\Models\Employee;
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

function createClockInContext(bool $withAttendance = true): array
{
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
        'day_of_week' => 4,
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

    if ($withAttendance) {
        $clockInTime = CarbonImmutable::parse('2026-09-10 08:05:00');

        Attendance::factory()->create([
            'employee_id' => $employee->id,
            'tenant_id' => $tenant->id,
            'attendance_date' => '2026-09-10',
            'clock_in' => $clockInTime,
            'status' => 'PRESENT',
            'clock_in_distance' => 6.4,
            'clock_in_latitude' => -3.6583,
            'clock_in_longitude' => 103.9063,
            'clock_in_accuracy' => 8.5,
        ]);
    }

    return compact('user', 'tenant', 'employee');
}

it('successfully clocks out and calculates work duration', function () {
    CarbonImmutable::setTestNow(CarbonImmutable::parse('2026-09-10 16:05:00'));

    ['user' => $user] = createClockInContext();

    actingAs($user)
        ->postJson(route('attendance.clock-out'), [
            'latitude' => -3.6583,
            'longitude' => 103.9063,
            'accuracy' => 8.5,
        ])
        ->assertOk()
        ->assertJsonPath('attendance.work_duration_minutes', fn ($val) => $val === 480);
});

it('returns 422 when no attendance exists (clock-in required)', function () {
    ['user' => $user] = createClockInContext(withAttendance: false);

    actingAs($user)
        ->postJson(route('attendance.clock-out'), [
            'latitude' => -3.6583,
            'longitude' => 103.9063,
            'accuracy' => 8.5,
        ])
        ->assertStatus(422)
        ->assertJson(['code' => 'CLOCK_IN_REQUIRED']);
});

it('returns 409 when employee has already clocked out', function () {
    ['user' => $user] = createClockInContext();

    Attendance::where('employee_id', $user->employee->id)->update([
        'clock_out' => CarbonImmutable::parse('2026-09-10 15:55:00'),
        'clock_out_latitude' => -3.6583,
        'clock_out_longitude' => 103.9063,
        'clock_out_accuracy' => 8.5,
        'clock_out_distance' => 5.1,
    ]);

    actingAs($user)
        ->postJson(route('attendance.clock-out'), [
            'latitude' => -3.6583,
            'longitude' => 103.9063,
            'accuracy' => 8.5,
        ])
        ->assertStatus(409)
        ->assertJson(['code' => 'ALREADY_CLOCKED_OUT']);
});

it('returns 422 when clock-out is outside radius', function () {
    ['user' => $user] = createClockInContext();

    actingAs($user)
        ->postJson(route('attendance.clock-out'), [
            'latitude' => -3.75,
            'longitude' => 103.91,
            'accuracy' => 8.5,
        ])
        ->assertStatus(422)
        ->assertJson(['code' => 'OUTSIDE_RADIUS']);
});
