import { Head, Link, router, usePage } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText, Check, X } from 'lucide-react';

const STATUS_CLASS: Record<string, string> = {
    PENDING: 'bg-amber-50 text-amber-700',
    APPROVED: 'bg-emerald-50 text-emerald-700',
    REJECTED: 'bg-red-50 text-red-700',
    CANCELLED: 'bg-muted text-muted-foreground',
};

export default function LeaveIndex({ leaves }: { leaves: any }) {
    const { flash, auth } = usePage().props;
    const canApprove = (auth as any)?.user?.all_permissions?.some((p: any) => p.name === 'approve_leave');
    const isStaff = Boolean((auth as any)?.user?.employee) && !canApprove;

    return (
        <>
            <Head title="Izin" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Pengajuan Izin</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Izin sakit, keperluan pribadi, dinas, dan lainnya
                        </p>
                    </div>
                    {isStaff && (
                        <Link href="/leaves/create" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90">
                            <Plus className="h-4 w-4" />
                            Ajukan Izin
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
                                        <th className="px-4 py-3 font-medium">Periode</th>
                                        <th className="px-4 py-3 font-medium">Alasan</th>
                                        <th className="px-4 py-3 font-medium">Status</th>
                                        <th className="px-4 py-3 font-medium text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {leaves?.data?.map((leave: any) => (
                                        <tr key={leave.id} className="hover:bg-muted/30">
                                            <td className="px-4 py-3">
                                                <p className="font-medium">{leave.employee?.name}</p>
                                                <p className="text-xs text-muted-foreground">{leave.tenant?.name}</p>
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">{leave.leave_type?.name}</td>
                                            <td className="px-4 py-3 whitespace-nowrap">{leave.start_date} – {leave.end_date}</td>
                                            <td className="px-4 py-3 max-w-[200px] truncate text-muted-foreground">{leave.reason}</td>
                                            <td className="px-4 py-3">
                                                <Badge variant="outline" className={STATUS_CLASS[leave.status] ?? ''}>
                                                    {leave.status}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex justify-end gap-2">
                                                    {canApprove && leave.status === 'PENDING' && (
                                                        <>
                                                            <button
                                                                onClick={() => router.post(`/leaves/${leave.id}/approve`)}
                                                                className="inline-flex items-center gap-1 px-2 py-1 text-xs text-emerald-600 hover:text-emerald-800"
                                                            >
                                                                <Check className="h-3.5 w-3.5" /> Setujui
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    const reason = prompt('Alasan penolakan:');
                                                                    if (reason) {
                                                                        router.post(`/leaves/${leave.id}/reject`, { reason });
                                                                    }
                                                                }}
                                                                className="inline-flex items-center gap-1 px-2 py-1 text-xs text-red-600 hover:text-red-800"
                                                            >
                                                                <X className="h-3.5 w-3.5" /> Tolak
                                                            </button>
                                                        </>
                                                    )}
                                                    {isStaff && leave.status === 'PENDING' && (
                                                        <button
                                                            onClick={() => {
                                                                if (confirm('Batalkan pengajuan izin?')) {
                                                                    router.post(`/leaves/${leave.id}/cancel`);
                                                                }
                                                            }}
                                                            className="text-xs text-muted-foreground hover:text-foreground"
                                                        >
                                                            Batalkan
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!leaves?.data || leaves.data.length === 0) && (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                                <FileText className="h-8 w-8 mx-auto mb-2 opacity-40" />
                                                Belum ada pengajuan izin.
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