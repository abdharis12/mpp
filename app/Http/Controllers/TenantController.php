<?php

namespace App\Http\Controllers;

use App\Http\Requests\Tenant\StoreTenantRequest;
use App\Http\Requests\Tenant\UpdateTenantRequest;
use App\Models\Tenant;
use Illuminate\Support\Facades\Redirect;
use Inertia\InertiaResponse;

class TenantController extends Controller
{
    public function index(): InertiaResponse
    {
        $user = auth()->user();
        $tenants = Tenant::query()
            ->when($user->employee, fn ($q) => $q->where('id', $user->employee->tenant_id))
            ->orderBy('name')
            ->paginate(15);

        return inertia('tenants/index', compact('tenants'));
    }

    public function create(): InertiaResponse
    {
        $this->authorize('create', Tenant::class);

        return inertia('tenants/form', [
            'tenant' => null,
        ]);
    }

    public function store(StoreTenantRequest $request)
    {
        $this->authorize('create', Tenant::class);

        Tenant::create($request->validated());

        return Redirect::route('tenants.index')->with('success', 'Tenant berhasil dibuat.');
    }

    public function edit(Tenant $tenant)
    {
        $this->authorize('update', $tenant);

        return inertia('tenants/form', [
            'tenant' => $tenant,
        ]);
    }

    public function update(UpdateTenantRequest $request, Tenant $tenant)
    {
        $this->authorize('update', $tenant);

        $tenant->update($request->validated());

        return Redirect::route('tenants.index')->with('success', 'Tenant berhasil diperbarui.');
    }

    public function destroy(Tenant $tenant)
    {
        $this->authorize('delete', $tenant);

        $tenant->delete();

        return Redirect::route('tenants.index')->with('success', 'Tenant berhasil dihapus.');
    }
}
