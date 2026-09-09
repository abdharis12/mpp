<?php

namespace App\Services\Attendance\Data;

use JsonSerializable;

final readonly class LocationResult implements JsonSerializable
{
    public function __construct(
        public bool $valid,
        public float $distance,
        public float $radius,
        public float $accuracy,
        public float $maximumAccuracy,
        public ?string $reason = null,
    ) {}

    public static function valid(
        float $distance,
        float $radius,
        float $accuracy,
        float $maximumAccuracy,
    ): self {
        return new self(true, $distance, $radius, $accuracy, $maximumAccuracy);
    }

    public static function invalid(
        string $reason,
        float $distance,
        float $radius,
        float $accuracy,
        float $maximumAccuracy,
    ): self {
        return new self(false, $distance, $radius, $accuracy, $maximumAccuracy, $reason);
    }

    public function jsonSerialize(): array
    {
        return [
            'valid' => $this->valid,
            'distance' => round($this->distance, 2),
            'radius' => $this->radius,
            'accuracy' => round($this->accuracy, 2),
            'maximum_accuracy' => $this->maximumAccuracy,
            'reason' => $this->reason,
        ];
    }
}
