# 02 — SYSTEM SPECIFICATION

## Sistem Absensi Tenant MPP Kabupaten Muara Enim

**Version:** 1.0  
**Status:** Approved  
**Depends On:** `01-PRD.md`  
**Backend:** Laravel 13  
**Frontend:** React + Inertia  
**Database:** MySQL  
**Timezone:** `Asia/Jakarta`

---

# 1. Purpose

Dokumen ini mendefinisikan **bagaimana sistem harus berperilaku secara teknis dan fungsional** berdasarkan requirement yang telah ditetapkan pada PRD.

Dokumen ini menjadi acuan untuk:

- backend developer,
- frontend developer,
- AI coding agent,
- tester,
- code reviewer.

Dokumen ini harus dianggap sebagai **source of truth untuk system behavior**.

Apabila terdapat konflik antara implementasi dan dokumen ini, implementasi harus mengikuti dokumen ini kecuali PRD telah diubah secara resmi.

---

# 2. System Principles

Sistem harus mengikuti prinsip:

1. **Server authoritative**
2. **Secure by default**
3. **Tenant isolated**
4. **Configuration over hard-code**
5. **Database integrity first**
6. **Audit important actions**
7. **Frontend is not trusted**
8. **Attendance rules are deterministic**
9. **Location validation is server-side**
10. **Business logic must not depend on UI**

---

# 3. System Context

```text
                        INTERNET
                            │
                            ▼
                      Cloudflare / DNS
                            │
                            ▼
                      Reverse Proxy
                            │
                            ▼
                    Laravel 13 Application
                            │
              ┌─────────────┼─────────────┐
              │             │             │
              ▼             ▼             ▼
           React +       MySQL         Redis
           Inertia                       │
                                        │
                                  Queue / Cache
```

Core application modules:

```text
Authentication
Authorization
Tenant Management
Employee Management
Attendance
Schedule
Holiday
Leave
Correction
Reporting
Notification
Audit
System Settings
```

---

# 4. User Context

## 4.1 Super Admin

Global access.

Dapat:

- mengelola tenant,
- mengelola employee,
- mengelola lokasi,
- mengelola schedule,
- mengelola holiday,
- melihat seluruh attendance,
- menangani correction,
- melihat seluruh report,
- melihat audit.

---

## 4.2 Admin MPP

Memiliki akses operasional terhadap seluruh tenant.

Dapat:

- monitoring tenant,
- monitoring attendance,
- mengelola konfigurasi operasional,
- mengelola holiday,
- melihat report,
- memproses administrasi sesuai permission.

---

## 4.3 Admin Tenant

Scope selalu terbatas pada tenant miliknya.

```text
current_user.tenant_id
```

harus menjadi dasar seluruh query tenant-scoped.

Tidak boleh memilih `tenant_id` lain hanya dengan memodifikasi request.

---

## 4.4 Tenant Staff

Hanya dapat:

- melihat data sendiri,
- clock-in,
- clock-out,
- melihat histori sendiri,
- mengajukan leave,
- mengajukan correction.

---

## 4.5 Viewer

Read-only.

Tidak dapat:

- membuat data,
- mengubah data,
- menghapus data,
- approve,
- reject,
- clock-in,
- clock-out.

---

# 5. Authentication

Authentication menggunakan Laravel authentication stack.

Aturan:

- Semua operasi attendance membutuhkan authenticated user.
- User nonaktif tidak dapat melakukan attendance.
- Employee yang tidak aktif tidak dapat melakukan attendance.
- Tenant nonaktif tidak dapat melakukan attendance.
- Session harus valid.
- Authorization tetap dilakukan setelah authentication.

Flow:

```text
Request
  ↓
Authentication
  ↓
User Active?
  ↓
Employee Active?
  ↓
Tenant Active?
  ↓
Authorization
  ↓
Business Rule
```

---

# 6. Tenant Isolation

Tenant isolation adalah requirement security utama.

## Rule

Semua data tenant-scoped harus dibatasi berdasarkan tenant user yang sedang aktif.

Contoh:

```text
Admin Tenant A
        ↓
tenant_id = A
        ↓
Employee query
        ↓
Attendance query
        ↓
Leave query
        ↓
Correction query
        ↓
Report query
```

Admin Tenant A tidak boleh:

- melihat employee Tenant B,
- melihat attendance Tenant B,
- melihat leave Tenant B,
- melihat correction Tenant B,
- export data Tenant B.

Frontend filter tidak dianggap sebagai mekanisme security.

Backend harus tetap menerapkan isolation.

---

# 7. Timezone

Timezone aplikasi:

```text
Asia/Jakarta
```

