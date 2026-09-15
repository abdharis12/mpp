import { BLUE, GOLD } from './content';

export function BrandMark() {
    return (
        <img
            className="relative grid size-9 shrink-0 place-content-center font-['Poppins',_sans-serif] text-[11px] leading-none font-bold"
            src="/img/logo-mpp.png"
            alt="Logo Mal Pelayanan Publik Muara Enim"
        />
    );
}

export function SectionHeading({
    eyebrow,
    title,
    description,
}: {
    eyebrow?: string;
    title: string;
    description?: string;
}) {
    return (
        <div className="mb-10 max-w-2xl">
            {eyebrow && (
                <p
                    className="mb-3 text-sm font-semibold tracking-widest uppercase"
                    style={{ color: BLUE }}
                >
                    {eyebrow}
                </p>
            )}
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {title}
            </h2>
            {description && (
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed sm:text-base">
                    {description}
                </p>
            )}
            <span
                className="mt-4 block h-1 w-10 rounded-full"
                style={{ backgroundColor: GOLD }}
                aria-hidden="true"
            />
        </div>
    );
}

export function tenantInitials(name: string): string {
    return name
        .replace(/^(Dinas|Kantor|Badan|UPT|Pemerintah|Kabupaten)\s+/i, '')
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? '')
        .join('');
}

export function Stars({ rating, label }: { rating: number; label: string }) {
    return (
        <span
            className="flex items-center gap-0.5"
            role="img"
            aria-label={label}
        >
            {[1, 2, 3, 4, 5].map((i) => (
                <span
                    key={i}
                    className={`size-2.5 rounded-full ${i <= rating ? '' : 'opacity-25'}`}
                    style={{ backgroundColor: GOLD }}
                    aria-hidden="true"
                />
            ))}
        </span>
    );
}
