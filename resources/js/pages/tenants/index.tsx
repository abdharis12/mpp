import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Plus, Pencil, Trash2 } from 'lucide-react';
import { router } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { Pagination } from '@/components/pagination';

export default function TenantIndex({ tenants }: { tenants: any }) {
    const { flash } = usePage().props;

    return (
        <>
            <Head title="Tenant" />
            <div className="space-y-6 p-10">
                <div className="border-border flex items-center justify-between border-b pb-4">
                    <div>
                        <h1 className="text-2xl font-semibold">Data Tenant</h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Instansi/OPD yang menjadi tenant di Mal Pelayanan
                            Publik
                        </p>
                    </div>
                    <Link
                        href="/tenants/create"
                        className="bg-secondary hover:bg-secondary/90 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white"
                    >
                        <Plus className="h-4 w-4" />
                        Tambah Tenant
                    </Link>
                </div>

                {flash?.success && (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                        {flash.success}
                    </div>
                )}

                <Card>
                    <CardContent className="overflow-hidden p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50">
                                    <tr className="text-muted-foreground text-left text-xs tracking-wider uppercase">
                                        <th className="px-4 py-3 font-medium">
                                            Kode
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Nama
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Kontak
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Status
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Petugas
                                        </th>
                                        <th className="px-4 py-3 text-right font-medium">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-border divide-y">
                                    {tenants?.data?.map((tenant: any) => (
                                        <tr
                                            key={tenant.id}
                                            className="hover:bg-muted/30"
                                        >
                                            <td className="px-4 py-3 font-mono text-xs">
                                                {tenant.code}
                                            </td>
                                            <td className="px-4 py-3 font-medium">
                                                {tenant.name}
                                            </td>
                                            <td className="text-muted-foreground px-4 py-3">
                                                {tenant.phone ||
                                                    tenant.email ||
                                                    '-'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge
                                                    variant={
                                                        tenant.is_active
                                                            ? 'outline'
                                                            : 'secondary'
                                                    }
                                                    className={
                                                        tenant.is_active
                                                            ? 'bg-emerald-50 text-emerald-700'
                                                            : 'bg-red-50 text-red-700'
                                                    }
                                                >
                                                    {tenant.is_active
                                                        ? 'Aktif'
                                                        : 'Nonaktif'}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3">
                                                {tenant.employees_count ?? 0}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={`/tenants/${tenant.id}/edit`}
                                                        className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs text-blue-600 hover:text-blue-800"
                                                    >
                                                        <Pencil className="h-3.5 w-3.5" />{' '}
                                                    </Link>
                                                    <button
                                                        onClick={() => {
                                                            if (
                                                                confirm(
                                                                    'Hapus tenant ini?',
                                                                )
                                                            ) {
                                                                router.delete(
                                                                    `/tenants/${tenant.id}`,
                                                                );
                                                            }
                                                        }}
                                                        className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-red-50 px-2 py-1 text-xs text-red-600 hover:text-red-800"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />{' '}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!tenants?.data ||
                                        tenants.data.length === 0) && (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="text-muted-foreground px-4 py-8 text-center"
                                            >
                                                <Building2 className="mx-auto mb-2 h-8 w-8 opacity-40" />
                                                Belum ada tenant.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                <Pagination meta={tenants} />
            </div>
        </>
    );
}
