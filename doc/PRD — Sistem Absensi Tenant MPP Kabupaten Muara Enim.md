# PRODUCT REQUIREMENTS DOCUMENT (PRD)

## Sistem Absensi Tenant MPP Kabupaten Muara Enim

**Versi:** 1.2  
**Status:** Ready for Development  
**Platform:** Web Application  
**Backend:** Laravel 13  
**Frontend:** React.js + Inertia  
**Database:** MySQL  
**Authentication:** Laravel Starter Kit / Fortify  
**Authorization:** Role & Permission  
**Timezone:** Asia/Jakarta

---

# 1. Ringkasan Produk

Sistem Absensi Tenant MPP Kabupaten Muara Enim adalah aplikasi berbasis web untuk mengelola, mencatat, memvalidasi, dan memonitor kehadiran seluruh petugas tenant di Mal Pelayanan Publik Kabupaten Muara Enim.

Sistem menggunakan:

- Autentikasi pengguna.
- Role & permission.
- Validasi lokasi GPS.
- Radius absensi **20 meter**.
- Timestamp dari server.
- Jadwal kerja configurable.
- Pengaturan hari libur oleh Admin.
- Pengaturan libur penuh atau sebagian jam kerja.
- Izin.
- Koreksi absensi.
- Monitoring.
- Laporan.
- Audit trail.

---

# 2. Tujuan Produk

Sistem bertujuan:

- Mendigitalisasi absensi seluruh tenant MPP.
- Memastikan absensi hanya dapat dilakukan dari lokasi yang ditentukan.
- Mengurangi manipulasi waktu dan lokasi.
- Mempermudah monitoring kehadiran.
- Mempermudah pengelolaan hari kerja dan hari libur.
- Menghasilkan laporan otomatis.
- Menyediakan histori dan audit yang dapat dipertanggungjawabkan.

---

# 3. Role Pengguna

## 3.1 Super Admin / Admin MPP

Akses seluruh sistem.

Dapat:

- Mengelola tenant.
- Mengelola petugas.
- Mengelola lokasi absensi.
- Mengatur radius.
- Mengatur jadwal kerja.
- Mengatur hari libur.
- Mengatur jenis izin.
- Melihat seluruh absensi.
- Mengelola koreksi.
- Melihat laporan.
- Melihat audit log.
- Mengelola konfigurasi.

## 3.2 Admin Tenant

Hanya mengelola tenant sendiri.

Dapat:

- Mengelola petugas.
- Melihat absensi.
- Mengajukan koreksi.
- Melihat izin.
- Melihat laporan tenant.

Tidak dapat mengubah konfigurasi pusat seperti:

- Titik lokasi MPP.
- Radius absensi.
- Aturan global.
- Hari libur global.

## 3.3 Petugas Tenant

Dapat:

- Login.
- Absensi masuk.
- Absensi pulang.
- Melihat histori.
- Mengajukan izin.
- Mengajukan koreksi.
- Melihat jadwal.
- Melihat kalender hari kerja/libur.

## 3.4 Viewer / Pimpinan

Read-only:

- Dashboard.
- Monitoring.
- Statistik.
- Laporan.

---

# 4. Jadwal Kerja Default

Jadwal awal:

| Hari | Mulai | Selesai |
|---|---:|---:|
| Senin | 08:00 | 16:00 |
| Selasa | 08:00 | 16:00 |
| Rabu | 08:00 | 16:00 |
| Kamis | 08:00 | 16:00 |
| **Jumat** | **07:00** | **16:30** |
| Sabtu | OFF | OFF |
| Minggu | OFF | OFF |

Jadwal harus configurable melalui database.

Tidak boleh hard-code di React atau Controller.

---

# 5. Hari Libur

## 5.1 Prinsip

Admin harus dapat membuat **hari libur secara manual**, walaupun tanggal tersebut secara default merupakan hari kerja.

Contoh:

```text
Senin, 17 Agustus 2026
```

Secara default:

```text
Senin = hari kerja
08:00 - 16:00
```

Tetapi Admin menetapkan:

```text
17 Agustus 2026
Hari Kemerdekaan
FULL DAY HOLIDAY
```

Maka pada tanggal tersebut:

```text
Tidak ada kewajiban absensi.
```

---

# 6. Jenis Hari Libur

Sistem menyediakan kategori:

```text
NATIONAL_HOLIDAY
JOINT_LEAVE
SPECIAL_HOLIDAY
MPP_CLOSURE
OFFICIAL_EVENT
OTHER
```

