<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'holiday_id',
    'holiday_date',
    'start_time',
    'end_time',
    'is_full_day',
])]
class HolidayPeriod extends Model
{
    use HasFactory;

    public function holiday(): BelongsTo
    {
        return $this->belongsTo(Holiday::class);
    }

    protected function casts(): array
    {
        return [
            'holiday_date' => 'date',
            'is_full_day' => 'boolean',
        ];
    }
}
