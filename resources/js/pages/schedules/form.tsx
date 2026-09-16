import { Form, Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { store, update } from '@/routes/schedules';

const DAY_NAMES = [
    '',
    'Senin',
    'Selasa',
    'Rabu',
    'Kamis',
    'Jumat',
    'Sabtu',
    'Minggu',
];

type DayInput = {
    day_of_week: number;
    start_time: string;
    end_time: string;
    is_working_day: boolean;
};

function sourceDays(schedule: any | null): DayInput[] {
    if (schedule) {
        return [1, 2, 3, 4, 5, 6, 7].map((d) => {
            const day = schedule.days?.find((x: any) => x.day_of_week === d);

            return {
                day_of_week: d,
                start_time: day?.is_working_day ? (day.start_time ?? '') : '',
                end_time: day?.is_working_day ? (day.end_time ?? '') : '',
                is_working_day: Boolean(day?.is_working_day),
            };
        });
    }

    return [
        {
            day_of_week: 1,
            start_time: '08:00',
            end_time: '16:00',
            is_working_day: true,
        },
        {
            day_of_week: 2,
            start_time: '08:00',
            end_time: '16:00',
            is_working_day: true,
        },
        {
            day_of_week: 3,
            start_time: '08:00',
            end_time: '16:00',
            is_working_day: true,
        },
        {
            day_of_week: 4,
            start_time: '08:00',
            end_time: '16:00',
            is_working_day: true,
        },
        {
            day_of_week: 5,
            start_time: '07:00',
            end_time: '16:30',
            is_working_day: true,
        },
        { day_of_week: 6, start_time: '', end_time: '', is_working_day: false },
        { day_of_week: 7, start_time: '', end_time: '', is_working_day: false },
    ];
}

export default function ScheduleForm({ schedule }: { schedule: any | null }) {
    const { errors } = usePage().props;
    const [days, setDays] = useState<DayInput[]>(() => sourceDays(schedule));

    const setDay = (index: number, patch: Partial<DayInput>) =>
        setDays((prev) =>
            prev.map((d, i) => (i === index ? { ...d, ...patch } : d)),
        );

    return (
        <>
            <Head title={schedule ? 'Edit Jadwal' : 'Tambah Jadwal'} />
            <div className="max-w-3xl space-y-6 p-10">
                <div className="border-border space-y-2 border-b pb-4">
                    <h1 className="text-2xl font-semibold">
                        {schedule ? 'Edit Jadwal' : 'Tambah Jadwal'}
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Definisikan jam kerja. Prioritas resolution: petugas →
                        tenant → global.
                    </p>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <Form
                            {...(
                                (schedule
                                    ? update({ schedule: schedule.id })
                                    : store) as any
                            ).form()}
                            className="space-y-5"
                        >
                            {days.map((day, i) => (
                                <input
                                    key={day.day_of_week}
                                    type="hidden"
                                    name={`days[${i}]`}
                                    value={JSON.stringify(day)}
                                />
                            ))}

                            <div className="space-y-2">
                                <Label htmlFor="name">Nama Jadwal</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    defaultValue={schedule?.name}
                                    required
                                    placeholder="Default MPP"
                                />
                                <InputError message={(errors as any)?.name} />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="grace">
                                        Masa Toleransi (menit)
                                    </Label>
                                    <Input
                                        id="grace"
                                        name="grace_period_minutes"
                                        type="number"
                                        min="0"
                                        defaultValue={
                                            schedule?.grace_period_minutes ?? 10
                                        }
                                        required
                                    />
                                    <InputError
                                        message={
                                            (errors as any)
                                                ?.grace_period_minutes
                                        }
                                    />
                                </div>
                                {schedule && (
                                    <div className="flex items-end pb-1">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="is_active"
                                                name="is_active"
                                                defaultChecked={
                                                    schedule.is_active
                                                }
                                            />
                                            <Label htmlFor="is_active">
                                                Jadwal aktif
                                            </Label>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3">
                                {days.map((day, i) => (
                                    <div
                                        key={day.day_of_week}
                                        className="bg-muted/40 flex flex-wrap items-center gap-3 rounded-lg p-3"
                                    >
                                        <div className="w-24 text-sm font-medium">
                                            {DAY_NAMES[day.day_of_week]}
                                        </div>
                                        <label className="flex items-center gap-2 text-sm">
                                            <Checkbox
                                                checked={day.is_working_day}
                                                onCheckedChange={(c) =>
                                                    setDay(i, {
                                                        is_working_day:
                                                            Boolean(c),
                                                    })
                                                }
                                            />
                                            Kerja
                                        </label>
                                        {day.is_working_day && (
                                            <div className="ml-auto flex items-center gap-2">
                                                <Input
                                                    type="time"
                                                    className="w-32"
                                                    value={day.start_time}
                                                    onChange={(e) =>
                                                        setDay(i, {
                                                            start_time:
                                                                e.target.value,
                                                        })
                                                    }
                                                />
                                                <span className="text-muted-foreground">
                                                    –
                                                </span>
                                                <Input
                                                    type="time"
                                                    className="w-32"
                                                    value={day.end_time}
                                                    onChange={(e) =>
                                                        setDay(i, {
                                                            end_time:
                                                                e.target.value,
                                                        })
                                                    }
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <Button type="submit">Simpan</Button>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
