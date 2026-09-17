import {
    Baby,
    BookOpen,
    Car,
    Cigarette,
    Coffee,
    Droplets,
    HandCoins,
    Info,
    LayoutGrid,
    Milk,
    MoonStar,
    Ticket,
    type LucideIcon,
} from 'lucide-react';

/* ============================================================================
 * KOPI & TAUTAN (PLACEHOLDER — GANTI DENGAN KONTEN RESMI)
 * ----------------------------------------------------------------------------
 * Berikut semua teks/token yang masih placeholder. Sampai diganti, halaman
 * menampilkan teks contoh agar struktur tetap utuh.
 *
 * [x] MOTO_MPP            — moto resmi Mal Pelayanan Publik Muara Enim
 * [x] PELAYANAN_INTRO     — kalimat pengantar layanan MPP
 * [x] LAYANAN_CATEGORIES  — kategori layanan MPP (3-5 item)
 * [x] FLOW_STEPS          — langkah alur pelayanan (4-6 item)
 * [x] ANTRIAN_URL         — link web antrian
 * [x] SKM_URL             — link survei kepuasan masyarakat
 * [x] PENGADUAN_CHANNELS  — kanal pengaduan resmi
 * ========================================================================== */

export const BLUE = '#123C86';
export const BLUE_DARK = '#0B2657';
export const GOLD = '#FEC62C';

// --- Placeholder copy (ganti dengan konten resmi) ---------------------------
export const MOTO_MPP =
    'Satu gedung, semua layanan, satu solusi bagi warga Muara Enim.';
export const PELAYANAN_INTRO =
    'Mal Pelayanan Publik Kabupaten Muara Enim menghadirkan layanan dari berbagai instansi pemerintah daerah dalam satu lokasi, sehingga warga cukup datang sekali untuk menyelesaikan banyak keperluan.';

export const LAYANAN_CATEGORIES = [
    {
        title: 'Administrasi Kependudukan',
        body: 'Layanan dokumen kependudukan seperti KTP, KK, dan akta dari tenant DISDUKCAPIL',
    },
    {
        title: 'Perizinan & Nonperizinan',
        body: 'Pengurusan perizinan non berusaha dan perizinan lainnya melalui sistem SIALAP',
    },
    {
        title: 'Layanan Perpajakan & Kendaraan Bermotor',
        body: 'Pelayanan pembayaran pajak daerah, pelaporan pajak tahunan dan pajak kendaraan bermotor melalui tenant BAPENDA, KP2KP dan SAMSAT',
    },
    {
        title: 'Layanan Kesehatan & Sosial',
        body: 'Layanan kesehatan dan sosial dari tenant DINKES, BPJS Kesehatan, dan DINSOS',
    },
    {
        title: 'Layanan UMKM',
        body: 'Pelayanan pendampingan dan pengembangan usaha mikro, kecil, dan menengah melalui tenant UMKM',
    },
    {
        title: 'Layanan Umum',
        body: 'Layanan umum pembuatan SKCK, pengaduan masyarakat, dan layanan lainnya dari tenant POLRES, KEJARI, dan lainnya',
    },
];

export const FLOW_STEPS = [
    {
        title: 'Cek jadwal & status',
        body: 'Pastikan layanan sedang buka, dan catat jam operasional tenant yang ingin dikunjungi.',
    },
    {
        title: 'Ambil nomor antrean',
        body: 'Gunakan layanan antrean di lokasi atau antrean online melalui website resmi MPP',
    },
    {
        title: 'Layanan di loket',
        body: 'Petugas memproses permohonan Anda sesuai layanan tenant yang dipilih, dan memberikan informasi tambahan bila diperlukan.',
    },
    {
        title: 'Selesai & umpan balik',
        body: 'Terima hasil layanan dan berikan penilaian melalui survei kepuasan masyarakat.',
    },
];

export const ANTRIAN_URL = 'https://siantri-dpmptsp.muaraenimkab.go.id/pemohon';
export const SKM_URL = 'https://skm-dpmptsp.muaraenimkab.go.id/survey';
export const VIDEO_URL_PLACEHOLDER = ''; // ganti dengan URL YouTube profil MPP
export const HERO_VIDEO_SRC = '/media/hero.mp4';
export const HERO_VIDEO_POSTER = '/img/logo-mpp.png';

export const MPP_ADDRESS =
    'Jl. Jenderal Sudirman, Jl. Lintas Prabumulih - Muara Enim, Kec. Muara Enim, Kabupaten Muara Enim, Sumatera Selatan 31311';
export const MPP_MAPS_EMBED_URL = `https://maps.google.com/maps?q=${encodeURIComponent('Mall Pelayanan Publik Kabupaten Muara Enim')}&ll=-3.6460303,103.7738702&z=17&output=embed`;
export const MPP_MAPS_DIRECTIONS_URL =
    'https://maps.app.goo.gl/zkJXih1LCPD2ER787';

