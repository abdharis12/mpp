import { Activity, ExternalLink, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ANTRIAN_URL, BLUE, GOLD, SKM_URL } from './content';
import { SectionHeading } from './helpers';

export default function QueueSkmSection() {
    return (
        <section
            id="layanan-digital"
            className="border-border/70 mx-auto w-full max-w-6xl scroll-mt-20 border-t px-6 py-16 lg:px-8 lg:py-20"
            aria-labelledby="layanan-digital-title"
        >
            <SectionHeading
                eyebrow="Layanan Digital"
                title="Antrian Online & Survei Kepuasan"
                description="Ambil nomor antrean dari rumah dan bagikan penilaian layanan Anda secara online."
            />
            <div className="grid gap-6 lg:grid-cols-2">
                <Card
                    className="relative overflow-hidden p-0"
                    style={{ borderLeft: `4px solid ${GOLD}` }}
                >
                    {/* dekorasi bulatan transparan */}
                    <span
                        className="pointer-events-none absolute -top-12 -right-12 size-36 rounded-full bg-green-500/10"
                        aria-hidden="true"
                    />
                    <span
                        className="pointer-events-none absolute right-10 -bottom-14 size-32 rounded-full bg-pink-400/10"
                        aria-hidden="true"
                    />
                    <CardContent className="relative flex flex-col items-start gap-4 py-7">
                        <span
                            className="bg-primary/10 grid size-12 shrink-0 place-content-center rounded-2xl"
                            style={{ color: BLUE }}
                        >
                            <Timer className="size-6" aria-hidden="true" />
                        </span>
                        <div>
                            <h3 className="text-base font-semibold">
                                Antrian online MPP
                            </h3>
                            <p className="text-muted-foreground mt-2 max-w-md text-sm leading-relaxed">
                                Ambil nomor antrean dan pilih tenant layanan
                                yang ingin dituju sebelum tiba di gedung.
                            </p>
                        </div>
                        <Button
                            asChild
                            size="lg"
                            className="text-white"
                            style={{ backgroundColor: BLUE }}
                        >
                            <a
                                href={ANTRIAN_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Buka web antrian{' '}
                                <ExternalLink className="size-4" />
                            </a>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden p-0">
                    {/* dekorasi bulatan transparan */}
                    <span
                        className="pointer-events-none absolute -right-14 -bottom-12 size-40 rounded-full bg-blue-500/10"
                        aria-hidden="true"
                    />
                    <span
                        className="pointer-events-none absolute -top-14 -left-10 size-36 rounded-full bg-green-400/10"
                        aria-hidden="true"
                    />
                    <CardContent className="relative flex flex-col items-start gap-4 py-7">
                        <span
                            className="bg-primary/10 grid size-12 shrink-0 place-content-center rounded-2xl"
                            style={{ color: BLUE }}
                        >
                            <Activity className="size-6" aria-hidden="true" />
                        </span>
                        <div>
                            <h3 className="text-base font-semibold">
                                Nilai kepuasan Anda berpengaruh
                            </h3>
                            <p className="text-muted-foreground mt-2 max-w-md text-sm leading-relaxed">
                                Hasil survei dievaluasi per periode dan
                                digunakan sebagai dasar perbaikan layanan di
                                seluruh tenant. Isi survei secara online dari
                                mana saja.
                            </p>
                        </div>
                        <Button
                            asChild
                            size="lg"
                            className="text-white"
                            style={{ backgroundColor: BLUE }}
                        >
                            <a
                                href={SKM_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Isi survei <ExternalLink className="size-4" />
                            </a>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
