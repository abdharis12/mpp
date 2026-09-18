<?php

use App\Models\Attendance;
use App\Models\Employee;
use App\Models\Tenant;
use App\Models\User;
use Carbon\CarbonImmutable;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

use function Pest\Laravel\actingAs;

beforeEach(function () {
    CarbonImmutable::setTestNow(CarbonImmutable::parse('2026-09-15 10:00:00'));

    $role = Role::firstOrCreate(['name' => 'report_viewer']);
    Permission::firstOrCreate(['name' => 'view_reports']);
    Permission::firstOrCreate(['name' => 'manage_attendance']);
    $role->givePermissionTo(['view_reports']);
});

afterEach(function () {
    CarbonImmutable::setTestNow();
});

function setupExportContext(): array
{
    $tenant = Tenant::factory()->create(['is_active' => true]);
    $user = User::factory()->create(['is_active' => true]);
    $user->assignRole('report_viewer');
    $employee = Employee::factory()->create([
        'user_id' => $user->id,
        'tenant_id' => $tenant->id,
        'is_active' => true,
    ]);

    Attendance::factory()->create([
        'employee_id' => $employee->id,
        'tenant_id' => $tenant->id,
        'attendance_date' => '2026-09-01',
        'status' => 'PRESENT',
        'clock_in' => '2026-09-01 08:05:00',
        'clock_out' => '2026-09-01 16:00:00',
        'late_minutes' => 0,
        'early_leave_minutes' => 0,
        'work_duration_minutes' => 475,
    ]);

    return compact('user', 'tenant', 'employee');
}

it('exports attendance excel for the given month', function () {
    ['user' => $user] = setupExportContext();

    actingAs($user)
        ->get(route('reports.attendance.export', ['month' => '2026-09']))
        ->assertOk()
        ->assertHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        ->assertHeader(
            'Content-Disposition',
            'attachment; filename=laporan-absensi-2026-09.xlsx',
        );
});

it('exports attendance excel filtered by tenant', function () {
    ['user' => $user, 'tenant' => $tenant] = setupExportContext();

    actingAs($user)
        ->get(route('reports.attendance.export', [
            'month' => '2026-09',
            'tenant_id' => $tenant->id,
        ]))
        ->assertOk()
        ->assertHeader('Content-Disposition', 'attachment; filename=laporan-absensi-2026-09.xlsx');
});

it('denies export for unauthenticated users', function () {
    $this->get(route('reports.attendance.export', ['month' => '2026-09']))
        ->assertRedirect(route('login'));
});

it('denies export for users without view_reports permission', function () {
    $user = User::factory()->create(['is_active' => true]);
    $role = Role::firstOrCreate(['name' => 'no_reports']);
    $user->assignRole('no_reports');

    actingAs($user)
        ->get(route('reports.attendance.export', ['month' => '2026-09']))
        ->assertForbidden();
});

it('rejects invalid month format', function () {
    ['user' => $user] = setupExportContext();

    actingAs($user)
        ->get(route('reports.attendance.export', ['month' => 'invalid']))
        ->assertStatus(422);
});
