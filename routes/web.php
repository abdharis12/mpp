<?php

use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\AttendanceCorrectionController;
use App\Http\Controllers\AttendanceLocationController;
use App\Http\Controllers\AttendanceReportController;
use App\Http\Controllers\AttendanceScheduleController;
use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\HolidayController;
use App\Http\Controllers\LeaveController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\TenantController;
use App\Http\Controllers\WelcomeController;
use Illuminate\Support\Facades\Route;

Route::get('/', [WelcomeController::class, 'index'])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::prefix('attendance')->name('attendance.')->group(function () {
        Route::get('today', [AttendanceController::class, 'today'])->name('today');

        Route::post('clock-in', [AttendanceController::class, 'clockIn'])
            ->name('clock-in')
            ->middleware('throttle:attendance');

        Route::post('clock-out', [AttendanceController::class, 'clockOut'])
            ->name('clock-out')
            ->middleware('throttle:attendance');
    });

    Route::resource('tenants', TenantController::class)->except(['show']);

    Route::resource('employees', EmployeeController::class)->except(['show']);

    Route::get('locations', [AttendanceLocationController::class, 'index'])->name('locations.index');
    Route::patch('locations/{location}', [AttendanceLocationController::class, 'update'])->name('locations.update');

    Route::resource('schedules', AttendanceScheduleController::class)->except(['show']);

    Route::get('holidays', [HolidayController::class, 'index'])->name('holidays.index');
    Route::get('holidays/create', [HolidayController::class, 'create'])->name('holidays.create');
    Route::post('holidays', [HolidayController::class, 'store'])->name('holidays.store');
    Route::get('holidays/{holiday}/edit', [HolidayController::class, 'edit'])->name('holidays.edit');
    Route::put('holidays/{holiday}', [HolidayController::class, 'update'])->name('holidays.update');
    Route::post('holidays/{holiday}/deactivate', [HolidayController::class, 'deactivate'])->name('holidays.deactivate');
    Route::post('holidays/{holiday}/activate', [HolidayController::class, 'activate'])->name('holidays.activate');
    Route::delete('holidays/{holiday}', [HolidayController::class, 'destroy'])->name('holidays.destroy');

    Route::get('leaves', [LeaveController::class, 'index'])->name('leaves.index');
    Route::get('leaves/create', [LeaveController::class, 'create'])->name('leaves.create');
    Route::post('leaves', [LeaveController::class, 'store'])->name('leaves.store');
    Route::post('leaves/{leave}/approve', [LeaveController::class, 'approve'])->name('leaves.approve');
    Route::post('leaves/{leave}/reject', [LeaveController::class, 'reject'])->name('leaves.reject');
    Route::post('leaves/{leave}/cancel', [LeaveController::class, 'cancel'])->name('leaves.cancel');

    Route::get('corrections', [AttendanceCorrectionController::class, 'index'])->name('corrections.index');
    Route::get('corrections/create', [AttendanceCorrectionController::class, 'create'])->name('corrections.create');
    Route::post('corrections', [AttendanceCorrectionController::class, 'store'])->name('corrections.store');
    Route::post('corrections/{correction}/approve', [AttendanceCorrectionController::class, 'approve'])->name('corrections.approve');
    Route::post('corrections/{correction}/reject', [AttendanceCorrectionController::class, 'reject'])->name('corrections.reject');

    Route::get('notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('notifications/{notification}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::post('notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');

    Route::get('reports/attendance', [AttendanceReportController::class, 'index'])->name('reports.attendance');
    Route::get('reports/attendance/export', [AttendanceReportController::class, 'exportExcel'])->name('reports.attendance.export');
    Route::get('reports/attendance/pdf', [AttendanceReportController::class, 'exportPdf'])->name('reports.attendance.pdf');

    Route::get('audit-logs', [AuditLogController::class, 'index'])->name('audit-logs.index');
});

require __DIR__.'/settings.php';
