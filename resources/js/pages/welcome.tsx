import { Head, Link, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { dashboard, home, login, register } from "@/routes";
import { Button } from "@/components/ui/button";

const WEEKDAYS = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];

// Palette — used deliberately, not as decoration:
// blue  = identitas resmi MPP (header, tombol utama, aksen tenang)
// kuning = sinyal/status (lampu indikator buka, garis penanda "hari ini")
const BLUE = "#123C86";
const BLUE_DARK = "#0B2657";
const YELLOW = "#FFC72C";
const BOARD_BG = "#0B1B33";

function jakartaParts(instant: Date) {
  const parts = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(instant);
  const v = (t: string): string =>
    parts.find((p) => p.type === t)?.value ?? "";
  const weekday = v("weekday");
  return {
    dayOfWeek: WEEKDAYS.indexOf(weekday),
    hours: Number(v("hour")),
    minutes: Number(v("minute")),
    timeLabel: `${v("hour")}:${v("minute")}`,
    secondsLabel: v("second"),
    dateLabel: `${weekday}, ${Number(v("day"))} ${v("month")} ${v("year")}`,
  };
}

function useJakartaNow() {
  const [now, setNow] = useState<ReturnType<typeof jakartaParts> | null>(null);
  useEffect(() => {
    setNow(jakartaParts(new Date()));
    const id = window.setInterval(() => setNow(jakartaParts(new Date())), 1000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

const SCHEDULE = [
  { days: "Senin – Kamis", hours: "08.00 – 16.00" },
  { days: "Jumat", hours: "07.00 – 16.30" },
  { days: "Sabtu – Minggu", hours: "Libur" },
] as const;

const PILLARS = [
  {
    title: "Satu alur, bukan banyak pintu",
    body: "Informasi loket, jenis layanan, dan jam buka disatukan sehingga warga tahu harus ke mana lebih dulu.",
  },
  {
    title: "Jam yang bisa diandalkan",
    body: "Senin–Kamis dan Jumat punya jam berbeda; Sabtu–Minggu libur. Statusnya tampil langsung di papan atas halaman ini.",
  },
  {
    title: "Kehadiran petugas tercatat",
    body: "Sistem internal mencatat kehadiran, sehingga jam layanan yang tertulis benar-benar berjalan di lapangan.",
  },
] as const;

function BrandMark({ inverted = false }: { inverted?: boolean }) {
  return (
    <img 
      className="relative grid size-9 shrink-0 place-content-center font-['Poppins',_sans-serif] text-[11px] font-bold leading-none"
      src="/img/logo-mpp.png"
      alt="Logo Mal Pelayanan Publik Muara Enim"
    />
  );
}

export default function Welcome() {
  const { auth } = usePage().props;
  const now = useJakartaNow();

  const isWeekend = now ? now.dayOfWeek === 0 || now.dayOfWeek === 6 : false;
  const isFriday = now ? now.dayOfWeek === 5 : false;
  const startMin = isFriday ? 7 * 60 : 8 * 60;
  const endMin = isFriday ? 16 * 60 + 30 : 16 * 60;
  const curMin = now ? now.hours * 60 + now.minutes : 0;
  const scheduleToday =
    !now || isWeekend
      ? null
      : {
          startMin,
          endMin,
          label: isFriday ? "07.00 – 16.30 WIB" : "08.00 – 16.00 WIB",
        };

  let jamStatus = !now ? "Memuat…" : "Libur pelayanan";
  let lampClass = "opacity-25";
  if (now && !isWeekend && scheduleToday) {
    if (curMin < startMin) {
      jamStatus = "Belum buka";
      lampClass = "opacity-40";
    } else if (curMin > endMin) {
      jamStatus = "Sudah tutup";
      lampClass = "opacity-25";
    } else {
      jamStatus = "Sedang buka";
      lampClass = "opacity-100";
    }
  }

  const todayIndex = !now ? -1 : isWeekend ? 2 : isFriday ? 1 : 0;

  return (
    <>
      <Head title="Mal Pelayanan Publik · Kabupaten Muara Enim">
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

            <nav className="flex shrink-0 items-center gap-2" aria-label="Navigasi utama">
              {auth.user ? (
                <Button asChild style={{ backgroundColor: BLUE }} className="rounded-sm text-white hover:opacity-90">
                  <Link href={dashboard()}>Buka sistem</Link>
                </Button>
              ) : (
                <>
                  <Button asChild variant="ghost" className="rounded-sm">
                    <Link href={login()}>Masuk</Link>
                  </Button>
                  <Button asChild variant="outline" className="rounded-sm">
                    <Link href={register()}>Buat akun</Link>
                  </Button>
                </>
              )}
            </nav>
          </div>
        </header>

        <main className="flex-1">
          {/* HERO */}
          <section className="mx-auto grid w-full max-w-6xl items-stretch gap-10 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:px-8 lg:py-24">
            <div className="flex flex-col justify-center">
              <h1 className="max-w-lg font-['Poppins',_sans-serif] text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl">
                Satu atap untuk layanan publik Muara Enim.
              </h1>
              <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
                Mal Pelayanan Publik menghadirkan layanan dari berbagai instansi dalam satu lokasi. Warga bisa
                mengecek jam buka dan status hari ini di papan sebelah, sementara petugas mengelola kehadiran dan
                laporan di sistem internal.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                {auth.user ? (
                  <Button asChild size="lg" style={{ backgroundColor: BLUE }} className="rounded-sm text-white hover:opacity-90">
                    <Link href={dashboard()}>Buka sistem petugas</Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild size="lg" style={{ backgroundColor: BLUE }} className="rounded-sm text-white hover:opacity-90">
                      <Link href={login()}>Masuk sistem petugas</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="rounded-sm">
                      <a href="#jadwal">Lihat jam layanan</a>
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* digital status board */}
            <div
              className="flex flex-col justify-between p-7 sm:p-8"
              style={{ backgroundColor: BOARD_BG, borderLeft: `4px solid ${YELLOW}` }}
              aria-label="Papan status layanan"
            >
              <div>
                <p className="text-sm text-white/55">Papan status layanan</p>
                <p
                  className="mt-5 font-['Poppins',_sans-serif] text-5xl font-semibold tracking-tight tabular-nums"
                  style={{ color: YELLOW }}
                  suppressHydrationWarning
                >
                  {now?.timeLabel ?? "--:--"}
                  <span className="text-2xl text-white/40">:{now?.secondsLabel ?? "--"}</span>
                </p>
                <p className="mt-2 text-sm text-white/70" suppressHydrationWarning>
                  {now?.dateLabel ?? "Memuat tanggal…"}
                </p>
              </div>

              <div className="mt-8 border-t border-white/15 pt-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2.5 text-sm font-semibold text-white">
                    <span
                      className={`inline-block size-2.5 rounded-full ${lampClass}`}
                      style={{ backgroundColor: YELLOW }}
                      aria-hidden="true"
                      suppressHydrationWarning
                    />
                    {jamStatus}
                  </span>
                  <span className="font-['Poppins',_sans-serif] text-sm text-white/70 tabular-nums">
                    {scheduleToday ? scheduleToday.label.replace(" WIB", "") : "Libur"}
                  </span>
                </div>
                <p className="mt-4 text-xs leading-relaxed text-white/45">
                  Jadwal khusus dan hari libur ditetapkan oleh Admin MPP.
                </p>
              </div>
            </div>
          </section>

          {/* ABOUT / PILLARS */}
          <section className="border-t border-border" aria-labelledby="tentang-mpp">
            <div className="mx-auto w-full max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
              <h2 id="tentang-mpp" className="max-w-xl font-['Poppins',_sans-serif] text-2xl font-semibold tracking-tight sm:text-3xl">
                Layanan lintas instansi, hadir lebih dekat untuk warga.
              </h2>

              <div className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-8">
                {PILLARS.map((pillar) => (
                  <div key={pillar.title} className="border-l-2 pl-5" style={{ borderColor: YELLOW }}>
                    <h3 className="text-sm font-semibold">{pillar.title}</h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{pillar.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* WEEKLY SCHEDULE */}
          <section id="jadwal" className="scroll-mt-20 border-t border-border bg-card" aria-labelledby="jam-mingguan">
            <div className="mx-auto w-full max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <h2 id="jam-mingguan" className="font-['Poppins',_sans-serif] text-xl font-semibold tracking-tight sm:text-2xl">
                  Jam layanan mingguan
                </h2>
                <p className="text-sm text-muted-foreground">Sesuaikan kedatangan dengan jadwal hari ini</p>
              </div>

              <div className="mt-8 border-t border-border">
                {SCHEDULE.map((item, index) => {
                  const isToday = index === todayIndex;
                  return (
                    <div
                      key={item.days}
                      className="flex items-center justify-between gap-4 border-b border-border py-5 pl-4"
                      style={isToday ? { borderLeft: `3px solid ${YELLOW}`, backgroundColor: "rgba(18,60,134,0.04)" } : undefined}
                    >
                      <div>
                        <p className="text-sm font-medium">{item.days}</p>
                        {isToday && <p className="mt-0.5 text-xs" style={{ color: BLUE }}>Hari ini</p>}
                      </div>
                      <p
                        className={`font-['Poppins',_sans-serif] text-sm tabular-nums ${
                          item.hours === "Libur" ? "text-muted-foreground" : "font-semibold text-foreground"
                        }`}
                      >
                        {item.hours}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* VISIT */}
          <section className="border-t border-border" aria-labelledby="kunjungi-mpp">
            <div className="mx-auto w-full max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
              <h2 id="kunjungi-mpp" className="font-['Poppins',_sans-serif] text-xl font-semibold tracking-tight sm:text-2xl">
                Kunjungi MPP
              </h2>
              <div className="mt-8 grid gap-10 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-semibold">Mal Pelayanan Publik</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Kabupaten Muara Enim</p>
                  <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                    Datang sesuai jam layanan di atas. Untuk riwayat layanan atau perbaikan data, setiap tenant
                    punya loketnya sendiri di dalam gedung.
                  </p>
                </div>
                <div className="border-l-2 pl-6" style={{ borderColor: YELLOW }}>
                  <h3 className="text-sm font-semibold">Butuh bantuan?</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    Tanyakan kepada petugas informasi di lokasi, atau ikuti arahan antrean digital di dalam
                    gedung.
                  </p>
                  <p className="mt-6 text-xs text-muted-foreground">
                    Halaman ini bersifat informatif. Sistem absensi dan monitoring petugas ada di menu masuk di atas.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer style={{ backgroundColor: BLUE_DARK }} className="mt-auto text-white">
          <div className="h-[3px] w-full" style={{ backgroundColor: YELLOW }} aria-hidden="true" />
          <div className="mx-auto w-full max-w-6xl px-6 py-12 lg:px-8">
            <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
              <div className="flex items-center gap-3">
                <BrandMark inverted />
                <span className="flex flex-col leading-tight">
                  <span className="text-sm font-semibold">Mal Pelayanan Publik</span>
                  <span className="text-xs text-white/55">Kabupaten Muara Enim</span>
                </span>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-white/70">
                Halaman depan menampilkan informasi umum. Sistem internal petugas tersedia melalui menu masuk.
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