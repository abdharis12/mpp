<?php

namespace App\Exports;

use App\Models\Attendance;
use App\Models\User;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class AttendanceExport implements FromQuery, ShouldAutoSize, WithHeadings, WithMapping
{
    public function __construct(
        private readonly string $month,
        private readonly ?int $tenantId = null,
        private readonly ?User $user = null,
    ) {}

    public function query()
    {
        $startDate = $this->month.'-01';
        $endDate = now()->parse($startDate)->endOfMonth()->format('Y-m-d');

        $query = Attendance::query()
            ->with('employee', 'tenant')
            ->whereBetween('attendance_date', [$startDate, $endDate]);

        $tenantId = $this->tenantId;

        if ($tenantId === null && $this->user?->employee && ! $this->user->hasPermissionTo('manage_attendance')) {
            $tenantId = $this->user->employee->tenant_id;
        }

        if ($tenantId) {
            $query->where('tenant_id', $tenantId);
        }

        return $query->orderBy('attendance_date')->orderBy('employee_id');
    }

    public function headings(): array
    {
        return [
            'Nama',
            'Kode',
            'Tenant',
            'Tanggal',
            'Jam Masuk',
            'Jam Keluar',
            'Status',
            'Terlambat (mnt)',
            'Pulang Cepat (mnt)',
            'Durasi Kerja (mnt)',
        ];
    }

    public function map($attendance): array
    {
        return [
            $attendance->employee->name,
            $attendance->employee->employee_code,
            $attendance->tenant->name,
            $attendance->attendance_date->format('d/m/Y'),
            $attendance->clock_in?->format('H:i'),
            $attendance->clock_out?->format('H:i'),
            $attendance->status->label(),
            $attendance->late_minutes,
            $attendance->early_leave_minutes,
            $attendance->work_duration_minutes,
        ];
    }
}
