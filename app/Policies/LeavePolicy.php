<?php

namespace App\Policies;

use App\Models\Leave;
use App\Models\User;

class LeavePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyPermission(['view_attendance', 'clock_in', 'clock_out']);
    }

    public function create(User $user): bool
    {
        return $user->employee && $user->can('request_leave');
    }

    public function approve(User $user, Leave $leave): bool
    {
        if (! $user->can('approve_leave')) {
            return false;
        }

        if ($user->employee) {
            return $leave->tenant_id === $user->employee->tenant_id;
        }

        return true;
    }

    public function cancel(User $user, Leave $leave): bool
    {
        return $user->employee && $leave->employee_id === $user->employee->id && $leave->status === 'PENDING';
    }
}
