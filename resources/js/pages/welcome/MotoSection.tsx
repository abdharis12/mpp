import { GOLD, MOTO_MPP, PELAYANAN_INTRO } from './content';

export default function MotoSection() {
    return (
        <section
            id="tentang"
            className="border-border/70 mx-auto w-full max-w-6xl scroll-mt-20 border-t px-6 py-16 lg:px-8 lg:py-20"
            aria-labelledby="tentang-title"
        >
            <div className="mx-auto max-w-3xl text-center">
                <span
                    className="mx-auto block h-1 w-12 rounded-full"
                    style={{ backgroundColor: GOLD }}
                    aria-hidden="true"
                />
                <h2
                    id="tentang-title"
                    className="mt-6 text-3xl leading-snug font-semibold tracking-tight sm:text-4xl"
                >
                    {MOTO_MPP}
                </h2>
                <p className="text-muted-foreground mx-auto mt-6 max-w-xl text-base leading-relaxed">
                    {PELAYANAN_INTRO}
                </p>
                <p className="text-muted-foreground/80 mt-8 text-xs">
                    Kami hadir untuk anda &amp; siap melayani dengan sepenuh
                    hati.
                </p>
            </div>
        </section>
    );
}
