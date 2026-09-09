<?php

namespace App\Http\Controllers;

use App\Http\Requests\Employee\StoreEmployeeRequest;
use App\Http\Requests\Employee\UpdateEmployeeRequest;
use App\Models\Employee;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Inertia\InertiaResponse;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $employees = Employee::query()
            ->with('user', 'tenant')
            ->when($user->employee, fn ($q) => $q->where('tenant_id', $user->employee->tenant_id))
            ->when($request->input('search'), fn ($q, $s) => $q->where(function ($q2) use ($s) {
                $q2->where('name', 'LIKE', "%{$s}%")
                    ->orWhere('employee_code', 'LIKE', "%{$s}%")
                    ->orWhere('email', 'LIKE', "%{$s}%");
            }))
            ->when($request->input('status'), fn ($q, $s) => $q->where('is_active', $s === 'active'))
            ->orderBy('name')
            ->paginate(15);

        return inertia('employees/index', compact('employees'));
    }

    public function create(): InertiaResponse
    {
        $this->authorize('create', Employee::class);
        $tenants = Tenant::where('is_active', true)->orderBy('name')->get();

        return inertia('employees/form', [
            'employee' => null,
            'tenants' => $tenants,
        ]);
    }

    public function store(StoreEmployeeRequest $request)
    {
        $this->authorize('create', Employee::class);

        DB::transaction(function () use ($request) {
            $user = User::create([
                'name' => $request->input('name'),
                'email' => $request->input('email'),
                'password' => $request->input('password'),
                'is_active' => true,
            ]);

            $user->assignRole('tenant_staff');

            Employee::create([
                'user_id' => $user->id,
                'tenant_id' => $request->input('tenant_id'),
                'employee_code' => $request->input('employee_code'),
                'name' => $request->input('name'),
                'position' => $request->input('position'),
                'phone' => $request->input('phone'),
                'email' => $request->input('email'),
                'is_active' => $request->boolean('is_active', true),
            ]);
        });

        return Redirect::route('employees.index')->with('success', 'Petugas berhasil dibuat.');
    }

    public function edit(Employee $employee)
    {
        $this->authorize('update', $employee);
        $tenants = Tenant::where('is_active', true)->orderBy('name')->get();

        return inertia('employees/form', [
            'employee' => $employee->load('user'),
            'tenants' => $tenants,
        ]);
    }

    public function update(UpdateEmployeeRequest $request, Employee $employee)
    {
        $this->authorize('update', $employee);

        DB::transaction(function () use ($request, $employee) {
            $employee->update($request->validated());
            $employee->user->update([
                'name' => $request->input('name', $employee->name),
            ]);
        });

        return Redirect::route('employees.index')->with('success', 'Petugas berhasil diperbarui.');
    }

    public function destroy(Employee $employee)
    {
        $this->authorize('update', $employee);

        DB::transaction(function () use ($employee) {
            $employee->user->delete();
            $employee->delete();
        });

        return Redirect::route('employees.index')->with('success', 'Petugas berhasil dihapus.');
    }
}
