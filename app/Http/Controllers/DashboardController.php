<?php

namespace App\Http\Controllers;

use App\Enums\CorrectionStatus;
use App\Enums\LeaveStatus;
use App\Models\Attendance;
use App\Models\AttendanceCorrection;
use App\Models\Employee;
use App\Models\Leave;
use App\Models\Tenant;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user();
        $isAdminMpp = $user->hasAnyPermission(['manage_settings', 'view_audit_logs']);

        $tenantScope = fn ($query) => $user->employee && ! $isAdminMpp
            ? $query->where('tenant_id', $user->employee->tenant_id)
            : $query;

        $today = now()->toDateString();

        $totalTenants = $isAdminMpp ? Tenant::count() : ($user->employee ? Tenant::where('id', $user->employee->tenant_id)->count() : 0);
        $totalEmployees = $isAdminMpp ? Employee::count() : ($user->employee ? Employee::where('tenant_id', $user->employee->tenant_id)->count() : 0);

        $todayQuery = $tenantScope(Attendance::onDate($today));

        $present = $todayQuery->clone()->withStatus('PRESENT')->count();
        $late = $todayQuery->clone()->withStatus('LATE')->count();
        $leave = $todayQuery->clone()->withStatus('LEAVE')->count();
        $recorded = $present + $late + $leave;

        $pendingLeaves = Leave::query()
            ->where('status', LeaveStatus::Pending)
            ->when(! $isAdminMpp && $user->employee, fn ($q) => $q->where('tenant_id', $user->employee->tenant_id))
            ->with('employee', 'tenant');

        $pendingCorrections = AttendanceCorrection::query()
            ->where('status', CorrectionStatus::Pending)
            ->when(! $isAdminMpp && $user->employee, fn ($q) => $q->where('tenant_id', $user->employee->tenant_id))
            ->with('employee', 'tenant');

        $greeting = match (true) {
            now()->hour < 11 => 'Selamat pagi',
            now()->hour < 15 => 'Selamat siang',
            now()->hour < 18 => 'Selamat sore',
            default => 'Selamat malam',
        };

        return Inertia::render('dashboard', [
            'greeting' => $greeting,
            'summary' => [
                'total_tenants' => $totalTenants,
                'total_employees' => $totalEmployees,
            ],
            'attendance_today' => [
                'present' => $present,
                'late' => $late,
                'leave' => $leave,
                'absent' => max(0, $totalEmployees - $recorded),
                'total' => $totalEmployees,
            ],
            'pending_leaves' => [
                'count' => $pendingLeaves->count(),
                'items' => $pendingLeaves->latest('created_at')->limit(3)->get()->map(fn (Leave $leave) => [
                    'employee_name' => $leave->employee?->name,
                    'tenant_name' => $leave->tenant?->name,
                    'created_at' => $leave->created_at?->diffForHumans(),
                    'start_date' => $leave->start_date?->toDateString(),
                ]),
            ],
            'pending_corrections' => [
                'count' => $pendingCorrections->count(),
                'items' => $pendingCorrections->latest('created_at')->limit(3)->get()->map(fn (AttendanceCorrection $correction) => [
                    'employee_name' => $correction->employee?->name,
                    'tenant_name' => $correction->tenant?->name,
                    'created_at' => $correction->created_at?->diffForHumans(),
                    'correction_type' => $correction->correction_type,
                ]),
            ],
        ]);
    }
}
