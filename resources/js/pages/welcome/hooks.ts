import { useEffect, useState } from 'react';

// ISO weekday (Mon=1 .. Sun=7) dari index JS Date#getDay() (Sun=0 .. Sat=6)
export const toIsoDow = (jsDay: number): number => (jsDay === 0 ? 7 : jsDay);

// ----------------------------------------------------------------------------
// Jam Jakarta (live)
// ----------------------------------------------------------------------------
export const WEEKDAYS = [
    'Minggu',
    'Senin',
    'Selasa',
    'Rabu',
    'Kamis',
    'Jumat',
    'Sabtu',
];

export function jakartaParts(instant: Date) {
    const parts = new Intl.DateTimeFormat('id-ID', {
        timeZone: 'Asia/Jakarta',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hourCycle: 'h23',
    }).formatToParts(instant);
    const v = (t: string): string =>
        parts.find((p) => p.type === t)?.value ?? '';
    const weekday = v('weekday');
    return {
        dayOfWeek: WEEKDAYS.indexOf(weekday),
        hours: Number(v('hour')),
        minutes: Number(v('minute')),
        timeLabel: `${v('hour')}:${v('minute')}`,
        secondsLabel: v('second'),
        dateLabel: `${weekday}, ${Number(v('day'))} ${v('month')} ${v('year')}`,
    };
}

export function useJakartaNow() {
    const [now, setNow] = useState<ReturnType<typeof jakartaParts> | null>(
        null,
    );
    useEffect(() => {
        setNow(jakartaParts(new Date()));
        const id = window.setInterval(
            () => setNow(jakartaParts(new Date())),
            1000,
        );
        return () => window.clearInterval(id);
    }, []);
    return now;
}

export const minutesOf = (t: string | null): number => {
    if (!t) return 0;
    const [h, m] = t.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
};