Semua aturan jadwal dan attendance menggunakan timezone aplikasi.

Timestamp dari browser tidak boleh menjadi sumber kebenaran.

Server menjadi sumber waktu utama.

---

# 8. Attendance Architecture

Attendance terdiri dari:

```text
Identity
+
Schedule
+
Holiday
+
Location
+
Time
+
Attendance State
+
Audit
```

Flow utama:

```text
Employee
   ↓
Current Date/Time
   ↓
Schedule Resolver
   ↓
Holiday Resolver
   ↓
Effective Working Period
   ↓
Attendance Validation
   ↓
Location Validation
   ↓
Create / Update Attendance
   ↓
Audit Log
```

---

# 9. Attendance Location

Sistem mempunyai lokasi absensi resmi yang ditentukan Admin.

Default:

```text
Radius = 20 meter
```

Data lokasi minimal:

```text
name
latitude
longitude
radius_meter
maximum_gps_accuracy
status
```

Lokasi aktif yang digunakan oleh attendance engine adalah lokasi yang telah ditetapkan Admin.

---

# 10. Geolocation Rule

Setiap clock-in dan clock-out wajib melakukan validasi lokasi.

```text
Clock In  → GPS validation
Clock Out → GPS validation
```

Client mengirim:

```text
latitude
longitude
accuracy
```

Backend menghitung distance dari titik lokasi resmi.

---

# 11. Distance Rule

Valid:

```text
distance <= configured_radius
```

Dengan default:

```text
configured_radius = 20 meters
```

Contoh:

```text
Distance = 6m
Radius   = 20m
Result   = VALID
```

```text
Distance = 20m
Radius   = 20m
Result   = VALID
```

```text
Distance = 20.1m
Radius   = 20m
Result   = INVALID
```

Keputusan validasi hanya boleh dibuat server.

---

# 12. GPS Accuracy Rule

Selain distance, sistem memeriksa `accuracy`.

Default:

```text
maximum_gps_accuracy = 50 meters
```

Contoh:

```text
Distance = 8m
Accuracy = 7m
Result   = VALID
```

Tetapi:

```text
Distance = 8m
Accuracy = 120m
Result   = INVALID
```

Pesan yang ditampilkan:

> Akurasi lokasi perangkat terlalu rendah. Aktifkan lokasi presisi tinggi dan coba kembali.

Nilai maximum accuracy dapat dikonfigurasi Admin.

---

# 13. GPS Failure Conditions

Attendance harus ditolak apabila:

- GPS tidak tersedia.
- Permission lokasi ditolak.
- Latitude tidak tersedia.
- Longitude tidak tersedia.
- Accuracy tidak tersedia ketika diwajibkan.
- Accuracy melebihi batas.
- Distance melebihi radius.
- Koordinat tidak valid.

Sistem tidak boleh fallback ke:

```text
browser time
browser location cache
manual coordinate
```

sebagai pengganti validasi server.

---

# 14. Schedule

Default schedule:

| Day       |     Start |       End | Status |
| --------- | --------: | --------: | ------ |
| Monday    |     08:00 |     16:00 | WORK   |
| Tuesday   |     08:00 |     16:00 | WORK   |
| Wednesday |     08:00 |     16:00 | WORK   |
| Thursday  |     08:00 |     16:00 | WORK   |
| Friday    | **07:00** | **16:30** | WORK   |
| Saturday  |         - |         - | OFF    |
| Sunday    |         - |         - | OFF    |

Schedule harus disimpan dalam database.

Jadwal tidak boleh hard-coded di React.

Jadwal tidak boleh hard-coded di Controller.

---

# 15. Schedule Resolution

Sistem menentukan jadwal efektif dengan urutan:

```text
Special Schedule
      ↓
Tenant / Employee Schedule
      ↓
Default Schedule
```

Jika tidak ada schedule aktif:

```text
OFF
```

---

# 16. Grace Period

Default:

```text
10 minutes
```

Grace period berlaku terhadap waktu mulai kerja efektif.

Contoh normal Friday:

```text
Schedule:
07:00 - 16:30

Grace:
10 minutes
```

Maka:

```text
07:00 - 07:10 → PRESENT
07:11 onwards → LATE
```

Perhitungan harus menggunakan waktu server.

---

# 17. Holiday System

Admin dapat mengatur hari libur walaupun tanggal tersebut merupakan hari kerja normal.

Holiday mendukung:

```text
FULL DAY
PARTIAL DAY
MULTI DAY
```

Contoh:

```text
17 August
Monday

Normal:
08:00 - 16:00

Holiday:
FULL DAY
```

Hasil:

