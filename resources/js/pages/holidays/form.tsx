import { Form, Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/textarea';
import { store, update } from '@/routes/holidays';

type Period = {
    holiday_date: string;
    start_time: string;
    end_time: string;
    is_full_day: boolean;
};

export default function HolidayForm({
    holiday,
    holiday_types,
}: {
    holiday: any | null;
    holiday_types: string[];
}) {
    const { errors, flash } = usePage().props;
    const [fullDay, setFullDay] = useState(
        holiday ? Boolean(holiday.is_full_day) : true,
    );
    const [startDate, setStartDate] = useState(holiday?.start_date ?? '');
    const [endDate, setEndDate] = useState(holiday?.end_date ?? '');

    const [periods, setPeriods] = useState<Period[]>(
        holiday?.periods?.length
            ? holiday.periods.map((p: any) => ({
                  holiday_date: p.holiday_date,
                  start_time: p.start_time ?? '',
                  end_time: p.end_time ?? '',
                  is_full_day: Boolean(p.is_full_day),
              }))
            : [
                  {
                      holiday_date: '',
                      start_time: '08:00',
                      end_time: '16:00',
                      is_full_day: true,
                  },
              ],
    );

    const setPeriod = (i: number, patch: Partial<Period>) =>
        setPeriods((prev) =>
            prev.map((p, idx) => (idx === i ? { ...p, ...patch } : p)),
        );

    const addPeriod = () =>
        setPeriods([
            ...periods,
            {
                holiday_date: '',
                start_time: '08:00',
                end_time: '16:00',
                is_full_day: true,
            },
        ]);

    const removePeriod = (i: number) =>
        setPeriods(periods.filter((_, idx) => idx !== i));

    // Build form data by injecting controlled fields via ref-free approach: use hidden inputs
    return (
        <>
            <Head title={holiday ? 'Edit Hari Libur' : 'Tambah Hari Libur'} />
            <div className="max-w-3xl space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold">
                        {holiday ? 'Edit Hari Libur' : 'Tambah Hari Libur'}
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Dukungan full-day, parsial, dan multi-hari.
                    </p>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <Form
                            {...(
                                (holiday
                                    ? update({ holiday: holiday.id })
                                    : store) as any
                            ).form()}
                            className="space-y-4"
                        >
                            <input
                                type="hidden"
                                name="is_full_day"
                                value={fullDay ? '1' : '0'}
                            />
                            <input
                                type="hidden"
                                name="start_date"
                                value={startDate}
                            />
                            <input
                                type="hidden"
                                name="end_date"
                                value={endDate}
                            />
                            {periods.map((p, i) => (
                                <input
                                    key={i}
                                    type="hidden"
                                    name={`periods[${i}]`}
                                    value={JSON.stringify(p)}
                                />
                            ))}

                            <div className="space-y-2">
                                <Label htmlFor="name">Nama Hari Libur</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    defaultValue={holiday?.name}
                                    required
                                    placeholder="Hari Kemerdekaan RI"
                                />
                                <InputError message={(errors as any)?.name} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="holiday_type">Jenis</Label>
                                <select
                                    id="holiday_type"
                                    name="holiday_type"
                                    defaultValue={
                                        holiday?.holiday_type ??
                                        'NATIONAL_HOLIDAY'
                                    }
                                    className="border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs"
                                >
                                    {holiday_types?.map((t: string) => (
                                        <option key={t} value={t}>
                                            {t.replace(/_/g, ' ')}
                                        </option>
                                    ))}
                                </select>
                                <InputError
                                    message={(errors as any)?.holiday_type}
                                />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="start_date">
                                        Tanggal Mulai
                                    </Label>
                                    <Input
                                        id="start_date"
                                        type="date"
                                        value={startDate}
                                        onChange={(e) =>
                                            setStartDate(e.target.value)
                                        }
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="end_date">
                                        Tanggal Selesai
                                    </Label>
                                    <Input
                                        id="end_date"
                                        type="date"
                                        value={endDate}
                                        onChange={(e) =>
                                            setEndDate(e.target.value)
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="full_day"
                                    checked={fullDay}
                                    onCheckedChange={(c) =>
                                        setFullDay(Boolean(c))
                                    }
                                />
                                <Label htmlFor="full_day">
                                    Libur seharian (full day)
                                </Label>
                            </div>

                            {!fullDay && (
                                <div className="bg-muted/40 space-y-3 rounded-lg p-4">
                                    <p className="text-sm font-medium">
                                        Periode Libur Sebagian
                                    </p>
                                    {periods.map((p, i) => (
                                        <div
                                            key={i}
                                            className="flex flex-wrap items-end gap-2"
                                        >
                                            <div className="space-y-1">
                                                <Label className="text-xs">
                                                    Tanggal
                                                </Label>
                                                <Input
                                                    type="date"
                                                    className="w-40"
                                                    value={p.holiday_date}
                                                    onChange={(e) =>
                                                        setPeriod(i, {
                                                            holiday_date:
                                                                e.target.value,
                                                        })
                                                    }
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs">
                                                    Mulai
                                                </Label>
                                                <Input
                                                    type="time"
                                                    className="w-32"
                                                    value={p.start_time}
                                                    onChange={(e) =>
                                                        setPeriod(i, {
                                                            start_time:
                                                                e.target.value,
                                                        })
                                                    }
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs">
                                                    Selesai
                                                </Label>
                                                <Input
                                                    type="time"
                                                    className="w-32"
                                                    value={p.end_time}
                                                    onChange={(e) =>
                                                        setPeriod(i, {
                                                            end_time:
                                                                e.target.value,
                                                        })
                                                    }
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removePeriod(i)}
                                                className="text-xs text-red-600"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={addPeriod}
                                        className="text-xs text-blue-600 underline"
                                    >
                                        + Tambah periode
                                    </button>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="description">Keterangan</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    defaultValue={holiday?.description}
                                    placeholder="Alasan / keterangan libur"
                                />
                                <InputError
                                    message={(errors as any)?.description}
                                />
                            </div>

                            <Button type="submit">Simpan</Button>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
