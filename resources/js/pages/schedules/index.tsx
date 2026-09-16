import { Head, Link, router, usePage } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Clock, Trash, Trash2 } from 'lucide-react';
import { Pagination } from '@/components/pagination';

const DAY_NAMES = [
    '',
    'Senin',
    'Selasa',
    'Rabu',
    'Kamis',
    'Jumat',
    'Sabtu',
    'Minggu',
];

export default function ScheduleIndex({ schedules }: { schedules: any }) {
    const { flash } = usePage().props;

    return (
        <>
            <Head title="Jadwal Kerja" />
            <div className="space-y-6 p-10">
                <div className="border-border flex items-center justify-between border-b pb-4">
                    <div>
                        <h1 className="text-2xl font-semibold">Jadwal Kerja</h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Jadwal default dan khusus per tenant/petugas
                        </p>
                    </div>
                    <Link
                        href="/schedules/create"
                        className="bg-secondary hover:bg-secondary/90 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white"
                    >
                        <Plus className="h-4 w-4" />
                        Tambah Jadwal
                    </Link>
                </div>

                {flash?.success && (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                        {flash.success}
                    </div>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                    {schedules?.data?.map((schedule: any) => (
                        <Card key={schedule.id}>
                            <CardContent className="space-y-3 pt-6">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-5 w-5 text-blue-600" />
                                        <div>
                                            <p className="font-semibold">
                                                {schedule.name}
                                            </p>
                                            <p className="text-muted-foreground text-xs">
                                                {schedule.description ??
                                                    'Jadwal kerja'}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge
                                        variant={
                                            schedule.is_active
                                                ? 'outline'
                                                : 'secondary'
                                        }
                                        className={
                                            schedule.is_active
                                                ? 'bg-emerald-50 text-emerald-700'
                                                : 'bg-red-50 text-red-700'
                                        }
                                    >
                                        {schedule.is_active
                                            ? 'Aktif'
                                            : 'Nonaktif'}
                                    </Badge>
                                </div>

                                <div className="bg-muted/40 rounded-lg p-3">
                                    {Array.from(
                                        { length: 7 },
                                        (_, i) => i + 1,
                                    ).map((d) => {
                                        const day = schedule.days?.find(
                                            (x: any) => x.day_of_week === d,
                                        );
                                        return (
                                            <div
                                                key={d}
                                                className="flex items-center justify-between py-0.5 text-sm"
                                            >
                                                <span className="text-muted-foreground">
                                                    {DAY_NAMES[d]}
                                                </span>
                                                {day?.is_working_day ? (
                                                    <span className="font-mono font-semibold">
                                                        {day.start_time?.slice(
                                                            0,
                                                            5,
                                                        )}{' '}
                                                        –{' '}
                                                        {day.end_time?.slice(
                                                            0,
                                                            5,
                                                        )}
                                                    </span>
                                                ) : (
                                                    <span className="text-muted-foreground font-mono">
                                                        Libur
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground text-xs">
                                        Toleransi:{' '}
                                        {schedule.grace_period_minutes} menit
                                    </span>
                                    <div className="flex gap-2">
                                        <Link
                                            href={`/schedules/${schedule.id}/edit`}
                                            className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs text-blue-600 hover:text-blue-800"
                                        >
                                            <Pencil className="h-3.5 w-3.5" />{' '}
                                        </Link>
                                        <button
                                            onClick={() => {
                                                if (
                                                    confirm('Hapus jadwal ini?')
                                                ) {
                                                    router.delete(
                                                        `/schedules/${schedule.id}`,
                                                    );
                                                }
                                            }}
                                            className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-red-50 px-2 py-1 text-xs text-red-600 hover:text-red-800"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {(!schedules?.data || schedules.data.length === 0) && (
                        <Card>
                            <CardContent className="text-muted-foreground py-10 text-center md:col-span-2">
                                Belum ada jadwal.
                            </CardContent>
                        </Card>
                    )}
                </div>

                <Pagination meta={schedules} />
            </div>
        </>
    );
}
