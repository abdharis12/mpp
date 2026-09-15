import { Form, Head, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/textarea';
import { store, update } from '@/routes/tenants';

export default function TenantForm({ tenant }: { tenant: any | null }) {
    const { errors } = usePage().props;

    const action = tenant ? update({ tenant: tenant.id }) : store();

    return (
        <>
            <Head title={tenant ? 'Edit Tenant' : 'Tambah Tenant'} />
            <div className="max-w-2xl space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold">
                        {tenant ? 'Edit Tenant' : 'Tambah Tenant'}
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Lengkapi informasi instansi tenant.
                    </p>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <Form
                            {...(
                                (tenant
                                    ? update({ tenant: tenant.id })
                                    : store) as any
                            ).form()}
                            className="space-y-4"
                        >
                            <div className="space-y-2">
                                <Label htmlFor="code">Kode Tenant</Label>
                                <Input
                                    id="code"
                                    name="code"
                                    defaultValue={tenant?.code}
                                    disabled={Boolean(tenant)}
                                    required
                                    placeholder="DPMPTSP"
                                />
                                <InputError message={errors.code} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="name">Nama Instansi</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    defaultValue={tenant?.name}
                                    required
                                    placeholder="Dinas Penanaman Modal dan PTSP"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Deskripsi</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    defaultValue={tenant?.description}
                                    placeholder="Deskripsi singkat tenant"
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Telepon</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        defaultValue={tenant?.phone}
                                        placeholder="(0718) 000000"
                                    />
                                    <InputError message={errors.phone} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        defaultValue={tenant?.email}
                                        placeholder="tenant@example.com"
                                    />
                                    <InputError message={errors.email} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Alamat</Label>
                                <Textarea
                                    id="address"
                                    name="address"
                                    defaultValue={tenant?.address}
                                    placeholder="Alamat lengkap"
                                />
                                <InputError message={errors.address} />
                            </div>

                            {tenant && (
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is_active"
                                        name="is_active"
                                        defaultChecked={tenant.is_active}
                                    />
                                    <Label htmlFor="is_active">
                                        Tenant aktif
                                    </Label>
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <Button type="submit" variant="default">
                                    Simpan
                                </Button>
                            </div>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
