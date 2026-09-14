import { Head, Link } from '@inertiajs/react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

const BLUE = "#123C86";
const BLUE_DARK = "#0B2657";
const YELLOW = "#FFC72C";

function BrandMark() {
  return (
    <img
      className="size-9 shrink-0 object-contain"
      src="/img/logo-mpp.png"
      alt="Logo Mal Pelayanan Publik Muara Enim"
    />
  );
}

export default function AuthSimpleLayout({
  children,
  title,
  description,
}: AuthLayoutProps) {
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className="flex min-h-screen flex-col bg-background font-['Poppins',_sans-serif] text-foreground">
      {/* signage strip */}
      <div className="h-[3px] w-full" style={{ backgroundColor: BLUE }} aria-hidden="true" />
      <div className="h-[3px] w-full" style={{ backgroundColor: YELLOW }} aria-hidden="true" />

      <header className="border-b border-border">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-6 lg:px-8">
          <Link
            href={home()}
            className="flex min-w-0 items-center gap-3"
            aria-label="Mal Pelayanan Publik Muara Enim — beranda"
          >
            <BrandMark />
            <span className="flex flex-col leading-tight">
              <span className="text-sm font-semibold">Mal Pelayanan Publik</span>
              <span className="text-xs text-muted-foreground">Kabupaten Muara Enim</span>
            </span>
          </Link>

          <Link
            href={home()}
            className="text-sm text-muted-foreground hover:text-foreground transition-color"
          >
            Kembali
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto grid w-full max-w-6xl items-stretch gap-10 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:px-8 lg:py-24">
          {/* Left: form area */}
          <div className="flex flex-col justify-center">
            <div className="max-w-md">
              <h1 className="font-['Poppins',_sans-serif] text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl">
                {title}
              </h1>
              {description && (
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  {description}
                </p>
              )}
            </div>

            <div className="mt-10">
              {children}
            </div>
          </div>

          {/* Right: status board */}
          <div
            className="flex flex-col justify-between p-7 sm:p-8"
            style={{ backgroundColor: "#0B1B33", borderLeft: `4px solid ${YELLOW}` }}
            aria-label="Informasi layanan"
          >
            <div>
              <p className="text-sm text-white/55">Mal Pelayanan Publik</p>
              <p className="mt-5 font-['Poppins',_sans-serif] text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Kabupaten Muara Enim
              </p>
              <p className="mt-4 text-sm leading-relaxed text-white/70">
                Satu atap untuk layanan publik. Masuk untuk mengakses sistem absensi dan monitoring petugas.
              </p>
            </div>

            <div className="mt-8 border-t border-white/15 pt-6">
              <div className="flex items-center gap-2.5 text-sm font-semibold text-white">
                <span
                  className="inline-block size-2.5 rounded-full opacity-100"
                  style={{ backgroundColor: YELLOW }}
                  aria-hidden="true"
                />
                Sistem aktif
              </div>
              <p className="mt-4 text-xs leading-relaxed text-white/45">
                Gunakan akun yang telah terdaftar untuk masuk. Hubungi admin jika belum memiliki akses.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer style={{ backgroundColor: BLUE_DARK }} className="mt-auto text-white">
        <div className="h-[3px] w-full" style={{ backgroundColor: YELLOW }} aria-hidden="true" />
        <div className="mx-auto w-full max-w-6xl px-6 py-12 lg:px-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="flex items-center gap-3">
              <BrandMark />
              <span className="flex flex-col leading-tight">
                <span className="text-sm font-semibold">Mal Pelayanan Publik</span>
                <span className="text-xs text-white/55">Kabupaten Muara Enim</span>
              </span>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-white/70">
              Halaman masuk untuk petugas dan admin sistem.
            </p>
          </div>
          <div className="mt-10 flex flex-col gap-2 border-t border-white/15 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Mal Pelayanan Publik Kabupaten Muara Enim.</p>
            <p>Sistem absensi petugas berada di dalam (login).</p>
          </div>
        </div>
      </footer>
      </div>
    </>
  );
}
