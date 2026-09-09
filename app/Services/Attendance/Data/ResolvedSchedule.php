<?php

namespace App\Services\Attendance\Data;

use App\Models\AttendanceSchedule;
use App\Models\AttendanceScheduleDay;

final readonly class ResolvedSchedule
{
    public function __construct(
        public AttendanceSchedule $schedule,
        public AttendanceScheduleDay $day,
    ) {}

    public function startsAt(): ?string
    {
        return $this->day->start_time;
    }

    public function endsAt(): ?string
    {
        return $this->day->end_time;
    }

    public function gracePeriodMinutes(): int
    {
        return $this->schedule->grace_period_minutes;
    }
}
