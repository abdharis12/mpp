<?php

namespace App\Http\Controllers;

use App\Enums\CorrectionStatus;
use App\Models\Attendance;
use App\Models\AttendanceCorrection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class AttendanceCorrectionController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', AttendanceCorrection::class);

        $user = $request->user();
        $corrections = AttendanceCorrection::query()
            ->with('employee', 'tenant', 'attendance', 'requester', 'reviewer')
            ->when($user->employee && ! $user->hasPermissionTo('view_attendance'), fn ($q) => $q->where('employee_id', $user->employee->id))
            ->when($user->employee && $user->hasPermissionTo('view_attendance') && ! $user->hasPermissionTo('manage_attendance'), fn ($q) => $q->where('tenant_id', $user->employee->tenant_id))
            ->orderByDesc('created_at')
            ->paginate(15);

        return Inertia::render('corrections/index', compact('corrections'));
    }

    public function create(): Response
    {
        $this->authorize('create', AttendanceCorrection::class);

        $employee = auth()->user()->employee;
        $attendances = Attendance::where('employee_id', $employee->id)
            ->orderByDesc('attendance_date')
            ->limit(30)
            ->get();

        return Inertia::render('corrections/form', [
            'correction' => null,
            'attendances' => $attendances,
            'correction_types' => config('attendance.correction_types'),
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', AttendanceCorrection::class);

        $data = $request->validate([
            'attendance_id' => 'required|exists:attendances,id',
            'correction_type' => 'required|string|in:'.implode(',', config('attendance.correction_types')),
            'requested_clock_in' => 'nullable|date_format:Y-m-d\TH:i',
            'requested_clock_out' => 'nullable|date_format:Y-m-d\TH:i',
            'reason' => 'required|string',
        ]);

        $employee = $request->user()->employee;
        $attendance = Attendance::where('id', $data['attendance_id'])->where('employee_id', $employee->id)->firstOrFail();

        AttendanceCorrection::create([
            'tenant_id' => $employee->tenant_id,
            'employee_id' => $employee->id,
            'attendance_id' => $attendance->id,
            'requested_by' => auth()->id(),
            'correction_type' => $data['correction_type'],
            'requested_clock_in' => $data['requested_clock_in'] ?? null,
            'requested_clock_out' => $data['requested_clock_out'] ?? null,
            'reason' => $data['reason'],
            'status' => CorrectionStatus::Pending,
        ]);

        return Redirect::route('corrections.index')->with('success', 'Pengajuan koreksi dikirim.');
    }

    public function approve(AttendanceCorrection $correction)
    {
        $this->authorize('approve', $correction);

        DB::transaction(function () use ($correction) {
            $attendance = $correction->attendance;

            $attendance->update([
                'clock_in' => $correction->requested_clock_in ?? $attendance->clock_in,
                'clock_out' => $correction->requested_clock_out ?? $attendance->clock_out,
            ]);

            $correction->update([
                'status' => CorrectionStatus::Approved,
                'reviewed_by' => auth()->id(),
                'reviewed_at' => now(),
                'rejection_reason' => null,
            ]);
        });

        return Redirect::back()->with('success', 'Koreksi disetujui dan diterapkan.');
    }

    public function reject(Request $request, AttendanceCorrection $correction)
    {
        $this->authorize('approve', $correction);

        $request->validate(['reason' => 'required|string']);

        $correction->update([
            'status' => CorrectionStatus::Rejected,
            'reviewed_by' => auth()->id(),
            'reviewed_at' => now(),
            'rejection_reason' => $request->input('reason'),
        ]);

        return Redirect::back()->with('success', 'Koreksi ditolak.');
    }
}
