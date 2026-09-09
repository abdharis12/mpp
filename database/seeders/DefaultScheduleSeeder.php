<?php

namespace Database\Seeders;

use App\Models\AttendanceSchedule;
use App\Models\AttendanceScheduleDay;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DefaultScheduleSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $schedule = AttendanceSchedule::firstOrCreate(
            ['name' => 'Default MPP'],
            [
                'description' => 'Jadwal default Mal Pelayanan Publik Kabupaten Muara Enim.',
                'tenant_id' => null,
                'employee_id' => null,
                'grace_period_minutes' => 10,
                'is_active' => true,
            ]
        );

        $days = [
            ['day_of_week' => 1, 'start_time' => '08:00', 'end_time' => '16:00', 'is_working_day' => true],
            ['day_of_week' => 2, 'start_time' => '08:00', 'end_time' => '16:00', 'is_working_day' => true],
            ['day_of_week' => 3, 'start_time' => '08:00', 'end_time' => '16:00', 'is_working_day' => true],
            ['day_of_week' => 4, 'start_time' => '08:00', 'end_time' => '16:00', 'is_working_day' => true],
            ['day_of_week' => 5, 'start_time' => '07:00', 'end_time' => '16:30', 'is_working_day' => true],
            ['day_of_week' => 6, 'start_time' => null, 'end_time' => null, 'is_working_day' => false],
            ['day_of_week' => 7, 'start_time' => null, 'end_time' => null, 'is_working_day' => false],
        ];

        foreach ($days as $day) {
            AttendanceScheduleDay::updateOrCreate(
                ['attendance_schedule_id' => $schedule->id, 'day_of_week' => $day['day_of_week']],
                $day
            );
        }
    }
}