```text
No attendance required
```

---

# 18. Holiday Types

Sistem dapat menyediakan:

```text
NATIONAL_HOLIDAY
JOINT_LEAVE
SPECIAL_HOLIDAY
MPP_CLOSURE
OFFICIAL_EVENT
OTHER
```

Jenis dapat diperluas tanpa mengubah attendance engine.

---

# 19. Full Day Holiday

Jika:

```text
is_full_day = true
```

maka seluruh effective working period dianggap holiday.

Attendance tidak diwajibkan.

Status harian:

```text
HOLIDAY
```

Bukan:

```text
ABSENT
```

Clock-in dan clock-out normal harus dinonaktifkan.

---

# 20. Partial Holiday

Partial holiday hanya menutup sebagian periode kerja.

Contoh:

```text
Friday Schedule:
07:00 - 16:30

Holiday:
12:00 - 13:30
```

Effective working period:

```text
07:00 - 12:00
13:30 - 16:30
```

Holiday:

```text
12:00 - 13:30
```

---

# 21. Holiday Pada Awal Hari

Contoh:

```text
Schedule:
07:00 - 16:30

Holiday:
07:00 - 09:00
```

Effective working period:

```text
09:00 - 16:30
```

Clock-in sebelum 09:00 tidak diperlukan.

Late calculation dimulai dari:

```text
09:00
```

bukan:

```text
07:00
```

---

# 22. Holiday Pada Akhir Hari

Contoh:

```text
Schedule:
08:00 - 16:00

Holiday:
14:00 - 16:00
```

Effective working period:

```text
08:00 - 14:00
```

Tidak ada kewajiban bekerja setelah 14:00.

---

# 23. Holiday di Tengah Hari

Contoh:

```text
Schedule:
08:00 - 16:00

Holiday:
12:00 - 13:00
```

Effective working period:

```text
08:00 - 12:00
13:00 - 16:00
```

Holiday:

```text
12:00 - 13:00
```

---

# 24. Multi-Day Holiday

Holiday dapat mempunyai rentang tanggal.

Contoh:

```text
Start:
28-12-2026

End:
31-12-2026
```

Jika full-day, seluruh tanggal efektif sebagai holiday.

Jika konfigurasi berbeda per hari diperlukan, sistem harus menggunakan holiday period/exception per tanggal.

---

# 25. Holiday Precedence

Holiday mempunyai prioritas terhadap schedule normal.

Urutan:

```text
1. Holiday
2. Special Schedule
3. Tenant / Employee Schedule
4. Default Schedule
```

Namun partial holiday hanya menimpa bagian waktu yang ditentukan.

Contoh:

```text
Schedule:
08:00 - 16:00

Holiday:
12:00 - 13:00
```

Hasil:

```text
08:00 - 12:00 WORK
12:00 - 13:00 HOLIDAY
13:00 - 16:00 WORK
```

---

# 26. Effective Working Period

Attendance engine harus terlebih dahulu menghasilkan **effective working period** sebelum menentukan status attendance.

Contoh:

```text
Normal Schedule:
07:00 - 16:30

Holiday:
07:00 - 09:00

Effective:
09:00 - 16:30
```

Contoh lain:

```text
Normal Schedule:
07:00 - 16:30

Holiday:
12:00 - 13:30

Effective:
07:00 - 12:00
13:30 - 16:30
```

Konsep ini menjadi dasar:

- late,
- absent,
- duration,
- expected work,
- report.

---

# 27. Attendance Status

Status utama:

```text
PRESENT
LATE
ABSENT
LEAVE
HOLIDAY
OFF
```

`PARTIAL_HOLIDAY` bukan status attendance utama.

Partial holiday merupakan kondisi schedule.

---

# 28. Clock-In Rules

Clock-in hanya dapat dilakukan jika:

```text
user authenticated
AND user active
AND employee active
AND tenant active
AND current time berada pada valid attendance window
AND day bukan OFF
AND day bukan FULL DAY HOLIDAY
AND user belum clock-in
AND location valid
AND GPS accuracy valid
```

Jika salah satu syarat gagal, request ditolak.

---

# 29. Clock-Out Rules

Clock-out hanya dapat dilakukan jika:

```text
user authenticated
AND user active
AND employee active
AND tenant active
AND existing attendance tersedia
AND clock_in sudah ada
AND clock_out belum ada
AND current time berada pada valid attendance window
AND location valid
AND GPS accuracy valid
```

---

# 30. Clock-In Outside Working Hours

Secara default, clock-in tidak diperbolehkan di luar attendance window.

Contoh:

```text
Schedule:
08:00 - 16:00
```

