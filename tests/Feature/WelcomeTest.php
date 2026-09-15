<?php

use App\Models\Attendance;
use App\Models\AttendanceSchedule;
use App\Models\AttendanceScheduleDay;
use App\Models\Employee;
use App\Models\Tenant;
use App\Models\TenantService;
use App\Models\User;
use App\Models\VisitorReview;
use Inertia\Testing\AssertableInertia as Assert;

test('welcome page renders for guests', function () {
    $response = $this->get(route('home'));
    $response->assertOk();
});

test('welcome page exposes correct stats', function () {
    $tenant = Tenant::factory()->create(['is_active' => true]);
    $user = User::factory()->create(['email_verified_at' => now(), 'is_active' => true]);
    $emp = Employee::factory()->create([
        'user_id' => $user->id,
        'tenant_id' => $tenant->id,
        'is_active' => true,
    ]);

    Attendance::factory()->create([
        'tenant_id' => $tenant->id,
        'employee_id' => $emp->id,
        'attendance_date' => now()->toDateString(),
        'status' => 'PRESENT',
        'clock_in' => now(),
        'clock_out' => null,
    ]);

    $this->get(route('home'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('welcome')
            ->has('tenants')
            ->has('schedule')
            ->has('today')
            ->has('stats', fn (Assert $stats) => $stats
                ->where('tenants', 1)
                ->where('employees', 1)
                ->where('present_today', 1)
                ->has('monthly_attendance')
            )
        );
});

test('welcome page returns active tenants with services', function () {
    $tenant = Tenant::factory()->create(['is_active' => true, 'name' => 'Test Tenant']);
    TenantService::factory()->create(['tenant_id' => $tenant->id, 'name' => 'Layanan A', 'is_active' => true]);

    $this->get(route('home'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('tenants.0.name', 'Test Tenant')
            ->has('tenants.0.services.0.name')
        );
});

test('welcome page returns schedule grouped from DB', function () {
    $schedule = AttendanceSchedule::create([
        'name' => 'Test Schedule',
        'tenant_id' => null,
        'employee_id' => null,
        'grace_period_minutes' => 10,
        'is_active' => true,
    ]);

    AttendanceScheduleDay::create([
        'attendance_schedule_id' => $schedule->id,
        'day_of_week' => 1,
        'start_time' => '08:00',
        'end_time' => '16:00',
        'is_working_day' => true,
    ]);
    AttendanceScheduleDay::create([
        'attendance_schedule_id' => $schedule->id,
        'day_of_week' => 6,
        'start_time' => null,
        'end_time' => null,
        'is_working_day' => false,
    ]);

    $this->get(route('home'))
        ->assertInertia(fn (Assert $page) => $page
            ->has('schedule')
            ->has('today')
        );
});

test('welcome page returns visible reviews only', function () {
    VisitorReview::factory()->create(['is_visible' => true]);
    VisitorReview::factory()->create(['is_visible' => false]);

    $this->get(route('home'))
        ->assertInertia(fn (Assert $page) => $page
            ->has('reviews', 1)
        );
});

test('activeTenantsToday includes tenants with staff present today', function () {
    $tenantA = Tenant::factory()->create(['is_active' => true, 'name' => 'Tenant Hadir']);
    $userA = User::factory()->create(['email_verified_at' => now(), 'is_active' => true]);
    $empA = Employee::factory()->create([
        'user_id' => $userA->id,
        'tenant_id' => $tenantA->id,
        'is_active' => true,
    ]);

    Attendance::factory()->create([
        'tenant_id' => $tenantA->id,
        'employee_id' => $empA->id,
        'attendance_date' => now()->toDateString(),
        'status' => 'PRESENT',
        'clock_in' => now(),
        'clock_out' => null,
    ]);

    // Tenant B — no attendance today
    $tenantB = Tenant::factory()->create(['is_active' => true, 'name' => 'Tenant Kosong']);

    $this->get(route('home'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('activeTenantsToday.0.id', $tenantA->id)
            ->where('activeTenantsToday.0.name', 'Tenant Hadir')
            ->where('activeTenantsToday.0.present_count', 1)
            ->missing('activeTenantsToday.1')
        );
});

test('activeTenantsToday is empty when no staff present today', function () {
    Tenant::factory()->create(['is_active' => true]);

    $this->get(route('home'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('activeTenantsToday', [])
        );
});
