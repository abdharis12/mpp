<?php

namespace App\Http\Controllers;

use App\Models\AttendanceSchedule;
use App\Models\AttendanceScheduleDay;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Validator;
use Inertia\InertiaResponse;

class AttendanceScheduleController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', AttendanceSchedule::class);

        $schedules = AttendanceSchedule::with('days')
            ->when(auth()->user()->employee && ! auth()->user()->hasPermissionTo('manage_schedule'), fn ($q) => $q->where(function ($q) {
                $q->where('tenant_id', auth()->user()->employee->tenant_id)
                    ->orWhere('employee_id', auth()->user()->employee->id)
                    ->orWhereNull('tenant_id')->whereNull('employee_id');
            }))
            ->with('days')
            ->paginate(15);

        return inertia('schedules/index', compact('schedules'));
    }

    public function create(): InertiaResponse
    {
        $this->authorize('create', AttendanceSchedule::class);

        return inertia('schedules/form', [
            'schedule' => null,
            'days' => collect(range(1, 7))->map(fn ($d) => ['day_of_week' => $d]),
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', AttendanceSchedule::class);

        $data = $this->validateSchedule($request);

        $schedule = AttendanceSchedule::create($data);

        foreach ($data['days'] as $day) {
            AttendanceScheduleDay::create([
                'attendance_schedule_id' => $schedule->id,
                'day_of_week' => $day['day_of_week'],
                'start_time' => $day['start_time'],
                'end_time' => $day['end_time'],
                'is_working_day' => $day['is_working_day'],
            ]);
        }

        return Redirect::route('schedules.index')->with('success', 'Jadwal berhasil dibuat.');
    }

    public function edit(AttendanceSchedule $schedule)
    {
        $this->authorize('update', $schedule);

        return inertia('schedules/form', [
            'schedule' => $schedule->load('days'),
            'days' => collect(range(1, 7))->map(fn ($d) => ['day_of_week' => $d]),
        ]);
    }

    public function update(Request $request, AttendanceSchedule $schedule)
    {
        $this->authorize('update', $schedule);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'grace_period_minutes' => 'required|integer|min:0',
            'is_active' => 'boolean',
            'days' => 'required|array|size:7',
            'days.*.day_of_week' => 'required|integer|between:1,7',
            'days.*.start_time' => 'nullable|date_format:H:i',
            'days.*.end_time' => 'nullable|date_format:H:i',
            'days.*.is_working_day' => 'required|boolean',
        ]);

        $schedule->update($data);

        foreach ($data['days'] as $day) {
            AttendanceScheduleDay::updateOrCreate(
                ['attendance_schedule_id' => $schedule->id, 'day_of_week' => $day['day_of_week']],
                [
                    'start_time' => $day['start_time'],
                    'end_time' => $day['end_time'],
                    'is_working_day' => $day['is_working_day'],
                ]
            );
        }

        return Redirect::route('schedules.index')->with('success', 'Jadwal berhasil diperbarui.');
    }

    public function destroy(AttendanceSchedule $schedule)
    {
        $this->authorize('update', $schedule);
        $schedule->delete();

        return Redirect::route('schedules.index')->with('success', 'Jadwal berhasil dihapus.');
    }

    private function validateSchedule(Request $request): array
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'grace_period_minutes' => 'required|integer|min:0',
            'is_active' => 'boolean',
            'days' => 'required|array|size:7',
        ]);

        $normalized = [];
        foreach ($data['days'] as $value) {
            $decoded = is_string($value) ? json_decode($value, true) : $value;

            if (! is_array($decoded)) {
                continue;
            }

            $normalized[] = Validator::make($decoded, [
                'day_of_week' => 'required|integer|between:1,7',
                'start_time' => 'nullable|date_format:H:i',
                'end_time' => 'nullable|date_format:H:i',
                'is_working_day' => 'required|boolean',
            ])->validate();
        }

        $data['days'] = $normalized;

        return $data;
    }
}
