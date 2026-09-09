<?php

namespace App\Services\Attendance;

use App\Models\AttendanceLocation;
use App\Services\Attendance\Data\LocationResult;

class LocationService
{
    private const EARTH_RADIUS_METERS = 6371000;

    public function distanceBetween(
        float $latitudeA,
        float $longitudeA,
        float $latitudeB,
        float $longitudeB,
    ): float {
        $latFrom = deg2rad($latitudeA);
        $latTo = deg2rad($latitudeB);
        $latDelta = $latTo - $latFrom;
        $lonDelta = deg2rad($longitudeB) - deg2rad($longitudeA);

        $a = sin($latDelta / 2) ** 2
            + cos($latFrom) * cos($latTo) * sin($lonDelta / 2) ** 2;

        return self::EARTH_RADIUS_METERS * (2 * atan2(sqrt($a), sqrt(1 - $a)));
    }

    public function validate(
        float $latitude,
        float $longitude,
        float $accuracy,
        AttendanceLocation $location,
    ): LocationResult {
        $distance = $this->distanceBetween(
            $latitude,
            $longitude,
            (float) $location->latitude,
            (float) $location->longitude,
        );

        if ($distance > (float) $location->radius_meter) {
            return LocationResult::invalid(
                'OUTSIDE_RADIUS',
                $distance,
                (float) $location->radius_meter,
                $accuracy,
                (float) $location->maximum_gps_accuracy,
            );
        }

        if ($accuracy > (float) $location->maximum_gps_accuracy) {
            return LocationResult::invalid(
                'GPS_ACCURACY_TOO_LOW',
                $distance,
                (float) $location->radius_meter,
                $accuracy,
                (float) $location->maximum_gps_accuracy,
            );
        }

        return LocationResult::valid(
            $distance,
            (float) $location->radius_meter,
            $accuracy,
            (float) $location->maximum_gps_accuracy,
        );
    }
}
