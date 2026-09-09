<?php

namespace App\Policies;

use App\Models\Holiday;
use App\Models\User;

class HolidayPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('manage_holiday') || $user->hasAnyPermission(['view_attendance', 'clock_in']);
    }

    public function create(User $user): bool
    {
        return $user->can('manage_holiday');
    }

    public function update(User $user, Holiday $holiday): bool
    {
        return $user->can('manage_holiday');
    }
}
