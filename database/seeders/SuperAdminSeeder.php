<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $superAdminRole = Role::firstOrCreate(['name' => 'super_admin']);

        $admin = User::firstOrCreate(
            ['email' => 'admin@dpmptspmuaraenimkab.go.id'],
            [
                'name' => 'Administrator',
                'password' => '@Dpmptsp123!',
                'email_verified_at' => now(),
            ]
        );

        $admin->assignRole($superAdminRole);
    }
}
