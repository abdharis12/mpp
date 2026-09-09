<?php

namespace App\Policies;

use App\Models\Attendance;
use App\Models\User;

class AttendancePolicy
{
    public function clockIn(User $user): bool
    {
        return $this->hasClockPermission($user, 'clock_in');
    }

    public function clockOut(User $user): bool
    {
        return $this->hasClockPermission($user, 'clock_out');
    }

    public function viewToday(User $user): bool
    {
        return $user->is_active
            && $user->employee
            && $user->employee->is_active
            && $user->employee->tenant->is_active
            && $user->hasAnyPermission(['view_attendance', 'clock_in', 'clock_out']);
    }

    public function view(User $user, Attendance $attendance): bool
    {
        if ($user->employee && $attendance->employee_id === $user->employee->id) {
            return true;
        }

        if ($user->employee && $user->employee->tenant_id === $attendance->tenant_id) {
            return $user->hasPermissionTo('view_attendance');
        }

        return $user->employee === null && $user->hasPermissionTo('view_attendance');
    }

    private function hasClockPermission(User $user, string $permission): bool
    {
        return $user->is_active
            && $user->employee
            && $user->employee->is_active
            && $user->employee->tenant
            && $user->employee->tenant->is_active
            && $user->hasPermissionTo($permission);
    }
}
