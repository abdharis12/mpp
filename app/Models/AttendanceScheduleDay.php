<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'attendance_schedule_id',
    'day_of_week',
    'start_time',
    'end_time',
    'is_working_day',
])]
class AttendanceScheduleDay extends Model
{
    use HasFactory;

    public function schedule(): BelongsTo
    {
        return $this->belongsTo(AttendanceSchedule::class, 'attendance_schedule_id');
    }

    protected function casts(): array
    {
        return [
            'day_of_week' => 'integer',
            'is_working_day' => 'boolean',
        ];
    }
}
