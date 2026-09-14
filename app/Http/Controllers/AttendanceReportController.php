<?php

namespace App\Http\Controllers;

use App\Exports\AttendanceExport;
use App\Models\Employee;
use App\Models\Tenant;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;

class AttendanceReportController extends Controller
{
    public function index(Request $request): Response
    {
        if (! $request->user()->hasPermissionTo('view_reports')) {
            abort(403);
        }

        $user = $request->user();
        $month = $request->input('month', now()->format('Y-m'));
        $tenantId = $request->input('tenant_id');

        if ($month && ! preg_match('/^\d{4}-\d{2}$/', (string) $month)) {
            abort(422, 'Format bulan tidak valid.');
        }

        $startDate = $month.'-01';
        $endDate = now()->parse($startDate)->endOfMonth()->format('Y-m-d');

        $employeeQuery = Employee::query()
            ->with('tenant')
            ->where('is_active', true);

        if ($user->employee && ! $user->hasPermissionTo('manage_attendance')) {
            $employeeQuery->where('tenant_id', $user->employee->tenant_id);
        }

        if ($tenantId && $user->employee && ! $user->hasPermissionTo('manage_attendance')) {
            $tenantId = $user->employee->tenant_id;
        }

        if ($tenantId) {
            $employeeQuery->where('tenant_id', $tenantId);
        }

        $employees = $employeeQuery->orderBy('name')->get();

        $aggregates = DB::table('attendances')
            ->whereBetween('attendance_date', [$startDate, $endDate])
            ->whereIn('employee_id', $employees->pluck('id'))
            ->select('employee_id')
            ->selectRaw("SUM(CASE WHEN status = 'PRESENT' THEN 1 ELSE 0 END) as present_count")
            ->selectRaw("SUM(CASE WHEN status = 'LATE' THEN 1 ELSE 0 END) as late_count")
            ->selectRaw("SUM(CASE WHEN status = 'ABSENT' THEN 1 ELSE 0 END) as absent_count")
            ->selectRaw("SUM(CASE WHEN status = 'LEAVE' THEN 1 ELSE 0 END) as leave_count")
            ->selectRaw("SUM(CASE WHEN status = 'HOLIDAY' THEN 1 ELSE 0 END) as holiday_count")
            ->selectRaw('SUM(CASE WHEN early_leave_minutes > 0 THEN 1 ELSE 0 END) as early_leave_count')
            ->selectRaw('SUM(COALESCE(early_leave_minutes, 0)) as total_early_leave_minutes')
            ->selectRaw('SUM(COALESCE(work_duration_minutes, 0)) as total_work_duration_minutes')
            ->selectRaw('AVG(CASE WHEN work_duration_minutes > 0 THEN work_duration_minutes END) as avg_work_duration_minutes')
            ->groupBy('employee_id')
            ->get()
            ->keyBy('employee_id');

        $summaries = $employees->map(fn ($employee) => [
            'employee_id' => $employee->id,
            'employee_name' => $employee->name,
            'employee_code' => $employee->employee_code,
            'tenant_name' => $employee->tenant->name,
            'tenant_id' => $employee->tenant_id,
            'present_count' => (int) ($aggregates[$employee->id]->present_count ?? 0),
            'late_count' => (int) ($aggregates[$employee->id]->late_count ?? 0),
            'absent_count' => (int) ($aggregates[$employee->id]->absent_count ?? 0),
            'leave_count' => (int) ($aggregates[$employee->id]->leave_count ?? 0),
            'holiday_count' => (int) ($aggregates[$employee->id]->holiday_count ?? 0),
            'early_leave_count' => (int) ($aggregates[$employee->id]->early_leave_count ?? 0),
            'total_early_leave_minutes' => (int) ($aggregates[$employee->id]->total_early_leave_minutes ?? 0),
            'total_work_duration_minutes' => (int) ($aggregates[$employee->id]->total_work_duration_minutes ?? 0),
            'avg_work_duration_minutes' => (int) round($aggregates[$employee->id]->avg_work_duration_minutes ?? 0),
        ]);

        $summaryStats = [
            'total_employees' => $employees->count(),
            'total_present' => $summaries->sum('present_count'),
            'total_late' => $summaries->sum('late_count'),
            'total_absent' => $summaries->sum('absent_count'),
            'total_leave' => $summaries->sum('leave_count'),
            'total_early_leave' => $summaries->sum('early_leave_count'),
        ];

        $tenants = Tenant::where('is_active', true)
            ->when($user->employee && ! $user->hasPermissionTo('manage_attendance'), fn ($q) => $q->where('id', $user->employee->tenant_id))
            ->orderBy('name')->get();

        return Inertia::render('reports/attendance', [
            'summaries' => $summaries->values(),
            'summaryStats' => $summaryStats,
            'tenants' => $tenants,
            'filters' => [
                'month' => $month,
                'tenant_id' => $tenantId,
            ],
        ]);
    }

