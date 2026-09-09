import { Form, Head, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/textarea';
import { store } from '@/routes/leaves';

export default function LeaveForm({ leave_types }: { leave_types: any }) {
    const { errors } = usePage().props;

    return (
        <>
            <Head title="Ajukan Izin" />
            <div className="max-w-2xl space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold">Ajukan Izin</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Pengajuan izin akan membutuhkan persetujuan admin.
                    </p>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <Form {...((store as any)()).form()} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="leave_type_id">Jenis Izin</Label>
                                <select
                                    id="leave_type_id"
                                    name="leave_type_id"
                                    defaultValue=""
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50"
                                >
                                    <option value="">-- Pilih Jenis Izin --</option>
                                    {leave_types?.map((lt: any) => (
                                        <option key={lt.id} value={lt.id}>
                                            {lt.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.leave_type_id} />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="start_date">Tanggal Mulai</Label>
                                    <Input id="start_date" name="start_date" type="date" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="end_date">Tanggal Selesai</Label>
                                    <Input id="end_date" name="end_date" type="date" required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="reason">Alasan</Label>
                                <Textarea id="reason" name="reason" required placeholder="Jelaskan alasan pengajuan izin" />
                                <InputError message={errors.reason} />
                            </div>

                            <Button type="submit">Kirim Pengajuan</Button>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}