<?php

namespace App\Services\Attendance;

use App\Models\Holiday;
use App\Models\HolidayPeriod;
use App\Services\Attendance\Data\HolidayResolution;
use Carbon\CarbonInterface;
use Illuminate\Support\Collection;

class HolidayResolver
{
    public function resolveFor(CarbonInterface $date): HolidayResolution
    {
        $holidays = Holiday::query()
            ->where('is_active', true)
            ->where('start_date', '<=', $date->toDateString())
            ->where('end_date', '>=', $date->toDateString())
            ->get();

        if ($holidays->isEmpty()) {
            return HolidayResolution::empty();
        }

        $periods = HolidayPeriod::query()
            ->whereIn('holiday_id', $holidays->pluck('id'))
            ->where('holiday_date', $date->toDateString())
            ->get();

        return new HolidayResolution($holidays, $periods);
    }

    /**
     * Kurangkan seluruh periode holiday dari satu periode kerja, hasilnya berupa potongan-potongan kerja baru.
     *
     * @param  Collection<int, HolidayPeriod>  $holidayPeriods
     * @return Collection<int, array{start: string, end: string}>
     */
    public function subtractPeriods(
        string $periodStart,
        string $periodEnd,
        Collection $holidayPeriods,
    ): Collection {
        $workPieces = collect([
            ['start' => $periodStart, 'end' => $periodEnd],
        ]);

        foreach ($holidayPeriods as $period) {
            $workPieces = $workPieces->flatMap(function (array $work) use ($period) {
                if ($period->start_time === null || $period->end_time === null) {
                    return [$work];
                }

                $holidayStart = $period->start_time;
                $holidayEnd = $period->end_time;

                if ($holidayEnd <= $work['start'] || $holidayStart >= $work['end']) {
                    return [$work];
                }

                $pieces = [];

                if ($holidayStart > $work['start']) {
                    $pieces[] = ['start' => $work['start'], 'end' => $holidayStart];
                }

                if ($holidayEnd < $work['end']) {
                    $pieces[] = ['start' => $holidayEnd, 'end' => $work['end']];
                }

                return $pieces;
            })->values();
        }

        return $workPieces;
    }
}