Nama kategori dapat dikonfigurasi Admin.

Contoh:

```text
17 Agustus 2026
Hari Kemerdekaan RI
NATIONAL_HOLIDAY
```

atau:

```text
26 Desember 2026
Cuti Bersama
JOINT_LEAVE
```

atau:

```text
10 September 2026
Penutupan Pelayanan MPP
MPP_CLOSURE
```

---

# 7. Full Day Holiday

Admin dapat mengaktifkan:

```text
Full Day = YES
```

Contoh:

```text
Tanggal:
17-08-2026

Nama:
Hari Kemerdekaan RI

Jenis:
NATIONAL_HOLIDAY

Full Day:
YES
```

Maka seluruh jam kerja pada tanggal tersebut dianggap libur.

Contoh:

```text
Senin
08:00 - 16:00

HOLIDAY
```

Petugas tidak perlu melakukan:

```text
Clock In
Clock Out
```

dan sistem tidak menghitung sebagai:

```text
ABSENT
```

---

# 8. Partial Holiday / Libur Sebagian Jam Kerja

Sistem juga harus mendukung hari libur yang hanya berlaku pada **periode tertentu di dalam jam kerja**.

Contoh:

```text
Jumat
Jam kerja:
07:00 - 16:30

Libur:
12:00 - 13:00
```

Maka:

```text
07:00 - 12:00
= jam kerja

12:00 - 13:00
= HOLIDAY

13:00 - 16:30
= jam kerja
```

Petugas hanya diwajibkan hadir pada periode kerja.

---

# 9. Contoh Partial Holiday

Admin membuat:

```text
Tanggal:
11-09-2026

Nama:
Kegiatan Internal MPP

Mulai Libur:
12:00

Selesai Libur:
13:30
```

Maka sistem:

```text
07:00 - 12:00 → WORKING
12:00 - 13:30 → HOLIDAY
13:30 - 16:30 → WORKING
```

Sistem tidak boleh menganggap seluruh tanggal sebagai libur.

---

# 10. Hari Libur Pada Awal Jam Kerja

Contoh Jumat:

```text
Jam kerja:
07:00 - 16:30

Libur:
07:00 - 10:00
```

Maka:

```text
07:00 - 10:00
HOLIDAY

10:00 - 16:30
WORKING
```

Petugas baru memiliki kewajiban clock-in setelah periode libur selesai.

---

# 11. Hari Libur Pada Akhir Jam Kerja

Contoh:

```text
Jam kerja:
08:00 - 16:00

Libur:
14:00 - 16:00
```

Maka:

```text
08:00 - 14:00
WORKING

14:00 - 16:00
HOLIDAY
```

Petugas tidak perlu melakukan aktivitas kerja pada periode tersebut.

---

# 12. Data Holiday

Tabel yang disarankan:

```text
holidays
```

Field:

```text
id
name
holiday_type

start_date
end_date

is_full_day

start_time
end_time

description

status

created_by
updated_by

created_at
updated_at
```

---

# 13. Multi-Day Holiday

Hari libur dapat berlaku lebih dari satu hari.

Contoh:

```text
Start:
28-12-2026

End:
31-12-2026
```

Jika:

```text
is_full_day = true
```

maka semua tanggal tersebut dianggap libur penuh.

---

# 14. Partial Holiday Multi-Day

Sistem juga dapat mendukung:

```text
28-12-2026
12:00 - 16:00

29-12-2026
FULL DAY

30-12-2026
FULL DAY

31-12-2026
08:00 - 12:00
```

Untuk kasus yang kompleks, sistem sebaiknya mendukung **holiday exception per tanggal** daripada memaksakan satu jam berlaku untuk seluruh rentang tanggal.

Dengan demikian struktur lanjutan dapat menggunakan:

```text
holidays
holiday_periods
```

atau model exception yang setara.

---

# 15. Prioritas Aturan Jadwal

Saat menghitung kewajiban absensi, engine menggunakan prioritas:

```text
1. Holiday / Closure
2. Special Schedule
3. Employee/Tenant Schedule
4. Default Schedule
```

Contoh:

```text
Default:
Jumat 07:00 - 16:30
```

Kemudian Admin membuat:

```text
11 September
12:00 - 13:30
HOLIDAY
```

Maka attendance engine menghasilkan:

```text
07:00 - 12:00
WORK

12:00 - 13:30
HOLIDAY

13:30 - 16:30
WORK
```

---

# 16. Pengaruh Hari Libur terhadap Absensi

## Full Day

Tidak ada kewajiban absensi.