Clock-in:

```text
06:30
```

ditolak.

Pesan:

> Saat ini belum memasuki waktu absensi.

Apabila kebijakan future membutuhkan early attendance, maka harus menjadi configuration tersendiri.

---

# 31. Clock-Out Outside Working Hours

Untuk MVP, clock-out harus mengikuti aturan attendance window.

Contoh:

```text
Schedule:
08:00 - 16:00
```

Clock-out:

```text
18:00
```

tidak otomatis dianggap valid.

Perilaku dapat dikonfigurasi kemudian melalui policy seperti:

```text
allow_late_clock_out
```

Tidak boleh dibuat implicit.

---

# 32. Duplicate Attendance

Satu employee hanya memiliki satu attendance per tanggal:

```text
UNIQUE(employee_id, attendance_date)
```

Jika dua request clock-in masuk hampir bersamaan, database tetap harus mencegah duplicate record.

Application-level validation saja tidak cukup.

---

# 33. Concurrency

Pada kondisi banyak tenant melakukan absensi bersamaan:

```text
07:00 / 08:00
        ↓
many concurrent requests
```

Sistem harus tetap menjamin:

- tidak ada duplicate attendance,
- transaction konsisten,
- status tidak corrupt,
- audit tidak hilang.

Database constraint adalah lapisan final.

---

# 34. Attendance Calculation

Contoh:

```text
Schedule:
08:00 - 16:00

Clock In:
07:56
```

Result:

```text
PRESENT
```

Contoh:

```text
Schedule:
08:00 - 16:00

Clock In:
08:16
```

Result:

```text
LATE
late_minutes = 16
```

Jika grace period 10 menit:

```text
08:00 - 08:10
```

tetap dianggap punctual.

Dengan implementasi final, `late_minutes` sebaiknya dihitung terhadap waktu mulai efektif setelah grace policy diterapkan.

---

# 35. Friday Rule

Friday mempunyai schedule default:

```text
07:00 - 16:30
```

Grace period:

```text
10 minutes
```

Contoh:

```text
06:57 → PRESENT
07:08 → PRESENT
07:11 → LATE
```

Jika Friday terkena partial holiday:

```text
Holiday:
07:00 - 09:00
```

maka:

```text
Effective Start:
09:00
```

Late dihitung dari:

```text
09:00
```

bukan:

```text
07:00
```

---

# 36. Leave Rules

Jika leave telah disetujui untuk tanggal tertentu:

```text
APPROVED LEAVE
```

maka attendance requirement pada tanggal tersebut mengikuti leave policy.

Status:

```text
LEAVE
```

Tidak dihitung sebagai:

```text
ABSENT
```

Leave yang masih:

```text
PENDING
```

belum menghilangkan attendance requirement.

---

# 37. Correction Rules

Correction digunakan untuk memperbaiki attendance yang telah tercatat atau attendance yang seharusnya tercatat.

Flow:

```text
Employee
   ↓
Create Correction
   ↓
PENDING
   ↓
Authorized Approver
   ├── APPROVE
   └── REJECT
```

Correction tidak boleh mengubah attendance secara langsung tanpa workflow apabila approval diwajibkan.

---

# 38. Correction Audit

Setiap correction harus menyimpan:

```text
requested_by
approved_by
approved_at
reason
old_value
new_value
status
```

Semua perubahan harus dapat dilacak.

---

# 39. Attendance Audit

Event yang wajib dicatat:

```text
CLOCK_IN
CLOCK_OUT

ATTENDANCE_REJECTED
LOCATION_VALIDATION_FAILED
GPS_ACCURACY_FAILED
ATTENDANCE_ATTEMPT_ON_HOLIDAY
ATTENDANCE_ATTEMPT_OUTSIDE_RADIUS
```

Audit minimal menyimpan:

```text
user
tenant
event
timestamp
ip
user_agent
metadata
```

---

# 40. Rejected Attendance

Tidak semua request gagal harus membuat attendance record.

Namun sistem harus dapat mencatat **security/operational event** untuk kegagalan penting.

Contoh:

```text
Distance = 76m
Radius   = 20m
```

Attendance record tidak dibuat.

Tetapi audit/event:

```text
ATTENDANCE_ATTEMPT_OUTSIDE_RADIUS
```

dapat dibuat.

---

# 41. Location Metadata

Attendance harus dapat menyimpan:

```text
latitude
longitude
accuracy
distance
```

secara terpisah untuk:

```text
clock_in
clock_out
```

Contoh:

```text
clock_in_latitude
clock_in_longitude
clock_in_accuracy
clock_in_distance

clock_out_latitude
clock_out_longitude
clock_out_accuracy
clock_out_distance
```

