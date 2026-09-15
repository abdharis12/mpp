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
    const canApprove = (auth as any)?.user?.all_permissions?.some(
        (p: any) => p.name === 'approve_correction',
    );
    const isStaff = Boolean((auth as any)?.user?.employee) && !canApprove;

    return (
        <>
            <Head title="Koreksi Absensi" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
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
                            className="bg-primary hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white"
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
                                                                        router.post(
                                                                            `/corrections/${c.id}/approve`,
                                                                        )
                                                                    }
                                                                    className="inline-flex items-center gap-1 px-2 py-1 text-xs text-emerald-600 hover:text-emerald-800"
                                                                >
                                                                    <Check className="h-3.5 w-3.5" />{' '}
                                                                    Setujui
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        const reason =
                                                                            prompt(
                                                                                'Alasan penolakan:',
                                                                            );
                                                                        if (
                                                                            reason
                                                                        ) {
                                                                            router.post(
                                                                                `/corrections/${c.id}/reject`,
                                                                                {
                                                                                    reason,
                                                                                },
                                                                            );
                                                                        }
                                                                    }}
                                                                    className="inline-flex items-center gap-1 px-2 py-1 text-xs text-red-600 hover:text-red-800"
                                                                >
                                                                    <X className="h-3.5 w-3.5" />{' '}
                                                                    Tolak
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
            </div>
        </>
    );
}
