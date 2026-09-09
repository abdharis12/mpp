<?php

namespace App\Services\Attendance\Data;

use Carbon\CarbonInterface;

final readonly class WorkingPeriod
{
    public function __construct(
        public CarbonInterface $start,
        public CarbonInterface $end,
    ) {}

    public function contains(CarbonInterface $time): bool
    {
        return $time->greaterThanOrEqualTo($this->start) && $time->lessThanOrEqualTo($this->end);
    }

    public function durationInMinutes(): int
    {
        return (int) $this->start->diffInMinutes($this->end);
    }
}
