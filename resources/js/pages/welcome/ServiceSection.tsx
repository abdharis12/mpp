import { Card, CardContent } from '@/components/ui/card';
import { GOLD, LAYANAN_CATEGORIES } from './content';
import { SectionHeading } from './helpers';

export default function ServiceSection() {
    return (
        <section
            id="layanan"
            className="border-border/70 mx-auto w-full max-w-6xl scroll-mt-20 border-t px-6 py-16 lg:px-8 lg:py-20"
            aria-labelledby="layanan-title"
        >
            <SectionHeading
                eyebrow="Layanan"
                title="Jenis layanan yang dapat diakses"
                description="Beragam kebutuhan warga dapat diselesaikan dalam satu kunjungan ke MPP."
            />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {LAYANAN_CATEGORIES.map((category) => (
                    <Card
                        key={category.title}
                        className="relative overflow-hidden"
                    >
                        <span
                            className="absolute top-0 right-0 left-0 h-1"
                            style={{ backgroundColor: GOLD }}
                            aria-hidden="true"
                        />
                        <CardContent className="pt-8">
                            <h3 className="text-base font-semibold">
                                {category.title}
                            </h3>
                            <p className="text-muted-foreground mt-2.5 text-sm leading-relaxed">
                                {category.body}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}
