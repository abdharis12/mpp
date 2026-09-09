<?php

namespace App\Http\Controllers;

use App\Actions\Attendance\ClockIn;
use App\Actions\Attendance\ClockOut;
use App\Http\Requests\Attendance\ClockInRequest;
use App\Http\Requests\Attendance\ClockOutRequest;
use App\Models\Attendance;
use App\Models\AttendanceLocation;
use App\Services\Attendance\AttendanceEngine;
use App\Services\Attendance\Exceptions\AttendanceException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;
use Inertia\InertiaResponse;

class AttendanceController extends Controller
{
    public function __construct(
        private readonly AttendanceEngine $engine,
        private readonly ClockIn $clockIn,
        private readonly ClockOut $clockOut,
    ) {}

    public function today(): InertiaResponse
    {
        $this->authorize('viewToday');

        $user = auth()->user();
        $employee = $user->employee;

        $now = now();
        $date = $now->copy()->startOfDay();
        $plan = $this->engine->planFor($employee, $date);

        $attendance = Attendance::query()
            ->forEmployee($employee->id)
            ->onDate($date->toDateString())
            ->first();

        $activeLocation = AttendanceLocation::where('is_active', true)->first();

        return inertia('attendance/today', [
            'date' => $date->toDateString(),
            'schedule' => $plan->isWorkingDay && $plan->schedule?->day->is_working_day
                ? [
                    'start' => $plan->schedule->day->start_time,
                    'end' => $plan->schedule->day->end_time,
                    'is_working_day' => true,
                    'grace_period_minutes' => $plan->gracePeriodMinutes,
                ]
                : null,
            'working_periods' => $plan->workingPeriods->map(fn ($period) => [
                'start' => $period->start->format('H:i'),
                'end' => $period->end->format('H:i'),
            ])->values(),
            'holiday' => $plan->holidays->isNotEmpty() ? [
                'name' => $plan->holidays->first()->name,
                'is_full_day' => $plan->isFullDayHoliday,
            ] : null,
            'attendance' => $attendance ? [
                'clock_in' => $attendance->clock_in?->format('H:i'),
                'clock_out' => $attendance->clock_out?->format('H:i'),
                'status' => $attendance->status,
            ] : null,
            'location' => $activeLocation ? [
                'name' => $activeLocation->name,
                'latitude' => $activeLocation->latitude,
                'longitude' => $activeLocation->longitude,
                'radius_meter' => $activeLocation->radius_meter,
                'maximum_gps_accuracy' => $activeLocation->maximum_gps_accuracy,
            ] : null,
        ]);
    }

    public function clockIn(ClockInRequest $request): RedirectResponse
    {
        $this->authorize('clockIn');

        try {
            $this->clockIn->execute(
                auth()->user()->employee,
                $request->float('latitude'),
                $request->float('longitude'),
                $request->float('accuracy'),
                $request,
            );

            return Redirect::route('attendance.today')->with('success', 'Clock-in berhasil.');
        } catch (AttendanceException $e) {
            return Redirect::back()->withErrors(['attendance' => $e->getMessage()]);
        }
    }

    public function clockOut(ClockOutRequest $request): RedirectResponse
    {
        $this->authorize('clockOut');

        try {
            $this->clockOut->execute(
                auth()->user()->employee,
                $request->float('latitude'),
                $request->float('longitude'),
                $request->float('accuracy'),
                $request,
            );

            return Redirect::route('attendance.today')->with('success', 'Clock-out berhasil.');
        } catch (AttendanceException $e) {
            return Redirect::back()->withErrors(['attendance' => $e->getMessage()]);
        }
    }
}
