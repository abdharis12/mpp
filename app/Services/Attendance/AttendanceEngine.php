<?php

namespace App\Services\Attendance;

use App\Models\Employee;
use App\Services\Attendance\Data\AttendancePlan;
use App\Services\Attendance\Data\WorkingPeriod;
use Carbon\CarbonInterface;

class AttendanceEngine
{
    public function __construct(
        private readonly ScheduleResolver $scheduleResolver,
        private readonly HolidayResolver $holidayResolver,
    ) {}

    public function planFor(Employee $employee, CarbonInterface $date): AttendancePlan
    {
        $resolvedSchedule = $this->scheduleResolver->resolveFor($employee, $date);
        $holidayResolution = $this->holidayResolver->resolveFor($date);

        if ($resolvedSchedule === null || ! $resolvedSchedule->day->is_working_day) {
            return new AttendancePlan(
                date: $date,
                isWorkingDay: false,
                isFullDayHoliday: false,
                gracePeriodMinutes: $resolvedSchedule?->gracePeriodMinutes() ?? 0,
                schedule: $resolvedSchedule,
                workingPeriods: collect(),
                holidays: $holidayResolution->holidays,
            );
        }

        $grace = $resolvedSchedule->gracePeriodMinutes();
        $startsAt = $resolvedSchedule->startsAt();
        $endsAt = $resolvedSchedule->endsAt();

        if ($holidayResolution->isFullDay()) {
            return new AttendancePlan(
                date: $date,
                isWorkingDay: true,
                isFullDayHoliday: true,
                gracePeriodMinutes: $grace,
                schedule: $resolvedSchedule,
                workingPeriods: collect(),
                holidays: $holidayResolution->holidays,
            );
        }

        $pieces = $this->holidayResolver->subtractPeriods(
            $startsAt,
            $endsAt,
            $holidayResolution->periods,
        );

        $workingPeriods = $pieces->map(function (array $piece) use ($date): WorkingPeriod {
            return new WorkingPeriod(
                start: $date->copy()->setTimeFromTimeString($piece['start']),
                end: $date->copy()->setTimeFromTimeString($piece['end']),
            );
        })->sortBy(fn (WorkingPeriod $period) => $period->start->toTimeString());

        return new AttendancePlan(
            date: $date,
            isWorkingDay: true,
            isFullDayHoliday: false,
            gracePeriodMinutes: $grace,
            schedule: $resolvedSchedule,
            workingPeriods: $workingPeriods->values(),
            holidays: $holidayResolution->holidays,
        );
    }
}
