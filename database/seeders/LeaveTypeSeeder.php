<?php

namespace Database\Seeders;

use App\Models\LeaveType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LeaveTypeSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $types = [
            ['code' => 'SICK', 'name' => 'Sakit', 'description' => 'Izin karena sakit.', 'requires_attachment' => false],
            ['code' => 'PERSONAL', 'name' => 'Keperluan Pribadi', 'description' => 'Izin karena keperluan pribadi.', 'requires_attachment' => false],
            ['code' => 'OFFICIAL_DUTY', 'name' => 'Dinas/Tugas', 'description' => 'Izin karena dinas keluar atau tugas kedinasan.', 'requires_attachment' => false],
            ['code' => 'OTHER', 'name' => 'Lainnya', 'description' => 'Jenis izin lainnya.', 'requires_attachment' => false],
        ];

        foreach ($types as $type) {
            LeaveType::firstOrCreate(
                ['code' => $type['code']],
                $type
            );
        }
    }
}