```text
Expected Attendance:
0
```

Status harian:

```text
HOLIDAY
```

Bukan:

```text
ABSENT
```

---

## Partial Holiday

Kewajiban kerja hanya dihitung pada jam yang bukan holiday.

Contoh:

```text
07:00 - 12:00
WORK

12:00 - 13:30
HOLIDAY

13:30 - 16:30
WORK
```

Total expected work:

```text
8 jam
```

bukan:

```text
9 jam 30 menit
```

---

# 17. Perhitungan Keterlambatan

Contoh Jumat:

```text
Normal:
07:00

Grace period:
10 menit
```

Namun:

```text
07:00 - 08:00
HOLIDAY
```

Jika jam kerja baru dimulai:

```text
08:00
```

maka keterlambatan dihitung dari:

```text
08:00
```

bukan:

```text
07:00
```

---

# 18. Contoh Kasus Holiday + Late

Jadwal:

```text
Jumat:
07:00 - 16:30
```

Holiday:

```text
07:00 - 09:00
```

Jam kerja efektif:

```text
09:00 - 16:30
```

Grace period:

```text
10 menit
```

Petugas clock-in:

```text
09:05
```

Status:

```text
PRESENT
```

Petugas clock-in:

```text
09:15
```

Status:

```text
LATE
```

Late dihitung dari:

```text
09:00
```

---

# 19. Clock-in Pada Hari Full Holiday

Jika:

```text
17 Agustus
FULL DAY HOLIDAY
```

dan petugas mencoba clock-in:

Sistem dapat menolak tindakan tersebut:

> Hari ini merupakan hari libur. Absensi tidak diperlukan.

Attendance tidak dibuat sebagai normal attendance.

Untuk audit, percobaan tersebut dapat dicatat sebagai:

```text
ATTENDANCE_ATTEMPT_ON_HOLIDAY
```

---

# 20. Clock-in Pada Partial Holiday

Jika:

```text
12:00 - 13:30
HOLIDAY
```

dan petugas mencoba clock-in:

```text
12:15
```

Sistem menolak:

> Saat ini berada dalam periode libur. Absensi tidak diperlukan.

Jika petugas mencoba:

```text
13:45
```

Sistem memperbolehkan clock-in berdasarkan jadwal yang aktif saat itu.

---

# 21. Clock-out Pada Partial Holiday

Aturan yang sama berlaku pada clock-out.

Contoh:

```text
12:00 - 13:30
HOLIDAY
```

Jika petugas melakukan clock-out:

```text
12:30
```

maka sistem harus menolak karena waktu tersebut berada pada periode libur.

Setelah:

```text
13:30
```

clock-out dapat dilakukan apabila aturan attendance masih mengizinkannya.

---

# 22. Location Validation Tetap Berlaku

Hari libur tidak mengubah aturan lokasi.

Pada jam kerja normal:

```text
Clock In
+
GPS
+
Radius 20m
```

Tetap wajib.

Tetapi pada periode holiday:

```text
HOLIDAY
```

tidak ada kewajiban clock-in/out.

---

# 23. Attendance Engine

Perhitungan status attendance harus menggunakan service khusus.

Contoh:

```text
AttendanceEngine
```

Input:

```text
employee
date
time
schedule
holiday
attendance
```

Output:

```text
is_working_time
is_holiday
expected_start
expected_end
status
late_minutes
```

Konsep:

```text
                    Attendance Engine
                           │
            ┌──────────────┼──────────────┐
            ▼              ▼              ▼
         Schedule       Holiday        Existing
            │              │           Attendance
            └──────────────┼──────────────┘
                           ▼
                      Final Rules
                           │
                           ▼
                      Attendance
```

---

# 24. Holiday Resolution

Urutan pemeriksaan:

```text
1. Apakah tanggal termasuk holiday?
       │
       ├── YES
       │    ↓
       │  Full day?
       │    │
       │    ├── YES → HOLIDAY
       │    │
       │    └── NO
       │         ↓
       │     Cek time range
       │
       └── NO
            ↓
       Gunakan Schedule
```

---

# 25. Konflik Holiday dan Schedule

Jika terdapat:

```text
Schedule:
08:00 - 16:00

Holiday:
08:00 - 16:00
```

hasil:

```text
HOLIDAY
```

Jika:

```text
Schedule:
08:00 - 16:00

Holiday:
12:00 - 13:00
```

hasil:

```text
08:00 - 12:00 WORK
12:00 - 13:00 HOLIDAY
13:00 - 16:00 WORK
```

