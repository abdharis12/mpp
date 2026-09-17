<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\AttendanceSchedule;
use App\Models\Employee;
use App\Models\Holiday;
use App\Models\Tenant;
use App\Models\VisitorReview;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Builder;
use Inertia\Inertia;
use Inertia\Response;

class WelcomeController extends Controller
{
    public function index(): Response
    {
        $today = now()->toDateString();
        $firstOfMonth = now()->startOfMonth()->toDateString();

        // Stats — factual, transparently labeled "Data operasional internal MPP"
        $stats = [
            'tenants' => Tenant::where('is_active', true)->count(),
            'employees' => Employee::where('is_active', true)->count(),
            'present_today' => Attendance::onDate($today)
                ->whereIn('status', ['PRESENT', 'LATE'])
                ->count(),
            'monthly_attendance' => Attendance::forDateRange($firstOfMonth, $today)->count(),
        ];

        // Tenants whose staff are present today (status PRESENT/LATE)
        $activeTenantsToday = Tenant::query()
            ->where('is_active', true)
            ->whereHas(
                'attendances',
                fn (Builder $q) => $q->onDate($today)->whereIn('status', ['PRESENT', 'LATE'])
            )
            ->withCount([
                'attendances as present_today_count' => fn (Builder $q) => $q->onDate($today)->whereIn('status', ['PRESENT', 'LATE']),
            ])
            ->orderBy('name')
            ->get()
            ->map(fn (Tenant $tenant) => [
                'id' => $tenant->id,
                'code' => $tenant->code,
                'name' => $tenant->name,
                'present_count' => $tenant->present_today_count,
            ])
            ->values();

        // Tenants + their services
        $tenants = Tenant::with([
            'services' => fn ($q) => $q->where('is_active', true),
        ])
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        // Schedule from DB — grouped consecutive days with same hours
        $schedule = $this->buildScheduleDisplay();

        // Today's specific schedule for the status board
        $todayDow = (int) CarbonImmutable::now('Asia/Jakarta')->format('N');
        $todayRow = collect($schedule)->first(
            fn (array $row) => in_array($todayDow, $row['day_numbers'])
        );

        $todayHoliday = Holiday::where('is_active', true)
            ->where('start_date', '<=', $today)
            ->where('end_date', '>=', $today)
            ->value('name');

        // Reviews — visible only
        $reviews = VisitorReview::where('is_visible', true)
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('welcome', [
            'tenants' => $tenants,
            'stats' => $stats,
            'activeTenantsToday' => $activeTenantsToday,
            'schedule' => $schedule,
            'today' => [
                'is_working_day' => $todayRow['is_working_day'] ?? false,
                'start' => $todayRow['start'] ?? null,
                'end' => $todayRow['end'] ?? null,
                'label' => $todayRow['label'] ?? null,
                'holiday' => $todayHoliday,
            ],
            'reviews' => $reviews,
            'embedsocialRef' => config('instagram.embedsocial_ref'),
        ]);
    }

    private function buildScheduleDisplay(): array
    {
        $attendanceSchedule = AttendanceSchedule::where('name', 'Default MPP')
            ->whereNull('tenant_id')
            ->whereNull('employee_id')
            ->first();

        if (! $attendanceSchedule) {
            return [
                ['label' => 'Senin – Jumat', 'hours' => '08.00 – 16.00', 'day_numbers' => [1, 2, 3, 4, 5], 'is_working_day' => true, 'start' => '08:00', 'end' => '16:00'],
                ['label' => 'Sabtu – Minggu', 'hours' => 'Libur',        'day_numbers' => [6, 7],           'is_working_day' => false, 'start' => null, 'end' => null],
            ];
        }

        $days = $attendanceSchedule->days()->orderBy('day_of_week')->get();

        $weekdayNames = [
            1 => 'Senin', 2 => 'Selasa', 3 => 'Rabu', 4 => 'Kamis',
            5 => 'Jumat', 6 => 'Sabtu', 7 => 'Minggu',
        ];

        // Group consecutive days with the same schedule
        $groups = [];
        $current = null;

        foreach ($days as $day) {
            $key = $day->is_working_day
                ? "{$day->start_time}-{$day->end_time}"
                : 'off';

            if ($current && $current['key'] === $key) {
                $current['day_numbers'][] = $day->day_of_week;
            } else {
                if ($current) {
                    $groups[] = $current;
                }
                $current = [
                    'key' => $key,
                    'day_numbers' => [$day->day_of_week],
                    'start' => $day->start_time,
                    'end' => $day->end_time,
                    'is_working_day' => $day->is_working_day,
                ];
            }
        }
        if ($current) {
            $groups[] = $current;
        }

        // Format into display rows
        $fmt = fn (?string $t) => $t
            ? CarbonImmutable::parse($t)->format('H.i')
            : null;

        return array_map(function (array $g) use ($weekdayNames, $fmt) {
            $first = $weekdayNames[$g['day_numbers'][0]] ?? '';
            $last = $weekdayNames[end($g['day_numbers'])] ?? '';

            $label = count($g['day_numbers']) > 1
                ? "{$first} – {$last}"
                : $first;

            $hours = $g['is_working_day']
                ? "{$fmt($g['start'])} – {$fmt($g['end'])}"
                : 'Libur';

            return [
                'label' => $label,
                'hours' => $hours,
                'day_numbers' => $g['day_numbers'],
                'is_working_day' => $g['is_working_day'],
                'start' => $g['start'],
                'end' => $g['end'],
            ];
        }, $groups);
    }
}
