<?php

namespace App\Services\Attendance\Exceptions;

use Illuminate\Http\JsonResponse;
use RuntimeException;

class AttendanceException extends RuntimeException
{
    public const NOT_WORKING_DAY = 'NOT_WORKING_DAY';

    public const HOLIDAY = 'HOLIDAY';

    public const OUTSIDE_ATTENDANCE_WINDOW = 'OUTSIDE_ATTENDANCE_WINDOW';

    public const ALREADY_CLOCKED_IN = 'ALREADY_CLOCKED_IN';

    public const ALREADY_CLOCKED_OUT = 'ALREADY_CLOCKED_OUT';

    public const CLOCK_IN_REQUIRED = 'CLOCK_IN_REQUIRED';

    public const OUTSIDE_RADIUS = 'OUTSIDE_RADIUS';

    public const GPS_ACCURACY_TOO_LOW = 'GPS_ACCURACY_TOO_LOW';

    public const LOCATION_UNAVAILABLE = 'LOCATION_UNAVAILABLE';

    public const LOCATION_VALIDATION_FAILED = 'LOCATION_VALIDATION_FAILED';

    public const EMPLOYEE_NOT_FOUND = 'EMPLOYEE_NOT_FOUND';

    public function __construct(
        string $errorCode,
        string $message,
        private readonly array $details = [],
        private readonly int $statusCode = 422
    ) {
        parent::__construct($message);
        $this->errorCode = $errorCode;
    }

    public string $errorCode;

    public static function make(string $code, string $message, array $details = [], int $statusCode = 422): self
    {
        return new self($code, $message, $details, $statusCode);
    }

    public function errorCode(): string
    {
        return $this->errorCode;
    }

    public function details(): array
    {
        return $this->details;
    }

    public function statusCode(): int
    {
        return $this->statusCode;
    }

    public function render(): JsonResponse
    {
        $payload = [
            'message' => $this->getMessage(),
            'code' => $this->errorCode,
        ];

        if ($this->details !== []) {
            $payload['details'] = $this->details;
        }

        return response()->json($payload, $this->statusCode);
    }
}
