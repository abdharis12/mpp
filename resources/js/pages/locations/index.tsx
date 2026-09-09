import { Form, Head, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { MapPin } from 'lucide-react';
import { update } from '@/routes/locations';

export default function LocationIndex({ locations }: { locations: any }) {
    const { flash, errors } = usePage().props;

    return (
        <>
            <Head title="Lokasi Absensi" />
            <div className="space-y-6 max-w-3xl">
                <div>
                    <h1 className="text-2xl font-semibold">Lokasi Absensi</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Titik koordinat, radius, dan toleransi akurasi GPS untuk validasi clock-in/out.
                    </p>
                </div>

                {(flash as any)?.success && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded-lg text-sm">
                        {(flash as any).success}
                    </div>
                )}

                {locations?.map((loc: any) => (
                    <Card key={loc.id}>
                        <CardHeader className="flex flex-row items-center gap-3">
                            <div className="bg-blue-100 text-blue-700 p-2 rounded-full">
                                <MapPin className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">{loc.name}</CardTitle>
                                <p className="text-sm text-muted-foreground">Lokasi aktif untuk seluruh tenant</p>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Form
                                {...(update({ location: loc.id }) as any).form()}
                                className="space-y-4"
                            >
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor={`lat-${loc.id}`}>Latitude</Label>
                                        <Input
                                            id={`lat-${loc.id}`}
                                            name="latitude"
                                            type="number"
                                            step="0.0000001"
                                            defaultValue={loc.latitude}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor={`lon-${loc.id}`}>Longitude</Label>
                                        <Input
                                            id={`lon-${loc.id}`}
                                            name="longitude"
                                            type="number"
                                            step="0.0000001"
                                            defaultValue={loc.longitude}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor={`radius-${loc.id}`}>Radius (meter)</Label>
                                        <Input
                                            id={`radius-${loc.id}`}
                                            name="radius_meter"
                                            type="number"
                                            step="0.01"
                                            min="1"
                                            defaultValue={loc.radius_meter}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor={`acc-${loc.id}`}>Maks. Akurasi GPS (meter)</Label>
                                        <Input
                                            id={`acc-${loc.id}`}
                                            name="maximum_gps_accuracy"
                                            type="number"
                                            step="0.01"
                                            min="1"
                                            defaultValue={loc.maximum_gps_accuracy}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox id={`active-${loc.id}`} name="is_active" defaultChecked={loc.is_active} />
                                    <Label htmlFor={`active-${loc.id}`}>Aktif</Label>
                                </div>

                                <Button type="submit">Simpan Lokasi</Button>
                            </Form>
                        </CardContent>
                    </Card>
                ))}

                {(!locations || locations.length === 0) && (
                    <Card>
                        <CardContent className="py-10 text-center text-muted-foreground">
                            Belum ada lokasi absensi.
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
}