import { Fragment } from 'react';
import { Badge } from '@/components/ui/badge';
import { FLOW_STEPS } from './content';
import { SectionHeading } from './helpers';

const LINE_COLOR = 'rgba(18,60,134,0.2)';

export default function FlowSection() {
    return (
        <section
            id="alur"
            className="border-border/70 mx-auto w-full max-w-6xl scroll-mt-20 border-t px-6 py-16 lg:px-8 lg:py-20"
            aria-labelledby="alur-title"
        >
            <SectionHeading
                eyebrow="Alur"
                title="Bagaimana pelayanan berjalan"
                description="Ikuti langkah-langkah berikut agar kunjungan Anda efisien."
            />
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-0">
                {FLOW_STEPS.map((step, index) => (
                    <Fragment key={step.title}>
                        <div className="flex flex-1 flex-col items-center text-center">
                            <Badge
                                variant="pill"
                                className="relative z-10 size-9 shrink-0 rounded-full px-0 text-center font-semibold"
                            >
                                {index + 1}
                            </Badge>
                            <h3 className="mt-4 text-base font-semibold">
                                {step.title}
                            </h3>
                            <p className="text-muted-foreground mt-1.5 max-w-[220px] text-sm leading-relaxed">
                                {step.body}
                            </p>
                        </div>
                        {index < FLOW_STEPS.length - 1 && (
                            <div
                                className="hidden w-16 shrink-0 self-start pt-[17px] lg:block"
                                aria-hidden="true"
                            >
                                <span
                                    className="block h-px w-full"
                                    style={{ backgroundColor: LINE_COLOR }}
                                />
                            </div>
                        )}
                    </Fragment>
                ))}
            </div>
        </section>
    );
}
