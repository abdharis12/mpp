import { Head, Link, router, usePage } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText, Check, X, XCircle } from 'lucide-react';
import { Pagination } from '@/components/pagination';
import ConfirmDialog from '@/components/confirm-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

const STATUS_CLASS: Record<string, string> = {
    PENDING: 'bg-amber-50 text-amber-700',
    APPROVED: 'bg-emerald-50 text-emerald-700',
    REJECTED: 'bg-red-50 text-red-700',
    CANCELLED: 'bg-muted text-muted-foreground',
};

export default function LeaveIndex({ leaves }: { leaves: any }) {
    const { flash, auth } = usePage().props;
    const canApprove = (auth as any)?.user?.all_permissions?.some(
        (p: any) => p.name === 'approve_leave',
    );
    const isStaff = Boolean((auth as any)?.user?.employee) && !canApprove;

    const [approveLeave, setApproveLeave] = useState<any>(null);
    const [cancelLeave, setCancelLeave] = useState<any>(null);
    const [rejectLeave, setRejectLeave] = useState<any>(null);
    const [rejectReason, setRejectReason] = useState('');

    return (
        <>
            <Head title="Izin" />
            <div className="space-y-6 p-10">
                <div className="border-border flex items-center justify-between border-b pb-4">
                    <div>
                        <h1 className="text-2xl font-semibold">
                            Pengajuan Izin
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Izin sakit, keperluan pribadi, dinas, dan lainnya
                        </p>
                    </div>
                    {isStaff && (
                        <Link
                            href="/leaves/create"
                            className="bg-secondary hover:bg-secondary/90 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white"
                        >
                            <Plus className="h-4 w-4" />
                            Ajukan Izin
                        </Link>
                    )}
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
                                            Petugas
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Jenis
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Periode
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Alasan
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
                                    {leaves?.data?.map((leave: any) => (
                                        <tr
                                            key={leave.id}
                                            className="hover:bg-muted/30"
                                        >
                                            <td className="px-4 py-3">
                                                <p className="font-medium">
                                                    {leave.employee?.name}
                                                </p>
                                                <p className="text-muted-foreground text-xs">
                                                    {leave.tenant?.name}
                                                </p>
                                            </td>
                                            <td className="text-muted-foreground px-4 py-3">
                                                {leave.leave_type?.name}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                {leave.start_date} –{' '}
                                                {leave.end_date}
                                            </td>
                                            <td className="text-muted-foreground max-w-[200px] truncate px-4 py-3">
                                                {leave.reason}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        STATUS_CLASS[
                                                            leave.status
                                                        ] ?? ''
                                                    }
                                                >
                                                    {leave.status}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex justify-end gap-2">
                                                    {canApprove &&
                                                        leave.status ===
                                                            'PENDING' && (
                                                            <>
                                                                <button
                                                                    onClick={() =>
                                                                        setApproveLeave(
                                                                            leave,
                                                                        )
                                                                    }
                                                                    className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-xs text-emerald-600 hover:text-emerald-800"
                                                                >
                                                                    <Check className="h-3.5 w-3.5" />{' '}
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setRejectLeave(
                                                                            leave,
                                                                        );
                                                                        setRejectReason(
                                                                            '',
                                                                        );
                                                                    }}
                                                                    className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-red-50 px-2 py-1 text-xs text-red-600 hover:text-red-800"
                                                                >
                                                                    <XCircle className="h-3.5 w-3.5" />{' '}
                                                                </button>
                                                            </>
                                                        )}
                                                    {isStaff &&
                                                        leave.status ===
                                                            'PENDING' && (
                                                            <button
                                                                onClick={() =>
                                                                    setCancelLeave(
                                                                        leave,
                                                                    )
                                                                }
                                                                className="text-muted-foreground hover:text-foreground text-xs"
                                                            >
                                                                Batalkan
                                                            </button>
                                                        )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!leaves?.data ||
                                        leaves.data.length === 0) && (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="text-muted-foreground px-4 py-8 text-center"
                                            >
                                                <FileText className="mx-auto mb-2 h-8 w-8 opacity-40" />
                                                Belum ada pengajuan izin.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                <Pagination meta={leaves} />
            </div>

            <ConfirmDialog
                open={approveLeave !== null}
                onOpenChange={() => setApproveLeave(null)}
                title="Setujui pengajuan izin?"
                description={`Pengajuan izin ${approveLeave?.leave_type?.name ?? 'ini'} — ${approveLeave?.start_date ?? ''} hingga ${approveLeave?.end_date ?? ''} (${approveLeave?.employee?.name ?? ''}) — akan disetujui dan status akan berubah menjadi Disetujui.`}
                confirmLabel="Setujui"
                cancelLabel="Batal"
                variant="warning"
                onConfirm={() => {
                    if (approveLeave) {
                        router.post(`/leaves/${approveLeave.id}/approve`);
                        setApproveLeave(null);
                    }
                }}
            />

            <ConfirmDialog
                open={cancelLeave !== null}
                onOpenChange={() => setCancelLeave(null)}
                title="Batalkan pengajuan izin?"
                description={`Pengajuan izin ${cancelLeave?.leave_type?.name ?? 'ini'} — ${cancelLeave?.start_date ?? ''} hingga ${cancelLeave?.end_date ?? ''} — akan dibatalkan dan status akan berubah menjadi Dibatalkan.`}
                confirmLabel="Ya, batalkan"
                cancelLabel="Kembali"
                onConfirm={() => {
                    if (cancelLeave) {
                        router.post(`/leaves/${cancelLeave.id}/cancel`);
                        setCancelLeave(null);
                    }
                }}
            />

            <ConfirmDialog
                open={rejectLeave !== null}
                onOpenChange={() => {
                    setRejectLeave(null);
                    setRejectReason('');
                }}
                title="Tolak pengajuan izin?"
                description="Berikan alasan penolakan. Alasan ini akan dikembalikan kepada pemohon."
                confirmLabel="Tolak"
                cancelLabel="Batal"
                onConfirm={() => {
                    if (rejectLeave) {
                        router.post(`/leaves/${rejectLeave.id}/reject`, {
                            reason: rejectReason,
                        });
                        setRejectLeave(null);
                        setRejectReason('');
                    }
                }}
            >
                <div className="space-y-2">
                    <Label
                        htmlFor="reject-reason"
                        className="text-foreground text-sm"
                    >
                        Alasan penolakan
                    </Label>
                    <Input
                        id="reject-reason"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Tulis alasan penolakan…"
                        autoComplete="off"
                    />
                </div>
            </ConfirmDialog>
        </>
    );
}
