<?php

namespace App\Services\Attendance\Data;

use App\Models\Holiday;
use App\Models\HolidayPeriod;
use Illuminate\Support\Collection;

final readonly class HolidayResolution
{
    /**
     * @param  Collection<int, Holiday>  $holidays
     * @param  Collection<int, HolidayPeriod>  $periods
     */
    public function __construct(
        public Collection $holidays,
        public Collection $periods,
    ) {}

    public function isFullDay(): bool
    {
        return $this->holidays->contains(fn (Holiday $holiday) => $holiday->is_full_day);
    }

    public static function empty(): self
    {
        return new self(collect(), collect());
    }
}
