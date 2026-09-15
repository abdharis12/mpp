import { ExternalLink, Mail, MapPin, Megaphone, Phone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { BLUE, PENGADUAN_CHANNELS } from './content';
import { SectionHeading } from './helpers';

export default function ComplaintSection() {
    return (
        <section
            id="pengaduan"
            className="border-border/70 mx-auto w-full max-w-6xl scroll-mt-20 border-t px-6 py-16 lg:px-8 lg:py-20"
            aria-labelledby="pengaduan-title"
        >
            <SectionHeading
                eyebrow="Pengaduan"
                title="Sampaikan keluhan atau masukan"
                description="Layanan pengaduan menerima keluhan terkait layanan atau petugas di lingkungan MPP."
            />
            <div className="grid gap-6 lg:grid-cols-2">
                <Card className="p-0">
                    <CardContent className="py-7">
                        <span
                            className="bg-primary/10 grid size-12 place-content-center rounded-2xl"
                            style={{ color: BLUE }}
                        >
                            <Megaphone className="size-6" aria-hidden="true" />
                        </span>
                        <h3 className="mt-4 text-base font-semibold">
                            Kanal resmi pengaduan
                        </h3>
                        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                            Sampaikan pengaduan melalui kanal resmi berikut.
                            (placeholder — verifikasi kanal yang aktif)
                        </p>
                        <ul className="mt-5 flex flex-col gap-3">
                            {PENGADUAN_CHANNELS.map((channel) => (
                                <li key={channel.label}>
                                    <a
                                        href={channel.href}
                                        target={
                                            channel.href.startsWith('http')
                                                ? '_blank'
                                                : undefined
                                        }
                                        rel={
                                            channel.href.startsWith('http')
                                                ? 'noopener noreferrer'
                                                : undefined
                                        }
                                        className="group border-border/70 hover:bg-accent/60 flex items-center justify-between gap-3 rounded-lg border px-4 py-3 transition-colors"
                                    >
                                        <span className="flex items-center gap-3">
                                            <span
                                                className="bg-accent grid size-8 place-content-center rounded-lg"
                                                style={{ color: BLUE }}
                                            >
                                                {channel.label ===
                                                    'Telepon' && (
                                                    <Phone
                                                        className="size-4"
                                                        aria-hidden="true"
                                                    />
                                                )}
                                                {channel.label ===
                                                    'WhatsApp' && (
                                                    <Mail
                                                        className="size-4"
                                                        aria-hidden="true"
                                                    />
                                                )}
                                                {channel.label === 'Email' && (
                                                    <Mail
                                                        className="size-4"
                                                        aria-hidden="true"
                                                    />
                                                )}
                                            </span>
                                            <span>
                                                <span className="text-muted-foreground block text-xs">
                                                    {channel.label}
                                                </span>
                                                <span className="block text-sm font-medium">
                                                    {channel.value}
                                                </span>
                                            </span>
                                        </span>
                                        <ExternalLink
                                            className="text-muted-foreground/60 size-4"
                                            aria-hidden="true"
                                        />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                <Card className="p-0">
                    <CardContent className="py-7">
                        <span
                            className="bg-primary/10 grid size-12 place-content-center rounded-2xl"
                            style={{ color: BLUE }}
                        >
                            <MapPin className="size-6" aria-hidden="true" />
                        </span>
                        <h3 className="mt-4 text-base font-semibold">
                            Kunjungi MPP
                        </h3>
                        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                            Datang sesuai jam layanan di atas. Untuk riwayat
                            layanan atau perbaikan data, setiap tenant punya
                            loketnya sendiri di dalam gedung.
                        </p>
                        <p className="text-muted-foreground mt-4 text-sm">
                            Butuh bantuan? Tanyakan kepada petugas informasi di
                            lokasi atau ikuti arahan antrean digital di dalam
                            gedung.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
