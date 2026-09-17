import { Head, Link, router, usePage } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, AlertCircle, Check, X } from 'lucide-react';
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

export default function CorrectionIndex({ corrections }: { corrections: any }) {
    const { flash, auth } = usePage().props;
    const canApprove = (auth as any)?.user?.all_permissions?.some(
        (p: any) => p.name === 'approve_correction',
    );
    const isStaff = Boolean((auth as any)?.user?.employee) && !canApprove;

    const [approveCorrection, setApproveCorrection] = useState<any>(null);
    const [rejectCorrection, setRejectCorrection] = useState<any>(null);
    const [rejectReason, setRejectReason] = useState('');

    return (
        <>
            <Head title="Koreksi Absensi" />
            <div className="space-y-6 p-10">
                <div className="border-border flex items-center justify-between border-b pb-4">
                    <div>
                        <h1 className="text-2xl font-semibold">
                            Koreksi Absensi
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Pengajuan perbaikan data kehadiran
                        </p>
                    </div>
                    {isStaff && (
                        <Link
                            href="/corrections/create"
                            className="bg-secondary hover:bg-secondary/90 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white"
                        >
                            <Plus className="h-4 w-4" />
                            Ajukan Koreksi
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
                                            Tanggal
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
                                    {corrections?.data?.map((c: any) => (
                                        <tr
                                            key={c.id}
                                            className="hover:bg-muted/30"
                                        >
                                            <td className="px-4 py-3">
                                                <p className="font-medium">
                                                    {c.employee?.name}
                                                </p>
                                                <p className="text-muted-foreground text-xs">
                                                    {c.tenant?.name}
                                                </p>
                                            </td>
                                            <td className="text-muted-foreground px-4 py-3">
                                                {c.correction_type?.replace(
                                                    /_/g,
                                                    ' ',
                                                )}
                                            </td>
                                            <td className="text-muted-foreground px-4 py-3 whitespace-nowrap">
                                                {c.attendance
                                                    ?.attendance_date ?? '-'}
                                            </td>
                                            <td className="text-muted-foreground max-w-[200px] truncate px-4 py-3">
                                                {c.reason}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        STATUS_CLASS[
                                                            c.status
                                                        ] ?? ''
                                                    }
                                                >
                                                    {c.status}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex justify-end gap-2">
                                                    {canApprove &&
                                                        c.status ===
                                                            'PENDING' && (
                                                            <>
                                                                <button
                                                                    onClick={() =>
                                                                        setApproveCorrection(
                                                                            c,
                                                                        )
                                                                    }
                                                                    className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-xs text-emerald-600 hover:text-emerald-800"
                                                                >
                                                                    <Check className="h-3.5 w-3.5" />{' '}
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setRejectCorrection(
                                                                            c,
                                                                        );
                                                                        setRejectReason(
                                                                            '',
                                                                        );
                                                                    }}
                                                                    className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-red-50 px-2 py-1 text-xs text-red-600 hover:text-red-800"
                                                                >
                                                                    <X className="h-3.5 w-3.5" />{' '}
                                                                </button>
                                                            </>
                                                        )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!corrections?.data ||
                                        corrections.data.length === 0) && (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="text-muted-foreground px-4 py-8 text-center"
                                            >
                                                <AlertCircle className="mx-auto mb-2 h-8 w-8 opacity-40" />
                                                Belum ada pengajuan koreksi.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                <Pagination meta={corrections} />
            </div>

            <ConfirmDialog
                open={approveCorrection !== null}
                onOpenChange={() => setApproveCorrection(null)}
                title="Setujui koreksi kehadiran?"
                description={`Koreksi ${approveCorrection?.employee?.name ?? ''} pada tanggal ${approveCorrection?.attendance_date ?? ''} akan disetujui dan data kehadiran akan diperbarui.`}
                confirmLabel="Setujui"
                cancelLabel="Batal"
                variant="warning"
                onConfirm={() => {
                    if (approveCorrection) {
                        router.post(`/corrections/${approveCorrection.id}/approve`);
                        setApproveCorrection(null);
                    }
                }}
            />

            <ConfirmDialog
                open={rejectCorrection !== null}
                onOpenChange={() => {
                    setRejectCorrection(null);
                    setRejectReason('');
                }}
                title="Tolak koreksi kehadiran?"
                description="Berikan alasan penolakan. Alasan ini akan dikembalikan kepada pemohon."
                confirmLabel="Tolak"
                cancelLabel="Batal"
                onConfirm={() => {
                    if (rejectCorrection) {
                        router.post(`/corrections/${rejectCorrection.id}/reject`, {
                            reason: rejectReason,
                        });
                        setRejectCorrection(null);
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
