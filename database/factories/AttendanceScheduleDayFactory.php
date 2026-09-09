<?php

namespace Database\Factories;

use App\Models\AttendanceSchedule;
use App\Models\AttendanceScheduleDay;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AttendanceScheduleDay>
 */
class AttendanceScheduleDayFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'attendance_schedule_id' => AttendanceSchedule::factory(),
            'day_of_week' => 1,
            'start_time' => '08:00:00',
            'end_time' => '16:00:00',
            'is_working_day' => true,
        ];
    }
}
