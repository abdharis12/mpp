<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'name',
    'origin',
    'rating',
    'body',
    'youtube_url',
    'is_visible',
    'sort_order',
])]
class VisitorReview extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'rating' => 'integer',
            'is_visible' => 'boolean',
            'sort_order' => 'integer',
        ];
    }
}
