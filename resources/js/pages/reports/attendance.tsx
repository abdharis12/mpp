import { Head, router, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import {
    CalendarCheck,
    AlertCircle,
    Users,
    Clock,
    Download,
    FileText,
    Filter,
} from 'lucide-react';
import { useState } from 'react';

const BLUE = '#123C86';
const YELLOW = '#FFC72C';

type Summary = {
    employee_id: number;
    employee_name: string;
    employee_code: string;
    tenant_name: string;
    tenant_id: number;
    present_count: number;
    late_count: number;
    absent_count: number;
    leave_count: number;
    holiday_count: number;
    early_leave_count: number;
    total_early_leave_minutes: number;
    total_work_duration_minutes: number;
    avg_work_duration_minutes: number;
};

type SummaryStats = {
    total_employees: number;
    total_present: number;
    total_late: number;
    total_absent: number;
    total_leave: number;
    total_early_leave: number;
};

type Tenant = {
    id: number;
    name: string;
};

type Filters = {
    month: string;
    tenant_id: string | null;
};

export default function AttendanceReport({
    summaries,
    summaryStats,
    tenants,
    filters,
}: {
    summaries: Summary[];
    summaryStats: SummaryStats;
    tenants: Tenant[];
    filters: Filters;
}) {
    const [month, setMonth] = useState(filters.month);
    const [tenantId, setTenantId] = useState(filters.tenant_id ?? 'all');

    const applyFilters = () => {
        const params: Record<string, string> = {};
        if (month) params.month = month;
        if (tenantId && tenantId !== 'all') params.tenant_id = tenantId;

        router.get('/reports/attendance', params, {
            preserveState: true,
            replace: true,
        });
    };

    const handleExport = () => {
        const params = new URLSearchParams();
        if (month) params.set('month', month);
        if (tenantId && tenantId !== 'all') params.set('tenant_id', tenantId);
        window.location.href = `/reports/attendance/export?${params.toString()}`;
    };

    const handleExportPdf = () => {
        const params = new URLSearchParams();
        if (month) params.set('month', month);
        if (tenantId && tenantId !== 'all') params.set('tenant_id', tenantId);
        window.location.href = `/reports/attendance/pdf?${params.toString()}`;
    };

    const formatDuration = (minutes: number) => {
        if (!minutes) return '-';
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return h > 0 ? `${h}j ${m}m` : `${m}m`;
    };

    return (
        <>
            <Head title="Laporan Absensi" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Laporan Absensi Bulanan</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Rekap kehadiran petugas per bulan berdasarkan tenant
                        </p>
                    </div>
                    <div className="flex gap-2">
                    <Button
                        onClick={handleExport}
                        variant="outline"
                        className="gap-2"
                    >
                        <Download className="h-4 w-4" />
                        Export Excel
                    </Button>
                    <Button
                        onClick={handleExportPdf}
                        variant="outline"
                        className="gap-2"
                    >
                        <FileText className="h-4 w-4" />
                        Export PDF
                    </Button>
                </div>
                </div>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-wrap items-end gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="month" className="text-xs">Bulan</Label>
                                <Input
                                    id="month"
                                    type="month"
                                    value={month}
                                    onChange={(e) => setMonth(e.target.value)}
                                    className="w-[200px]"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-xs">Tenant</Label>
                                <Select
                                    value={tenantId}
                                    onValueChange={setTenantId}
                                >
                                    <SelectTrigger className="w-[220px]">
                                        <SelectValue placeholder="Semua tenant" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua tenant</SelectItem>
                                        {tenants.map((t) => (
                                            <SelectItem key={t.id} value={String(t.id)}>
                                                {t.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button onClick={applyFilters} className="gap-2">
                                <Filter className="h-4 w-4" />
                                Tampilkan
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
                    <Card className="shadow-sm">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground">Total Petugas</p>
                                    <p className="text-2xl font-bold mt-1">{summaryStats.total_employees}</p>
                                </div>
                                <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
                                    <Users className="h-5 w-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground">Hadir</p>
                                    <p className="text-2xl font-bold mt-1 text-emerald-700">{summaryStats.total_present}</p>
                                </div>
                                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                                    <CalendarCheck className="h-5 w-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground">Terlambat</p>
                                    <p className="text-2xl font-bold mt-1 text-amber-700">{summaryStats.total_late}</p>
                                </div>
                                <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
                                    <Clock className="h-5 w-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground">Pulang Cepat</p>
                                    <p className="text-2xl font-bold mt-1 text-orange-700">{summaryStats.total_early_leave}</p>
                                </div>
                                <div className="p-2 rounded-lg bg-orange-100 text-orange-700">
                                    <Clock className="h-5 w-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground">Izin</p>
                                    <p className="text-2xl font-bold mt-1 text-purple-700">{summaryStats.total_leave}</p>
                                </div>
                                <div className="p-2 rounded-lg bg-purple-100 text-purple-700">
                                    <Users className="h-5 w-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground">Tidak Hadir</p>
                                    <p className="text-2xl font-bold mt-1 text-red-700">{summaryStats.total_absent}</p>
                                </div>
                                <div className="p-2 rounded-lg bg-red-100 text-red-700">
                                    <AlertCircle className="h-5 w-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Rekap Per Petugas</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50">
                                    <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                                        <th className="px-4 py-3 font-medium">Petugas</th>
                                        <th className="px-4 py-3 font-medium">Kode</th>
                                        <th className="px-4 py-3 font-medium">Tenant</th>
                                        <th className="px-4 py-3 font-medium text-center">Hadir</th>
                                        <th className="px-4 py-3 font-medium text-center">Terlambat</th>
                                        <th className="px-4 py-3 font-medium text-center">Pulang Cepat</th>
                                        <th className="px-4 py-3 font-medium text-center">Izin</th>
                                        <th className="px-4 py-3 font-medium text-center">Libur</th>
                                        <th className="px-4 py-3 font-medium text-center">Tidak Hadir</th>
                                        <th className="px-4 py-3 font-medium text-center">Total Jam</th>
                                        <th className="px-4 py-3 font-medium text-center">Rata-rata</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {summaries.map((s) => (
                                        <tr key={s.employee_id} className="hover:bg-muted/30">
                                            <td className="px-4 py-3 font-medium">{s.employee_name}</td>
                                            <td className="px-4 py-3 font-mono text-xs">{s.employee_code}</td>
                                            <td className="px-4 py-3 text-muted-foreground">{s.tenant_name}</td>
                                            <td className="px-4 py-3 text-center">
                                                <Badge className="bg-emerald-100 text-emerald-700 border-0">{s.present_count}</Badge>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <Badge className="bg-amber-100 text-amber-700 border-0">{s.late_count}</Badge>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <Badge className="bg-orange-100 text-orange-700 border-0">
                                                    {s.early_leave_count}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <Badge className="bg-purple-100 text-purple-700 border-0">{s.leave_count}</Badge>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <Badge className="bg-sky-100 text-sky-700 border-0">{s.holiday_count}</Badge>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <Badge className="bg-red-100 text-red-700 border-0">{s.absent_count}</Badge>
                                            </td>
                                            <td className="px-4 py-3 text-center text-xs">
                                                {formatDuration(s.total_work_duration_minutes)}
                                            </td>
                                            <td className="px-4 py-3 text-center text-xs">
                                                {formatDuration(s.avg_work_duration_minutes)}
                                            </td>
                                        </tr>
                                    ))}
                                    {summaries.length === 0 && (
                                        <tr>
                                            <td colSpan={11} className="px-4 py-12 text-center text-muted-foreground">
                                                <CalendarCheck className="h-8 w-8 mx-auto mb-2 opacity-40" />
                                                Tidak ada data untuk bulan ini.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

AttendanceReport.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Laporan Absensi', href: '/reports/attendance' },
    ],
};
