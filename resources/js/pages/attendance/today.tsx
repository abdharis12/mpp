import { Head, usePage } from '@inertiajs/react';
import { Form } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { clockIn, clockOut } from '@/routes/attendance';

type GeoState = {
    status: 'idle' | 'loading' | 'ready' | 'denied' | 'error';
    latitude?: number;
    longitude?: number;
    accuracy?: number;
    message?: string;
};

export default function AttendanceToday({
    date,
    schedule,
    working_periods,
    holiday,
    attendance,
    location,
}: {
    date: string;
    schedule: any;
    working_periods: any[];
    holiday: any | null;
    attendance: any | null;
    location: any | null;
}) {
    const { flash } = usePage().props;
    const [geo, setGeo] = useState<GeoState>({ status: 'idle' });
    const [distance, setDistance] = useState<number | null>(null);

    const acquireLocation = () => {
        if (!('geolocation' in navigator)) {
            setGeo({ status: 'error', message: 'Perangkat tidak mendukung geolokasi.' });
            return;
        }

        setGeo({ status: 'loading' });

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude, accuracy } = pos.coords;
                setGeo({ status: 'ready', latitude, longitude, accuracy });

                if (location) {
                    const d = haversine(
                        latitude,
                        longitude,
                        Number(location.latitude),
                        Number(location.longitude),
                    );
                    setDistance(d);
                }
            },
            (err) => {
                setGeo({
                    status: err.code === err.PERMISSION_DENIED ? 'denied' : 'error',
                    message:
                        err.code === err.PERMISSION_DENIED
                            ? 'Izin lokasi ditolak. Aktifkan izin lokasi browser untuk absensi.'
                            : `Gagal mendapatkan lokasi: ${err.message}`,
                });
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
        );
    };

    useEffect(() => {
        acquireLocation();
    }, []);

    const geoReady = geo.status === 'ready' && geo.latitude !== undefined;
    const inRadius = distance !== null && location ? distance <= Number(location.radius_meter) : null;

    return (
        <>
            <Head title="Absensi Hari Ini" />
            <div className="space-y-6 max-w-3xl">
                <div>
                    <h1 className="text-2xl font-semibold">Absensi Hari Ini</h1>
                    <p className="text-sm text-muted-foreground mt-1">{formatDateID(date)}</p>
                </div>

                {flash?.success && (
                    <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded-lg text-sm">
                        <CheckCircle2 className="h-4 w-4" />
                        {flash.success}
                    </div>
                )}

                {working_periods?.length === 0 && !holiday && (
                    <Card>
                        <CardContent className="py-10 text-center text-muted-foreground">
                            Hari ini bukan hari kerja. Tidak ada kewajiban absensi.
                        </CardContent>
                    </Card>
                )}

                {holiday && (
                    <Card>
                        <CardContent className="py-8 text-center space-y-2">
                            <AlertTriangle className="h-8 w-8 mx-auto text-amber-500" />
                            <p className="font-semibold">Hari Libur</p>
                            <p className="text-sm text-muted-foreground">{holiday.name}</p>
                            <p className="text-sm text-muted-foreground">Absensi tidak diperlukan.</p>
                        </CardContent>
                    </Card>
                )}

                {working_periods?.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                Jam Kerja Hari Ini
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {working_periods.map((p: any, i: number) => (
                                <div key={i} className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Periode {i + 1}</span>
                                    <span className="font-mono font-semibold">
                                        {p.start} – {p.end}
                                    </span>
                                </div>
                            ))}
                            {schedule && (
                                <p className="text-xs text-muted-foreground pt-2">
                                    Masa toleransi keterlambatan: {schedule.grace_period_minutes} menit.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            Lokasi Anda
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {geo.status === 'loading' && (
                            <p className="text-sm text-muted-foreground">Mengambil lokasi GPS…</p>
                        )}
                        {geo.status === 'denied' && (
                            <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
                                <XCircle className="h-4 w-4 mt-0.5" />
                                <div>
                                    <p className="font-medium">Izin lokasi ditolak</p>
                                    <p>{geo.message}</p>
                                </div>
                            </div>
                        )}
                        {geo.status === 'error' && (
                            <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
                                <XCircle className="h-4 w-4 mt-0.5" />
                                <p>{geo.message}</p>
                            </div>
                        )}

                        {geoReady && (
                            <div className="grid gap-2 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Koordinat</span>
                                    <span className="font-mono">
                                        {geo.latitude!.toFixed(7)}, {geo.longitude!.toFixed(7)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Akurasi</span>
                                    <span className="font-mono">{geo.accuracy?.toFixed(1)} m</span>
                                </div>
                                {distance !== null && location && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Jarak ke titik absensi</span>
                                        <span className="font-mono font-semibold">
                                            {distance.toFixed(1)} m / maks {Number(location.radius_meter).toFixed(0)} m
                                        </span>
                                    </div>
                                )}
                                {inRadius !== null && (
                                    <Badge
                                        variant="outline"
                                        className={inRadius ? 'bg-emerald-50 text-emerald-700 justify-center' : 'bg-red-50 text-red-700 justify-center'}
                                    >
                                        {inRadius ? 'Di dalam area absensi' : 'Di luar area absensi'}
                                    </Badge>
                                )}
                                <button
                                    type="button"
                                    onClick={acquireLocation}
                                    className="text-xs text-blue-600 hover:text-blue-800 underline"
                                >
                                    Perbarui lokasi
                                </button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {working_periods?.length > 0 && geoReady && (
                    <Card>
                        <CardContent className="pt-6 space-y-3">
                            {!attendance && inRadius && (
                                <Form
                                    {...clockIn.form()}
                                    transform={(data: any) => ({
                                        ...data,
                                        latitude: geo.latitude,
                                        longitude: geo.longitude,
                                        accuracy: geo.accuracy,
                                    })}
                                >
                                    {({ processing }: any) => (
                                        <Button type="submit" size="lg" className="w-full" disabled={processing}>
                                            {processing ? 'Memproses…' : 'Absen Masuk'}
                                        </Button>
                                    )}
                                </Form>
                            )}

                            {!attendance && !inRadius && (
                                <div className="text-center text-sm text-muted-foreground bg-muted/50 rounded-lg p-4">
                                    Anda berada di luar area absensi. Dekati titik lokasi untuk absen.
                                </div>
                            )}

                            {attendance && !attendance.clock_out && (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                                        <span className="text-emerald-700 font-medium">
                                            Masuk: {attendance.clock_in}
                                        </span>
                                        <Badge variant="outline" className="bg-emerald-100 text-emerald-700">
                                            {attendance.status}
                                        </Badge>
                                    </div>
                                    {inRadius && (
                                        <Form
                                            {...clockOut.form()}
                                            transform={(data: any) => ({
                                                ...data,
                                                latitude: geo.latitude,
                                                longitude: geo.longitude,
                                                accuracy: geo.accuracy,
                                            })}
                                        >
                                            {({ processing }: any) => (
                                                <Button
                                                    type="submit"
                                                    size="lg"
                                                    variant="secondary"
                                                    className="w-full"
                                                    disabled={processing}
                                                >
                                                    {processing ? 'Memproses…' : 'Absen Pulang'}
                                                </Button>
                                            )}
                                        </Form>
                                    )}
                                    {!inRadius && (
                                        <div className="text-center text-sm text-muted-foreground bg-muted/50 rounded-lg p-4">
                                            Anda berada di luar area absensi.
                                        </div>
                                    )}
                                </div>
                            )}

                            {attendance?.clock_out && (
                                <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 p-3 rounded-lg text-sm">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Absensi hari ini selesai ({attendance.clock_in} – {attendance.clock_out}).
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371000;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
}

function formatDateID(iso: string): string {
    try {
        return new Date(iso + 'T00:00:00').toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    } catch {
        return iso;
    }
}