---

# 26. Admin Holiday Management

Menu:

```text
Master Data
   └── Hari Libur
```

Halaman:

```text
Hari Libur

[ + Tambah Hari Libur ]

Filter:
[Tahun]
[Jenis]
[Status]
```

Table:

| Tanggal | Keterangan | Jenis | Durasi | Status |
|---|---|---|---|---|
| 17-08-2026 | Hari Kemerdekaan | Nasional | Full Day | Aktif |
| 11-09-2026 | Kegiatan MPP | Khusus | 12:00–13:30 | Aktif |

---

# 27. Form Tambah Hari Libur

```text
Nama Hari Libur
[________________]

Jenis
[ National Holiday ▼ ]

Tanggal Mulai
[ 17/08/2026 ]

Tanggal Selesai
[ 17/08/2026 ]

○ Libur Seharian

Jika tidak:

Jam Mulai
[ 12:00 ]

Jam Selesai
[ 13:30 ]

Keterangan
[________________]

Status
[ Aktif ]

[ Simpan ]
```

UX harus otomatis menyembunyikan field jam ketika:

```text
Full Day = YES
```

---

# 28. Kalender Admin

Admin sebaiknya memiliki tampilan kalender.

Contoh:

```text
September 2026

Sen  Sel  Rab  Kam  Jum  Sab  Min
 7    8    9   10   11   12   13
                 ▲
             Libur 12:00-13:30
```

Warna/status kalender:

```text
WORKING
HOLIDAY
PARTIAL HOLIDAY
SPECIAL SCHEDULE
OFF
```

---

# 29. Kalender Petugas

Petugas juga dapat melihat:

```text
September 2026

11 Jumat
07:00 - 12:00 Kerja
12:00 - 13:30 Libur
13:30 - 16:30 Kerja
```

Ini mencegah kebingungan ketika jam kerja berubah karena hari libur khusus.

---

# 30. Holiday Notification

Jika ada perubahan jadwal:

```text
Admin membuat holiday
```

Sistem dapat membuat notifikasi:

> 11 September 2026 terdapat libur khusus pukul 12:00–13:30.

Untuk full day:

> 17 Agustus 2026 merupakan hari libur. Absensi tidak diperlukan.

---

# 31. Audit Hari Libur

Semua perubahan hari libur dicatat:

```text
HOLIDAY_CREATED
HOLIDAY_UPDATED
HOLIDAY_DELETED
HOLIDAY_ACTIVATED
HOLIDAY_DEACTIVATED
```

Audit mencatat:

```text
who
when
old value
new value
reason
IP
user agent
```

---

# 32. Attendance Calculation Example

### Normal Friday

```text
Schedule:
07:00 - 16:30

Holiday:
None
```

Expected:

```text
07:00 - 16:30
```

---

### Full Holiday Friday

```text
Schedule:
07:00 - 16:30

Holiday:
FULL DAY
```

Expected:

```text
No attendance required
```

---

### Partial Holiday Friday

```text
Schedule:
07:00 - 16:30

Holiday:
12:00 - 13:30
```

Expected:

```text
07:00 - 12:00
13:30 - 16:30
```

---

# 33. Attendance Status

Status utama:

```text
PRESENT
LATE
ABSENT
LEAVE
HOLIDAY
OFF
```

Untuk periode:

```text
PARTIAL_HOLIDAY
```

status tersebut lebih tepat dianggap sebagai **schedule state**, bukan status satu record attendance.

Dengan demikian data attendance tetap bersih dan laporan tidak rancu.

---

# 34. Database

Entitas utama:

```text
users
tenants
employees

attendance_locations

attendance_schedules
attendance_schedule_days

attendances

holidays
holiday_periods

leave_types
leaves

attendance_corrections

audit_logs
```

---

# 35. Rekomendasi Model Holiday

Untuk fleksibilitas, saya merekomendasikan:

```text
holidays
```

menyimpan informasi event libur:

```text
id
name
holiday_type
start_date
end_date
is_full_day
description
status
created_by
updated_by
created_at
updated_at
```

Sedangkan:

```text
holiday_periods
```

menyimpan periode waktu:

```text
id
holiday_id
date
start_time
end_time
is_full_day
```

Pendekatan ini lebih fleksibel untuk kebutuhan seperti:

```text
Senin
Full Day

Selasa
12:00 - 16:00

Rabu
08:00 - 10:00
```

---

# 36. Business Rule Holiday

Aturan:

```text
IF holiday.is_full_day
THEN no attendance required
```

Jika partial:

