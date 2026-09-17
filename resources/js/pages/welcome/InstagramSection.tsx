import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Instagram } from 'lucide-react';
import { BLUE, GOLD } from './content';
import { SectionHeadingCenter } from './helpers';

const EMBEDSOCIAL_SCRIPT_ID = 'embedsocial-hashtag-script';
const EMBEDSOCIAL_SCRIPT_SRC = 'https://embedsocial.com/cdn/ht.js';

declare global {
    interface Window {
        EmbedSocialHashtagScript?: () => void;
    }
}

const containerVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.15, delayChildren: 0.15 },
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

type Props = {
    embedsocialRef: string;
};

export default function InstagramSection({ embedsocialRef }: Props) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const injectedRef = useRef(false);
    const shouldReduceMotion = useReducedMotion();

    useEffect(() => {
        if (!embedsocialRef) {
            return;
        }

        const tryInit = () => {
            window.EmbedSocialHashtagScript?.();
        };

        const injectScript = () => {
            if (injectedRef.current) {
                return;
            }

            const existing = document.getElementById(EMBEDSOCIAL_SCRIPT_ID);
            if (existing) {
                tryInit();
                injectedRef.current = true;

                return;
            }

            const script = document.createElement('script');
            script.id = EMBEDSOCIAL_SCRIPT_ID;
            script.src = EMBEDSOCIAL_SCRIPT_SRC;
            script.async = true;
            script.onload = tryInit;
            script.onerror = () => {
                console.error('Gagal memuat skrip widget EmbedSocial.');
            };
            document.head.appendChild(script);
            injectedRef.current = true;
        };

        injectScript();
    }, [embedsocialRef]);

    return (
        <motion.section
            id="instagram"
            className="border-border/70 mx-auto w-full max-w-6xl scroll-mt-20 border-t px-6 py-16 lg:px-8 lg:py-20"
            aria-labelledby="instagram-title"
            initial={shouldReduceMotion ? false : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, amount: 0.12, margin: '0px 0px -40px 0px' }}
            variants={containerVariants}
        >
            <motion.div variants={itemVariants}>
                <SectionHeadingCenter
                    eyebrow="Instagram"
                    title="Aktivitas MPP di Instagram"
                    description="Postingan terbaru dari hashtag #mpp pada akun resmi DPMPTSP Kabupaten Muara Enim."
                />
            </motion.div>

            <motion.div
                variants={itemVariants}
                className="rounded-2xl border border-border/70 bg-card p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_2px_8px_rgba(18,60,134,0.05),0_12px_28px_rgba(18,60,134,0.08)] sm:p-6"
                style={{ borderLeft: `4px solid ${BLUE}` }}
            >
                {embedsocialRef ? (
                    <div
                        ref={wrapperRef}
                        className="embedsocial-hashtag min-h-[340px] w-full"
                        data-ref={embedsocialRef}
                    >
                        <div className="es-widget-branding-text" />
                    </div>
                ) : (
                    <div className="flex min-h-[200px] flex-col items-center justify-center gap-4 rounded-xl border border-dashed px-6 py-12 text-center">
                        <span
                            className="bg-primary/10 grid size-14 place-content-center rounded-2xl"
                            style={{ color: BLUE }}
                        >
                            <Instagram className="size-7" aria-hidden="true" />
                        </span>
                        <p className="text-muted-foreground text-sm">
                            Widget Instagram belum dikonfigurasi.
                        </p>
                    </div>
                )}
            </motion.div>

            <motion.div
                variants={itemVariants}
                className="mt-8 flex flex-col items-center gap-3"
            >
                <a
                    href="https://www.instagram.com/explore/tags/mpp/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: BLUE }}
                >
                    <Instagram className="size-4" aria-hidden="true" />
                    Lihat semua postingan #mpp di Instagram
                </a>

                <a
                    href="https://www.instagram.com/dpmptsp_muaraenim/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium underline-offset-2 hover:underline"
                    style={{ color: BLUE }}
                >
                    Mengunjungi profil @dpmptsp_muaraenim
                </a>
            </motion.div>

            <motion.div
                variants={itemVariants}
                className="mt-8 flex items-center justify-center gap-2"
            >
                <span
                    className="inline-flex h-1 w-10 rounded-full"
                    style={{ backgroundColor: GOLD }}
                    aria-hidden="true"
                />
            </motion.div>

            <motion.p
                variants={itemVariants}
                className="text-muted-foreground mt-4 text-center text-xs"
            >
                Postingan dimuat otomatis dari Instagram publik melalui widget
                EmbedSocial dan diperbarui secara berkala.
            </motion.p>
        </motion.section>
    );
}