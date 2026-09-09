<?php

namespace App\Policies;

use App\Models\AttendanceSchedule;
use App\Models\User;

class AttendanceSchedulePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('manage_schedule') || $user->can('view_attendance');
    }

    public function create(User $user): bool
    {
        return $user->can('manage_schedule');
    }

    public function update(User $user, AttendanceSchedule $schedule): bool
    {
        if (! $user->can('manage_schedule')) {
            return false;
        }

        if ($user->employee && $user->employee->tenant_id !== null && $schedule->tenant_id !== $user->employee->tenant_id) {
            return false;
        }

        return true;
    }
}
