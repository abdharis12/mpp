import { router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type PaginationInfo = {
    data: unknown[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from?: number | null;
    to?: number | null;
};

export function Pagination({ meta }: { meta: PaginationInfo }) {
    if (meta.last_page <= 1) {
        return null;
    }

    const goTo = (page: number) => {
        if (page < 1 || page > meta.last_page) {
            return;
        }

        const search = new URLSearchParams(window.location.search);
        search.set('page', String(page));
        const query = search.toString();

        router.get(
            window.location.pathname + (query ? `?${query}` : ''),
            {},
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-muted-foreground text-sm">
                Menampilkan {meta.from ?? 0}–{meta.to ?? 0} dari {meta.total}
            </p>
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    disabled={meta.current_page <= 1}
                    onClick={() => goTo(meta.current_page - 1)}
                >
                    <ChevronLeft className="h-4 w-4" />
                    Sebelumnya
                </Button>
                <span className="text-muted-foreground text-sm">
                    {meta.current_page} / {meta.last_page}
                </span>
                <Button
                    variant="outline"
                    size="sm"
                    disabled={meta.current_page >= meta.last_page}
                    onClick={() => goTo(meta.current_page + 1)}
                >
                    Berikutnya
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
