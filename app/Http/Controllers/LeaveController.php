<?php

namespace App\Http\Controllers;

use App\Enums\LeaveStatus;
use App\Models\Leave;
use App\Models\LeaveType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class LeaveController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', Leave::class);

        $user = $request->user();
        $leaves = Leave::query()
            ->with('employee', 'tenant', 'leaveType', 'approver')
            ->when($user->employee && ! $user->hasPermissionTo('view_attendance'), fn ($q) => $q->where('employee_id', $user->employee->id))
            ->when($user->employee && $user->hasPermissionTo('view_attendance') && ! $user->hasPermissionTo('manage_attendance'), fn ($q) => $q->where('tenant_id', $user->employee->tenant_id))
            ->orderByDesc('created_at')
            ->paginate(15);

        return Inertia::render('leaves/index', compact('leaves'));
    }

    public function create(): Response
    {
        $this->authorize('create', Leave::class);

        return Inertia::render('leaves/form', [
            'leave' => null,
            'leave_types' => LeaveType::where('is_active', true)->get(),
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', Leave::class);

        $data = $request->validate([
            'leave_type_id' => 'required|exists:leave_types,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'required|string',
        ]);

        $employee = $request->user()->employee;

        Leave::create([
            ...$data,
            'tenant_id' => $employee->tenant_id,
            'employee_id' => $employee->id,
            'status' => LeaveStatus::Pending,
        ]);

        return Redirect::route('leaves.index')->with('success', 'Pengajuan izin dikirim.');
    }

    public function approve(Leave $leave)
    {
        $this->authorize('approve', $leave);

        $leave->update([
            'status' => LeaveStatus::Approved,
            'approved_by' => auth()->id(),
            'approved_at' => now(),
            'rejection_reason' => null,
        ]);

        return Redirect::back()->with('success', 'Pengajuan izin disetujui.');
    }

    public function reject(Request $request, Leave $leave)
    {
        $this->authorize('approve', $leave);

        $request->validate(['reason' => 'required|string']);

        $leave->update([
            'status' => LeaveStatus::Rejected,
            'rejection_reason' => $request->input('reason'),
        ]);

        return Redirect::back()->with('success', 'Pengajuan izin ditolak.');
    }

    public function cancel(Leave $leave)
    {
        $this->authorize('cancel', $leave);

        $leave->update(['status' => LeaveStatus::Cancelled]);

        return Redirect::back()->with('success', 'Pengajuan izin dibatalkan.');
    }
}
