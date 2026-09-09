<?php

namespace App\Policies;

use App\Models\AttendanceLocation;
use App\Models\User;

class LocationPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('manage_location');
    }

    public function view(User $user, AttendanceLocation $location): bool
    {
        return $user->can('manage_location');
    }

    public function create(User $user): bool
    {
        return $user->can('manage_location');
    }

    public function update(User $user, AttendanceLocation $location): bool
    {
        return $user->can('manage_location');
    }
}
