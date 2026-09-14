<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>Rekap Absensi Bulanan - MPP Kabupaten Muara Enim</title>
<style>
  @page { size: A4 landscape; margin: 12mm 15mm; }
  * { box-sizing: border-box; }
  body {
    font-family: Arial, Helvetica, sans-serif;
    color: #000;
    margin: 0;
    padding: 0;
  }
  .sheet {
    max-width: 100%;
    padding: 0;
  }
  .kop {
    display: flex;
    align-items: center;
    gap: 14px;
    padding-bottom: 6px;
  }
  .kop img {
    width: 78px;
    height: 78px;
    flex-shrink: 0;
  }
  .kop-text { text-align: center; flex: 1; }
  .kop-text h1 {
    font-size: 17px;
    margin: 0;
    font-weight: normal;
  }
  .kop-text h2 {
    font-size: 15px;
    margin: 2px 0;
    font-weight: bold;
  }
  .kop-text p {
    font-size: 11px;
    margin: 1px 0;
  }
  .kop-line {
    border: none;
    border-top: 3px solid #000;
    border-bottom: 1px solid #000;
    margin: 4px 0 12px 0;
  }
  .title { text-align: center; margin-bottom: 10px; }
  .title p { margin: 2px 0; font-weight: bold; font-size: 14px; }
  .meta { margin-bottom: 10px; font-size: 12px; display: flex; gap: 30px; }
  .meta div { }
  .meta span.label { font-weight: bold; }
  .meta span.colon { margin: 0 4px; }
  .meta .fill {
    border-bottom: 1px dotted #000;
    min-height: 14px;
    display: inline-block;
    min-width: 120px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 11px;
    margin-bottom: 20px;
  }
  th, td {
    border: 1px solid #000;
    padding: 4px 6px;
    text-align: center;
  }
  th { font-weight: bold; font-size: 10px; }
  td { height: 22px; }
  td.num { text-align: center; }
  td.name { text-align: left; }
  td.tenant { text-align: left; }
  .summary-row td { font-weight: bold; background-color: #f5f5f5; }
  .ttd {
    margin-top: 8px;
    font-size: 12px;
    text-align: right;
  }
  .ttd-inner {
    display: inline-block;
    text-align: center;
  }
  .ttd-space { height: 50px; }
  .ttd-name {
    font-weight: bold;
    text-decoration: underline;
    margin: 0;
  }
  .ttd-inner p { margin: 2px 0; }
</style>
</head>
<body>

<div class="sheet">
  <div class="kop">
    <img src="data:image/png;base64,{{ $logo }}" alt="Logo Kabupaten Muara Enim">
    <div class="kop-text">
      <h1>PEMERINTAH KABUPATEN MUARA ENIM</h1>
      <h2>DINAS PENANAMAN MODAL DAN PELAYANAN TERPADU SATU PINTU</h2>
      <p>Jalan Jend. Sudirman Simpang Bemban (Depan GOR) RT. 001 RW. 009</p>
      <p>Kelurahan Muara Enim Kecamatan Muara Enim Kode Pos (31312) Sumatera Selatan</p>
      <p>Website : https://dpmptsp.muaraenimkab.go.id &nbsp; Email : dpm.ptspmuaraenim@gmail.com</p>
    </div>
  </div>
  <hr class="kop-line">

  <div class="title">
    <p>REKAP ABSENSI BULANAN</p>
    <p>MAL PELAYANAN PUBLIK KABUPATEN MUARA ENIM</p>
  </div>

  <div class="meta">
    <div>
      <span class="label">Bulan</span>
      <span class="colon">:</span>
      <span class="fill">{{ $monthLabel }}</span>
    </div>
    @if($tenantName)
    <div>
      <span class="label">Tenant</span>
      <span class="colon">:</span>
      <span class="fill">{{ $tenantName }}</span>
    </div>
    @endif
    <div>
      <span class="label">Jumlah Petugas</span>
      <span class="colon">:</span>
      <span class="fill">{{ $summaries->count() }}</span>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th rowspan="2" style="width:30px">NO</th>
        <th rowspan="2" style="width:140px">NAMA</th>
        <th rowspan="2" style="width:100px">KODE</th>
        <th rowspan="2" style="width:120px">GERAI/TENANT</th>
        <th colspan="5">REKAP KEHADIRAN</th>
        <th colspan="2">DURASI</th>
      </tr>
      <tr>
        <th style="width:45px">Hadir</th>
        <th style="width:45px">Terlambat</th>
        <th style="width:45px">Pulang Cepat</th>
        <th style="width:45px">Izin</th>
        <th style="width:45px">Tidak Hadir</th>
        <th style="width:55px">Total Jam</th>
        <th style="width:55px">Rata-rata/Jam</th>
      </tr>
    </thead>
    <tbody>
      @forelse($summaries as $index => $s)
      <tr>
        <td class="num">{{ $index + 1 }}</td>
        <td class="name">{{ $s['employee_name'] }}</td>
        <td class="num">{{ $s['employee_code'] }}</td>
        <td class="tenant">{{ $s['tenant_name'] }}</td>
        <td class="num">{{ $s['present_count'] }}</td>
        <td class="num">{{ $s['late_count'] }}</td>
        <td class="num">{{ $s['early_leave_count'] }}</td>
        <td class="num">{{ $s['leave_count'] }}</td>
        <td class="num">{{ $s['absent_count'] }}</td>
        <td class="num">{{ $s['total_work_duration_minutes'] > 0 ? floor($s['total_work_duration_minutes'] / 60).'j '.($s['total_work_duration_minutes'] % 60).'m' : '-' }}</td>
        <td class="num">{{ $s['avg_work_duration_minutes'] > 0 ? floor($s['avg_work_duration_minutes'] / 60).'j '.($s['avg_work_duration_minutes'] % 60).'m' : '-' }}</td>
      </tr>
      @empty
      <tr>
        <td colspan="11" style="text-align:center; padding:20px;">Tidak ada data untuk bulan ini</td>
      </tr>
      @endforelse
      @if($summaries->count() > 0)
      <tr class="summary-row">
        <td colspan="4" style="text-align:left">TOTAL</td>
        <td class="num">{{ $summaries->sum('present_count') }}</td>
        <td class="num">{{ $summaries->sum('late_count') }}</td>
        <td class="num">{{ $summaries->sum('early_leave_count') }}</td>
        <td class="num">{{ $summaries->sum('leave_count') }}</td>
        <td class="num">{{ $summaries->sum('absent_count') }}</td>
        <td class="num"></td>
        <td class="num"></td>
      </tr>
      @endif
    </tbody>
  </table>

  <div class="ttd">
    <div class="ttd-inner">
      <p>Penata Perizinan Ahli Madya / Koordinator MPP</p>
      <div class="ttd-space"></div>
      <p class="ttd-name">ZALDI AZUWAR, S.E., M.Si</p>
      <p>Pembina Tingkat I (IV/b)</p>
      <p>NIP: 196805171993031006</p>
    </div>
  </div>
</div>

</body>
</html>