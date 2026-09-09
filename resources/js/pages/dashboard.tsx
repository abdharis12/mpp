import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { Users, Building2, CalendarCheck, AlertCircle, Clock, Building } from 'lucide-react';

export default function Dashboard({
    summary,
}: {
    summary: {
        total_tenants: number;
        total_employees: number;
        present_today: number;
        late_today: number;
        absent_today: number;
        monthly_attendance: number;
    };
}) {
    const { auth } = usePage().props;

    const stats = [
        {
            label: 'Total Tenant',
            value: summary.total_tenants,
            icon: Building2,
            color: 'bg-blue-100 text-blue-700',
        },
        {
            label: 'Total Petugas',
            value: summary.total_employees,
            icon: Users,
            color: 'bg-green-100 text-green-700',
        },
        {
            label: 'Hadir Hari Ini',
            value: summary.present_today,
            icon: CalendarCheck,
            color: 'bg-emerald-100 text-emerald-700',
        },
        {
            label: 'Terlambat',
            value: summary.late_today,
            icon: AlertCircle,
            color: 'bg-amber-100 text-amber-700',
        },
        {
            label: 'Tidak Hadir',
            value: summary.absent_today,
            icon: Clock,
            color: 'bg-red-100 text-red-700',
        },
        {
            label: 'Kehadiran Bulan Ini',
            value: summary.monthly_attendance,
            icon: Building,
            color: 'bg-purple-100 text-purple-700',
        },
    ];

    return (
        <>
            <Head title="Dashboard" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Dashboard</h1>
                    <div className="flex gap-2">
                        <Link
                            href="/tenants/create"
                            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90"
                        >
                            Tambah Tenant
                        </Link>
                        <Link
                            href="/employees/create"
                            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-secondary rounded-lg hover:bg-secondary/90"
                        >
                            Tambah Petugas
                        </Link>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                    {stats.map((stat) => (
                        <Card key={stat.label} className="shadow-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            {stat.label}
                                        </p>
                                        <p className="text-3xl font-bold mt-1">{stat.value}</p>
                                    </div>
                                    <div className={`${stat.color} p-3 rounded-xl`}>
                                        <stat.icon className="h-6 w-6" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Aksi Cepat</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-3">
                            <Link
                                href="/tenants"
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20"
                            >
                                Kelola Tenant
                            </Link>
                            <Link
                                href="/employees"
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-secondary bg-secondary/10 rounded-lg hover:bg-secondary/20"
                            >
                                Kelola Petugas
                            </Link>
                            <Link
                                href="/locations"
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100"
                            >
                                Lokasi Absensi
                            </Link>
                            <Link
                                href="/schedules"
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                            >
                                Jadwal Kerja
                            </Link>
                            <Link
                                href="/holidays"
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-amber-600 bg-amber-50 rounded-lg hover:bg-amber-100"
                            >
                                Hari Libur
                            </Link>
                            <Link
                                href="/leaves"
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100"
                            >
                                Izin
                            </Link>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Statistik Tenant</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Total tenant: <span className="font-semibold text-foreground">
                                    {/* This would need tenant breakdown - simplified for now */}
                                </span>
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}