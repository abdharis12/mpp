import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { BLUE, FACILITIES, type Facility } from './content';
import { SectionHeading } from './helpers';

const containerVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.06, delayChildren: 0.15 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
    },
};

export default function FacilitySection() {
    const [selected, setSelected] = useState<Facility | null>(null);
    const shouldReduceMotion = useReducedMotion();

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
            <motion.div
                initial={shouldReduceMotion ? false : 'hidden'}
                whileInView="visible"
                viewport={{ once: true, amount: 0.1, margin: '0px 0px -40px 0px' }}
                variants={containerVariants}
            >
                <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {FACILITIES.map((facility) => (
                        <motion.li key={facility.name} variants={itemVariants}>
                            <button
                                type="button"
                                onClick={() => setSelected(facility)}
                                className="border-border/70 hover:shadow-accent/5 flex w-full cursor-pointer flex-col items-center gap-0 rounded-lg border px-5 py-6 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_2px_8px_rgba(18,60,134,0.05),0_12px_28px_rgba(18,60,134,0.08)] transition-shadow duration-200"
                                style={{ borderLeft: `4px solid ${BLUE}` }}
                                aria-label={`Lihat foto ${facility.name}`}
                            >
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
                            </button>
                        </motion.li>
                    ))}
                </ul>
            </motion.div>

            <Dialog
                open={!!selected}
                onOpenChange={(open) => {
                    if (!open) setSelected(null);
                }}
            >
                <DialogContent className="max-w-lg overflow-hidden p-0">
                    <DialogHeader className="sr-only">
                        <DialogTitle>{selected?.name}</DialogTitle>
                        <DialogDescription>
                            {selected?.description}
                        </DialogDescription>
                    </DialogHeader>

                    {selected?.image && (
                        <img
                            src={selected.image}
                            alt={selected.name}
                            className="h-auto max-h-[65vh] w-full object-cover"
                            loading="lazy"
                        />
                    )}

                    <div className="px-6 pt-2 pb-6">
                        <h3
                            className="text-base font-semibold"
                            style={{ color: BLUE }}
                        >
                            {selected?.name}
                        </h3>
                        <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                            {selected?.description}
                        </p>
                    </div>
                </DialogContent>
            </Dialog>
        </section>
    );
}
