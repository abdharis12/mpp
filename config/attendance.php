<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Attendance Default Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration over hard-code. All values here can be overridden by
    | database configuration (attendance_schedules.grace_period_minutes,
    | attendance_locations.radius_meter, maximum_gps_accuracy).
    |
    */

    'defaults' => [
        'radius_meter' => env('ATTENDANCE_RADIUS_METER', 20.00),
        'maximum_gps_accuracy' => env('ATTENDANCE_MAX_GPS_ACCURACY', 50.00),
        'grace_period_minutes' => env('ATTENDANCE_GRACE_PERIOD_MINUTES', 10),
    ],

    'timezone' => 'Asia/Jakarta',

    'holiday_types' => [
        'NATIONAL_HOLIDAY',
        'JOINT_LEAVE',
        'SPECIAL_HOLIDAY',
        'MPP_CLOSURE',
        'OFFICIAL_EVENT',
        'OTHER',
    ],

    'leave_statuses' => [
        'PENDING',
        'APPROVED',
        'REJECTED',
        'CANCELLED',
    ],

    'correction_statuses' => [
        'PENDING',
        'APPROVED',
        'REJECTED',
        'CANCELLED',
    ],

    'correction_types' => [
        'MISSING_CLOCK_IN',
        'MISSING_CLOCK_OUT',
        'WRONG_CLOCK_IN',
        'WRONG_CLOCK_OUT',
        'OTHER',
    ],

    'attendance_statuses' => [
        'PRESENT',
        'LATE',
        'ABSENT',
        'LEAVE',
        'HOLIDAY',
        'OFF',
    ],
];
