import { motion, useReducedMotion } from 'motion/react';
import { Card } from '@/components/ui/card';
import { type ActiveTenantToday, type Stats } from './content';
import { SectionHeading } from './helpers';

const containerVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.1, delayChildren: 0.15 },
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

type Props = { stats: Stats; activeTenantsToday: ActiveTenantToday[] };

export default function StatsSection({ stats, activeTenantsToday }: Props) {
    const shouldReduceMotion = useReducedMotion();

    return (
        <section
            id="statistik"
            className="border-border/70 mx-auto w-full max-w-6xl scroll-mt-20 border-t px-6 py-16 lg:px-8 lg:py-20"
            aria-labelledby="statistik-title"
        >
            <SectionHeading
                eyebrow="Statistik"
                title="Layanan berjalan hari ini"
                description="Jumlah instansi, petugas, dan kehadiran yang tercatat pada sistem internal MPP."
            />
            <motion.div
                initial={shouldReduceMotion ? false : 'hidden'}
                whileInView="visible"
                viewport={{ once: true, amount: 0.2, margin: '0px 0px -40px 0px' }}
                variants={containerVariants}
            >
                <Card className="p-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_2px_10px_rgba(18,60,134,0.06),0_16px_40px_rgba(18,60,134,0.1)]">
                    <dl className="grid grid-cols-2 gap-y-8 lg:grid-cols-4">
                        <motion.div
                            variants={itemVariants}
                            className="border-border/70 border-r px-6 py-6 sm:px-8"
                        >
                            <dt className="text-muted-foreground text-sm font-medium">
                                Tenant Aktif
                            </dt>
                            <dd className="mt-3 flex items-end gap-1.5">
                                <span className="text-4xl font-bold tracking-tight tabular-nums">
                                    {stats.tenants}
                                </span>
                                <span className="text-muted-foreground pb-1 text-xs">
                                    tenant
                                </span>
                            </dd>
                        </motion.div>
                        <motion.div
                            variants={itemVariants}
                            className="border-border/70 border-r px-6 py-6 sm:px-8"
                        >
                            <dt className="text-muted-foreground text-sm font-medium">
                                Petugas Aktif
                            </dt>
                            <dd className="mt-3 flex items-end gap-1.5">
                                <span className="text-4xl font-bold tracking-tight tabular-nums">
                                    {stats.employees}
                                </span>
                                <span className="text-muted-foreground pb-1 text-xs">
                                    petugas
                                </span>
                            </dd>
                        </motion.div>
                        <motion.div
                            variants={itemVariants}
                            className="border-border/70 border-r px-6 py-6 sm:px-8"
                        >
                            <dt className="text-muted-foreground text-sm font-medium">
                                Kehadiran Bulan Ini
                            </dt>
                            <dd className="mt-3 flex items-end gap-1.5">
                                <span className="text-4xl font-bold tracking-tight tabular-nums">
                                    {stats.monthly_attendance}
                                </span>
                                <span className="text-muted-foreground pb-1 text-xs">
                                    catatan
                                </span>
                            </dd>
                        </motion.div>
                        <motion.div
                            variants={itemVariants}
                            className="px-6 py-6 sm:px-8"
                        >
                            <dt className="text-muted-foreground text-sm font-medium">
                                Hadir Hari Ini
                            </dt>
                            <dd className="mt-3">
                                {activeTenantsToday.length === 0 ? (
                                    <p className="text-muted-foreground text-xs leading-relaxed">
                                        Belum ada tenant dengan petugas hadir
                                        hari ini.
                                    </p>
                                ) : (
                                    <ul className="flex flex-wrap gap-1.5">
                                        {activeTenantsToday.map((t) => (
                                            <li
                                                key={t.id}
                                                className="border-border/60 bg-primary/10 inline-flex items-center rounded-full border px-2.5 py-1"
                                            >
                                                <span className="text-xs font-medium">
                                                    {t.code}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </dd>
                        </motion.div>
                    </dl>
                    <div className="border-border/70 border-t px-6 py-4 sm:px-8">
                        <p className="text-muted-foreground text-xs leading-relaxed">
                            Data operasional internal MPP, diperbarui otomatis
                            dari sistem kehadiran petugas.
                        </p>
                    </div>
                </Card>
            </motion.div>
        </section>
    );
}
