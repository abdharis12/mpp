import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BLUE, GOLD, PELAYANAN_INTRO, type TodayInfo } from './content';
import { minutesOf, useJakartaNow } from './hooks';

type Props = { today: TodayInfo };

export default function Hero({ today }: Props) {
    const now = useJakartaNow();

    const todayIsWorking = today.is_working_day && !today.holiday;
    const curMin = now ? now.hours * 60 + now.minutes : 0;

    let jamStatus = !now ? 'Memuat…' : 'Libur pelayanan';
    let lampClass = 'opacity-25';
    let todayHoursLabel = 'Libur';

    if (today.holiday) {
        jamStatus = 'Libur — hari libur';
        todayHoursLabel = 'Libur';
    } else if (now && todayIsWorking) {
        const startMin = minutesOf(today.start);
        const endMin = minutesOf(today.end);
        todayHoursLabel = today.label ?? 'Lihat jadwal';
        if (curMin < startMin) {
            jamStatus = 'Belum buka';
            lampClass = 'opacity-40';
        } else if (curMin > endMin) {
            jamStatus = 'Sudah tutup';
            lampClass = 'opacity-25';
        } else {
            jamStatus = 'Sedang buka';
            lampClass = 'opacity-100';
        }
    } else if (now) {
        todayHoursLabel = 'Libur';
    }

    return (
        <section className="mx-auto grid w-full max-w-6xl items-stretch gap-10 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:px-8 lg:py-24">
            <div className="flex flex-col justify-center">
                <Badge
                    variant="pill"
                    className="bg-secondary/10 text-secondary mb-5 self-start"
                >
                    Mal Pelayanan Publik Kabupaten Muara Enim
                </Badge>
                <h1 className="max-w-lg text-4xl leading-[1.1] font-bold tracking-tight sm:text-5xl">
                    Satu atap untuk layanan publik Muara Enim.
                </h1>
                <p className="text-muted-foreground mt-6 max-w-md text-base leading-relaxed">
                    {PELAYANAN_INTRO}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                    <Button asChild size="lg" variant="outline">
                        <a href="#jadwal">Lihat jam layanan</a>
                    </Button>
                </div>
            </div>

            {/* status board — clay light */}
            <div
                className="border-border/70 bg-card relative flex flex-col justify-between overflow-hidden rounded-[1.5rem] border p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_2px_10px_rgba(18,60,134,0.14),0_20px_40px_rgba(18,60,134,0.2)] sm:p-8"
                style={{ borderLeft: `4px solid ${GOLD}` }}
                aria-label="Papan status layanan"
            >
                {/* dekorasi bulatan transparan — hiasan lembut */}
                <span
                    className="pointer-events-none absolute -top-14 -right-14 size-64 rounded-full bg-blue-400/10"
                    aria-hidden="true"
                />
                <span
                    className="pointer-events-none absolute right-14 -bottom-12 size-36 rounded-full bg-pink-400/10"
                    aria-hidden="true"
                />
                <span
                    className="pointer-events-none absolute -bottom-14 -left-8 size-32 rounded-full bg-green-400/10"
                    aria-hidden="true"
                />

                <div className="relative">
                    <p className="text-muted-foreground text-sm">
                        Papan status layanan
                    </p>
                    <p
                        className="mt-5 text-5xl font-semibold tracking-tight tabular-nums"
                        style={{ color: BLUE }}
                        suppressHydrationWarning
                    >
                        {now?.timeLabel ?? '--:--'}
                        <span className="text-muted-foreground text-2xl">
                            :{now?.secondsLabel ?? '--'}
                        </span>
                    </p>
                    <p
                        className="text-muted-foreground mt-2 text-sm"
                        suppressHydrationWarning
                    >
                        {now?.dateLabel ?? 'Memuat tanggal…'}
                    </p>
                </div>

                <div className="border-border/70 relative mt-8 border-t pt-6">
                    <div className="flex items-center justify-between gap-3">
                        <span className="text-foreground flex items-center gap-2.5 text-sm font-semibold">
                            <span
                                className={`inline-block size-2.5 rounded-full ${lampClass}`}
                                style={{ backgroundColor: GOLD }}
                                aria-hidden="true"
                                suppressHydrationWarning
                            />
                            {jamStatus}
                        </span>
                        <span className="text-muted-foreground text-sm tabular-nums">
                            {todayHoursLabel}
                        </span>
                    </div>
                    <p className="text-muted-foreground/60 mt-4 text-xs leading-relaxed">
                        Jadwal khusus dan hari libur ditetapkan oleh Admin MPP.
                    </p>
                </div>
            </div>
        </section>
    );
}
