<?php

namespace App\Services\Attendance;

use App\Models\AttendanceSchedule;
use App\Models\Employee;
use App\Services\Attendance\Data\ResolvedSchedule;
use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Builder;

class ScheduleResolver
{
    public function resolveFor(Employee $employee, CarbonInterface $date): ?ResolvedSchedule
    {
        $dayOfWeek = $date->dayOfWeekIso; // 1 (Monday) .. 7 (Sunday)

        $scopes = [
            fn (Builder $query) => $query->where('employee_id', $employee->id),
            fn (Builder $query) => $query
                ->whereNull('employee_id')
                ->where('tenant_id', $employee->tenant_id),
            fn (Builder $query) => $query
                ->whereNull('employee_id')
                ->whereNull('tenant_id'),
        ];

        foreach ($scopes as $scope) {
            $schedule = AttendanceSchedule::query()
                ->where('is_active', true)
                ->where($scope)
                ->with(['days' => fn (Builder $query) => $query->where('day_of_week', $dayOfWeek)])
                ->orderBy('id')
                ->first();

            if ($schedule && $schedule->days->isNotEmpty()) {
                return new ResolvedSchedule($schedule, $schedule->days->first());
            }
        }

        return null;
    }
}
