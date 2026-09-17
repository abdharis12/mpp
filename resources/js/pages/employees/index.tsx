import { Head, Link, router, usePage } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Search, Users, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/pagination';
import ConfirmDialog from '@/components/confirm-dialog';
import { useState } from 'react';
import type { User } from '@/types';

export default function EmployeeIndex({ employees }: { employees: any }) {
    const { flash, errors } = usePage().props;
    const [deleteEmployee, setDeleteEmployee] = useState<any>(null);

    return (
        <>
            <Head title="Petugas" />
            <div className="space-y-6 p-10">
                <div className="border-border flex items-center justify-between border-b pb-4">
                    <div>
                        <h1 className="text-2xl font-semibold">Data Petugas</h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Petugas tenant yang mengisi absensi
                        </p>
                    </div>
                    <Link
                        href="/employees/create"
                        className="bg-secondary hover:bg-secondary/90 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white"
                    >
                        <Plus className="h-4 w-4" />
                        Tambah Petugas
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
                                            Kode
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Nama
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Tenant
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Jabatan
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Email
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
                                    {employees?.data?.map((emp: any) => (
                                        <tr
                                            key={emp.id}
                                            className="hover:bg-muted/30"
                                        >
                                            <td className="px-4 py-3 font-mono text-xs">
                                                {emp.employee_code}
                                            </td>
                                            <td className="px-4 py-3 font-medium">
                                                {emp.name}
                                            </td>
                                            <td className="text-muted-foreground px-4 py-3">
                                                {emp.tenant?.name ?? '-'}
                                            </td>
                                            <td className="text-muted-foreground px-4 py-3">
                                                {emp.position ?? '-'}
                                            </td>
                                            <td className="text-muted-foreground px-4 py-3">
                                                {emp.email ?? '-'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        emp.is_active
                                                            ? 'bg-emerald-50 text-emerald-700'
                                                            : 'bg-red-50 text-red-700'
                                                    }
                                                >
                                                    {emp.is_active
                                                        ? 'Aktif'
                                                        : 'Nonaktif'}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={`/employees/${emp.id}/edit`}
                                                        className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs text-blue-600 hover:text-blue-800"
                                                    >
                                                        <Pencil className="h-3.5 w-3.5" />{' '}
                                                    </Link>
                                                    <button
                                                        onClick={() =>
                                                            setDeleteEmployee(
                                                                emp,
                                                            )
                                                        }
                                                        className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-red-50 px-2 py-1 text-xs text-red-600 hover:text-red-800"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />{' '}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!employees?.data ||
                                        employees.data.length === 0) && (
                                        <tr>
                                            <td
                                                colSpan={7}
                                                className="text-muted-foreground px-4 py-8 text-center"
                                            >
                                                <Users className="mx-auto mb-2 h-8 w-8 opacity-40" />
                                                Belum ada petugas.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                <Pagination meta={employees} />
            </div>

            <ConfirmDialog
                open={deleteEmployee !== null}
                onOpenChange={() => setDeleteEmployee(null)}
                title="Hapus petugas?"
                description={`Petugas "${deleteEmployee?.name ?? ''}" beserta seluruh data kehadirannya akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.`}
                confirmLabel="Hapus"
                cancelLabel="Batal"
                onConfirm={() => {
                    if (deleteEmployee) {
                        router.delete(`/employees/${deleteEmployee.id}`);
                        setDeleteEmployee(null);
                    }
                }}
            />
        </>
    );
}
