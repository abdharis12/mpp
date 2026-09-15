<?php

namespace Database\Seeders;

use App\Models\Tenant;
use App\Models\TenantService;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TenantCarouselSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Sample tenants for the welcome-page marquee.
     *
     * These are demo data (fake instansi) so the two-row auto-scrolling marquee
     * has content. Replace with real tenants via admin before going live.
     */
    public function run(): void
    {
        $tenants = [
            [
                'code' => 'DUKCAPIL',
                'name' => 'Dinas Kependudukan dan Pencatatan Sipil',
                'description' => 'Pelayanan administrasi kependudukan.',
                'phone' => '(0718) 000001',
                'email' => 'dukcapil@mpp-sample.dev',
                'address' => 'Gedung MPP, Kabupaten Muara Enim',
                'services' => [
                    ['name' => 'Pembuatan KTP', 'description' => 'Perekaman dan pencetakan KTP elektronik.', 'sort_order' => 1],
                    ['name' => 'Pembuatan KK', 'description' => 'Penerbitan Kartu Keluarga.', 'sort_order' => 2],
                    ['name' => 'Akta Kelahiran', 'description' => 'Penerbitan akta kelahiran.', 'sort_order' => 3],
                ],
            ],
            [
                'code' => 'DINSOS',
                'name' => 'Dinas Sosial',
                'description' => 'Pelayanan bantuan dan jaminan sosial.',
                'phone' => '(0718) 000002',
                'email' => 'dinsos@mpp-sample.dev',
                'address' => 'Gedung MPP, Kabupaten Muara Enim',
                'services' => [
                    ['name' => 'Bantuan Sosial', 'description' => 'Verifikasi bansos dan BPNT.', 'sort_order' => 1],
                    ['name' => 'Data Kemiskinan', 'description' => 'Pemutakhiran DTKS.', 'sort_order' => 2],
                ],
            ],
            [
                'code' => 'DINKES',
                'name' => 'Dinas Kesehatan',
                'description' => 'Pelayanan jaminan kesehatan masyarakat.',
                'phone' => '(0718) 000003',
                'email' => 'dinkes@mpp-sample.dev',
                'address' => 'Gedung MPP, Kabupaten Muara Enim',
                'services' => [
                    ['name' => 'JKN PBI', 'description' => 'Pendaftaran jaminan kesehatan PBI.', 'sort_order' => 1],
                    ['name' => 'Surat Keterangan Sehat', 'description' => 'Penerbitan surat keterangan.', 'sort_order' => 2],
                ],
            ],
            [
                'code' => 'DISDIKBUD',
                'name' => 'Dinas Pendidikan dan Kebudayaan',
                'description' => 'Pelayanan pendidikan dan kebudayaan.',
                'phone' => '(0718) 000004',
                'email' => 'disdikbud@mpp-sample.dev',
                'services' => [
                    ['name' => 'Legalisasi Ijazah', 'description' => 'Legalisir dokumen pendidikan.', 'sort_order' => 1],
                    ['name' => 'Bantuan PIP', 'description' => 'Informasi dan verifikasi PIP.', 'sort_order' => 2],
                ],
            ],
            [
                'code' => 'BPJSK',
                'name' => 'BPJS Kesehatan',
                'description' => 'Pelayanan kepesertaan jaminan kesehatan.',
                'phone' => '(0718) 000005',
                'email' => 'bpjs-ks@mpp-sample.dev',
                'services' => [
                    ['name' => 'Pendaftaran Peserta', 'description' => 'Registrasi kepesertaan baru.', 'sort_order' => 1],
                    ['name' => 'Perubahan Kelas', 'description' => 'Penyesuaian kelas perawatan.', 'sort_order' => 2],
                    ['name' => 'Informasi Iuran', 'description' => 'Cek tagihan dan status kepesertaan.', 'sort_order' => 3],
                ],
            ],
            [
                'code' => 'BPJSTK',
                'name' => 'BPJS Ketenagakerjaan',
                'description' => 'Pelayanan jaminan sosial ketenagakerjaan.',
                'phone' => '(0718) 000006',
                'email' => 'bpjs-tk@mpp-sample.dev',
                'services' => [
                    ['name' => 'Pendaftaran Perusahaan', 'description' => 'Registrasi kepesertaan perusahaan.', 'sort_order' => 1],
                    ['name' => 'Jaminan Kecelakaan Kerja', 'description' => 'Klaim JKK.', 'sort_order' => 2],
                ],
            ],
            [
                'code' => 'IMIGRASI',
                'name' => 'Kantor Imigrasi',
                'description' => 'Pelayanan keimigrasian.',
                'phone' => '(0718) 000007',
                'email' => 'imigrasi@mpp-sample.dev',
                'services' => [
                    ['name' => 'Paspor', 'description' => 'Penerbitan paspor.', 'sort_order' => 1],
                    ['name' => 'Perpanjangan Paspor', 'description' => 'Perpanjangan masa berlaku.', 'sort_order' => 2],
                ],
            ],
            [
                'code' => 'POLRI',
                'name' => 'Kepolisian Resor',
                'description' => 'Pelayanan publik kepolisian.',
                'phone' => '(0718) 000008',
                'email' => 'polres@mpp-sample.dev',
                'services' => [
                    ['name' => 'SKCK', 'description' => 'Surat keterangan catatan kepolisian.', 'sort_order' => 1],
                    ['name' => 'SIM', 'description' => 'Perpanjangan SIM.', 'sort_order' => 2],
                ],
            ],
            [
                'code' => 'PAJAK',
                'name' => 'Pajak Daerah',
                'description' => 'Pelayanan perpajakan daerah.',
                'phone' => '(0718) 000009',
                'email' => 'pajak@mpp-sample.dev',
                'services' => [
                    ['name' => 'PBB-P2', 'description' => 'Pembayaran PBB.', 'sort_order' => 1],
                    ['name' => 'BPHTB', 'description' => 'Bea perolehan hak atas tanah.', 'sort_order' => 2],
                    ['name' => 'Retribusi', 'description' => 'Pembayaran retribusi daerah.', 'sort_order' => 3],
                ],
            ],
            [
                'code' => 'PLN',
                'name' => 'PT PLN (Persero)',
                'description' => 'Pelayanan ketenagalistrikan.',
                'phone' => '(0718) 000010',
                'email' => 'pln@mpp-sample.dev',
                'services' => [
                    ['name' => 'Pasang Baru', 'description' => 'Pemasangan listrik baru.', 'sort_order' => 1],
                    ['name' => 'Informasi Tagihan', 'description' => 'Cek tagihan listrik.', 'sort_order' => 2],
                ],
            ],
            [
                'code' => 'PDAM',
                'name' => 'Perusahaan Daerah Air Minum',
                'description' => 'Pelayanan air bersih.',
                'phone' => '(0718) 000011',
                'email' => 'pdam@mpp-sample.dev',
                'services' => [
                    ['name' => 'Pasang Baru', 'description' => 'Registrasi sambungan air.', 'sort_order' => 1],
                    ['name' => 'Pembayaran Rekening', 'description' => 'Pembayaran tagihan air.', 'sort_order' => 2],
                ],
            ],
            [
                'code' => 'PUNMAS',
                'name' => 'Dinas PU Penataan Ruang',
                'description' => 'Pelayanan pekerjaan umum.',
                'phone' => '(0718) 000012',
                'email' => 'pupr@mpp-sample.dev',
                'services' => [
                    ['name' => 'IMB', 'description' => 'Izin mendirikan bangunan.', 'sort_order' => 1],
                    ['name' => 'SLF', 'description' => 'Sertifikat laik fungsi.', 'sort_order' => 2],
                ],
            ],
            [
                'code' => 'DISPANG',
                'name' => 'Dinas Perdagangan',
                'description' => 'Pelayanan perdagangan.',
                'phone' => '(0718) 000013',
                'email' => 'disdag@mpp-sample.dev',
                'services' => [
                    ['name' => 'TDP', 'description' => 'Tanda daftar perusahaan.', 'sort_order' => 1],
                    ['name' => 'SIUP', 'description' => 'Surat izin usaha perdagangan.', 'sort_order' => 2],
                ],
            ],
            [
                'code' => 'DISPERTAN',
                'name' => 'Dinas Pertanian',
                'description' => 'Pelayanan pertanian dan pangan.',
                'phone' => '(0718) 000014',
                'email' => 'distan@mpp-sample.dev',
                'services' => [
                    ['name' => 'Subsidi Pupuk', 'description' => 'Verifikasi subsidi pupuk.', 'sort_order' => 1],
                    ['name' => 'Bantuan Benih', 'description' => 'Distribusi benih bantuan.', 'sort_order' => 2],
                ],
            ],
            [
                'code' => 'DISHUB',
                'name' => 'Dinas Perhubungan',
                'description' => 'Pelayanan perhubungan.',
                'phone' => '(0718) 000015',
                'email' => 'dishub@mpp-sample.dev',
                'services' => [
                    ['name' => 'Uji KIR', 'description' => 'Pengujian kendaraan bermotor.', 'sort_order' => 1],
                    ['name' => 'Perpanjangan Izin Trayek', 'description' => 'Izin trayek angkutan.', 'sort_order' => 2],
                ],
            ],
            [
                'code' => 'DISNAKER',
                'name' => 'Dinas Tenaga Kerja',
                'description' => 'Pelayanan ketenagakerjaan.',
                'phone' => '(0718) 000016',
                'email' => 'disnaker@mpp-sample.dev',
                'services' => [
                    ['name' => 'AK1', 'description' => 'Kartu pencari kerja.', 'sort_order' => 1],
                    ['name' => 'Informasi Lowongan', 'description' => 'Penyampaian lowongan kerja.', 'sort_order' => 2],
                ],
            ],
            [
                'code' => 'DISKOMINFO',
                'name' => 'Dinas Komunikasi dan Informatika',
                'description' => 'Pelayanan komunikasi dan informasi.',
                'phone' => '(0718) 000017',
                'email' => 'kominfo@mpp-sample.dev',
                'services' => [
                    ['name' => 'Penyuluhan Informasi', 'description' => 'Layanan informasi publik.', 'sort_order' => 1],
                ],
            ],
            [
                'code' => 'DISPEN',
                'name' => 'Dinas Pendidikan Nonformal',
                'description' => 'Pelayanan pendidikan nonformal.',
                'phone' => '(0718) 000018',
                'email' => 'dispen@mpp-sample.dev',
                'services' => [
                    ['name' => 'Izin Operasional Kursus', 'description' => 'Izin lembaga kursus.', 'sort_order' => 1],
                    ['name' => 'Pendataan PKBM', 'description' => 'Pendataan pusat kegiatan belajar.', 'sort_order' => 2],
                ],
            ],
            [
                'code' => 'PENUNJANG',
                'name' => 'Layanan Pengadaan',
                'description' => 'Pelayanan pengadaan barang/jasa.',
                'phone' => '(0718) 000019',
                'email' => 'pengadaan@mpp-sample.dev',
                'services' => [
                    ['name' => 'Informasi Lelang', 'description' => 'Informasi tender/lelang.', 'sort_order' => 1],
                ],
            ],
            [
                'code' => 'UMUM',
                'name' => 'Loket Pembayaran Umum',
                'description' => 'Loket pembayaran atas tagihan umum.',
                'phone' => '(0718) 000020',
                'email' => 'umum@mpp-sample.dev',
                'services' => [
                    ['name' => 'Pembayaran Tagihan', 'description' => 'Pembayaran IMB, retribusi, dan tagihan lain.', 'sort_order' => 1],
                ],
            ],
        ];

        foreach ($tenants as $data) {
            $tenant = Tenant::firstOrCreate(
                ['code' => $data['code']],
                [
                    'name' => $data['name'],
                    'description' => $data['description'],
                    'phone' => $data['phone'],
                    'email' => $data['email'],
                    'address' => $data['address'] ?? null,
                    'is_active' => true,
                ]
            );

            foreach ($data['services'] as $service) {
                TenantService::firstOrCreate(
                    ['tenant_id' => $tenant->id, 'name' => $service['name']],
                    [
                        'description' => $service['description'],
                        'sort_order' => $service['sort_order'],
                        'is_active' => true,
                    ]
                );
            }
        }
    }
}