export const PENGADUAN_CHANNELS = [
    {
        label: 'Telepon',
        value: '+62 821 8148 7928',
        href: 'tel:+6282181487928',
    },
    {
        label: 'WhatsApp',
        value: '0821 8148 7928',
        href: 'https://wa.me/6282181487928',
    },
    {
        label: 'Email',
        value: 'pengaduan@dpmptsp.muaraenimkab.go.id',
        href: 'mailto:pengaduan@dpmptsp.muaraenimkab.go.id',
    },
];

// --- Fasilitas MPP — konten hard-coded (bisa disesuaikan langsung di sini) ---
export type Facility = {
    name: string;
    description: string;
    icon: LucideIcon;
    image: string;
};

export const FACILITIES: Facility[] = [
    {
        name: 'Mushola',
        description: 'Ruang ibadah bagi pengunjung.',
        icon: MoonStar,
        image: '/fasilities/mushola.jpg',
    },
    {
        name: 'Toilet',
        description: 'Fasilitas sanitasi bersih.',
        icon: Droplets,
        image: '/fasilities/toilet.jpg',
    },
    {
        name: 'Area Parkir',
        description: 'Area parkir kendaraan.',
        icon: Car,
        image: '/fasilities/parkir.jpg',
    },
    {
        name: 'Ruang Bermain Anak',
        description: 'Tempat bermain aman saat menunggu.',
        icon: Baby,
        image: '/fasilities/ruang-bermain-anak.jpg',
    },
    {
        name: 'Ruang Laktasi',
        description: 'Ruang menyusui yang nyaman.',
        icon: Milk,
        image: '/fasilities/laktasi.jpg',
    },
    {
        name: 'ATM',
        description: 'Mesin ATM di area gedung.',
        icon: HandCoins,
        image: '/fasilities/atm.jpg',
    },
    {
        name: 'Loket Prioritas',
        description: 'Loket khusus lansia, ibu hamil, dan disabilitas.',
        icon: Ticket,
        image: '/fasilities/disable.jpg',
    },
    {
        name: 'Pusat Informasi',
        description: 'Petugas membantu pengunjung menentukan layanan.',
        icon: Info,
        image: '/fasilities/informasi.jpg',
    },
    {
        name: 'Area Merokok',
        description: 'Area khusus merokok di luar ruang layanan.',
        icon: Cigarette,
        image: '/fasilities/smoking-area.jpg',
    },
    {
        name: 'Kafetaria',
        description: 'Tempat makan dan minum bagi pengunjung.',
        icon: Coffee,
        image: '/fasilities/cafetaria.jpg',
    },
    {
        name: 'Pojok Baca',
        description: 'Area untuk membaca buku dan majalah.',
        icon: BookOpen,
        image: '/fasilities/pojok-baca.jpg',
    },
    {
        name: 'Ruang Rapat',
        description: 'Ruang untuk rapat dan pertemuan.',
        icon: LayoutGrid,
        image: '/fasilities/ruang-rapat.jpg',
    },
];

export const NAV_LINKS = [
    { href: '#layanan', label: 'Layanan' },
    { href: '#tenant', label: 'Tenant' },
    { href: '#fasilitas', label: 'Fasilitas' },
    { href: '#layanan-digital', label: 'Layanan Digital' },
    { href: '#instagram', label: 'Instagram' },
    { href: '#kontak', label: 'Kontak' },
];

// ----------------------------------------------------------------------------
// Types dari server
// ----------------------------------------------------------------------------
export type TenantService = {
    id: number;
    name: string;
    description: string | null;
};
export type Tenant = {
    id: number;
    code: string;
    name: string;
    description: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
    logo_path: string | null;
    services: TenantService[];
};
export type ScheduleRow = {
    label: string;
    hours: string;
    day_numbers: number[];
    is_working_day: boolean;
    start: string | null;
    end: string | null;
};
export type TodayInfo = {
    is_working_day: boolean;
    start: string | null;
    end: string | null;
    label: string | null;
    holiday: string | null;
};
export type Review = {
    id: number;
    name: string;
    origin: string | null;
    rating: number;
    body: string;
    youtube_url: string | null;
};
export type Stats = {
    tenants: number;
    employees: number;
    present_today: number;
    monthly_attendance: number;
};

export type ActiveTenantToday = {
    id: number;
    code: string;
    name: string;
    present_count: number;
};

export type WelcomeProps = {
    tenants: Tenant[];
    stats: Stats;
    activeTenantsToday: ActiveTenantToday[];
    schedule: ScheduleRow[];
    today: TodayInfo;
    reviews: Review[];
    embedsocialRef: string;
};
