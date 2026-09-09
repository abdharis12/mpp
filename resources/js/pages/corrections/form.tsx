import { Form, Head, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/textarea';
import { store } from '@/routes/corrections';

export default function CorrectionForm({
    attendances,
    correction_types,
}: {
    attendances: any;
    correction_types: string[];
}) {
    const { errors } = usePage().props;

    return (
        <>
            <Head title="Ajukan Koreksi" />
            <div className="max-w-2xl space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold">Ajukan Koreksi Absensi</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Koreksi hanya dapat dilakukan pada data kehadiran yang sudah tercatat.
                    </p>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <Form {...((store as any)()).form()} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="attendance_id">Kehadiran Terkait</Label>
                                <select
                                    id="attendance_id"
                                    name="attendance_id"
                                    defaultValue=""
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50"
                                >
                                    <option value="">-- Pilih kehadiran --</option>
                                    {attendances?.map((a: any) => (
                                        <option key={a.id} value={a.id}>
                                            {a.attendance_date} — {a.status}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.attendance_id} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="correction_type">Jenis Koreksi</Label>
                                <select
                                    id="correction_type"
                                    name="correction_type"
                                    defaultValue=""
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50"
                                >
                                    <option value="">-- Pilih Jenis --</option>
                                    {correction_types?.map((ct: string) => (
                                        <option key={ct} value={ct}>
                                            {ct.replace(/_/g, ' ')}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.correction_type} />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="requested_clock_in">Jam Masuk yang Diminta</Label>
                                    <Input id="requested_clock_in" name="requested_clock_in" type="datetime-local" />
                                    <InputError message={errors.requested_clock_in} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="requested_clock_out">Jam Pulang yang Diminta</Label>
                                    <Input id="requested_clock_out" name="requested_clock_out" type="datetime-local" />
                                    <InputError message={errors.requested_clock_out} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="reason">Alasan Koreksi</Label>
                                <Textarea id="reason" name="reason" required placeholder="Jelaskan alasan pengajuan koreksi" />
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