<?php

namespace App\Policies;

use App\Models\Tenant;
use App\Models\User;

class TenantPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('view_tenants');
    }

    public function view(User $user, Tenant $tenant): bool
    {
        if (! $user->can('view_tenants')) {
            return false;
        }

        return $user->employee === null || $user->employee->tenant_id === $tenant->id;
    }

    public function create(User $user): bool
    {
        return $user->employee === null && $user->can('create_tenants');
    }

    public function update(User $user, Tenant $tenant): bool
    {
        if (! $user->can('update_tenants')) {
            return false;
        }

        return $user->employee === null || $user->employee->tenant_id === $tenant->id;
    }

    public function delete(User $user, Tenant $tenant): bool
    {
        if (! $user->can('delete_tenants')) {
            return false;
        }

        if ($user->employee !== null && $user->employee->tenant_id !== $tenant->id) {
            return false;
        }

        if ($tenant->employees()->exists()) {
            return false;
        }

        return true;
    }
}