---

# 42. Location Validation Result

Backend internal harus dapat menghasilkan hasil seperti:

```text
valid = true

distance = 6.42
radius = 20
accuracy = 8
maximum_accuracy = 50
```

Atau:

```text
valid = false

reason = OUTSIDE_RADIUS
distance = 31.7
radius = 20
```

Alasan kegagalan sebaiknya menggunakan machine-readable code.

Contoh:

```text
LOCATION_PERMISSION_DENIED
LOCATION_UNAVAILABLE
INVALID_COORDINATES
GPS_ACCURACY_TOO_LOW
OUTSIDE_RADIUS
```

---

# 43. Attendance Window

Sistem harus membedakan:

```text
working period
attendance window
grace period
holiday period
```

Jangan menganggap keempatnya sama.

Contoh:

```text
Working:
07:00 - 16:30

Grace:
07:00 - 07:10

Holiday:
12:00 - 13:30
```

Attendance engine menggunakan hasil akhir semua rule tersebut.

---

# 44. Full Day Holiday Behavior

Jika full-day holiday aktif:

```text
Expected Attendance = 0
```

Dashboard:

```text
HOLIDAY
```

Laporan:

```text
tidak dihitung sebagai absence
```

Attendance button:

```text
disabled
```

---

# 45. Partial Holiday Behavior

Jika partial holiday aktif:

```text
Expected Attendance
=
Total Schedule
-
Holiday Period
```

Contoh:

```text
07:00 - 16:30 = 9.5 hours

Holiday:
12:00 - 13:30 = 1.5 hours

Effective Work:
8 hours
```

Angka durasi dapat mengikuti kebijakan break/working-hour policy yang nantinya dikonfigurasi.

---

# 46. Break Time

MVP harus menghindari asumsi bahwa semua waktu antara start dan end otomatis merupakan jam kerja efektif apabila break belum didefinisikan.

Struktur sistem harus memungkinkan future configuration:

```text
break periods
```

Namun apabila break belum dikonfigurasi:

```text
effective work period
=
schedule period
-
holiday period
```

---

# 47. Working Day Determination

Urutan:

```text
Current Date
      ↓
Holiday?
 ┌────┴────┐
YES       NO
 │         │
 ▼         ▼
Holiday   Schedule
          ↓
        Working?
       ┌───┴───┐
      YES      NO
       │        │
       ▼        ▼
      WORK     OFF
```

---

# 48. Daily Attendance State

Untuk setiap employee dan tanggal, sistem secara konseptual dapat menghasilkan:

```text
date
schedule
effective_work_periods
holiday_periods
attendance
leave
final_status
```

Contoh:

```text
Date:
Friday

Schedule:
07:00 - 16:30

Holiday:
12:00 - 13:30

Clock In:
06:58

Clock Out:
16:31

Final:
PRESENT
```

---

# 49. Absent Determination

Employee dianggap `ABSENT` apabila:

```text
expected working period > 0
AND
no valid leave
AND
no attendance
AND
working day has passed / attendance determination threshold reached
```

Sistem tidak boleh langsung menganggap seseorang absent hanya karena saat ini masih pagi dan belum melakukan clock-in.

---

# 50. Holiday and Absent

Hari holiday:

```text
HOLIDAY
```

tidak boleh berubah menjadi:

```text
ABSENT
```

bahkan jika tidak terdapat attendance record.

---

# 51. Leave and Absent

Approved leave:

```text
LEAVE
```

tidak boleh dihitung sebagai absence.

Pending leave:

```text
does not automatically suppress absence
```

keputusan akhir mengikuti workflow leave.

---

# 52. Dashboard Behavior

## Admin MPP

Dashboard harus dapat menampilkan:

```text
Total Tenant
Total Employee
Present
Late
Absent
Leave
Holiday
```

Data dapat difilter berdasarkan:

```text
date
tenant
status
```

---

# 53. Tenant Dashboard

Admin Tenant hanya melihat:

```text
current tenant employees
current tenant attendance
current tenant leave
current tenant correction
```

Tidak ada data tenant lain.

---

# 54. Employee Dashboard

Employee melihat:

```text
Today's Schedule
Today's Status
Clock In
Clock Out
Current Location State
Attendance History
Leave
Correction
```

---

# 55. Attendance UI State

Frontend harus memiliki state minimal:

```text
LOADING_LOCATION
LOCATION_VALID
LOCATION_INVALID
READY_TO_CLOCK_IN
READY_TO_CLOCK_OUT
ALREADY_COMPLETED
HOLIDAY
OFF
LEAVE
ERROR
```

