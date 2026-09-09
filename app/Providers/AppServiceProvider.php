<?php

namespace App\Providers;

use App\Models\Attendance;
use App\Models\AttendanceCorrection;
use App\Models\AttendanceLocation;
use App\Models\AttendanceSchedule;
use App\Models\Employee;
use App\Models\Holiday;
use App\Models\Leave;
use App\Models\Tenant;
use App\Models\User;
use App\Policies\AttendanceCorrectionPolicy;
use App\Policies\AttendancePolicy;
use App\Policies\AttendanceSchedulePolicy;
use App\Policies\EmployeePolicy;
use App\Policies\HolidayPolicy;
use App\Policies\LeavePolicy;
use App\Policies\LocationPolicy;
use App\Policies\TenantPolicy;
use Carbon\CarbonImmutable;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
        $this->registerPolicies();
        $this->configureRateLimiters();
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }

    private function registerPolicies(): void
    {
        Gate::policy(Attendance::class, AttendancePolicy::class);
        Gate::policy(Tenant::class, TenantPolicy::class);
        Gate::policy(Employee::class, EmployeePolicy::class);
        Gate::policy(AttendanceLocation::class, LocationPolicy::class);
        Gate::policy(AttendanceSchedule::class, AttendanceSchedulePolicy::class);
        Gate::policy(Holiday::class, HolidayPolicy::class);
        Gate::policy(Leave::class, LeavePolicy::class);
        Gate::policy(AttendanceCorrection::class, AttendanceCorrectionPolicy::class);

        Gate::define('clockIn', fn (User $user) => $user->is_active && $user->employee && $user->employee->is_active && $user->employee->tenant->is_active && $user->hasPermissionTo('clock_in'));
        Gate::define('clockOut', fn (User $user) => $user->is_active && $user->employee && $user->employee->is_active && $user->employee->tenant->is_active && $user->hasPermissionTo('clock_out'));
        Gate::define('viewToday', fn (User $user) => $user->is_active && $user->employee && $user->employee->is_active && $user->employee->tenant->is_active && $user->hasAnyPermission(['view_attendance', 'clock_in', 'clock_out']));
    }

    private function configureRateLimiters(): void
    {
        RateLimiter::for('attendance', function (Request $request) {
            $id = $request->user()?->id;

            return Limit::perMinute(10)->by($id ?? $request->ip());
        });
    }
}
