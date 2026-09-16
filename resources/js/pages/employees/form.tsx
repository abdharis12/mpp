import { Form, Head, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { store, update } from '@/routes/employees';

export default function EmployeeForm({
    employee,
    tenants,
}: {
    employee: any | null;
    tenants: any;
}) {
    const { errors } = usePage().props;

    return (
        <>
            <Head title={employee ? 'Edit Petugas' : 'Tambah Petugas'} />
            <div className="max-w-2xl space-y-6 p-10">
                <div className="border-border border-b pb-4">
                    <h1 className="text-2xl font-semibold">
                        {employee ? 'Edit Petugas' : 'Tambah Petugas'}
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Akun login otomatis dibuat untuk petugas baru.
                    </p>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <Form
                            {...(
                                (employee
                                    ? update({ employee: employee.id })
                                    : store) as any
                            ).form()}
                            className="space-y-4"
                        >
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nama Lengkap</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        defaultValue={employee?.name}
                                        required
                                        placeholder="Nama petugas"
                                    />
                                    <InputError message={errors.name} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="employee_code">
                                        Kode Petugas
                                    </Label>
                                    <Input
                                        id="employee_code"
                                        name="employee_code"
                                        defaultValue={employee?.employee_code}
                                        required
                                        placeholder="EMP-0001"
                                    />
                                    <InputError
                                        message={errors.employee_code}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        defaultValue={employee?.email}
                                        disabled={Boolean(employee)}
                                        required
                                        placeholder="petugas@example.com"
                                    />
                                    <InputError message={errors.email} />
                                </div>
                                {!employee && (
                                    <div className="space-y-2">
                                        <Label htmlFor="password">
                                            Password Awal
                                        </Label>
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            required
                                            placeholder="Min. 8 karakter"
                                        />
                                        <InputError message={errors.password} />
                                    </div>
                                )}
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="position">Jabatan</Label>
                                    <Input
                                        id="position"
                                        name="position"
                                        defaultValue={employee?.position}
                                        placeholder="Petugas Layanan"
                                    />
                                    <InputError message={errors.position} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Telepon</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        defaultValue={employee?.phone}
                                        placeholder="08xxxxxxxxxx"
                                    />
                                    <InputError message={errors.phone} />
                                </div>
                            </div>

                            {!employee && (
                                <div className="space-y-2">
                                    <Label htmlFor="tenant_id">Tenant</Label>
                                    <select
                                        id="tenant_id"
                                        name="tenant_id"
                                        defaultValue=""
                                        className="border-input focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs"
                                    >
                                        <option value="">
                                            -- Pilih Tenant --
                                        </option>
                                        {tenants?.map((t: any) => (
                                            <option key={t.id} value={t.id}>
                                                {t.name} ({t.code})
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.tenant_id} />
                                </div>
                            )}

                            {employee && (
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is_active"
                                        name="is_active"
                                        defaultChecked={employee.is_active}
                                    />
                                    <Label htmlFor="is_active">
                                        Petugas aktif
                                    </Label>
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <Button type="submit">Simpan</Button>
                            </div>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