UI tidak boleh menampilkan tombol absensi seolah-olah tersedia ketika backend pasti akan menolaknya.

Namun frontend tetap harus menganggap backend sebagai sumber kebenaran.

---

# 56. Location UI

Contoh valid:

```text
Lokasi Valid

Jarak:
6.4 meter

Akurasi:
8 meter

Radius Maksimal:
20 meter

[ ABSEN MASUK ]
```

Contoh invalid:

```text
Di Luar Area Absensi

Jarak:
37 meter

Radius Maksimal:
20 meter

[ COBA LAGI ]
```

---

# 57. Holiday UI

Full day:

```text
Hari Libur

17 Agustus 2026
Hari Kemerdekaan RI

Absensi tidak diperlukan.
```

Partial:

```text
Hari Libur Sebagian

12:00 - 13:30

Jam kerja:
07:00 - 12:00
13:30 - 16:30
```

---

# 58. Admin Holiday UI

Admin dapat:

```text
Create Holiday
Edit Holiday
Activate Holiday
Deactivate Holiday
Delete Holiday
```

Input:

```text
name
holiday_type
start_date
end_date
full_day / partial
start_time
end_time
description
status
```

Jika `full_day = true`, field time tidak diperlukan.

---

# 59. Holiday Validation

Sistem harus menolak:

```text
start_date > end_date
```

dan partial holiday:

```text
start_time >= end_time
```

Sistem juga harus menangani konflik antar holiday period.

Contoh:

```text
12:00 - 14:00
13:00 - 15:00
```

Overlap harus:

- ditolak, atau
- dinormalisasi,

dan pilihan tersebut harus ditentukan dalam implementation layer.

MVP direkomendasikan **menolak overlapping period** agar data tidak ambigu.

---

# 60. Schedule Validation

Schedule harus mencegah kondisi seperti:

```text
start_time >= end_time
```

untuk normal same-day schedule.

Schedule juga harus memiliki:

```text
active / inactive
```

dan hanya schedule aktif yang digunakan engine.

---

# 61. Configuration Rules

Nilai berikut harus configurable:

```text
attendance radius
maximum GPS accuracy
grace period
schedule
holiday
leave type
attendance policy
```

Default:

```text
radius = 20 meters
maximum_gps_accuracy = 50 meters
grace_period = 10 minutes
timezone = Asia/Jakarta
```

---

# 62. No Hard-Coded Business Rules

Dilarang membuat logika seperti:

```php
if ($day === 'Friday') {
    $start = '07:00';
}
```

sebagai satu-satunya sumber aturan.

Informasi Jumat:

```text
Friday = 07:00 - 16:30
```

harus berasal dari schedule configuration.

Begitu juga:

```text
20 meters
10 minutes
```

harus berasal dari configuration.

---

# 63. Attendance Service Responsibility

Attendance business logic harus terpusat pada service/action yang jelas.

Contoh konsep:

```text
AttendanceService
    ├── clockIn()
    ├── clockOut()
    ├── validateSchedule()
    ├── validateHoliday()
    ├── validateLocation()
    ├── calculateStatus()
    └── calculateDuration()
```

Controller tidak boleh menjadi tempat utama seluruh business logic.

---

# 64. Location Service Responsibility

Konsep:

```text
LocationService
    ├── validateCoordinates()
    ├── calculateDistance()
    ├── validateRadius()
    └── validateAccuracy()
```

Output harus konsisten dan mudah dites.

---

# 65. Schedule Resolver Responsibility

Konsep:

```text
ScheduleResolver
    ├── resolveEmployeeSchedule()
    ├── resolveTenantSchedule()
    ├── resolveDefaultSchedule()
    └── resolveEffectivePeriod()
```

Resolver tidak bertanggung jawab membuat attendance record.

---

# 66. Holiday Resolver Responsibility

Konsep:

```text
HolidayResolver
    ├── findHoliday()
    ├── isFullDayHoliday()
    ├── getHolidayPeriods()
    └── subtractHolidayFromSchedule()
```

Output:

```text
effective_working_periods
```

---

# 67. Transaction Boundary

Clock-in:

```text
BEGIN TRANSACTION
    validate
    create attendance
    write audit
COMMIT
```

Clock-out:

```text
BEGIN TRANSACTION
    validate
    update attendance
    calculate duration
    write audit
COMMIT
```

Apabila operasi gagal:

```text
ROLLBACK
```

---

# 68. Idempotency

Attendance request harus sebisa mungkin idempotent.

Repeated request akibat:

- double click,
- network retry,
- browser retry,

tidak boleh membuat duplicate attendance.

