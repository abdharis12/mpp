import { Head, Link, router, usePage } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, AlertCircle, Check, X } from 'lucide-react';

const STATUS_CLASS: Record<string, string> = {
    PENDING: 'bg-amber-50 text-amber-700',
    APPROVED: 'bg-emerald-50 text-emerald-700',
    REJECTED: 'bg-red-50 text-red-700',
    CANCELLED: 'bg-muted text-muted-foreground',
};

export default function CorrectionIndex({ corrections }: { corrections: any }) {
    const { flash, auth } = usePage().props;
    const canApprove = (auth as any)?.user?.all_permissions?.some((p: any) => p.name === 'approve_correction');
    const isStaff = Boolean((auth as any)?.user?.employee) && !canApprove;

    return (
        <>
            <Head title="Koreksi Absensi" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Koreksi Absensi</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Pengajuan perbaikan data kehadiran
                        </p>
                    </div>
                    {isStaff && (
                        <Link href="/corrections/create" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90">
                            <Plus className="h-4 w-4" />
                            Ajukan Koreksi
                        </Link>
                    )}
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
                                        <th className="px-4 py-3 font-medium">Petugas</th>
                                        <th className="px-4 py-3 font-medium">Jenis</th>
                                        <th className="px-4 py-3 font-medium">Tanggal</th>
                                        <th className="px-4 py-3 font-medium">Alasan</th>
                                        <th className="px-4 py-3 font-medium">Status</th>
                                        <th className="px-4 py-3 font-medium text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {corrections?.data?.map((c: any) => (
                                        <tr key={c.id} className="hover:bg-muted/30">
                                            <td className="px-4 py-3">
                                                <p className="font-medium">{c.employee?.name}</p>
                                                <p className="text-xs text-muted-foreground">{c.tenant?.name}</p>
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">{c.correction_type?.replace(/_/g, ' ')}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                                                {c.attendance?.attendance_date ?? '-'}
                                            </td>
                                            <td className="px-4 py-3 max-w-[200px] truncate text-muted-foreground">{c.reason}</td>
                                            <td className="px-4 py-3">
                                                <Badge variant="outline" className={STATUS_CLASS[c.status] ?? ''}>
                                                    {c.status}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex justify-end gap-2">
                                                    {canApprove && c.status === 'PENDING' && (
                                                        <>
                                                            <button
                                                                onClick={() => router.post(`/corrections/${c.id}/approve`)}
                                                                className="inline-flex items-center gap-1 px-2 py-1 text-xs text-emerald-600 hover:text-emerald-800"
                                                            >
                                                                <Check className="h-3.5 w-3.5" /> Setujui
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    const reason = prompt('Alasan penolakan:');
                                                                    if (reason) {
                                                                        router.post(`/corrections/${c.id}/reject`, { reason });
                                                                    }
                                                                }}
                                                                className="inline-flex items-center gap-1 px-2 py-1 text-xs text-red-600 hover:text-red-800"
                                                            >
                                                                <X className="h-3.5 w-3.5" /> Tolak
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!corrections?.data || corrections.data.length === 0) && (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                                <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-40" />
                                                Belum ada pengajuan koreksi.
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