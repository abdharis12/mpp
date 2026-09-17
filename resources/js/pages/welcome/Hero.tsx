import { useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import {
    GOLD,
    HERO_VIDEO_SRC,
    PELAYANAN_INTRO,
    type TodayInfo,
} from './content';
import { minutesOf, useJakartaNow } from './hooks';

type Props = { today: TodayInfo };

export default function Hero({ today }: Props) {
    const now = useJakartaNow();
    const videoRef = useRef<HTMLVideoElement>(null);

    const [videoReady, setVideoReady] = useState(false);
    const [videoError, setVideoError] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) {
            return;
        }
        const media = window.matchMedia('(prefers-reduced-motion: reduce)');
        const apply = () => {
            if (media.matches) {
                video.pause();
            } else {
                void video.play().catch(() => {});
            }
        };
        media.addEventListener('change', apply);
        apply();
        return () => media.removeEventListener('change', apply);
    }, []);

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
        <section className="relative w-full overflow-hidden py-16 lg:py-24">
            <video
                ref={videoRef}
                src={HERO_VIDEO_SRC}
                className="absolute inset-0 h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                onLoadedMetadata={() => setVideoReady(true)}
                onError={() => setVideoError(true)}
                tabIndex={-1}
                aria-hidden="true"
                disablePictureInPicture
            />
            {!videoReady && !videoError && (
                <div
                    className="absolute inset-0 z-[1] flex items-center justify-center"
                    aria-hidden="true"
                >
                    <Spinner className="size-10 text-white" />
                </div>
            )}
            <div
                className="absolute inset-0"
                style={{ backgroundColor: 'rgba(11, 38, 87, 0.55)' }}
                aria-hidden="true"
            />

            <div className="relative z-10 mx-auto w-full max-w-6xl px-6 lg:px-8">
                <div className="grid items-stretch gap-10 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
                    <div className="flex flex-col justify-center">
                        <Badge
                            variant="pill"
                            className="mb-5 self-start border-white/25 bg-white/15 text-white"
                        >
                            Mal Pelayanan Publik Kabupaten Muara Enim
                        </Badge>
                        <h1 className="max-w-lg text-4xl leading-[1.1] font-bold tracking-tight text-white sm:text-5xl">
                            Satu atap untuk layanan publik Muara Enim.
                        </h1>
                        <p className="mt-6 max-w-md text-base leading-relaxed text-white/85">
                            {PELAYANAN_INTRO}
                        </p>
                        <div className="mt-8 flex flex-wrap items-center gap-3">
                            <Button
                                asChild
                                size="lg"
                                variant="outline"
                                className="bg-background/10 border-white/70 text-white hover:bg-white/20 hover:text-white"
                            >
                                <a href="#jadwal">Lihat jam layanan</a>
                            </Button>
                        </div>
                    </div>

                    {/* status board — glass transparan */}
                    <div>
                        <div
                            className="relative flex flex-col justify-between overflow-hidden rounded-[1.5rem] border border-white/20 bg-white/40 p-5 shadow-[0_2px_10px_rgba(11,38,87,0.16),0_20px_40px_rgba(11,38,87,0.24)] backdrop-blur-md sm:p-6"
                            style={{ borderLeft: `4px solid ${GOLD}` }}
                            aria-label="Papan status layanan"
                        >
                            <div className="relative">
                                <p className="text-sm font-medium text-white/85">
                                    Papan status layanan
                                </p>
                                <p
                                    className="mt-4 text-4xl font-semibold tracking-tight text-white tabular-nums"
                                    suppressHydrationWarning
                                >
                                    {now?.timeLabel ?? '--:--'}
                                    <span className="text-xl text-white/80">
                                        :{now?.secondsLabel ?? '--'}
                                    </span>
                                </p>
                                <p
                                    className="mt-2 text-sm text-white/85"
                                    suppressHydrationWarning
                                >
                                    {now?.dateLabel ?? 'Memuat tanggal…'}
                                </p>
                            </div>

                            <div className="relative mt-6 border-t border-white/25 pt-5">
                                <div className="flex items-center justify-between gap-3">
                                    <span className="flex items-center gap-2.5 text-sm font-semibold text-white">
                                        <span
                                            className={`inline-block size-2.5 rounded-full ${lampClass}`}
                                            style={{ backgroundColor: GOLD }}
                                            aria-hidden="true"
                                            suppressHydrationWarning
                                        />
                                        {jamStatus}
                                    </span>
                                    <span className="text-sm text-white/85 tabular-nums">
                                        {todayHoursLabel}
                                    </span>
                                </div>
                                <p className="mt-4 text-xs leading-relaxed text-white/70">
                                    Jadwal khusus dan hari libur ditetapkan oleh
                                    Admin MPP.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
