<?php

namespace App\Http\Controllers;

use App\Actions\Attendance\ClockIn;
use App\Actions\Attendance\ClockOut;
use App\Http\Requests\Attendance\ClockInRequest;
use App\Http\Requests\Attendance\ClockOutRequest;
use App\Models\Attendance;
use App\Models\AttendanceLocation;
use App\Services\Attendance\AttendanceEngine;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class AttendanceController extends Controller
{
    public function __construct(
        private readonly AttendanceEngine $engine,
        private readonly ClockIn $clockIn,
        private readonly ClockOut $clockOut,
    ) {}

    public function today(Request $request): Response|JsonResponse
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

        $payload = [
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
        ];

        if ($request->wantsJson()) {
            return response()->json([
                ...$payload,
                'attendance' => $attendance ? array_filter([
                    'clock_in' => $attendance->clock_in?->toIso8601String(),
                    'clock_out' => $attendance->clock_out?->toIso8601String(),
                    'status' => $attendance->status,
                ], fn ($value) => $value !== null) : null,
            ]);
        }

        return Inertia::render('attendance/today', $payload);
    }

    public function clockIn(ClockInRequest $request): RedirectResponse|JsonResponse
    {
        $this->authorize('clockIn');

        $attendance = $this->clockIn->execute(
            auth()->user()->employee,
            $request->float('latitude'),
            $request->float('longitude'),
            $request->float('accuracy'),
            $request,
        );

        if ($request->wantsJson()) {
            return response()->json([
                'attendance' => [
                    'id' => $attendance->id,
                    'status' => $attendance->status->value,
                    'late_minutes' => $attendance->late_minutes,
                    'clock_in' => $attendance->clock_in?->toIso8601String(),
                ],
            ], 201);
        }

        return Redirect::route('attendance.today')->with('success', 'Clock-in berhasil.');
    }

    public function clockOut(ClockOutRequest $request): RedirectResponse|JsonResponse
    {
        $this->authorize('clockOut');

        $attendance = $this->clockOut->execute(
            auth()->user()->employee,
            $request->float('latitude'),
            $request->float('longitude'),
            $request->float('accuracy'),
            $request,
        );

        if ($request->wantsJson()) {
            return response()->json([
                'attendance' => [
                    'id' => $attendance->id,
                    'work_duration_minutes' => $attendance->work_duration_minutes,
                    'clock_out' => $attendance->clock_out?->toIso8601String(),
                ],
            ]);
        }

        return Redirect::route('attendance.today')->with('success', 'Clock-out berhasil.');
    }
}
