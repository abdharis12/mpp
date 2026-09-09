<?php

namespace App\Policies;

use App\Models\Employee;
use App\Models\User;

class EmployeePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('view_employees');
    }

    public function view(User $user, Employee $employee): bool
    {
        if ($user->employee && $user->employee->id === $employee->id) {
            return true;
        }

        if (! $user->can('view_employees')) {
            return false;
        }

        if ($user->employee) {
            return $user->employee->tenant_id === $employee->tenant_id;
        }

        return true;
    }

    public function create(User $user): bool
    {
        return $user->can('create_employees');
    }

    public function update(User $user, Employee $employee): bool
    {
        if (! $user->can('update_employees')) {
            return false;
        }

        if ($user->employee) {
            return $user->employee->tenant_id === $employee->tenant_id;
        }

        return true;
    }
}
