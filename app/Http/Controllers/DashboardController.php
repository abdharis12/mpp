<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Employee;
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
        $firstOfMonth = now()->startOfMonth()->toDateString();

        $totalTenants = ($isAdminMpp ? Tenant::query() : Employee::where('tenant_id', $user->employee?->tenant_id))->count();
        $totalTenants = $isAdminMpp ? Tenant::count() : ($user->employee ? Tenant::where('id', $user->employee->tenant_id)->count() : 0);
        $totalEmployees = $isAdminMpp ? Employee::count() : ($user->employee ? Employee::where('tenant_id', $user->employee->tenant_id)->count() : 0);

        $todayQuery = Attendance::onDate($today);
        $todayQuery = ! $isAdminMpp && $user->employee ? $todayQuery->forTenant($user->employee->tenant_id) : $todayQuery;

        $present = $todayQuery->clone()->whereIn('status', ['PRESENT', 'LATE'])->count();
        $late = $todayQuery->clone()->withStatus('LATE')->count();
        $absent = $totalEmployees - $todayQuery->clone()->count();

        $monthQuery = Attendance::forDateRange($firstOfMonth, $today);
        $monthQuery = ! $isAdminMpp && $user->employee ? $monthQuery->forTenant($user->employee->tenant_id) : $monthQuery;
        $monthlyAttendance = $monthQuery->count();

        return Inertia::render('dashboard', [
            'summary' => [
                'total_tenants' => $totalTenants,
                'total_employees' => $totalEmployees,
                'present_today' => $present,
                'late_today' => $late,
                'absent_today' => max(0, $absent),
                'monthly_attendance' => $monthlyAttendance,
            ],
        ]);
    }
}
