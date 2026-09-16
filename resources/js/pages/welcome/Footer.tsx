import { Mail, MapPin, Phone } from 'lucide-react';
import { BLUE_DARK, GOLD } from './content';
import { BrandMark } from './helpers';

export default function Footer() {
    return (
        <footer
            style={{ backgroundColor: BLUE_DARK }}
            className="mt-auto text-white"
        >
            <div
                className="h-[3px] w-full"
                style={{ backgroundColor: GOLD }}
                aria-hidden="true"
            />
            <div
                className="mx-auto w-full max-w-6xl px-6 py-12 lg:px-8"
                id="kontak"
            >
                <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
                    <div className="flex items-center gap-3">
                        <BrandMark />
                        <span className="flex flex-col leading-tight">
                            <span className="text-sm font-semibold">
                                Mal Pelayanan Publik
                            </span>
                            <span className="text-xs text-white/55">
                                Kabupaten Muara Enim
                            </span>
                        </span>
                    </div>
                    <div className="flex flex-col gap-2 text-sm leading-relaxed text-white/70">
                        <span className="flex items-center gap-2">
                            <Phone className="size-4" aria-hidden="true" /> +62
                            821 8148 7928
                        </span>
                        <span className="flex items-center gap-2">
                            <Mail className="size-4" aria-hidden="true" />{' '}
                            pengaduan@dpmptsp.muaraenimkab.go.id
                        </span>
                        <span className="flex items-center gap-2">
                            <MapPin className="size-4" aria-hidden="true" /> MPP
                            Kabupaten Muara Enim
                        </span>
                    </div>
                    <p className="max-w-md text-sm leading-relaxed text-white/70">
                        Halaman depan menampilkan informasi umum tentang layanan
                        Mal Pelayanan Publik.
                    </p>
                </div>
                <div className="mt-10 flex flex-col gap-2 border-t border-white/15 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
                    <p>© 2026 Mal Pelayanan Publik Kabupaten Muara Enim.</p>
                </div>
            </div>
        </footer>
    );
}
