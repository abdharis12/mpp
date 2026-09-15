import { Card } from '@/components/ui/card';
import { BLUE, GOLD, type ScheduleRow } from './content';
import { toIsoDow, useJakartaNow } from './hooks';
import { SectionHeading } from './helpers';

type Props = { schedule: ScheduleRow[] };

export default function ScheduleSection({ schedule }: Props) {
    const now = useJakartaNow();
    const todayIsoDow = now ? toIsoDow(now.dayOfWeek) : -1;

    return (
        <section
            id="jadwal"
            className="border-border/70 mx-auto w-full max-w-6xl scroll-mt-20 border-t px-6 py-16 lg:px-8 lg:py-20"
            aria-labelledby="jadwal-title"
        >
            <SectionHeading
                eyebrow="Jadwal"
                title="Jam layanan mingguan"
                description="Sesuaikan kedatangan Anda dengan jadwal hari ini."
            />
            <Card className="overflow-hidden p-0">
                <ul className="divide-border/70 divide-y">
                    {schedule.map((row) => {
                        const isToday = row.day_numbers.includes(todayIsoDow);
                        return (
                            <li
                                key={row.label}
                                className="flex items-center justify-between gap-4 border-l-4 py-5 pr-5 pl-5 sm:pr-8"
                                style={{
                                    borderColor: isToday ? GOLD : 'transparent',
                                    backgroundColor: isToday
                                        ? 'rgba(18,60,134,0.04)'
                                        : undefined,
                                }}
                            >
                                <div>
                                    <p className="text-sm font-medium">
                                        {row.label}
                                    </p>
                                    {isToday && (
                                        <p
                                            className="mt-0.5 text-xs font-medium"
                                            style={{ color: BLUE }}
                                        >
                                            Hari ini
                                        </p>
                                    )}
                                </div>
                                <p
                                    className={`text-sm tabular-nums ${
                                        row.is_working_day
                                            ? 'text-foreground font-semibold'
                                            : 'text-muted-foreground'
                                    }`}
                                >
                                    {row.hours}
                                </p>
                            </li>
                        );
                    })}
                </ul>
                <div className="border-border/70 border-t px-6 py-4 sm:px-8">
                    <p className="text-muted-foreground text-xs">
                        Jadwal bersumber dari sistem penjadwalan MPP. Hari libur
                        nasional otomatis ditandai sebagai libur.
                    </p>
                </div>
            </Card>
        </section>
    );
}
