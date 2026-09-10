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
    seconds: Number(v("second")),
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

function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={`grid size-9 shrink-0 place-content-center rounded-md bg-[#0A2472] text-[11px] font-bold leading-none tracking-tight text-white not-dark:text-white ${className ?? ""}`}
      aria-hidden="true"
    >
      MPP
    </span>
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
  const scheduleToday = !now || isWeekend
    ? null
    : { startMin, endMin, label: isFriday ? "07.00 – 16.30 WIB" : "08.00 – 16.00 WIB" };
  let jamStatus = !now ? "Memuat…" : "Libur pelayanan";
  let dotClass = "bg-muted-foreground";
  if (now && !isWeekend && scheduleToday) {
    if (curMin < startMin) {
      jamStatus = "Belum buka";
      dotClass = "bg-[#FFBA08]";
    } else if (curMin > endMin) {
      jamStatus = "Sudah tutup";
      dotClass = "bg-muted-foreground";
    } else {
      jamStatus = "Sedang buka";
      dotClass = "bg-success";
    }
  }

  return (
    <>
      <Head title="Mal Pelayanan Publik · Kabupaten Muara Enim" />

      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <div className="h-1 w-full bg-primary" aria-hidden="true" />

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

            <nav
              className="flex shrink-0 items-center gap-2"
              aria-label="Navigasi utama"
            >
              {auth.user ? (
                <Button asChild>
                  <Link href={dashboard()}>Buka sistem</Link>
                </Button>
              ) : (
                <>
                  <Button asChild variant="ghost">
                    <Link href={login()}>Masuk</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href={register()}>Buat akun</Link>
                  </Button>
                </>
              )}
            </nav>
          </div>
        </header>

        <main className="flex-1">
          <section className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-22">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.16em] text-[#0A2472] dark:text-secondary-foreground/70">
                Mal Pelayanan Publik · Kabupaten Muara Enim
              </p>
              <h1 className="mt-4 text-4xl font-bold leading-[1.14] tracking-tight sm:text-5xl">
                Satu tempat, <span className="underline decoration-primary decoration-4 underline-offset-4">satu alur</span> layanan
                publik di Muara Enim.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
                Mal Pelayanan Publik (MPP) menghadirkan layanan dari berbagai instansi terpadu dalam satu lokasi.
                Cek jam layanan, lihat jadwal hari ini, dan akses sistem absensi petugas di dalam.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                {auth.user ? (
                  <Button asChild size="lg">
                    <Link href={dashboard()}>Buka sistem petugas</Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild size="lg">
                      <Link href={login()}>Masuk sistem petugas</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                      <a href="#jam-layanan">Lihat jam layanan</a>
                    </Button>
                  </>
                )}
              </div>
              <p
                id="jam-layanan"
                className="mt-8 scroll-mt-20 text-sm text-muted-foreground"
              >
                Sistem petugas (absensi, monitoring, laporan) tersedia di dalam dan memerlukan login.
              </p>
            </div>

            <div
              className="relative overflow-hidden rounded-lg border border-border bg-card px-6 py-7 shadow-sm sm:px-8 sm:py-8"
              aria-label="Jam layanan hari ini"
            >
              <div className="absolute inset-x-0 top-0 h-0.5 bg-primary" aria-hidden="true" />
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Jam layanan hari ini
              </p>

              <p className="mt-7 flex items-baseline gap-1 tabular-nums" suppressHydrationWarning>
                <span className="text-5xl font-bold tracking-tight">{now?.timeLabel ?? "--:--"}</span>
                <span className="text-2xl font-medium text-muted-foreground">:{now?.secondsLabel ?? "--"}</span>
                <span className="ml-2 text-xs font-medium tracking-[0.12em] text-muted-foreground">
                  WIB
                </span>
              </p>
              <p className="mt-2 text-sm text-muted-foreground" suppressHydrationWarning>{now?.dateLabel ?? "Memuat tanggal…"}</p>

              <div className="mt-6 border-t border-border pt-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <span className="text-sm text-muted-foreground">
                    {isWeekend ? "Sabtu–Minggu" : isFriday ? "Jumat" : "Senin–Kamis"}
                  </span>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold">
                    <span
                      className={`inline-block size-2 rounded-full ${dotClass}`}
                      aria-hidden="true"
                      suppressHydrationWarning
                    />
                    {jamStatus}
                  </span>
                </div>
                {scheduleToday ? (
                  <p className="mt-2 text-sm font-semibold tabular-nums">{scheduleToday.label}</p>
                ) : (
                  <p className="mt-2 text-sm font-semibold">Libur</p>
                )}
                <p className="mt-4 text-sm text-muted-foreground">
                  Spesifikasi jadwal dan hari libur dikelola oleh Admin MPP; petugas mengecek jam kerja efektif di sistem.
                </p>
              </div>
            </div>
          </section>

          <section className="border-t border-border bg-card" aria-labelledby="tentang-mpp">
            <div className="mx-auto w-full max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
              <h2 id="tentang-mpp" className="max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">
                Layanan lintas instansi, satu pintu hadir lebih dekat untuk warga.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
                MPP adalah wujud satu pintu: warga tidak perlu datang ke banyak lokasi untuk menyelesaikan urusan administratif. Tenan layanan
                beroperasi pada jam yang sama sehingga alur antri dan penanganan lebih terkontrol.
              </p>

              <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-0 md:divide-x md:divide-border">
                <div className="md:pr-8">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                    Alur yang jelas
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    Informasi loket, jenis layanan, dan jam buka disatukan sehingga warga tahu harus ke mana terlebih dahulu.
                  </p>
                </div>
                <div className="md:px-8">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                    Jam yang terprediksi
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    Senin–Kamis dan Jumat memiliki jam berbeda; Sabtu–Minggu libur. Status hari ini tampil di atas halaman ini.
                  </p>
                </div>
                <div className="md:pl-8">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                    Akuntabilitas pemda
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    Kehadiran petugas tercatat di sistem internal agar kedisiplinan jam layanan benar-benar terjaga.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section
            id="layanan"
            className="scroll-mt-20 border-t border-border"
            aria-labelledby="jam-mingguan"
          >
            <div className="mx-auto w-full max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <h2 id="jam-mingguan" className="text-xl font-semibold tracking-tight sm:text-2xl">
                  Jam layanan mingguan
                </h2>
                <p className="text-sm text-muted-foreground">Sesuaikan kedatangan dengan jam masing-masing hari</p>
              </div>

              <div className="mt-9 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3">
                {SCHEDULE.map((item, index) => {
                  const isToday = now ? index === (isWeekend ? 2 : isFriday ? 1 : 0) : false;
                  return (
                    <div
                      key={item.days}
                      className={`px-6 py-7 ${isToday ? "bg-popover" : "bg-card"}`}
                    >
                      <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                        {item.days}
                      </p>
                      <p
                        className={`mt-3 text-sm font-semibold tabular-nums ${item.hours === "Libur" ? "text-muted-foreground" : "text-foreground"}`}
                      >
                        {item.hours}
                      </p>
                      {isToday && (
                        <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#0A2472] dark:text-primary">
                          <span className="inline-block size-1.5 rounded-full bg-primary" />
                          Hari ini
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              <p className="mt-6 text-sm text-muted-foreground">
                Perubahan jadwal khusus dan hari libur (mis. nasional, cuti bersama) ditetapkan oleh Admin MPP dan berpengaruh pada ketersediaan
                layanan.
              </p>
            </div>
          </section>

          <section className="border-t border-border bg-card" aria-labelledby="kunjungi-mpp">
            <div className="mx-auto w-full max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
              <h2 id="kunjungi-mpp" className="text-xl font-semibold tracking-tight sm:text-2xl">
                Kunjungi MPP
              </h2>
              <div className="mt-8 grid gap-10 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-semibold">Mal Pelayanan Publik</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Kabupaten Muara Enim</p>
                  <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                    Silakan datang sesuai jam layanan di atas. Untuk riwayat layanan atau perbaikan data, setiap tenant memiliki loketnya sendiri di
                    dalam gedung.
                  </p>
                </div>
                <div className="border-l border-border pl-8 md:pl-10">
                  <h3 className="text-sm font-semibold">Butuh bantuan?</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    Warga dapat bertanya kepada petugas informasi di lokasi, atau mengikuti arahan antrean digital di dalam gedung.
                  </p>
                  <p className="mt-6 text-xs text-muted-foreground">
                    Halaman ini bersifat informatif. Untuk sistem absensi dan monitoring petugas, masuk melalui tombol di atas.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="mt-auto bg-[#0A2472] text-white">
          <div className="mx-auto w-full max-w-6xl px-6 py-12 lg:px-8">
            <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
              <div className="flex items-center gap-3">
                <BrandMark className="!bg-white !text-[#0A2472]" />
                <span className="flex flex-col leading-tight">
                  <span className="text-sm font-semibold">Mal Pelayanan Publik</span>
                  <span className="text-xs text-white/60">Kabupaten Muara Enim</span>
                </span>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-white/75">
                Mal Pelayanan Publik Kabupaten Muara Enim. Halaman depan menampilkan informasi umum; sistem internal petugas tersedia di dalam
                melalui menu login.
              </p>
            </div>
            <div className="mt-10 flex flex-col gap-2 border-t border-white/15 pt-6 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
              <p>© 2026 Mal Pelayanan Publik Kabupaten Muara Enim.</p>
              <p>Sistem absensi petugas berada di dalam (login).</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}