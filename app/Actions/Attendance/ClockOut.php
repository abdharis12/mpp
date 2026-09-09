<?php

namespace App\Actions\Attendance;

use App\Enums\AttendanceStatus;
use App\Models\Attendance;
use App\Models\AttendanceLocation;
use App\Models\Employee;
use App\Services\Attendance\Exceptions\AttendanceException;
use App\Services\Attendance\LocationService;
use App\Services\Audit\AuditLogger;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ClockOut
{
    public function __construct(
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

        if (! $employee->is_active || ! $employee->tenant || ! $employee->tenant->is_active) {
            throw AttendanceException::make(
                AttendanceException::LOCATION_UNAVAILABLE,
                'Petugas atau tenant tidak aktif.',
                [],
                422,
            );
        }

        $attendance = Attendance::where('employee_id', $employee->id)
            ->where('attendance_date', $date->toDateString())
            ->whereNull('clock_out')
            ->first();

        if (! $attendance) {
            if (Attendance::where('employee_id', $employee->id)->where('attendance_date', $date->toDateString())->exists()) {
                throw AttendanceException::make(
                    AttendanceException::ALREADY_CLOCKED_OUT,
                    'Anda sudah melakukan absensi pulang.',
                    [],
                    409,
                );
            }

            throw AttendanceException::make(
                AttendanceException::CLOCK_IN_REQUIRED,
                'Anda belum melakukan absensi masuk.',
                [],
                422,
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
                subjectType: Attendance::class,
                subjectId: $attendance->id,
                newValues: array_merge($locResult->jsonSerialize(), ['attempt' => 'clock_out']),
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

        $clockIn = $attendance->clock_in instanceof Carbon
            ? $attendance->clock_in
            : Carbon::parse($attendance->clock_in);
        $workDurationMinutes = (int) $clockIn->diffInMinutes($now);
        $status = $attendance->status instanceof AttendanceStatus
            ? $attendance->status
            : AttendanceStatus::from($attendance->status);

        return DB::transaction(function () use (
            $attendance,
            $employee,
            $now,
            $latitude,
            $longitude,
            $accuracy,
            $locResult,
            $workDurationMinutes,
            $request,
        ) {
            $attendance->update([
                'clock_out' => $now,
                'clock_out_latitude' => $latitude,
                'clock_out_longitude' => $longitude,
                'clock_out_accuracy' => $accuracy,
                'clock_out_distance' => round($locResult->distance, 2),
                'work_duration_minutes' => $workDurationMinutes,
                'clock_out_ip' => $request?->ip(),
                'clock_out_user_agent' => $request?->userAgent() !== null
                    ? mb_substr($request->userAgent(), 0, 1000)
                    : null,
            ]);

            AuditLogger::log(
                AuditLogger::CLOCK_OUT,
                tenantId: $employee->tenant_id,
                subjectType: Attendance::class,
                subjectId: $attendance->id,
                newValues: [
                    'clock_out' => $now->toIso8601String(),
                    'work_duration_minutes' => $workDurationMinutes,
                    'distance' => round($locResult->distance, 2),
                ],
                request: $request,
            );

            return $attendance->refresh();
        });
    }
}
