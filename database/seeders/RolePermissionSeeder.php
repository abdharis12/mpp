<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            'view_dashboard',
            'view_tenants',
            'create_tenants',
            'update_tenants',
            'delete_tenants',
            'view_employees',
            'create_employees',
            'update_employees',
            'delete_employees',
            'clock_in',
            'clock_out',
            'view_attendance',
            'manage_attendance',
            'request_leave',
            'approve_leave',
            'request_correction',
            'approve_correction',
            'view_reports',
            'export_reports',
            'manage_location',
            'manage_schedule',
            'manage_holiday',
            'view_audit_logs',
            'manage_settings',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        $roles = [
            'tenant_staff' => [
                'view_dashboard',
                'clock_in',
                'clock_out',
                'view_attendance',
                'request_leave',
                'request_correction',
            ],
        ];

        foreach ($roles as $roleName => $rolePermissions) {
            $role = Role::firstOrCreate(['name' => $roleName]);
            $role->syncPermissions($rolePermissions);
        }

        $superAdmin = Role::firstOrCreate(['name' => 'super_admin']);
        $superAdmin->syncPermissions(Permission::all());

        // Remove deprecated roles if they exist.
        $deprecated = Role::whereIn('name', ['admin_mpp', 'admin_tenant', 'viewer'])->get();
        foreach ($deprecated as $role) {
            $role->permissions()->detach();
            $role->delete();
        }
    }
}
