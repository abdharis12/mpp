<?php

namespace App\Http\Controllers;

use App\Http\Requests\Tenant\StoreTenantRequest;
use App\Http\Requests\Tenant\UpdateTenantRequest;
use App\Models\Tenant;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class TenantController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user();
        $tenants = Tenant::query()
            ->when($user->employee, fn ($q) => $q->where('id', $user->employee->tenant_id))
            ->orderBy('name')
            ->paginate(15);

        return Inertia::render('tenants/index', compact('tenants'));
    }

    public function create(): Response
    {
        $this->authorize('create', Tenant::class);

        return Inertia::render('tenants/form', [
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

        return Inertia::render('tenants/form', [
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
