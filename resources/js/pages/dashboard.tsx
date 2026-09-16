import { Head, Link, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowRight,
    Building2,
    CalendarCheck,
    CalendarClock,
    FileText,
    Plus,
    Users,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type PendingItem = {
    employee_name?: string | null;
    tenant_name?: string | null;
    created_at?: string | null;
    start_date?: string | null;
};

type DashboardProps = {
    greeting: string;
    summary: {
        total_tenants: number;
        total_employees: number;
    };
    attendance_today: {
        present: number;
        late: number;
        leave: number;
        absent: number;
        total: number;
    };
    pending_leaves: {
        count: number;
        items: PendingItem[];
    };
    pending_corrections: {
        count: number;
        items: PendingItem[];
    };
};

const ATTENDANCE_SEGMENTS = [
    { key: 'present', label: 'Hadir', color: 'bg-success' },
    { key: 'late', label: 'Terlambat', color: 'bg-warning' },
    { key: 'leave', label: 'Izin', color: 'bg-info' },
    { key: 'absent', label: 'Tidak Hadir', color: 'bg-destructive' },
] as const;

const LEGEND_DOT: Record<string, string> = {
    present: 'bg-success',
    late: 'bg-warning',
    leave: 'bg-info',
    absent: 'bg-destructive',
};

const LEGEND_TEXT: Record<string, string> = {
    present: 'text-success',
    late: 'text-warning',
    leave: 'text-info',
    absent: 'text-destructive',
};

export default function Dashboard({
    greeting,
    summary,
    attendance_today,
    pending_leaves,
    pending_corrections,
}: DashboardProps) {
    const { auth } = usePage().props as any;
    const user = auth?.user;
    const permissions: string[] =
        user?.all_permissions?.map((p: any) => p.name) ?? [];

    const todayLabel = new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    const canCreateTenants = permissions.includes('create_tenants');
    const canCreateEmployees = permissions.includes('create_employees');
    const canViewReports = permissions.includes('view_reports');
    const canReviewLeaves = permissions.includes('view_attendance');
    const canReviewCorrections = permissions.includes('view_attendance');

    const total = Math.max(1, attendance_today.total);
    const segments = ATTENDANCE_SEGMENTS.map((segment) => ({
        ...segment,
        count: attendance_today[segment.key],
        width: `${(attendance_today[segment.key] / total) * 100}%`,
    }));

    const hasPending =
        pending_leaves.count > 0 || pending_corrections.count > 0;

    return (
        <>
            <Head title="Dashboard" />

            <div className="space-y-8 p-10">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">
                            {greeting}, {user?.name}
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            {todayLabel}
                        </p>
                    </div>

                    {(canCreateTenants || canCreateEmployees) && (
                        <div className="flex flex-wrap gap-2">
                            {canCreateTenants && (
                                <Button asChild>
                                    <Link href="/tenants/create">
                                        <Plus />
                                        Tambah Tenant
                                    </Link>
                                </Button>
                            )}
                            {canCreateEmployees && (
                                <Button asChild variant="secondary">
                                    <Link href="/employees/create">
                                        <Plus />
                                        Tambah Petugas
                                    </Link>
                                </Button>
                            )}
                        </div>
                    )}
                </div>

                {hasPending ? (
                    <section aria-label="Perlu ditindak" className="space-y-4">
                        <h2 className="text-lg font-semibold">
                            Perlu Ditindak
                        </h2>
                        <div className="grid gap-4 lg:grid-cols-2">
                            {canReviewLeaves && (
                                <PendingCard
                                    title="Pengajuan Izin"
                                    icon={<FileText className="size-5" />}
                                    count={pending_leaves.count}
                                    items={pending_leaves.items}
                                    href="/leaves"
                                    emptyText="Tidak ada pengajuan izin menunggu."
                                />
                            )}
                            {canReviewCorrections && (
                                <PendingCard
                                    title="Pengajuan Koreksi"
                                    icon={<AlertCircle className="size-5" />}
                                    count={pending_corrections.count}
                                    items={pending_corrections.items}
                                    href="/corrections"
                                    emptyText="Tidak ada pengajuan koreksi menunggu."
                                />
                            )}
                        </div>
                    </section>
                ) : (
                    <Card className="bg-success/10">
                        <CardContent className="flex items-center gap-3 p-5">
                            <CheckMark />
                            <div>
                                <p className="font-medium">
                                    Semua sudah ditindaklanjuti
                                </p>
                                <p className="text-muted-foreground text-sm">
                                    Tidak ada pengajuan izin atau koreksi yang
                                    menunggu.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <section aria-label="Kehadiran hari ini" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">
                            Kehadiran Hari Ini
                        </h2>
                        {canViewReports && (
                            <Button asChild variant="ghost" size="sm">
                                <Link href="/reports/attendance">
                                    Detail Laporan
                                    <ArrowRight />
                                </Link>
                            </Button>
                        )}
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <CalendarCheck className="text-primary size-5" />
                                Rekap Kehadiran
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div
                                role="img"
                                aria-label={`Hadir ${attendance_today.present}, terlambat ${attendance_today.late}, izin ${attendance_today.leave}, tidak hadir ${attendance_today.absent}`}
                                className="bg-muted flex h-4 w-full overflow-hidden rounded-full"
                            >
                                {segments.map((segment) =>
                                    segment.count > 0 ? (
                                        <div
                                            key={segment.key}
                                            className={`${segment.color} h-full`}
                                            style={{ width: segment.width }}
                                            title={`${segment.label}: ${segment.count}`}
                                        />
                                    ) : null,
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                {segments.map((segment) => (
                                    <div
                                        key={segment.key}
                                        className="flex items-center gap-2"
                                    >
                                        <span
                                            className={`${LEGEND_DOT[segment.key]} size-3 shrink-0 rounded-full`}
                                        />
                                        <div className="min-w-0">
                                            <p className="text-muted-foreground truncate text-sm">
                                                {segment.label}
                                            </p>
                                            <p
                                                className={`${LEGEND_TEXT[segment.key]} text-2xl font-bold`}
                                            >
                                                {segment.count}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <section aria-label="Ringkasan" className="space-y-4">
                    <h2 className="text-lg font-semibold">Ringkasan</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        <MetricCard
                            label="Total Tenant"
                            value={summary.total_tenants}
                            icon={<Building2 className="size-6" />}
                            iconClass="bg-primary/10 text-primary"
                        />
                        <MetricCard
                            label="Total Petugas"
                            value={summary.total_employees}
                            icon={<Users className="size-6" />}
                            iconClass="bg-secondary/10 text-secondary"
                        />
                    </div>
                </section>

                {(canCreateTenants || canCreateEmployees) && (
                    <section aria-label="Aksi cepat" className="space-y-4">
                        <h2 className="text-lg font-semibold">Aksi Cepat</h2>
                        <Card>
                            <CardContent className="flex flex-wrap gap-3 p-6">
                                {canCreateTenants && (
                                    <Button asChild variant="outline">
                                        <Link href="/tenants/create">
                                            <Building2 />
                                            Tambah Tenant
                                        </Link>
                                    </Button>
                                )}
                                {canCreateEmployees && (
                                    <Button asChild variant="outline">
                                        <Link href="/employees/create">
                                            <Users />
                                            Tambah Petugas
                                        </Link>
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    </section>
                )}
            </div>
        </>
    );
}

function CheckMark() {
    return (
        <span className="bg-success/10 flex size-10 shrink-0 items-center justify-center rounded-full">
            <CalendarClock className="text-success size-5" />
        </span>
    );
}

function PendingCard({
    title,
    icon,
    count,
    items,
    href,
    emptyText,
}: {
    title: string;
    icon: ReactNode;
    count: number;
    items: PendingItem[];
    href: string;
    emptyText: string;
}) {
    return (
        <Card>
            <CardHeader className="flex-row items-center justify-between gap-4">
                <CardTitle className="flex items-center gap-2 text-base">
                    <span className="bg-warning/10 text-warning flex size-10 items-center justify-center rounded-xl">
                        {icon}
                    </span>
                    {title}
                </CardTitle>
                {count > 0 && (
                    <Badge variant="pill" className="text-base">
                        {count}
                    </Badge>
                )}
            </CardHeader>
            <CardContent>
                {items.length > 0 ? (
                    <ul className="divide-border divide-y">
                        {items.map((item, index) => (
                            <li
                                key={`${item.employee_name}-${index}`}
                                className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                            >
                                <div className="min-w-0">
                                    <p className="truncate font-medium">
                                        {item.employee_name ?? '-'}
                                    </p>
                                    <p className="text-muted-foreground truncate text-sm">
                                        {item.tenant_name ??
                                            item.start_date ??
                                            item.created_at}
                                    </p>
                                </div>
                                <span className="text-muted-foreground shrink-0 text-xs">
                                    {item.created_at}
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-muted-foreground py-2 text-sm">
                        {emptyText}
                    </p>
                )}
                <Button asChild variant="ghost" size="sm" className="mt-3">
                    <Link href={href}>
                        Lihat Semua
                        <ArrowRight />
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
}

function MetricCard({
    label,
    value,
    icon,
    iconClass,
}: {
    label: string;
    value: number;
    icon: ReactNode;
    iconClass: string;
}) {
    return (
        <Card>
            <CardContent className="flex items-center gap-4 p-6">
                <span
                    className={`flex size-12 items-center justify-center rounded-xl ${iconClass}`}
                >
                    {icon}
                </span>
                <div>
                    <p className="text-muted-foreground text-sm font-medium">
                        {label}
                    </p>
                    <p className="mt-0.5 text-3xl font-bold">{value}</p>
                </div>
            </CardContent>
        </Card>
    );
}
