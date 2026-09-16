import { Head, usePage, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, MapPin, Navigation, XCircle } from 'lucide-react';
import { update } from '@/routes/locations';
import AdminLocationMap from '@/components/admin-location-map';
import { useCallback, useRef, useState, useEffect } from 'react';

export default function LocationIndex({ locations }: { locations: any }) {
    const { flash } = usePage().props;

    return (
        <>
            <Head title="Lokasi Absensi Pegawai" />
            <div className="border-border mx-6 my-5 flex max-w-7xl flex-col gap-1 border-b pb-4">
                <h1 className="text-2xl font-semibold">
                    Lokasi Absensi Pegawai Tenant
                </h1>
                <p className="text-muted-foreground mt-1 text-sm">
                    Pengaturan Titik koordinat, radius, dan toleransi akurasi
                    GPS untuk validasi clock-in/out.
                </p>
            </div>
            <div className="mx-6 my-5 max-w-5xl">
                {(flash as any)?.success && (
                    <Alert className="mb-5 border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        <AlertTitle>Berhasil</AlertTitle>
                        <AlertDescription className="text-emerald-700 dark:text-emerald-300">
                            {(flash as any).success}
                        </AlertDescription>
                    </Alert>
                )}

                {locations?.map((loc: any) => (
                    <LocationCard key={loc.id} loc={loc} />
                ))}

                {(!locations || locations.length === 0) && (
                    <Card>
                        <CardContent className="text-muted-foreground py-10 text-center">
                            Belum ada lokasi absensi.
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
}

function LocationCard({ loc }: { loc: any }) {
    const { data, setData, patch, processing, errors } = useForm({
        latitude: String(loc.latitude),
        longitude: String(loc.longitude),
        radius_meter: String(loc.radius_meter),
        maximum_gps_accuracy: String(loc.maximum_gps_accuracy),
        is_active: !!loc.is_active,
    });

    const [localAlert, setLocalAlert] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);
    const [fetching, setFetching] = useState(false);
    const [radiusPreview, setRadiusPreview] = useState(
        Number(loc.radius_meter),
    );
    const [accuracy, setAccuracy] = useState<number | null>(null);
    const [watching, setWatching] = useState(false);
    const watchIdRef = useRef<number | null>(null);
    const watchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleMapChange = useCallback(
        (newLat: number, newLng: number) => {
            setData(
                (prev) =>
                    ({
                        ...prev,
                        latitude: String(newLat),
                        longitude: String(newLng),
                    }) as any,
            );
        },
        [setData],
    );

    useEffect(() => {
        setRadiusPreview(Number(data.radius_meter));
    }, [data.radius_meter]);

    useEffect(() => {
        return () => {
            if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(watchIdRef.current);
            }
            if (watchTimeoutRef.current) {
                clearTimeout(watchTimeoutRef.current);
            }
        };
    }, []);

    const stopWatching = () => {
        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }
        if (watchTimeoutRef.current) {
            clearTimeout(watchTimeoutRef.current);
            watchTimeoutRef.current = null;
        }
        setWatching(false);
        setFetching(false);
    };

    const useCurrentLocation = () => {
        if (!navigator.geolocation || watchIdRef.current !== null) return;

        setFetching(true);
        setWatching(true);
        setAccuracy(null);

        watchIdRef.current = navigator.geolocation.watchPosition(
            (pos) => {
                const acc = pos.coords.accuracy;
                setAccuracy(acc);
                setData(
                    (prev) =>
                        ({
                            ...prev,
                            latitude: String(pos.coords.latitude),
                            longitude: String(pos.coords.longitude),
                        }) as any,
                );

                if (acc <= 10) {
                    stopWatching();
                }
            },
            () => {
                stopWatching();
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
        );

        watchTimeoutRef.current = setTimeout(stopWatching, 8000);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(update.url({ location: loc.id }), {
            onSuccess: () =>
                setLocalAlert({
                    type: 'success',
                    message: 'Lokasi berhasil diperbarui.',
                }),
            onError: () =>
                setLocalAlert({
                    type: 'error',
                    message: 'Gagal menyimpan lokasi. Periksa input.',
                }),
        } as any);
    };

    useEffect(() => {
        if (localAlert) {
            const t = setTimeout(() => setLocalAlert(null), 4000);
            return () => clearTimeout(t);
        }
    }, [localAlert]);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center gap-3">
                <div className="rounded-full bg-blue-100 p-2 text-blue-700">
                    <MapPin className="h-5 w-5" />
                </div>
                <div>
                    <CardTitle className="text-lg">{loc.name}</CardTitle>
                    <p className="text-muted-foreground text-sm">
                        Lokasi aktif untuk seluruh tenant
                    </p>
                </div>
            </CardHeader>
            <CardContent>
                <div className="mb-4">
                    <AdminLocationMap
                        latitude={Number(data.latitude)}
                        longitude={Number(data.longitude)}
                        radius={
                            Number.isFinite(radiusPreview)
                                ? radiusPreview
                                : Number(loc.radius_meter)
                        }
                        onChange={handleMapChange}
                    />
                </div>

                {localAlert && (
                    <Alert
                        variant={
                            localAlert.type === 'error'
                                ? 'destructive'
                                : 'default'
                        }
                        className={
                            localAlert.type === 'success'
                                ? 'mb-4 border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300'
                                : 'mb-4'
                        }
                    >
                        {localAlert.type === 'success' ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                            <XCircle className="h-4 w-4" />
                        )}
                        <AlertTitle>
                            {localAlert.type === 'success'
                                ? 'Berhasil'
                                : 'Gagal'}
                        </AlertTitle>
                        <AlertDescription
                            className={
                                localAlert.type === 'success'
                                    ? 'text-emerald-700 dark:text-emerald-300'
                                    : ''
                            }
                        >
                            {localAlert.message}
                        </AlertDescription>
                    </Alert>
                )}

                <form onSubmit={submit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor={`lat-${loc.id}`}>Latitude</Label>
                            <Input
                                id={`lat-${loc.id}`}
                                type="number"
                                step="0.0000001"
                                value={data.latitude}
                                onChange={(e) =>
                                    setData('latitude', e.target.value)
                                }
                                required
                            />
                            {errors.latitude && (
                                <p className="text-destructive text-sm">
                                    {errors.latitude}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor={`lon-${loc.id}`}>Longitude</Label>
                            <Input
                                id={`lon-${loc.id}`}
                                type="number"
                                step="0.0000001"
                                value={data.longitude}
                                onChange={(e) =>
                                    setData('longitude', e.target.value)
                                }
                                required
                            />
                            {errors.longitude && (
                                <p className="text-destructive text-sm">
                                    {errors.longitude}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor={`radius-${loc.id}`}>
                                Radius (meter)
                            </Label>
                            <Input
                                id={`radius-${loc.id}`}
                                type="number"
                                step="0.01"
                                min="1"
                                value={data.radius_meter}
                                onChange={(e) =>
                                    setData('radius_meter', e.target.value)
                                }
                                required
                            />
                            {errors.radius_meter && (
                                <p className="text-destructive text-sm">
                                    {errors.radius_meter}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor={`acc-${loc.id}`}>
                                Maks. Akurasi GPS (meter)
                            </Label>
                            <Input
                                id={`acc-${loc.id}`}
                                type="number"
                                step="0.01"
                                min="1"
                                value={data.maximum_gps_accuracy}
                                onChange={(e) =>
                                    setData(
                                        'maximum_gps_accuracy',
                                        e.target.value,
                                    )
                                }
                                required
                            />
                            {errors.maximum_gps_accuracy && (
                                <p className="text-destructive text-sm">
                                    {errors.maximum_gps_accuracy}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id={`active-${loc.id}`}
                            checked={data.is_active}
                            onCheckedChange={(v) =>
                                setData('is_active', v === true)
                            }
                        />
                        <Label htmlFor={`active-${loc.id}`}>Aktif</Label>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={useCurrentLocation}
                            disabled={fetching}
                        >
                            <Navigation className="mr-1.5 h-4 w-4" />
                            {fetching ? 'Mencari sinyal...' : 'Lokasi saat ini'}
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan Lokasi'}
                        </Button>
                    </div>

                    {accuracy !== null && (
                        <p
                            className={`text-sm ${
                                accuracy > Number(data.maximum_gps_accuracy)
                                    ? 'text-destructive'
                                    : 'text-muted-foreground'
                            }`}
                        >
                            Akurasi posisi saat ini: ±{Math.round(accuracy)} m
                            {watching && ' · memperbarui…'}
                        </p>
                    )}
                    {accuracy !== null &&
                        accuracy > Number(data.maximum_gps_accuracy) && (
                            <p className="text-destructive text-sm">
                                Akurasi melebihi batas (
                                {Number(data.maximum_gps_accuracy)} m). Tunggu
                                sinyal membaik atau coba di area terbuka sebelum
                                menyimpan.
                            </p>
                        )}
                </form>
            </CardContent>
        </Card>
    );
}