    public function exportExcel(Request $request)
    {
        if (! $request->user()->hasPermissionTo('view_reports')) {
            abort(403);
        }

        $month = $request->input('month', now()->format('Y-m'));
        $tenantId = $request->input('tenant_id');

        if ($month && ! preg_match('/^\d{4}-\d{2}$/', (string) $month)) {
            abort(422, 'Format bulan tidak valid.');
        }

        if ($request->user()->employee && ! $request->user()->hasPermissionTo('manage_attendance')) {
            $tenantId = $request->user()->employee->tenant_id;
        }

        return Excel::download(
            new AttendanceExport($month, $tenantId, $request->user()),
            'laporan-absensi-'.$month.'.xlsx'
        );
    }

    public function exportPdf(Request $request)
    {
        if (! $request->user()->hasPermissionTo('view_reports')) {
            abort(403);
        }

        $month = $request->input('month', now()->format('Y-m'));
        $tenantId = $request->input('tenant_id');

        if ($month && ! preg_match('/^\d{4}-\d{2}$/', (string) $month)) {
            abort(422, 'Format bulan tidak valid.');
        }

        if ($request->user()->employee && ! $request->user()->hasPermissionTo('manage_attendance')) {
            $tenantId = $request->user()->employee->tenant_id;
        }

        $startDate = $month.'-01';
        $endDate = now()->parse($startDate)->endOfMonth()->format('Y-m-d');

        $employeeQuery = Employee::query()
            ->with('tenant')
            ->where('is_active', true);

        if ($request->user()->employee && ! $request->user()->hasPermissionTo('manage_attendance')) {
            $employeeQuery->where('tenant_id', $request->user()->employee->tenant_id);
        }

        if ($tenantId) {
            $employeeQuery->where('tenant_id', $tenantId);
        }

        $employees = $employeeQuery->orderBy('name')->get();

        $aggregates = DB::table('attendances')
            ->whereBetween('attendance_date', [$startDate, $endDate])
            ->whereIn('employee_id', $employees->pluck('id'))
            ->select('employee_id')
            ->selectRaw("SUM(CASE WHEN status = 'PRESENT' THEN 1 ELSE 0 END) as present_count")
            ->selectRaw("SUM(CASE WHEN status = 'LATE' THEN 1 ELSE 0 END) as late_count")
            ->selectRaw("SUM(CASE WHEN status = 'ABSENT' THEN 1 ELSE 0 END) as absent_count")
            ->selectRaw("SUM(CASE WHEN status = 'LEAVE' THEN 1 ELSE 0 END) as leave_count")
            ->selectRaw("SUM(CASE WHEN status = 'HOLIDAY' THEN 1 ELSE 0 END) as holiday_count")
            ->selectRaw('SUM(CASE WHEN early_leave_minutes > 0 THEN 1 ELSE 0 END) as early_leave_count')
            ->selectRaw('SUM(COALESCE(early_leave_minutes, 0)) as total_early_leave_minutes')
            ->selectRaw('SUM(COALESCE(work_duration_minutes, 0)) as total_work_duration_minutes')
            ->selectRaw('AVG(CASE WHEN work_duration_minutes > 0 THEN work_duration_minutes END) as avg_work_duration_minutes')
            ->groupBy('employee_id')
            ->get()
            ->keyBy('employee_id');

        $summaries = $employees->map(fn ($employee) => [
            'employee_id' => $employee->id,
            'employee_name' => $employee->name,
            'employee_code' => $employee->employee_code,
            'tenant_name' => $employee->tenant->name,
            'tenant_id' => $employee->tenant_id,
            'present_count' => (int) ($aggregates[$employee->id]->present_count ?? 0),
            'late_count' => (int) ($aggregates[$employee->id]->late_count ?? 0),
            'absent_count' => (int) ($aggregates[$employee->id]->absent_count ?? 0),
            'leave_count' => (int) ($aggregates[$employee->id]->leave_count ?? 0),
            'holiday_count' => (int) ($aggregates[$employee->id]->holiday_count ?? 0),
            'early_leave_count' => (int) ($aggregates[$employee->id]->early_leave_count ?? 0),
            'total_early_leave_minutes' => (int) ($aggregates[$employee->id]->total_early_leave_minutes ?? 0),
            'total_work_duration_minutes' => (int) ($aggregates[$employee->id]->total_work_duration_minutes ?? 0),
            'avg_work_duration_minutes' => (int) round($aggregates[$employee->id]->avg_work_duration_minutes ?? 0),
        ]);

        $logoPath = public_path('img/logo.png');
        $logoBase64 = file_exists($logoPath) ? base64_encode(file_get_contents($logoPath)) : '';

        $monthLabel = now()->parse($month)->translatedFormat('F Y');
        $tenantName = $tenantId ? Tenant::find($tenantId)?->name : null;

        $pdf = Pdf::loadView('reports.attendance-pdf', [
            'summaries' => $summaries,
            'month' => $month,
            'monthLabel' => $monthLabel,
            'tenantName' => $tenantName,
            'logo' => $logoBase64,
        ])->setPaper('A4', 'landscape');

        return $pdf->download('rekap-absensi-'.$month.'.pdf');
    }
}
