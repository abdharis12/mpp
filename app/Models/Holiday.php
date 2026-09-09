<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'name',
    'holiday_type',
    'start_date',
    'end_date',
    'is_full_day',
    'description',
    'is_active',
    'created_by',
    'updated_by',
])]
class Holiday extends Model
{
    use HasFactory, SoftDeletes;

    public function periods(): HasMany
    {
        return $this->hasMany(HolidayPeriod::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'is_full_day' => 'boolean',
            'is_active' => 'boolean',
        ];
    }
}
