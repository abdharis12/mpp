import { Link } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTrigger,
} from '@/components/ui/sheet';
import { home } from '@/routes';
import { NAV_LINKS } from './content';
import { BrandMark } from './helpers';

export default function Navigation() {
    return (
        <header className="border-border/70 bg-background/90 sticky top-0 z-40 border-b shadow-[0_2px_10px_rgba(18,60,134,0.06)] backdrop-blur-sm">
            <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-6 lg:px-8">
                <Link
                    href={home()}
                    className="flex min-w-0 items-center gap-3"
                    aria-label="Mal Pelayanan Publik Muara Enim — beranda"
                >
                    <BrandMark />
                    <span className="flex flex-col leading-tight">
                        <span className="text-sm font-semibold">
                            Mal Pelayanan Publik
                        </span>
                        <span className="text-muted-foreground text-xs">
                            Kabupaten Muara Enim
                        </span>
                    </span>
                </Link>

                <nav
                    className="hidden items-center gap-1 lg:flex"
                    aria-label="Navigasi utama"
                >
                    {NAV_LINKS.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                <div className="flex shrink-0 items-center lg:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                aria-label="Buka menu navigasi"
                            >
                                <Menu className="size-5" aria-hidden="true" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-72">
                            <SheetHeader className="flex flex-row items-center gap-3">
                                <BrandMark />
                                <span className="flex flex-col leading-tight">
                                    <span className="text-sm font-semibold">
                                        Mal Pelayanan Publik
                                    </span>
                                    <span className="text-muted-foreground text-xs">
                                        Kabupaten Muara Enim
                                    </span>
                                </span>
                            </SheetHeader>
                            <nav
                                className="flex flex-col gap-1 px-4"
                                aria-label="Navigasi menu"
                            >
                                {NAV_LINKS.map((link) => (
                                    <a
                                        key={link.href}
                                        href={link.href}
                                        className="text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                ))}
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
