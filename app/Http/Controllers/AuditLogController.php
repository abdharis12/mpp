<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AuditLogController extends Controller
{
    public function index(Request $request): Response
    {
        if (! $request->user()->hasPermissionTo('view_audit_logs')) {
            abort(403);
        }

        $user = $request->user();

        $logs = AuditLog::query()
            ->with('user', 'tenant')
            ->when($user->employee && ! $user->hasPermissionTo('manage_all_tenants'), function ($q) use ($user) {
                $q->where('tenant_id', $user->employee->tenant_id);
            })
            ->when($request->input('event'), fn ($q, $event) => $q->where('event', 'LIKE', "%{$event}%"))
            ->when($request->input('user_id'), fn ($q, $userId) => $q->where('user_id', $userId))
            ->when($request->input('tenant_id'), fn ($q, $tenantId) => $q->where('tenant_id', $tenantId))
            ->when($request->input('date_from'), fn ($q, $date) => $q->whereDate('created_at', '>=', $date))
            ->when($request->input('date_to'), fn ($q, $date) => $q->whereDate('created_at', '<=', $date))
            ->orderByDesc('created_at')
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('audit-logs/index', [
            'logs' => $logs,
            'filters' => $request->only(['event', 'user_id', 'tenant_id', 'date_from', 'date_to']),
        ]);
    }
}
