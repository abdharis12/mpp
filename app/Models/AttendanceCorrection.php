<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'tenant_id',
    'employee_id',
    'attendance_id',
    'requested_by',
    'correction_type',
    'requested_clock_in',
    'requested_clock_out',
    'reason',
    'attachment_path',
    'status',
    'reviewed_by',
    'reviewed_at',
    'rejection_reason',
])]
class AttendanceCorrection extends Model
{
    use HasFactory;

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function attendance(): BelongsTo
    {
        return $this->belongsTo(Attendance::class);
    }

    public function requester(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requested_by');
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    protected function casts(): array
    {
        return [
            'requested_clock_in' => 'datetime',
            'requested_clock_out' => 'datetime',
            'reviewed_at' => 'datetime',
        ];
    }
}