Database constraint tetap menjadi protection layer final.

---

# 69. Reporting Rules

Report harus menggunakan hasil attendance engine yang konsisten.

Jangan membuat perhitungan status baru yang berbeda di reporting query.

Contoh:

```text
Dashboard
Report
Export
```

harus menggunakan definisi status yang sama.

---

# 70. Attendance Metrics

Sistem dapat menghitung:

```text
Present
Late
Absent
Leave
Holiday
Attendance Rate
Punctuality Rate
Late Rate
```

Untuk future analytics:

```text
Average Late Minutes
Average Distance
Outside Radius Attempts
GPS Failure Rate
```

---

# 71. Audit Rules

Audit wajib untuk:

```text
attendance create
attendance update
correction
leave approval
leave rejection
tenant changes
employee changes
location changes
schedule changes
holiday changes
permission changes
```

Audit tidak boleh bergantung pada frontend.

---

# 72. Security Rules

Frontend tidak boleh dipercaya untuk:

```text
tenant_id
employee_id
attendance status
distance
attendance time
permission
approval status
```

Semua harus diverifikasi backend.

Contoh request:

```json
{
    "tenant_id": 10,
    "employee_id": 99
}
```

tidak berarti backend harus menerima kedua nilai tersebut.

Identity sebaiknya diambil dari authenticated context apabila memungkinkan.

---

# 73. Error Codes

Backend sebaiknya menghasilkan error code yang stabil.

Contoh:

```text
AUTH_REQUIRED
USER_INACTIVE
TENANT_INACTIVE
EMPLOYEE_INACTIVE

NOT_WORKING_DAY
HOLIDAY
OUTSIDE_ATTENDANCE_WINDOW

ALREADY_CLOCKED_IN
ALREADY_CLOCKED_OUT
CLOCK_IN_REQUIRED

LOCATION_PERMISSION_DENIED
LOCATION_UNAVAILABLE
INVALID_COORDINATES
GPS_ACCURACY_TOO_LOW
OUTSIDE_RADIUS

LEAVE_PENDING
LEAVE_APPROVED

UNAUTHORIZED
TENANT_ACCESS_DENIED
```

Message dapat berubah untuk UX, tetapi code harus stabil untuk frontend.

---

# 74. Example — Normal Friday

```text
Date:
Friday

Schedule:
07:00 - 16:30

Holiday:
None

GPS:
Distance = 5m
Accuracy = 8m

Clock In:
07:05

Result:
PRESENT
```

---

# 75. Example — Friday Late

```text
Schedule:
07:00 - 16:30

Grace:
10 minutes

Clock In:
07:18

Result:
LATE

Late:
18 minutes
```

---

# 76. Example — Partial Holiday

```text
Schedule:
07:00 - 16:30

Holiday:
12:00 - 13:30

Clock In:
06:58

Clock Out:
16:31

Result:
PRESENT
```

Effective work:

```text
07:00 - 12:00
13:30 - 16:30
```

---

# 77. Example — Holiday Morning

```text
Schedule:
07:00 - 16:30

Holiday:
07:00 - 09:00

Clock In:
09:05

Grace:
10 minutes

Result:
PRESENT
```

Effective start:

```text
09:00
```

---

# 78. Example — Outside Radius

```text
Radius:
20m

Distance:
42m

Accuracy:
8m
```

Result:

```text
REJECTED
```

Reason:

```text
OUTSIDE_RADIUS
```

No attendance record is created.

Audit event may be created.

---

# 79. Example — Poor Accuracy

```text
Radius:
20m

Distance:
6m

Accuracy:
130m
```

Result:

```text
REJECTED
```

Reason:

```text
GPS_ACCURACY_TOO_LOW
```

---

# 80. Example — Full Day Holiday

```text
Schedule:
08:00 - 16:00

Holiday:
Full Day
```

Result:

```text
HOLIDAY
```

Expected attendance:

```text
0
```

Tidak dihitung sebagai absent.

---

# 81. Example — Tenant Isolation

```text
Current User:
Admin Tenant A

Request:
GET attendance
```

Backend harus menghasilkan:

```text
Tenant A attendance only
```

Bukan:

```text
all attendance records
```

---

# 82. Example — Concurrent Clock-In

Dua request hampir bersamaan:

```text
Request A → clock-in
Request B → clock-in
```

Result:

```text
One attendance record only
```

Request berikutnya menerima:

```text
ALREADY_CLOCKED_IN
```

---

# 83. Daily State Resolution

Sistem dapat menggunakan konsep state machine:

```text
OFF
HOLIDAY
WAITING_FOR_CLOCK_IN
PRESENT
LATE
WORKING
COMPLETED
LEAVE
```

