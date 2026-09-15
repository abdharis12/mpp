<?php

namespace Database\Seeders;

use App\Models\AttendanceLocation;
use App\Models\Employee;
use App\Models\Tenant;
use App\Models\TenantService;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SampleTenantSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tenant = Tenant::firstOrCreate(
            ['code' => 'DPMPTSP'],
            [
                'name' => 'Dinas Penanaman Modal dan Pelayanan Terpadu Satu Pintu',
                'description' => 'Tenant penyelenggara Mal Pelayanan Publik Kabupaten Muara Enim.',
                'is_active' => true,
            ]
        );

        $staffUser = User::firstOrCreate(
            ['email' => 'petugas@mpp-muaraenim.dev'],
            [
                'name' => 'Petugas Layanan Contoh',
                'password' => 'password',
                'email_verified_at' => now(),
                'is_active' => true,
            ]
        );
        $staffUser->assignRole('tenant_staff');

        Employee::firstOrCreate(
            ['user_id' => $staffUser->id],
            [
                'tenant_id' => $tenant->id,
                'employee_code' => 'EMP-0001',
                'name' => $staffUser->name,
                'position' => 'Petugas Layanan',
                'email' => $staffUser->email,
                'is_active' => true,
            ]
        );

        AttendanceLocation::firstOrCreate(
            ['name' => 'MPP Kabupaten Muara Enim'],
            [
                'latitude' => (float) env('MPP_LATITUDE', -3.6582),
                'longitude' => (float) env('MPP_LONGITUDE', 103.9064),
                'radius_meter' => 20.00,
                'maximum_gps_accuracy' => 50.00,
                'is_active' => true,
            ]
        );

        // Sample tenant services — clearly sample data, to be replaced by real services via admin CRUD
        $sampleServices = [
            ['name' => 'Perizinan Berusaha',  'description' => 'Pelayanan perizinan berusaha melalui sistem Online Single Submission (OSS).', 'sort_order' => 1, 'is_active' => true],
            ['name' => 'Penanaman Modal',      'description' => 'Pelayanan penanaman modal dalam dan luar negeri.', 'sort_order' => 2, 'is_active' => true],
            ['name' => 'Informasi & Pengaduan', 'description' => 'Pusat informasi layanan dan penerimaan pengaduan masyarakat.', 'sort_order' => 3, 'is_active' => true],
        ];

        foreach ($sampleServices as $service) {
            TenantService::firstOrCreate(
                ['tenant_id' => $tenant->id, 'name' => $service['name']],
                $service
            );
        }
    }
}
