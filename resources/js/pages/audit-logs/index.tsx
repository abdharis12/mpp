import { Head, router, usePage } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Shield, Filter, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { useState } from 'react';

const EVENT_LABELS: Record<string, string> = {
    CLOCK_IN: 'Clock In',
    CLOCK_OUT: 'Clock Out',
    ATTENDANCE_REJECTED: 'Absensi Ditolak',
    ATTENDANCE_ATTEMPT_ON_HOLIDAY: 'Coba Absen di Hari Libur',
    ATTENDANCE_ATTEMPT_OUTSIDE_RADIUS: 'Absen di Luar Radius',
    GPS_ACCURACY_FAILED: 'GPS Akurasi Gagal',
    LOCATION_VALIDATION_FAILED: 'Validasi Lokasi Gagal',
    LOCATION_CREATED: 'Lokasi Dibuat',
    LOCATION_UPDATED: 'Lokasi Diperbarui',
    LEAVE_CREATED: 'Izin Diajukan',
    LEAVE_APPROVED: 'Izin Disetujui',
    ATTENDANCE_CORRECTION_CREATED: 'Koreksi Diajukan',
};

const EVENT_COLORS: Record<string, string> = {
    CLOCK_IN: 'bg-emerald-50 text-emerald-700',
    CLOCK_OUT: 'bg-blue-50 text-blue-700',
    ATTENDANCE_REJECTED: 'bg-red-50 text-red-700',
    ATTENDANCE_ATTEMPT_ON_HOLIDAY: 'bg-amber-50 text-amber-700',
    ATTENDANCE_ATTEMPT_OUTSIDE_RADIUS: 'bg-orange-50 text-orange-700',
    GPS_ACCURACY_FAILED: 'bg-rose-50 text-rose-700',
    LOCATION_VALIDATION_FAILED: 'bg-red-50 text-red-700',
    LOCATION_CREATED: 'bg-sky-50 text-sky-700',
    LOCATION_UPDATED: 'bg-sky-50 text-sky-700',
    LEAVE_CREATED: 'bg-purple-50 text-purple-700',
    LEAVE_APPROVED: 'bg-emerald-50 text-emerald-700',
    ATTENDANCE_CORRECTION_CREATED: 'bg-indigo-50 text-indigo-700',
};

type AuditLog = {
    id: number;
    user_id: number | null;
    tenant_id: number | null;
    event: string;
    subject_type: string | null;
    subject_id: number | null;
    metadata: Record<string, any> | null;
    ip_address: string | null;
    created_at: string;
    user?: { name: string; email: string } | null;
    tenant?: { name: string } | null;
};

