<?php

namespace App\Actions\Attendance;

use App\Enums\AttendanceStatus;
use App\Models\Attendance;
use App\Models\AttendanceLocation;
use App\Models\Employee;
use App\Services\Attendance\AttendanceEngine;
use App\Services\Attendance\Exceptions\AttendanceException;
use App\Services\Attendance\LocationService;
use App\Services\Audit\AuditLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ClockIn
{
    public function __construct(
        private readonly AttendanceEngine $engine,
        private readonly LocationService $locationService,
    ) {}

    public function execute(
        Employee $employee,
        float $latitude,
        float $longitude,
        float $accuracy,
        ?Request $request = null,
    ): Attendance {
        $now = now();
        $date = $now->copy()->startOfDay();

        if (! $employee->is_active) {
            throw AttendanceException::make(AttendanceException::EMPLOYEE_NOT_FOUND, 'Petugas tidak aktif atau tidak ditemukan.', [], 404);
        }

        if (! $employee->tenant || ! $employee->tenant->is_active) {
            throw AttendanceException::make(AttendanceException::LOCATION_UNAVAILABLE, 'Tenant petugas tidak aktif.', [], 422);
        }

        $plan = $this->engine->planFor($employee, $date);

        if (! $plan->isWorkingDay) {
            throw AttendanceException::make(AttendanceException::NOT_WORKING_DAY, 'Hari ini bukan hari kerja.', [], 422);
        }

        if ($plan->isFullDayHoliday) {
            AuditLogger::log(
                AuditLogger::ATTENDANCE_ATTEMPT_ON_HOLIDAY,
                tenantId: $employee->tenant_id,
                subjectType: Employee::class,
                subjectId: $employee->id,
                metadata: ['date' => $date->toDateString()],
                request: $request,
            );

            throw AttendanceException::make(
                AttendanceException::HOLIDAY,
                'Hari ini merupakan hari libur. Absensi tidak diperlukan.',
                [],
                422,
            );
        }

        $period = $plan->periodContaining($now, $plan->gracePeriodMinutes);

        if (! $period) {
            AuditLogger::log(
                AuditLogger::ATTENDANCE_REJECTED,
                tenantId: $employee->tenant_id,
                subjectType: Employee::class,
                subjectId: $employee->id,
                metadata: ['reason' => AttendanceException::OUTSIDE_ATTENDANCE_WINDOW, 'date' => $date->toDateString()],
                request: $request,
            );

            throw AttendanceException::make(
                AttendanceException::OUTSIDE_ATTENDANCE_WINDOW,
                'Saat ini berada di luar jam absensi.',
                [],
                422,
            );
        }

        if (Attendance::where('employee_id', $employee->id)->where('attendance_date', $date->toDateString())->exists()) {
            throw AttendanceException::make(
                AttendanceException::ALREADY_CLOCKED_IN,
                'Anda sudah melakukan absensi masuk.',
                [],
                409,
            );
        }

        $location = AttendanceLocation::where('is_active', true)->first();

        if (! $location) {
            throw AttendanceException::make(
                AttendanceException::LOCATION_UNAVAILABLE,
                'Belum terdapat titik lokasi absensi aktif. Silakan hubungi administrator.',
                [],
                503,
            );
        }

        $locResult = $this->locationService->validate($latitude, $longitude, $accuracy, $location);

        if (! $locResult->valid) {
            $event = match ($locResult->reason) {
                'GPS_ACCURACY_TOO_LOW' => AuditLogger::GPS_ACCURACY_FAILED,
                'OUTSIDE_RADIUS' => AuditLogger::ATTENDANCE_ATTEMPT_OUTSIDE_RADIUS,
                default => AuditLogger::LOCATION_VALIDATION_FAILED,
            };

            AuditLogger::log(
                $event,
                tenantId: $employee->tenant_id,
                subjectType: Employee::class,
                subjectId: $employee->id,
                newValues: $locResult->jsonSerialize(),
                request: $request,
            );

            $message = match ($locResult->reason) {
                'GPS_ACCURACY_TOO_LOW' => 'Akurasi lokasi perangkat terlalu rendah. Aktifkan lokasi presisi tinggi dan coba kembali.',
                default => 'Anda berada di luar area absensi.',
            };

            throw AttendanceException::make(
                $locResult->reason ?? 'LOCATION_VALIDATION_FAILED',
                $message,
                [
                    'distance' => round($locResult->distance, 2),
                    'radius' => $locResult->radius,
                ],
                422,
            );
        }

        $expectedStart = $period->start;
        $lateMinutes = $now->greaterThan($expectedStart)
            ? (int) ceil($now->diffInMinutes($expectedStart))
            : 0;
        $status = $lateMinutes <= $plan->gracePeriodMinutes
            ? AttendanceStatus::Present
            : AttendanceStatus::Late;

        return DB::transaction(function () use (
            $employee,
            $date,
            $now,
            $latitude,
            $longitude,
            $accuracy,
            $locResult,
            $location,
            $status,
            $lateMinutes,
            $request,
        ) {
            $attendance = Attendance::create([
                'tenant_id' => $employee->tenant_id,
                'employee_id' => $employee->id,
                'attendance_date' => $date->toDateString(),
                'attendance_location_id' => $location->id,
                'clock_in' => $now,
                'clock_in_latitude' => $latitude,
                'clock_in_longitude' => $longitude,
                'clock_in_accuracy' => $accuracy,
                'clock_in_distance' => round($locResult->distance, 2),
                'status' => $status,
                'late_minutes' => max(0, $lateMinutes),
                'early_leave_minutes' => 0,
                'clock_in_ip' => $request?->ip(),
                'clock_in_user_agent' => $request?->userAgent() !== null
                    ? mb_substr($request->userAgent(), 0, 1000)
                    : null,
            ]);

            AuditLogger::log(
                AuditLogger::CLOCK_IN,
                tenantId: $employee->tenant_id,
                subjectType: Attendance::class,
                subjectId: $attendance->id,
                newValues: [
                    'clock_in' => $now->toIso8601String(),
                    'status' => $status->value,
                    'late_minutes' => $lateMinutes,
                    'distance' => round($locResult->distance, 2),
                ],
                request: $request,
            );

            return $attendance;
        });
    }
}
