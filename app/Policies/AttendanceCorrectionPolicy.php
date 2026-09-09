<?php

namespace App\Policies;

use App\Models\AttendanceCorrection;
use App\Models\User;

class AttendanceCorrectionPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyPermission(['view_attendance', 'clock_in', 'clock_out']);
    }

    public function create(User $user): bool
    {
        return $user->employee && $user->can('request_correction');
    }

    public function approve(User $user, AttendanceCorrection $correction): bool
    {
        if (! $user->can('approve_correction')) {
            return false;
        }

        if ($user->employee) {
            return $correction->tenant_id === $user->employee->tenant_id;
        }

        return true;
    }
}
