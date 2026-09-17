import { Head, Link, router, usePage } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, CalendarOff, Power, Trash2 } from 'lucide-react';
import { Pagination } from '@/components/pagination';
import ConfirmDialog from '@/components/confirm-dialog';
import { useState } from 'react';

const TYPE_LABELS: Record<string, string> = {
    NATIONAL_HOLIDAY: 'Libur Nasional',
    JOINT_LEAVE: 'Cuti Bersama',
    SPECIAL_HOLIDAY: 'Libur Khusus',
    MPP_CLOSURE: 'Penutupan MPP',
    OFFICIAL_EVENT: 'Kegiatan Resmi',
    OTHER: 'Lainnya',
};

export default function HolidayIndex({ holidays }: { holidays: any }) {
    const { flash } = usePage().props;
    const [deleteHoliday, setDeleteHoliday] = useState<any>(null);
    const [toggleHoliday, setToggleHoliday] = useState<any>(null);

    return (
        <>
            <Head title="Hari Libur" />
            <div className="space-y-6 p-10">
                <div className="border-border flex items-center justify-between border-b pb-4">
                    <div>
                        <h1 className="text-2xl font-semibold">Hari Libur</h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Kelola libur nasional, cuti bersama, hingga
                            penutupan layanan
                        </p>
                    </div>
                    <Link
                        href="/holidays/create"
                        className="bg-secondary hover:bg-secondary/90 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white"
                    >
                        <Plus className="h-4 w-4" />
                        Tambah Hari Libur
                    </Link>
                </div>

                {(flash as any)?.success && (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                        {(flash as any).success}
                    </div>
                )}

                <Card>
                    <CardContent className="overflow-hidden p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50">
                                    <tr className="text-muted-foreground text-left text-xs tracking-wider uppercase">
                                        <th className="px-4 py-3 font-medium">
                                            Nama
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Jenis
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Tanggal
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Durasi
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Status
                                        </th>
                                        <th className="px-4 py-3 text-right font-medium">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-border divide-y">
                                    {holidays?.data?.map((h: any) => (
                                        <tr
                                            key={h.id}
                                            className="hover:bg-muted/30"
                                        >
                                            <td className="px-4 py-3 font-medium">
                                                {h.name}
                                            </td>
                                            <td className="text-muted-foreground px-4 py-3">
                                                {TYPE_LABELS[h.holiday_type] ??
                                                    h.holiday_type}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                {h.start_date}{' '}
                                                {h.start_date !== h.end_date &&
                                                    `– ${h.end_date}`}
                                            </td>
                                            <td className="px-4 py-3">
                                                {h.is_full_day ? (
                                                    <Badge
                                                        variant="outline"
                                                        className="bg-blue-50 text-blue-700"
                                                    >
                                                        Seharian
                                                    </Badge>
                                                ) : (
                                                    <span className="text-muted-foreground">
                                                        {h.periods
                                                            ?.map(
                                                                (p: any) =>
                                                                    p.start_time &&
                                                                    `${p.start_time}–${p.end_time}`,
                                                            )
                                                            .filter(Boolean)
                                                            .join(', ') ||
                                                            'Parsial'}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        h.is_active
                                                            ? 'bg-emerald-50 text-emerald-700'
                                                            : 'bg-red-50 text-red-700'
                                                    }
                                                >
                                                    {h.is_active
                                                        ? 'Aktif'
                                                        : 'Nonaktif'}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex justify-end gap-2">
                                                    {h.is_active ? (
                                                        <button
                                                            onClick={() =>
                                                                setToggleHoliday(
                                                                    h,
                                                                )
                                                            }
                                                            className="inline-flex items-center gap-1 px-2 py-1 text-xs text-amber-600 hover:text-amber-800"
                                                        >
                                                            <Power className="h-3.5 w-3.5" />{' '}
                                                            Nonaktifkan
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() =>
                                                                setToggleHoliday(
                                                                    h,
                                                                )
                                                            }
                                                            className="inline-flex items-center gap-1 px-2 py-1 text-xs text-emerald-600 hover:text-emerald-800"
                                                        >
                                                            <Power className="h-3.5 w-3.5" />{' '}
                                                            Aktifkan
                                                        </button>
                                                    )}
                                                    <Link
                                                        href={`/holidays/${h.id}/edit`}
                                                        className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs text-blue-600 hover:text-blue-800"
                                                    >
                                                        <Pencil className="h-3.5 w-3.5" />{' '}
                                                    </Link>
                                                    <button
                                                        onClick={() =>
                                                            setDeleteHoliday(h)
                                                        }
                                                        className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-red-50 px-2 py-1 text-xs text-red-600 hover:text-red-800"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />{' '}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!holidays?.data ||
                                        holidays.data.length === 0) && (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="text-muted-foreground px-4 py-8 text-center"
                                            >
                                                <CalendarOff className="mx-auto mb-2 h-8 w-8 opacity-40" />
                                                Belum ada hari libur.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                <Pagination meta={holidays} />
            </div>

            <ConfirmDialog
                open={toggleHoliday !== null}
                onOpenChange={() => setToggleHoliday(null)}
                title={
                    toggleHoliday?.is_active
                        ? 'Nonaktifkan hari libur?'
                        : 'Aktifkan hari libur?'
                }
                description={
                    toggleHoliday?.is_active
                        ? `"${toggleHoliday?.name ?? ''}" akan dinonaktifkan sehingga tidak lagi memengaruhi status layanan.`
                        : `"${toggleHoliday?.name ?? ''}" akan diaktifkan kembali sehingga memengaruhi status layanan.`
                }
                confirmLabel={
                    toggleHoliday?.is_active ? 'Nonaktifkan' : 'Aktifkan'
                }
                cancelLabel="Batal"
                variant="warning"
                onConfirm={() => {
                    if (toggleHoliday) {
                        router.post(
                            toggleHoliday.is_active
                                ? `/holidays/${toggleHoliday.id}/deactivate`
                                : `/holidays/${toggleHoliday.id}/activate`,
                        );
                        setToggleHoliday(null);
                    }
                }}
            />

            <ConfirmDialog
                open={deleteHoliday !== null}
                onOpenChange={() => setDeleteHoliday(null)}
                title="Hapus hari libur?"
                description={`Hari libur "${deleteHoliday?.name ?? ''}" beserta seluruh periode waktunya akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.`}
                confirmLabel="Hapus"
                cancelLabel="Batal"
                onConfirm={() => {
                    if (deleteHoliday) {
                        router.delete(`/holidays/${deleteHoliday.id}`);
                        setDeleteHoliday(null);
                    }
                }}
            />
        </>
    );
}
