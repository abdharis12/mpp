<?php

namespace Database\Factories;

use App\Models\VisitorReview;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<VisitorReview>
 */
class VisitorReviewFactory extends Factory
{
    protected $model = VisitorReview::class;

    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'origin' => fake()->company(),
            'rating' => fake()->numberBetween(3, 5),
            'body' => fake()->paragraph(),
            'youtube_url' => null,
            'is_visible' => true,
            'sort_order' => fake()->numberBetween(1, 100),
        ];
    }
}
