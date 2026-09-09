<?php

namespace App\Http\Controllers;

use App\Models\AttendanceLocation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class AttendanceLocationController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', AttendanceLocation::class);

        $locations = AttendanceLocation::orderByDesc('is_active')
            ->orderBy('name')
            ->get();

        return Inertia::render('locations/index', compact('locations'));
    }

    public function update(Request $request, AttendanceLocation $location)
    {
        $this->authorize('update', $location);

        $data = $request->validate([
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'radius_meter' => 'required|numeric|min:1',
            'maximum_gps_accuracy' => 'required|numeric|min:1',
            'is_active' => 'boolean',
        ]);

        $location->update($data);

        return Redirect::back()->with('success', 'Lokasi berhasil diperbarui.');
    }
}
