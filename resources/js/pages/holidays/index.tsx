import { Head, Link, router, usePage } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, CalendarOff, Power, Trash2 } from 'lucide-react';

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

    return (
        <>
            <Head title="Hari Libur" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Hari Libur</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Kelola libur nasional, cuti bersama, hingga penutupan layanan
                        </p>
                    </div>
                    <Link href="/holidays/create" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90">
                        <Plus className="h-4 w-4" />
                        Tambah Hari Libur
                    </Link>
                </div>

                {(flash as any)?.success && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded-lg text-sm">
                        {(flash as any).success}
                    </div>
                )}

                <Card>
                    <CardContent className="p-0 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50">
                                    <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                                        <th className="px-4 py-3 font-medium">Nama</th>
                                        <th className="px-4 py-3 font-medium">Jenis</th>
                                        <th className="px-4 py-3 font-medium">Tanggal</th>
                                        <th className="px-4 py-3 font-medium">Durasi</th>
                                        <th className="px-4 py-3 font-medium">Status</th>
                                        <th className="px-4 py-3 font-medium text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {holidays?.data?.map((h: any) => (
                                        <tr key={h.id} className="hover:bg-muted/30">
                                            <td className="px-4 py-3 font-medium">{h.name}</td>
                                            <td className="px-4 py-3 text-muted-foreground">{TYPE_LABELS[h.holiday_type] ?? h.holiday_type}</td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                {h.start_date} {h.start_date !== h.end_date && `– ${h.end_date}`}
                                            </td>
                                            <td className="px-4 py-3">
                                                {h.is_full_day ? (
                                                    <Badge variant="outline" className="bg-blue-50 text-blue-700">Seharian</Badge>
                                                ) : (
                                                    <span className="text-muted-foreground">
                                                        {h.periods?.map((p: any) => p.start_time && `${p.start_time}–${p.end_time}`).filter(Boolean).join(', ') || 'Parsial'}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge variant="outline" className={h.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}>
                                                    {h.is_active ? 'Aktif' : 'Nonaktif'}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex justify-end gap-2">
                                                    {h.is_active ? (
                                                        <button
                                                            onClick={() => router.post(`/holidays/${h.id}/deactivate`)}
                                                            className="inline-flex items-center gap-1 px-2 py-1 text-xs text-amber-600 hover:text-amber-800"
                                                        >
                                                            <Power className="h-3.5 w-3.5" /> Nonaktifkan
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => router.post(`/holidays/${h.id}/activate`)}
                                                            className="inline-flex items-center gap-1 px-2 py-1 text-xs text-emerald-600 hover:text-emerald-800"
                                                        >
                                                            <Power className="h-3.5 w-3.5" /> Aktifkan
                                                        </button>
                                                    )}
                                                    <Link
                                                        href={`/holidays/${h.id}/edit`}
                                                        className="inline-flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:text-blue-800"
                                                    >
                                                        <Pencil className="h-3.5 w-3.5" /> Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => {
                                                            if (confirm(`Hapus hari libur "${h.name}"?`)) {
                                                                router.delete(`/holidays/${h.id}`);
                                                            }
                                                        }}
                                                        className="inline-flex items-center gap-1 px-2 py-1 text-xs text-red-600 hover:text-red-800"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" /> Hapus
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!holidays?.data || holidays.data.length === 0) && (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                                <CalendarOff className="h-8 w-8 mx-auto mb-2 opacity-40" />
                                                Belum ada hari libur.
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