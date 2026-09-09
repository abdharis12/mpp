<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'code',
    'name',
    'description',
    'requires_attachment',
    'is_active',
])]
class LeaveType extends Model
{
    use HasFactory, SoftDeletes;

    public function leaves(): HasMany
    {
        return $this->hasMany(Leave::class);
    }

    protected function casts(): array
    {
        return [
            'requires_attachment' => 'boolean',
            'is_active' => 'boolean',
        ];
    }
}
