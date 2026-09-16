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
            <div className="space-y-6 p-10">
                <div className="border-border flex items-center justify-between border-b pb-4">
                    <div>
                        <h1 className="text-2xl font-semibold">
                            Laporan Absensi Bulanan
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Rekap kehadiran petugas per bulan berdasarkan tenant
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={handleExport}
                            variant="outline"
                            className="cursor-pointer gap-2 bg-emerald-500 text-white hover:bg-emerald-600 hover:text-white"
                        >
                            <Download className="h-4 w-4" />
                            Export Excel
                        </Button>
                        <Button
                            onClick={handleExportPdf}
                            variant="outline"
                            className="cursor-pointer gap-2 bg-red-500 text-white hover:bg-red-600 hover:text-white"
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
                                <Label htmlFor="month" className="text-xs">
                                    Bulan
                                </Label>
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
                                        <SelectItem value="all">
                                            Semua tenant
                                        </SelectItem>
                                        {tenants.map((t) => (
                                            <SelectItem
                                                key={t.id}
                                                value={String(t.id)}
                                            >
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
                                    <p className="text-muted-foreground text-xs">
                                        Total Petugas
                                    </p>
                                    <p className="mt-1 text-2xl font-bold">
                                        {summaryStats.total_employees}
                                    </p>
                                </div>
                                <div className="rounded-lg bg-blue-100 p-2 text-blue-700">
                                    <Users className="h-5 w-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-muted-foreground text-xs">
                                        Hadir
                                    </p>
                                    <p className="mt-1 text-2xl font-bold text-emerald-700">
                                        {summaryStats.total_present}
                                    </p>
                                </div>
                                <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700">
                                    <CalendarCheck className="h-5 w-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-muted-foreground text-xs">
                                        Terlambat
                                    </p>
                                    <p className="mt-1 text-2xl font-bold text-amber-700">
                                        {summaryStats.total_late}
                                    </p>
                                </div>
                                <div className="rounded-lg bg-amber-100 p-2 text-amber-700">
                                    <Clock className="h-5 w-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-muted-foreground text-xs">
                                        Pulang Cepat
                                    </p>
                                    <p className="mt-1 text-2xl font-bold text-orange-700">
                                        {summaryStats.total_early_leave}
                                    </p>
                                </div>
                                <div className="rounded-lg bg-orange-100 p-2 text-orange-700">
                                    <Clock className="h-5 w-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-muted-foreground text-xs">
                                        Izin
                                    </p>
                                    <p className="mt-1 text-2xl font-bold text-purple-700">
                                        {summaryStats.total_leave}
                                    </p>
                                </div>
                                <div className="rounded-lg bg-purple-100 p-2 text-purple-700">
                                    <Users className="h-5 w-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-muted-foreground text-xs">
                                        Tidak Hadir
                                    </p>
                                    <p className="mt-1 text-2xl font-bold text-red-700">
                                        {summaryStats.total_absent}
                                    </p>
                                </div>
                                <div className="rounded-lg bg-red-100 p-2 text-red-700">
                                    <AlertCircle className="h-5 w-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            Rekap Per Petugas
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="overflow-hidden p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50">
                                    <tr className="text-muted-foreground text-left text-xs tracking-wider uppercase">
                                        <th className="px-4 py-3 font-medium">
                                            Petugas
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Kode
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Tenant
                                        </th>
                                        <th className="px-4 py-3 text-center font-medium">
                                            Hadir
                                        </th>
                                        <th className="px-4 py-3 text-center font-medium">
                                            Terlambat
                                        </th>
                                        <th className="px-4 py-3 text-center font-medium">
                                            Pulang Cepat
                                        </th>
                                        <th className="px-4 py-3 text-center font-medium">
                                            Izin
                                        </th>
                                        <th className="px-4 py-3 text-center font-medium">
                                            Libur
                                        </th>
                                        <th className="px-4 py-3 text-center font-medium">
                                            Tidak Hadir
                                        </th>
                                        <th className="px-4 py-3 text-center font-medium">
                                            Total Jam
                                        </th>
                                        <th className="px-4 py-3 text-center font-medium">
                                            Rata-rata
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-border divide-y">
                                    {summaries.map((s) => (
                                        <tr
                                            key={s.employee_id}
                                            className="hover:bg-muted/30"
                                        >
                                            <td className="px-4 py-3 font-medium">
                                                {s.employee_name}
                                            </td>
                                            <td className="px-4 py-3 font-mono text-xs">
                                                {s.employee_code}
                                            </td>
                                            <td className="text-muted-foreground px-4 py-3">
                                                {s.tenant_name}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <Badge className="border-0 bg-emerald-100 text-emerald-700">
                                                    {s.present_count}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <Badge className="border-0 bg-amber-100 text-amber-700">
                                                    {s.late_count}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <Badge className="border-0 bg-orange-100 text-orange-700">
                                                    {s.early_leave_count}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <Badge className="border-0 bg-purple-100 text-purple-700">
                                                    {s.leave_count}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <Badge className="border-0 bg-sky-100 text-sky-700">
                                                    {s.holiday_count}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <Badge className="border-0 bg-red-100 text-red-700">
                                                    {s.absent_count}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 text-center text-xs">
                                                {formatDuration(
                                                    s.total_work_duration_minutes,
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-center text-xs">
                                                {formatDuration(
                                                    s.avg_work_duration_minutes,
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {summaries.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={11}
                                                className="text-muted-foreground px-4 py-12 text-center"
                                            >
                                                <CalendarCheck className="mx-auto mb-2 h-8 w-8 opacity-40" />
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
