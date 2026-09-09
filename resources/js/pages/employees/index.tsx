import { Head, Link, router, usePage } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Search, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { User } from '@/types';

export default function EmployeeIndex({ employees }: { employees: any }) {
    const { flash, errors } = usePage().props;

    return (
        <>
            <Head title="Petugas" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Data Petugas</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Petugas tenant yang mengisi absensi
                        </p>
                    </div>
                    <Link href="/employees/create" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90">
                        <Plus className="h-4 w-4" />
                        Tambah Petugas
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
                                        <th className="px-4 py-3 font-medium">Kode</th>
                                        <th className="px-4 py-3 font-medium">Nama</th>
                                        <th className="px-4 py-3 font-medium">Tenant</th>
                                        <th className="px-4 py-3 font-medium">Jabatan</th>
                                        <th className="px-4 py-3 font-medium">Email</th>
                                        <th className="px-4 py-3 font-medium">Status</th>
                                        <th className="px-4 py-3 font-medium text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {employees?.data?.map((emp: any) => (
                                        <tr key={emp.id} className="hover:bg-muted/30">
                                            <td className="px-4 py-3 font-mono text-xs">{emp.employee_code}</td>
                                            <td className="px-4 py-3 font-medium">{emp.name}</td>
                                            <td className="px-4 py-3 text-muted-foreground">{emp.tenant?.name ?? '-'}</td>
                                            <td className="px-4 py-3 text-muted-foreground">{emp.position ?? '-'}</td>
                                            <td className="px-4 py-3 text-muted-foreground">{emp.email ?? '-'}</td>
                                            <td className="px-4 py-3">
                                                <Badge variant="outline" className={emp.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}>
                                                    {emp.is_active ? 'Aktif' : 'Nonaktif'}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={`/employees/${emp.id}/edit`}
                                                        className="inline-flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:text-blue-800"
                                                    >
                                                        <Pencil className="h-3.5 w-3.5" /> Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => {
                                                            if (confirm(`Hapus petugas ${emp.name}?`)) {
                                                                router.delete(`/employees/${emp.id}`);
                                                            }
                                                        }}
                                                        className="inline-flex items-center gap-1 px-2 py-1 text-xs text-red-600 hover:text-red-800"
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!employees?.data || employees.data.length === 0) && (
                                        <tr>
                                            <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                                                <Users className="h-8 w-8 mx-auto mb-2 opacity-40" />
                                                Belum ada petugas.
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