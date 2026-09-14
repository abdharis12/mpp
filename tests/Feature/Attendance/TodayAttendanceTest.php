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

function setupAttendanceContext(): array
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

    return compact('user', 'tenant', 'employee', 'schedule');
}

it('returns schedule and no attendance when employee has not clocked in', function () {
    ['user' => $user] = setupAttendanceContext();

    actingAs($user)
        ->getJson(route('attendance.today'))
        ->assertOk()
        ->assertJsonStructure([
            'date',
            'schedule' => ['start', 'end', 'is_working_day', 'grace_period_minutes'],
            'working_periods',
            'holiday',
            'attendance',
            'location',
        ])
        ->assertJsonPath('attendance', null)
        ->assertJsonPath('schedule.is_working_day', true)
        ->assertJsonPath('working_periods.0.start', '08:00')
        ->assertJsonPath('working_periods.0.end', '16:00');
});

it('returns attendance after clock-in', function () {
    ['user' => $user] = setupAttendanceContext();

    $clockInTime = CarbonImmutable::parse('2026-09-10 08:05:00');

    Attendance::factory()->create([
        'employee_id' => $user->employee->id,
        'tenant_id' => $user->employee->tenant_id,
        'attendance_date' => '2026-09-10',
        'clock_in' => $clockInTime,
        'status' => 'PRESENT',
        'clock_in_distance' => 6.4,
        'clock_in_latitude' => -3.6583,
        'clock_in_longitude' => 103.9063,
        'clock_in_accuracy' => 8.5,
    ]);

    actingAs($user)
        ->getJson(route('attendance.today'))
        ->assertOk()
        ->assertJsonPath('attendance.status', 'PRESENT')
        ->assertJsonPath('attendance.clock_in', fn (mixed $clockIn) => is_string($clockIn) && str_starts_with($clockIn, '2026-09-10T08:05:00'))
        ->assertJsonMissingPath('attendance.clock_out');
});

it('redirects guest to login page', function () {
    $response = $this->get(route('attendance.today'));
    $response->assertRedirect(route('login'));
});
