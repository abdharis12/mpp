<?php

namespace App\Services\Audit;

use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;

class AuditLogger
{
    public const CLOCK_IN = 'CLOCK_IN';

    public const CLOCK_OUT = 'CLOCK_OUT';

    public const ATTENDANCE_REJECTED = 'ATTENDANCE_REJECTED';

    public const ATTENDANCE_ATTEMPT_ON_HOLIDAY = 'ATTENDANCE_ATTEMPT_ON_HOLIDAY';

    public const ATTENDANCE_ATTEMPT_OUTSIDE_RADIUS = 'ATTENDANCE_ATTEMPT_OUTSIDE_RADIUS';

    public const GPS_ACCURACY_FAILED = 'GPS_ACCURACY_FAILED';

    public const LOCATION_VALIDATION_FAILED = 'LOCATION_VALIDATION_FAILED';

    public const LOCATION_CREATED = 'LOCATION_CREATED';

    public const LOCATION_UPDATED = 'LOCATION_UPDATED';

    public const LEAVE_CREATED = 'LEAVE_CREATED';

    public const LEAVE_APPROVED = 'LEAVE_APPROVED';

    public const ATTENDANCE_CORRECTION_CREATED = 'ATTENDANCE_CORRECTION_CREATED';

    public static function log(
        string $event,
        ?int $userId = null,
        ?int $tenantId = null,
        ?string $subjectType = null,
        int|string|null $subjectId = null,
        ?array $oldValues = null,
        ?array $newValues = null,
        ?array $metadata = null,
        ?Request $request = null,
    ): AuditLog {
        return AuditLog::create(
            Arr::whereNotNull([
                'user_id' => $userId ?? auth()->id(),
                'tenant_id' => $tenantId,
                'event' => $event,
                'subject_type' => $subjectType,
                'subject_id' => $subjectId,
                'old_values' => $oldValues,
                'new_values' => $newValues,
                'metadata' => $metadata,
                'ip_address' => $request?->ip() ?? request()->ip(),
                'user_agent' => $request?->userAgent() ?? request()->userAgent(),
                'created_at' => now(),
            ])
        );
    }
}
