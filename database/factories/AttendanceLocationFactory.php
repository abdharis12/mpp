<?php

namespace Database\Factories;

use App\Models\AttendanceLocation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AttendanceLocation>
 */
class AttendanceLocationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => 'MPP Kabupaten Muara Enim',
            'latitude' => -3.6582,
            'longitude' => 103.9064,
            'radius_meter' => 20.00,
            'maximum_gps_accuracy' => 50.00,
            'is_active' => true,
            'created_by' => null,
            'updated_by' => null,
        ];
    }
}
