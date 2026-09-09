<?php

namespace App\Services\Attendance\Data;

use App\Models\Holiday;
use Carbon\CarbonInterface;
use Illuminate\Support\Collection;

final readonly class AttendancePlan
{
    /**
     * @param  Collection<int, WorkingPeriod>  $workingPeriods
     * @param  Collection<int, Holiday>  $holidays
     */
    public function __construct(
        public CarbonInterface $date,
        public bool $isWorkingDay,
        public bool $isFullDayHoliday,
        public int $gracePeriodMinutes,
        public ?ResolvedSchedule $schedule,
        public Collection $workingPeriods,
        public Collection $holidays,
    ) {}

    public function hasWorkingTime(): bool
    {
        return $this->isWorkingDay && ! $this->isFullDayHoliday && $this->workingPeriods->isNotEmpty();
    }

    public function containsWorkingTime(CarbonInterface $time): ?WorkingPeriod
    {
        return $this->workingPeriods->first(
            fn (WorkingPeriod $period) => $period->contains($time)
        );
    }

    public function periodContaining(CarbonInterface $time, int $toleranceMinutes = 0): ?WorkingPeriod
    {
        return $this->workingPeriods->first(function (WorkingPeriod $period) use ($time, $toleranceMinutes) {
            $lower = $period->start->copy()->subMinutes($toleranceMinutes);

            return $time->greaterThanOrEqualTo($lower) && $time->lessThanOrEqualTo($period->end);
        });
    }
}
