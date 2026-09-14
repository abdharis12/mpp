<?php

namespace App\Http\Controllers;

use App\Models\Holiday;
use App\Models\HolidayPeriod;
use App\Services\NotificationService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Inertia\Response;

class HolidayController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', Holiday::class);

        $holidays = Holiday::with('periods')
            ->when($request->input('year'), fn ($q, $y) => $q->whereYear('start_date', $y))
            ->when($request->input('type'), fn ($q, $t) => $q->where('holiday_type', $t))
            ->orderByDesc('start_date')
            ->paginate(15);

        return Inertia::render('holidays/index', compact('holidays'));
    }

    public function create(): Response
    {
        $this->authorize('create', Holiday::class);

        return Inertia::render('holidays/form', [
            'holiday' => null,
            'holiday_types' => config('attendance.holiday_types'),
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', Holiday::class);

        $data = $this->validateHoliday($request);
        $periods = $data['periods'];

        if ($periods === [] && $data['is_full_day']) {
            $periods = $this->buildFullDayPeriods($data['start_date'], $data['end_date']);
        }

        DB::transaction(function () use ($data, $periods) {
            $holiday = Holiday::create([
                'name' => $data['name'],
                'holiday_type' => $data['holiday_type'],
                'start_date' => $data['start_date'],
                'end_date' => $data['end_date'],
                'is_full_day' => $data['is_full_day'],
                'description' => $data['description'] ?? null,
                'is_active' => true,
                'created_by' => auth()->id(),
            ]);

            foreach ($periods as $period) {
                HolidayPeriod::create([
                    'holiday_id' => $holiday->id,
                    'holiday_date' => $period['holiday_date'],
                    'start_time' => $period['is_full_day'] ? null : $period['start_time'],
                    'end_time' => $period['is_full_day'] ? null : $period['end_time'],
                    'is_full_day' => $period['is_full_day'],
                ]);
            }
        });

        NotificationService::notifyUsersWithPermission(
            ['manage_holiday', 'view_attendance'],
            'Hari Libur Baru',
            "Hari libur \"{$data['name']}\" telah ditambahkan.",
            'holiday',
            route('holidays.index'),
        );

        return Redirect::route('holidays.index')->with('success', 'Hari libur berhasil dibuat.');
    }

    public function edit(Holiday $holiday)
    {
        $this->authorize('update', $holiday);

        return Inertia::render('holidays/form', [
            'holiday' => $holiday->load('periods'),
            'holiday_types' => config('attendance.holiday_types'),
        ]);
    }

    public function update(Request $request, Holiday $holiday)
    {
        $this->authorize('update', $holiday);

        $data = $this->validateHoliday($request);
        $periods = $data['periods'];

        if ($periods === [] && $data['is_full_day']) {
            $periods = $this->buildFullDayPeriods($data['start_date'], $data['end_date']);
        }

        DB::transaction(function () use ($data, $periods, $holiday) {
            $holiday->update([
                'name' => $data['name'],
                'holiday_type' => $data['holiday_type'],
                'start_date' => $data['start_date'],
                'end_date' => $data['end_date'],
                'is_full_day' => $data['is_full_day'],
                'description' => $data['description'] ?? null,
                'updated_by' => auth()->id(),
            ]);

            $holiday->periods()->delete();

            foreach ($periods as $period) {
                HolidayPeriod::create([
                    'holiday_id' => $holiday->id,
                    'holiday_date' => $period['holiday_date'],
                    'start_time' => $period['is_full_day'] ? null : $period['start_time'],
                    'end_time' => $period['is_full_day'] ? null : $period['end_time'],
                    'is_full_day' => $period['is_full_day'],
                ]);
            }
        });

        NotificationService::notifyUsersWithPermission(
            ['manage_holiday', 'view_attendance'],
            'Hari Libur Diperbarui',
            "Hari libur \"{$data['name']}\" telah diperbarui.",
            'holiday',
            route('holidays.index'),
        );

        return Redirect::route('holidays.index')->with('success', 'Hari libur berhasil diperbarui.');
    }

    public function deactivate(Holiday $holiday)
    {
        $this->authorize('update', $holiday);
        $holiday->update(['is_active' => false]);

        return Redirect::back()->with('success', 'Hari libur dinonaktifkan.');
    }

    public function activate(Holiday $holiday)
    {
        $this->authorize('update', $holiday);
        $holiday->update(['is_active' => true]);

        return Redirect::back()->with('success', 'Hari libur diaktifkan.');
    }

    public function destroy(Holiday $holiday)
    {
        $this->authorize('update', $holiday);
        $holiday->delete();

        return Redirect::route('holidays.index')->with('success', 'Hari libur berhasil dihapus.');
    }

    /**
     * @return list<array{ holiday_date: string, is_full_day: bool, start_time: null, end_time: null }>
     */
    private function buildFullDayPeriods(string $startDate, string $endDate): array
    {
        $periods = [];
        $cursor = Carbon::parse($startDate);

        while ($cursor->lte(Carbon::parse($endDate))) {
            $periods[] = [
                'holiday_date' => $cursor->toDateString(),
                'is_full_day' => true,
                'start_time' => null,
                'end_time' => null,
            ];

            $cursor->addDay();
        }

        return $periods;
    }

    private function validateHoliday(Request $request): array
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'holiday_type' => 'required|string|in:'.implode(',', config('attendance.holiday_types')),
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'is_full_day' => 'required|boolean',
            'description' => 'nullable|string',
            'periods' => 'nullable|array',
        ]);

        $periods = $data['periods'] ?? [];

        // Frontend mengirim periods sebagai array of JSON-encoded strings agar dapat dikelola secara interaktif.
        $normalized = [];
        foreach ($periods as $value) {
            $decoded = is_string($value) ? json_decode($value, true) : $value;

            if (! is_array($decoded)) {
                continue;
            }

            $validated = Validator::make($decoded, [
                'holiday_date' => 'required|date',
                'is_full_day' => 'required|boolean',
                'start_time' => 'nullable|date_format:H:i',
                'end_time' => 'nullable|date_format:H:i',
            ])->validate();

            if (! $validated['is_full_day']) {
                Validator::make($validated, [
                    'start_time' => 'required',
                    'end_time' => 'required',
                ])->validate();
            }

            $normalized[] = $validated;
        }

        $data['periods'] = $normalized;

        return $data;
    }
}
