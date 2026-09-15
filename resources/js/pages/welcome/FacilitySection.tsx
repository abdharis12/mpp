import { Card } from '@/components/ui/card';
import { BLUE, FACILITIES } from './content';
import { SectionHeading } from './helpers';

export default function FacilitySection() {
    return (
        <section
            id="fasilitas"
            className="border-border/70 mx-auto w-full max-w-6xl scroll-mt-20 border-t px-6 py-16 lg:px-8 lg:py-20"
            aria-labelledby="fasilitas-title"
        >
            <SectionHeading
                eyebrow="Fasilitas"
                title="Fasilitas dalam gedung MPP"
                description="Berbagai fasilitas pendukung tersedia untuk kenyamanan pengunjung."
            />
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {FACILITIES.map((facility) => (
                    <li key={facility.name}>
                        <Card className="h-full gap-0 px-5 py-6 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_2px_8px_rgba(18,60,134,0.05),0_12px_28px_rgba(18,60,134,0.08)]">
                            <span
                                className="bg-primary/10 mx-auto grid size-11 place-content-center rounded-2xl"
                                style={{ color: BLUE }}
                            >
                                <facility.icon
                                    className="size-5"
                                    aria-hidden="true"
                                />
                            </span>
                            <h3 className="mt-4 text-sm font-semibold">
                                {facility.name}
                            </h3>
                            <p className="text-muted-foreground mt-1.5 text-xs leading-relaxed">
                                {facility.description}
                            </p>
                        </Card>
                    </li>
                ))}
            </ul>
        </section>
    );
}