```text
IF current_time BETWEEN
holiday.start_time AND holiday.end_time
THEN no attendance required
```

Jika berada di luar periode holiday:

```text
normal schedule applies
```

---

# 37. Business Rule Final

Attendance engine harus mempertimbangkan seluruh kondisi:

```text
Employee
     ↓
Tenant
     ↓
Date
     ↓
Holiday?
 ┌───┴───┐
 YES     NO
 │        │
 ▼        ▼
Holiday  Schedule
 │        │
 │      Working?
 │      ┌──┴──┐
 │     YES   NO
 │      │     │
 │      ▼     ▼
 │   Location OFF
 │   Validation
 │      │
 └──────┼───────
        ▼
    Attendance
```

---

# 38. P0 — Mandatory

Fitur MVP:

```text
Authentication

Tenant
Employee
Role & Permission

Attendance
Clock In
Clock Out

GPS Validation
20 Meter Radius
GPS Accuracy

Schedule

Monday-Thursday
08:00 - 16:00

Friday
07:00 - 16:30

Holiday Management
Full Day Holiday
Partial Holiday
Multi-Day Holiday

Leave
Correction
Audit Log

Dashboard
Reports
```

---

# 39. P1 — Important

```text
Excel Export
PDF Export

Holiday Calendar
Employee Calendar

Notification
Advanced Statistics

Real-time Dashboard
```

---

# 40. P2 — Future

```text
Dynamic QR
PWA
Push Notification
GPS Spoofing Detection
Face Recognition
External Integration
```

---

# 41. Acceptance Criteria — Full Day Holiday

Given:

```text
17 Agustus 2026
Monday
08:00 - 16:00
```

And Admin membuat:

```text
Full Day Holiday
```

When petugas membuka halaman absensi:

Then:

```text
Status = HOLIDAY
Clock In = disabled
Clock Out = disabled
```

Tidak boleh tercatat sebagai:

```text
ABSENT
```

---

# 42. Acceptance Criteria — Partial Holiday

Given:

```text
Friday
07:00 - 16:30
```

Admin membuat:

```text
12:00 - 13:30
HOLIDAY
```

Then:

```text
07:00 - 12:00 = WORK
12:00 - 13:30 = HOLIDAY
13:30 - 16:30 = WORK
```

Petugas dapat absen pada periode kerja.

Petugas tidak perlu absen pada periode holiday.

---

# 43. Acceptance Criteria — Holiday dan Late

Given:

```text
Friday
07:00 - 16:30

Holiday:
07:00 - 09:00

Grace:
10 minutes
```

Effective start:

```text
09:00
```

Clock-in:

```text
09:05
```

Result:

```text
PRESENT
```

Clock-in:

```text
09:15
```

Result:

```text
LATE
```

---

# 44. Acceptance Criteria — Outside Holiday

Given:

```text
Friday
07:00 - 16:30

Holiday:
12:00 - 13:30
```

At:

```text
11:00
```

system:

```text
WORKING
```

At:

```text
12:30
```

system:

```text
HOLIDAY
```

At:

```text
14:00
```

system:

```text
WORKING
```

---

# 45. Kesimpulan

Dengan perubahan ini, sistem memiliki **Attendance Schedule Engine** yang jauh lebih fleksibel.

Contoh akhir:

```text
               MPP MUARA ENIM
                      │
              Attendance Engine
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
     Schedule       Holiday       Location
        │             │             │
        │          Full/Partial    Radius
        │             │             20m
        └─────────────┼─────────────┘
                      ▼
                Final Schedule
                      │
                 ┌────┴────┐
                 ▼         ▼
               WORK      HOLIDAY
                 │
                 ▼
          GPS Validation
                 │
                 ▼
             ATTENDANCE
```

Aturan inti sekarang:

```text
Lokasi absensi:
Ditentukan Admin

Radius:
20 meter

Senin-Kamis:
08:00 - 16:00

Jumat:
07:00 - 16:30

Sabtu-Minggu:
OFF

Hari libur:
Dapat dibuat Admin

Hari libur:
Dapat Full Day

Hari libur:
Dapat Partial / per jam

Hari libur:
Dapat Multi-Day

Partial Holiday:
Tidak menghapus seluruh jadwal,
hanya menonaktifkan periode tertentu

Server:
Menjadi sumber waktu dan keputusan akhir

Clock-in:
Wajib valid lokasi pada jam kerja

Clock-out:
Wajib valid lokasi pada jam kerja

Holiday:
Tidak dihitung sebagai ABSENT
```