Contoh:

```text
07:30
WAITING_FOR_CLOCK_IN

07:55
PRESENT after clock-in

12:00
WORKING

16:05
COMPLETED after clock-out
```

State machine adalah konsep internal; status database tetap mengikuti model attendance yang didefinisikan pada database specification.

---

# 84. System Source of Truth

Prioritas dokumen:

```text
01-PRD.md
    ↓
02-SYSTEM-SPECIFICATION.md
    ↓
03-DATABASE-AND-API.md
    ↓
04-DEVELOPMENT-AND-SECURITY.md
    ↓
Implementation
```

Jika terdapat konflik:

```text
Approved Product Requirement
>
Approved System Specification
>
Implementation Detail
```

Perubahan aturan harus memperbarui dokumen sebelum kode dianggap final.

---

# 85. Development Rules for AI Agents

AI coding agent harus:

1. Membaca `01-PRD.md`.
2. Membaca `02-SYSTEM-SPECIFICATION.md`.
3. Tidak mengubah business rule tanpa instruksi.
4. Tidak membuat aturan baru yang tidak terdokumentasi.
5. Tidak memindahkan business rule ke frontend.
6. Tidak mengandalkan frontend untuk authorization.
7. Tidak mengandalkan browser timestamp sebagai waktu resmi.
8. Tidak mengandalkan client distance sebagai keputusan final.
9. Selalu menjaga tenant isolation.
10. Menambahkan test untuk business rule yang diimplementasikan.

---

# 86. Definition of System Behavior

Sistem dianggap sesuai dokumen ini apabila:

```text
Authentication
        ✓
Authorization
        ✓
Tenant Isolation
        ✓
Schedule Resolution
        ✓
Holiday Resolution
        ✓
Location Validation
        ✓
20m Radius Validation
        ✓
GPS Accuracy Validation
        ✓
Server Time
        ✓
Clock In
        ✓
Clock Out
        ✓
Duplicate Prevention
        ✓
Leave
        ✓
Correction
        ✓
Audit
        ✓
```

---

# 87. Final Business Flow

```text
                    USER
                      │
                      ▼
                AUTHENTICATION
                      │
                      ▼
                 AUTHORIZATION
                      │
                      ▼
             TENANT / EMPLOYEE CHECK
                      │
                      ▼
              DATE & SERVER TIME
                      │
                      ▼
              SCHEDULE RESOLUTION
                      │
                      ▼
               HOLIDAY RESOLUTION
                      │
                      ▼
          EFFECTIVE WORKING PERIOD
                      │
             ┌────────┴────────┐
             │                 │
           WORK              HOLIDAY/OFF
             │                 │
             ▼                 ▼
      LOCATION VALIDATION    NO ATTENDANCE
             │
        ┌────┴────┐
       YES         NO
        │           │
        ▼           ▼
   ATTENDANCE     REJECT
        │
        ▼
   AUDIT EVENT
        │
        ▼
     REPORTING
```

---

# 88. Core Configuration Defaults

```yaml
timezone: Asia/Jakarta

attendance:
    radius_meter: 20
    maximum_gps_accuracy: 50
    grace_period_minutes: 10

schedule:
    monday:
        start: '08:00'
        end: '16:00'

    tuesday:
        start: '08:00'
        end: '16:00'

    wednesday:
        start: '08:00'
        end: '16:00'

    thursday:
        start: '08:00'
        end: '16:00'

    friday:
        start: '07:00'
        end: '16:30'

    saturday:
        status: OFF

    sunday:
        status: OFF
```

Nilai di atas adalah **default configuration**, bukan business logic yang boleh di-hard-code pada application layer.

---

# 89. Implementation Priority

Urutan implementasi system behavior:

```text
1. Authentication
2. Tenant Isolation
3. Schedule Resolver
4. Holiday Resolver
5. Location Service
6. Attendance Engine
7. Clock In
8. Clock Out
9. Leave
10. Correction
11. Audit
12. Dashboard
13. Reporting
```

---

# 90. Final Rule

Aturan terpenting sistem:

> **Attendance hanya boleh dianggap valid setelah server memvalidasi identitas, tenant, jadwal, holiday state, waktu server, lokasi GPS, radius, dan kondisi attendance.**

Dengan kata lain:

```text
Client says:
"I'm in the MPP."

             ↓

Server asks:
"Is the authenticated employee
actually authorized,
within the configured 20m radius,
with acceptable GPS accuracy,
during an effective working period,
and without an existing attendance?"

             ↓

Only then:
VALID ATTENDANCE
```

---

## End of Specification
