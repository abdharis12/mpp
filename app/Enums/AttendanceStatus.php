<?php

namespace App\Enums;

enum AttendanceStatus: string
{
    case Present = 'PRESENT';
    case Late = 'LATE';
    case Absent = 'ABSENT';
    case Leave = 'LEAVE';
    case Holiday = 'HOLIDAY';
    case Off = 'OFF';

    public function label(): string
    {
        return match ($this) {
            self::Present => 'Hadir',
            self::Late => 'Terlambat',
            self::Absent => 'Tidak Hadir',
            self::Leave => 'Izin',
            self::Holiday => 'Libur',
            self::Off => 'Luar Jadwal',
        };
    }
}