type Pagination = {
    data: AuditLog[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
};

type Filters = {
    event?: string;
    user_id?: string;
    tenant_id?: string;
    date_from?: string;
    date_to?: string;
};

export default function AuditLogIndex({
    logs,
    filters,
}: {
    logs: Pagination;
    filters: Filters;
}) {
    const [filterValues, setFilterValues] = useState<Filters>(filters);

    const applyFilters = () => {
        const params: Record<string, string> = {};
        if (filterValues.event) params.event = filterValues.event;
        if (filterValues.user_id) params.user_id = filterValues.user_id;
        if (filterValues.tenant_id) params.tenant_id = filterValues.tenant_id;
        if (filterValues.date_from) params.date_from = filterValues.date_from;
        if (filterValues.date_to) params.date_to = filterValues.date_to;

        router.get('/audit-logs', params, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setFilterValues({});
        router.get('/audit-logs', {}, { preserveState: true, replace: true });
    };

    return (
        <>
            <Head title="Log Aktivitas" />
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold">Log Aktivitas</h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Jejak aktivitas sistem untuk audit dan keamanan
                    </p>
                </div>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-wrap items-end gap-4">
                            <div className="grid gap-2">
                                <Label className="text-xs">Event</Label>
                                <Input
                                    placeholder="Cari event..."
                                    value={filterValues.event ?? ''}
                                    onChange={(e) =>
                                        setFilterValues({
                                            ...filterValues,
                                            event: e.target.value,
                                        })
                                    }
                                    className="w-[180px]"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-xs">Tanggal Dari</Label>
                                <Input
                                    type="date"
                                    value={filterValues.date_from ?? ''}
                                    onChange={(e) =>
                                        setFilterValues({
                                            ...filterValues,
                                            date_from: e.target.value,
                                        })
                                    }
                                    className="w-[160px]"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-xs">
                                    Tanggal Sampai
                                </Label>
                                <Input
                                    type="date"
                                    value={filterValues.date_to ?? ''}
                                    onChange={(e) =>
                                        setFilterValues({
                                            ...filterValues,
                                            date_to: e.target.value,
                                        })
                                    }
                                    className="w-[160px]"
                                />
                            </div>
                            <Button onClick={applyFilters} className="gap-2">
                                <Filter className="h-4 w-4" />
                                Filter
                            </Button>
                            <Button variant="ghost" onClick={clearFilters}>
                                Reset
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="overflow-hidden p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50">
                                    <tr className="text-muted-foreground text-left text-xs tracking-wider uppercase">
                                        <th className="px-4 py-3 font-medium">
                                            Waktu
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Event
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Pengguna
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Tenant
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            IP Address
                                        </th>
                                        <th className="px-4 py-3 text-right font-medium">
                                            Detail
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-border divide-y">
                                    {logs.data.map((log) => (
                                        <tr
                                            key={log.id}
                                            className="hover:bg-muted/30"
                                        >
                                            <td className="text-muted-foreground px-4 py-3 text-xs whitespace-nowrap">
                                                {new Date(
                                                    log.created_at,
                                                ).toLocaleString('id-ID', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    second: '2-digit',
                                                })}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        EVENT_COLORS[
                                                            log.event
                                                        ] ??
                                                        'bg-gray-50 text-gray-700'
                                                    }
                                                >
                                                    {EVENT_LABELS[log.event] ??
                                                        log.event}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3">
                                                {log.user ? (
                                                    <div>
                                                        <p className="font-medium">
                                                            {log.user.name}
                                                        </p>
                                                        <p className="text-muted-foreground text-xs">
                                                            {log.user.email}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground">
                                                        -
                                                    </span>
                                                )}
                                            </td>
                                            <td className="text-muted-foreground px-4 py-3">
                                                {log.tenant?.name ?? '-'}
                                            </td>
                                            <td className="text-muted-foreground px-4 py-3 font-mono text-xs">
                                                {log.ip_address ?? '-'}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                {log.metadata && (
                                                    <Badge
                                                        variant="secondary"
                                                        className="text-xs"
                                                    >
                                                        <Eye className="mr-1 h-3 w-3" />
                                                        {
                                                            Object.keys(
                                                                log.metadata,
                                                            ).length
                                                        }{' '}
                                                        field
                                                    </Badge>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {logs.data.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="text-muted-foreground px-4 py-12 text-center"
                                            >
                                                <Shield className="mx-auto mb-2 h-8 w-8 opacity-40" />
                                                Belum ada log aktivitas.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {logs.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-muted-foreground text-sm">
                            Menampilkan {logs.data.length} dari {logs.total} log
                        </p>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={logs.current_page <= 1}
                                onClick={() =>
                                    router.get(
                                        `/audit-logs?page=${logs.current_page - 1}`,
                                        {},
                                        { preserveState: true, replace: true },
                                    )
                                }
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Sebelumnya
                            </Button>
                            <span className="text-muted-foreground text-sm">
                                {logs.current_page} / {logs.last_page}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={logs.current_page >= logs.last_page}
                                onClick={() =>
                                    router.get(
                                        `/audit-logs?page=${logs.current_page + 1}`,
                                        {},
                                        { preserveState: true, replace: true },
                                    )
                                }
                            >
                                Berikutnya
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

AuditLogIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Log Aktivitas', href: '/audit-logs' },
    ],
};
