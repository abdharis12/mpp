import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { BLUE, BLUE_DARK, type Tenant } from './content';
import { SectionHeadingCenter, tenantInitials } from './helpers';

type Props = { tenants: Tenant[] };

export default function TenantMarquee({ tenants }: Props) {
    return (
        <section
            id="tenant"
            className="border-border/70 mx-auto w-full max-w-6xl scroll-mt-20 border-t px-6 py-16 lg:px-8 lg:py-20"
            aria-labelledby="tenant-title"
        >
            <SectionHeadingCenter
                eyebrow="Tenant & Layanan"
                title="Instansi yang bergabung dengan MPP"
                description="Setiap tenant memiliki layanan masing-masing yang dapat diakses di loketnya dalam gedung."
            />
            {tenants.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground text-sm">
                            Daftar tenant akan ditampilkan di sini.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <MarqueeRows tenants={tenants} />
            )}
        </section>
    );
}

function MarqueeRows({ tenants }: { tenants: Tenant[] }) {
    const mid = Math.ceil(tenants.length / 2);
    const rowTop = tenants.slice(0, mid);
    const rowBottom = tenants.slice(mid);
    const slideColors = [
        'rgba(18,60,134,0.12)',
        'rgba(254,198,44,0.18)',
        'rgba(18,60,134,0.08)',
        'rgba(37,99,235,0.10)',
        'rgba(18,60,134,0.06)',
    ];

    return (
        <div className="space-y-5">
            {/* Row 1 — moving left to right */}
            <div className="marquee-paused marquee-fade overflow-hidden py-2">
                <div className="animate-marquee-ltr flex w-max gap-6">
                    {[...rowTop, ...rowTop].map((tenant, i) => (
                        <TenantSlide
                            key={`${tenant.id}-a-${i}`}
                            tenant={tenant}
                            bg={slideColors[i % slideColors.length]}
                            fg={i % slideColors.length === 1 ? BLUE_DARK : BLUE}
                        />
                    ))}
                </div>
            </div>
            {/* Row 2 — moving right to left */}
            <div className="marquee-paused marquee-fade overflow-hidden py-2">
                <div className="animate-marquee-rtl flex w-max gap-6">
                    {[...rowBottom, ...rowBottom].map((tenant, i) => (
                        <TenantSlide
                            key={`${tenant.id}-b-${i}`}
                            tenant={tenant}
                            bg={slideColors[(i + 3) % slideColors.length]}
                            fg={
                                (i + 3) % slideColors.length === 1
                                    ? BLUE_DARK
                                    : BLUE
                            }
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

function TenantSlide({
    tenant,
    bg,
    fg,
}: {
    tenant: Tenant;
    bg: string;
    fg: string;
}) {
    return (
        <div className="bg-card flex shrink-0 flex-col items-center gap-3 rounded-2xl px-6 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_2px_6px_rgba(18,60,134,0.08),0_10px_24px_rgba(18,60,134,0.07)]">
            <Avatar className="size-14 rounded-2xl">
                <AvatarFallback
                    className="rounded-2xl text-sm font-semibold"
                    style={{ backgroundColor: bg, color: fg }}
                >
                    {tenantInitials(tenant.name)}
                </AvatarFallback>
            </Avatar>
            <span className="max-w-[120px] truncate text-center text-xs font-medium">
                {tenant.name}
            </span>
        </div>
    );
}
