# 04 — DEVELOPMENT AND SECURITY SPECIFICATION

## Sistem Absensi Tenant MPP Kabupaten Muara Enim

**Version:** 1.0  
**Status:** Approved  
**Depends On:**

- `01-PRD.md`
- `02-SYSTEM-SPECIFICATION.md`
- `03-DATABASE-AND-API.md`

**Backend:** Laravel 13  
**Frontend:** React + Inertia  
**Database:** MySQL  
**Timezone:** `Asia/Jakarta`

---

# 1. Purpose

Dokumen ini mendefinisikan standar implementasi aplikasi, struktur kode, security, authorization, testing, deployment, dan operational requirement.

Dokumen ini menjadi acuan untuk:

- developer,
- AI coding agent,
- code reviewer,
- QA/tester,
- system administrator.

Tujuan utamanya adalah memastikan implementasi:

- konsisten dengan PRD,
- konsisten dengan system specification,
- aman,
- maintainable,
- testable,
- scalable,
- mudah di-deploy.

---

# 2. Development Principles

Development harus mengikuti prinsip berikut:

```text
1. Clean and maintainable code
2. Thin controllers
3. Business logic outside controllers
4. Server authoritative
5. Policy-based authorization
6. Tenant isolation by default
7. Database constraints for integrity
8. Explicit business rules
9. Reusable frontend components
10. Automated testing
11. Secure defaults
12. No unnecessary complexity
```

---

# 3. Architecture Style

Gunakan:

```text
Modular Monolith
```

bukan microservices untuk MVP.

Struktur konseptual:

```text
Laravel Application
│
├── Authentication
├── Authorization
├── Tenant
├── Employee
├── Attendance
├── Schedule
├── Holiday
├── Leave
├── Correction
├── Reporting
├── Notification
└── Audit
```

Semua modul tetap berada dalam satu aplikasi Laravel.

---

# 4. Application Layers

Gunakan pemisahan tanggung jawab:

```text
React / Inertia
        ↓
Routes / Controllers
        ↓
Form Requests
        ↓
Policies
        ↓
Actions / Services
        ↓
Domain Logic
        ↓
Models / Query Layer
        ↓
Database
```

Audit berjalan sebagai bagian dari transaction yang relevan.

---

# 5. Controller Responsibility

Controller hanya menangani:

```text
Request
Authorization
Invoke Action / Service
Response
```

Controller tidak boleh menjadi tempat utama business logic.

Tidak disarankan:

```php id="0x5g0l"
public function clockIn(Request $request)
{
    // 100+ lines of attendance logic
}
```

Lebih baik:

```php id="u8ck16"
public function clockIn(ClockInRequest $request, ClockIn $action)
{
    $attendance = $action->execute(
        auth()->user(),
        $request->validated()
    );

    return response()->json($attendance);
}
```

---

# 6. Action / Service Layer

Business operation utama menggunakan Action atau Service.

Contoh:

```text id="ll53fb"
Actions/
└── Attendance/
    ├── ClockIn.php
    └── ClockOut.php
```

Service:

```text id="xkv0th"
Services/
├── Attendance/
├── Schedule/
├── Holiday/
├── Location/
├── Leave/
├── Correction/
└── Reporting/
```

---

# 7. Recommended Laravel Structure

```text id="zvp0lf"
app/
├── Actions/
│   ├── Attendance/
│   │   ├── ClockIn.php
│   │   └── ClockOut.php
│   │
│   ├── Leave/
│   └── Correction/
│
├── Data/
│   ├── AttendanceData.php
│   ├── LocationData.php
│   └── EmployeeData.php
│
├── Models/
│   ├── User.php
│   ├── Tenant.php
│   ├── Employee.php
│   ├── Attendance.php
│   ├── AttendanceLocation.php
│   ├── AttendanceSchedule.php
│   ├── AttendanceScheduleDay.php
│   ├── Holiday.php
│   ├── HolidayPeriod.php
│   ├── Leave.php
│   ├── LeaveType.php
│   ├── AttendanceCorrection.php
│   └── AuditLog.php
│
├── Policies/
│   ├── TenantPolicy.php
│   ├── EmployeePolicy.php
│   ├── AttendancePolicy.php
│   ├── LeavePolicy.php
│   └── CorrectionPolicy.php
│
├── Services/
│   ├── Attendance/
│   ├── Schedule/
│   ├── Holiday/
│   ├── Location/
│   ├── Leave/
│   ├── Correction/
│   └── Report/
│
├── Http/
│   ├── Controllers/
│   ├── Requests/
│   └── Resources/
│
└── Support/
```

Folder boleh berkembang, tetapi tanggung jawab tetap harus mengikuti prinsip yang sama.

---

# 8. Frontend Architecture

Frontend menggunakan:

```text
React
+
Inertia
+
TypeScript
+
Tailwind CSS
```

Recommended structure:

```text id="mwe5re"
resources/js/
├── components/
├── layouts/
├── pages/
├── features/
│   ├── attendance/
│   ├── tenants/
│   ├── employees/
│   ├── leaves/
│   ├── corrections/
│   └── reports/
├── hooks/
├── lib/
├── types/
└── utils/
```

---

# 9. Feature-Based Frontend

Code khusus attendance sebaiknya berada pada:

```text id="7bq58t"
features/attendance/
```

Contoh:

```text id="i4kh1z"
features/attendance/
├── components/
│   ├── AttendanceCard.tsx
│   ├── LocationStatus.tsx
│   └── AttendanceStatus.tsx
├── hooks/
│   ├── useGeolocation.ts
│   └── useAttendance.ts
├── types.ts
└── utils.ts
```

Jangan mencampur semua logic ke `pages/Attendance.tsx`.

---

# 10. Frontend State

Attendance page harus memiliki state yang eksplisit.

Contoh:

```text id="9wk62n"
INITIALIZING
CHECKING_LOCATION
LOCATION_VALID
LOCATION_INVALID
READY_CLOCK_IN
READY_CLOCK_OUT
COMPLETED
HOLIDAY
OFF
LEAVE
ERROR
```

State frontend hanya untuk UX.

State backend tetap menjadi sumber kebenaran.

---

# 11. Geolocation Frontend

Browser menggunakan Geolocation API.

Frontend bertugas:

```text id="uw8x4k"
Request permission
        ↓
Get latitude
Get longitude
Get accuracy
        ↓
Send to backend
```

Frontend tidak boleh menetapkan:

```text id="h3ib9u"
distance = valid
```

sebagai keputusan final.

---

# 12. Geolocation Security

Backend harus menghitung:

```text id="mk6oqe"
distance
```

dari:

```text id="9n3l34"
server-configured location
```

bukan dari nilai yang dikirim frontend seperti:

```json id="bswz9w"
{
    "distance": 5
}
```

Nilai `distance` dari client harus diabaikan.

---

# 13. Server Time

Attendance time harus dibuat menggunakan server application time.

Contoh:

```php id="k6w5s8"
now()
```

atau abstraction waktu aplikasi yang ekuivalen.

Jangan menggunakan:

```javascript id="eq82jj"
new Date()
```

sebagai timestamp resmi attendance.

---

# 14. Server Authoritative Principle

Data yang wajib ditentukan server:

```text id="vrkfs1"
user identity
employee
tenant
attendance date
attendance time
attendance status
late minutes
distance
effective schedule
holiday state
leave state
authorization
```

Data client hanya menjadi input:

```text id="47abjl"
latitude
longitude
accuracy
form values
```

---

# 15. Authorization

Authorization harus menggunakan:

```text id="ih9y2c"
Authentication
+
Role
+
Permission
+
Policy
+
Tenant Scope
```

Jangan menggunakan frontend permission sebagai security control.

---

# 16. Role Structure

Minimum:

```text id="inw1gz"
super_admin
admin_mpp
admin_tenant
tenant_staff
viewer
```

Role dapat diperluas tanpa mengubah core architecture.

---

# 17. Permission Strategy

Permission menggunakan naming yang konsisten.

Contoh:

```text id="t13ydc"
view_dashboard

view_tenants
create_tenants
update_tenants
delete_tenants

view_employees
create_employees
update_employees
delete_employees

clock_in
clock_out

view_attendance
manage_attendance

request_leave
approve_leave

request_correction
approve_correction

view_reports
export_reports

manage_location
manage_schedule
manage_holiday

view_audit_logs
manage_settings
```

---

# 18. Policy Strategy

Policy wajib digunakan untuk resource authorization.

Contoh:

```php id="qv5j7m"
AttendancePolicy::view(
    User $user,
    Attendance $attendance
)
```

Policy harus memastikan:

```text id="b2ylyf"
permission
+
tenant ownership
```

---

# 19. Tenant Scope

Admin Tenant hanya dapat mengakses record:

```text id="q5iw9g"
record.tenant_id === user.employee.tenant_id
```

Tenant scope harus diterapkan pada:

```text id="73fgd7"
queries
policies
actions
reports
exports
search
relationships
```

---

# 20. Prevent IDOR

Jangan menganggap URL parameter sudah aman.

Contoh:

```text id="e5g4qx"
GET /employees/123
```

tidak berarti user otomatis boleh melihat employee 123.

Backend harus memvalidasi:

```text id="w3pdc5"
employee belongs to allowed tenant
```

---

# 21. Mass Assignment

Gunakan `$fillable`, `$guarded`, atau typed DTO/request sesuai kebutuhan.

Field sensitif tidak boleh diterima dari user secara langsung.

Contoh field yang tidak boleh dipercaya client:

```text id="w0cxfj"
tenant_id
approved_by
status
late_minutes
distance
attendance_date
```

---

# 22. Form Requests

Setiap form/action dengan validasi kompleks menggunakan Form Request.

Contoh:

```text id="fdt5wy"
ClockInRequest
ClockOutRequest
StoreTenantRequest
UpdateTenantRequest
StoreEmployeeRequest
StoreHolidayRequest
StoreLeaveRequest
StoreCorrectionRequest
```

Validation harus dilakukan server.

---

# 23. DTO / Data Objects

DTO dapat digunakan untuk memindahkan data tervalidasi dari HTTP layer ke service/action.

Contoh:

```php id="9yw59r"
ClockInData
{
    latitude,
    longitude,
    accuracy
}
```

DTO tidak boleh menjadi tempat business rule utama.

---

# 24. Attendance Engine

Attendance engine harus menjadi komponen terisolasi.

Contoh:

```text id="jzzw76"
AttendanceEngine
├── resolveSchedule()
├── resolveHoliday()
├── resolveEffectivePeriods()
├── validateAttendanceWindow()
├── calculateStatus()
└── calculateLate()
```

Lokasi ditangani oleh:

```text id="9a9ov0"
LocationService
```

---

# 25. Schedule Resolver

Schedule resolver bertugas menentukan:

```text id="4q0d0e"
effective schedule
```

berdasarkan:

```text id="gh0iha"
special schedule
tenant/employee schedule
default schedule
```

Schedule resolver tidak membuat attendance record.

---

# 26. Holiday Resolver

Holiday resolver bertugas:

```text id="wqsbjz"
Find holiday
Determine full day
Determine partial periods
Subtract holiday from schedule
Return effective working periods
```

Contoh:

```text id="7u4b8h"
Schedule:
07:00 - 16:30

Holiday:
12:00 - 13:30

Result:
07:00 - 12:00
13:30 - 16:30
```

---

# 27. Location Service

Location service bertugas:

```text id="hl2u2k"
validate coordinates
calculate distance
validate radius
validate accuracy
return validation result
```

Input:

```text id="wn0z1e"
latitude
longitude
accuracy
location configuration
```

Output:

```text id="gpdpzi"
valid
distance
radius
accuracy
maximum_accuracy
failure_code
```

---

# 28. Distance Calculation

Perhitungan distance harus konsisten.

Recommended:

```text id="h94j5t"
Haversine formula
```

dapat digunakan untuk menghitung jarak permukaan antara dua koordinat.

Tidak perlu melakukan perhitungan jarak di React sebagai sumber kebenaran.

---

# 29. Attendance Transaction

Clock-in:

```text id="4cz2r4"
BEGIN TRANSACTION

Resolve employee
Resolve schedule
Resolve holiday
Validate working period
Validate duplicate
Validate location
Create attendance
Create audit

COMMIT
```

Failure:

```text id="g4d1d0"
ROLLBACK
```

Clock-out menggunakan prinsip yang sama.

---

# 30. Concurrency Protection

Sistem harus aman terhadap:

```text id="0akb49"
double click
network retry
browser retry
concurrent request
```

Protection:

```text id="mvtl1f"
database unique constraint
+
transaction
+
application validation
```

---

# 31. Database Integrity

Database harus memiliki constraint:

```text id="faoqzv"
UNIQUE(employee_id, attendance_date)
```

Application validation tidak menggantikan database constraint.

---

# 32. Attendance Immutability

Attendance transaksi tidak boleh diedit sembarangan.

Perubahan attendance dilakukan melalui:

```text id="sxgvkx"
Correction Workflow
```

bukan:

```text id="v8z7le"
Direct admin update
```

Audit harus selalu tersedia untuk perubahan kritis.

---

# 33. Audit Implementation

Audit dibuat pada server.

Minimal mencatat:

```text id="mskmmw"
user
tenant
event
subject
timestamp
IP
user-agent
metadata
```

Untuk perubahan:

```text id="ge5m5g"
old_values
new_values
```

---

# 34. Security Event Logging

Catat event penting seperti:

```text id="yrg3jr"
failed authentication
unauthorized access attempt
outside radius
GPS accuracy failure
attendance attempt on holiday
cross-tenant access attempt
permission changes
```

Log security tidak boleh menyimpan password atau secret.

---

# 35. Rate Limiting

Rate limiting harus diterapkan terutama pada:

```text id="bjwvao"
login
clock-in
clock-out
location validation
password reset
```

Read-only endpoints dapat memiliki rate limit berbeda.

---

# 36. Authentication Security

Minimum:

```text id="q4dl45"
secure password hashing
session protection
CSRF protection
login throttling
password reset protection
secure cookies
HTTPS
```

Jangan menyimpan password dalam plain text.

---

# 37. Session Security

Production:

```text id="pn0ywf"
HTTPS only
secure cookies
HttpOnly
appropriate SameSite policy
```

Session driver dapat menggunakan:

```text id="c8h4oq"
database
Redis
```

sesuai infrastructure.

---

# 38. CSRF

State-changing web requests harus dilindungi CSRF.

Khusus Inertia/standard Laravel web flow, gunakan mekanisme CSRF Laravel.

Jangan mematikan CSRF secara global hanya karena frontend menggunakan React.

---

# 39. HTTPS

Production wajib menggunakan HTTPS.

Attendance terutama harus dilakukan melalui:

```text id="lq5fpa"
HTTPS
```

agar:

- GPS API dapat berjalan sesuai browser security policy,
- session terlindungi,
- request tidak mudah disadap.

---

# 40. File Upload Security

Untuk attachment izin/correction:

Validasi:

```text id="14ca5f"
MIME type
extension
file size
filename
```

File tidak boleh dieksekusi sebagai PHP/script.

Gunakan random generated filename.

Contoh:

```text id="ycso94"
storage/
├── leaves/
└── corrections/
```

---

# 41. Storage Security

Attachment private harus menggunakan private storage.

Jangan mengekspos secara langsung:

```text id="vp3j7e"
/storage/private/...
```

Gunakan:

- authorization check,
- temporary signed URL,
- authenticated download.

---

# 42. Input Sanitization

Semua input harus melalui Laravel validation.

Jangan melakukan:

```text id="q08aqh"
trust request input
```

Jangan melakukan raw SQL dengan string interpolation.

Gunakan:

- Eloquent,
- query builder,
- parameter binding.

---

# 43. XSS Protection

Jangan merender HTML dari user input kecuali benar-benar diperlukan dan telah disanitasi.

React escaping menjadi default, tetapi backend tetap harus memvalidasi dan menyimpan data dengan benar.

---

# 44. SQL Injection Protection

Gunakan:

```text id="a3y5ra"
Eloquent
Query Builder
Bindings
```

Hindari:

```php id="fgd8e5"
DB::raw("... {$request->input('search')} ...")
```

tanpa parameter binding yang benar.

---

# 45. Enumeration Protection

Jangan membocorkan informasi internal melalui error.

Contoh:

Jangan memberi response berbeda yang mengungkap keberadaan employee tenant lain hanya berdasarkan ID.

---

# 46. Error Handling

Production tidak boleh mengekspos:

```text id="qv5j7d"
stack trace
SQL query
filesystem path
secret configuration
environment variable
```

Frontend mendapatkan error yang aman dan actionable.

---

# 47. Exception Strategy

Gunakan exception/domain error yang jelas.

Contoh:

```text id="zz0kyo"
OutsideRadiusException
GpsAccuracyException
HolidayException
AttendanceAlreadyExistsException
UnauthorizedTenantException
```

Kemudian mapping ke response/API error code.

---

# 48. Configuration

Business configuration harus menggunakan environment/configuration/database sesuai sifatnya.

Environment:

```text id="i6f64o"
APP_ENV
APP_URL
APP_KEY
DB_*
CACHE_*
QUEUE_*
MAIL_*
```

Database/application settings:

```text id="1pb81z"
attendance radius
GPS accuracy
grace period
schedule
holiday
```

---

# 49. No Secrets in Git

Jangan commit:

```text id="2hybd7"
.env
database passwords
API keys
SMTP passwords
private keys
production credentials
```

Repository hanya menyimpan:

```text id="qtbqax"
.env.example
```

---

# 50. Environment Separation

Minimal:

```text id="50ozt1"
local
staging
production
```

Database dan credential harus berbeda.

Production tidak boleh menggunakan data credential staging.

---

# 51. Testing Strategy

Testing minimal:

```text id="e0o5ku"
Unit Test
Feature Test
Authorization Test
Integration Test
Browser / E2E Test
```

---

# 52. Unit Tests

Unit test untuk:

```text id="oyc2ak"
distance calculation
schedule resolver
holiday resolver
effective working period
late calculation
attendance status
duration calculation
```

Contoh:

```text id="3otm1o"
20m <= radius → valid
20.1m > radius → invalid
```

---

# 53. Feature Tests

Feature test untuk:

```text id="6mfi0o"
clock-in
clock-out
leave
correction
tenant isolation
permission
holiday
schedule
```

---

# 54. Mandatory Attendance Test Cases

Minimal harus tersedia test untuk:

```text id="3z34gt"
1. valid clock-in
2. valid clock-out
3. duplicate clock-in
4. duplicate clock-out
5. clock-out without clock-in
6. outside radius
7. exact 20m boundary
8. above 20m
9. poor GPS accuracy
10. invalid coordinates
```

---

# 55. Schedule Test Cases

```text id="p3jv5b"
Monday 08:00
Monday 16:00

Friday 07:00
Friday 16:30

Saturday OFF
Sunday OFF

late after grace period
```

---

# 56. Holiday Test Cases

```text id="v8d8ep"
Full day holiday
Partial holiday
Holiday at beginning
Holiday in middle
Holiday at end
Multi-day holiday
Holiday on Friday
Holiday overlapping schedule
```

---

# 57. Partial Holiday Tests

Example:

```text id="t6j2qy"
Schedule:
07:00 - 16:30

Holiday:
12:00 - 13:30
```

Expected:

```text id="glro1p"
07:00 - 12:00 WORK
12:00 - 13:30 HOLIDAY
13:30 - 16:30 WORK
```

---

# 58. Holiday + Late Tests

Example:

```text id="0b6c6c"
Schedule:
07:00 - 16:30

Holiday:
07:00 - 09:00

Grace:
10 minutes
```

Clock-in:

```text id="ti3wq2"
09:05 → PRESENT
09:11 → LATE
```

---

# 59. Tenant Isolation Tests

Test:

```text id="rwm7nh"
Admin Tenant A
```

must not access:

```text id="jkw99m"
Tenant B Employee
Tenant B Attendance
Tenant B Leave
Tenant B Correction
Tenant B Report
```

Test harus dilakukan pada backend, bukan hanya UI.

---

# 60. Authorization Tests

Test minimal:

```text id="j7l8os"
Viewer cannot create
Viewer cannot approve
Staff cannot manage tenant
Staff cannot manage location
Tenant admin cannot access another tenant
```

---

# 61. Correction Tests

Test:

```text id="4d9o4w"
create correction
approve correction
reject correction
approve unauthorized
reject unauthorized
duplicate approval
already rejected correction
```

---

# 62. Leave Tests

Test:

```text id="f8wz5z"
create leave
approve leave
reject leave
cancel leave
pending leave
overlapping leave
unauthorized approval
```

---

# 63. Browser / E2E Testing

Critical browser flow:

```text id="7tqsh2"
Login
 ↓
Open Attendance
 ↓
Allow Location
 ↓
Detect GPS
 ↓
Valid Location
 ↓
Clock In
 ↓
Clock Out
```

Also:

```text id="k0w45b"
GPS denied
Outside radius
Poor accuracy
Holiday
OFF day
```

---

# 64. Testing Time and Date

Time-dependent tests harus menggunakan controllable clock.

Jangan membuat test bergantung pada waktu server aktual.

Gunakan Laravel time mocking / Carbon test utilities.

Contoh konsep:

```php id="c3pvcn"
Carbon::setTestNow(...)
```

---

# 65. Testing Database

Test database menggunakan:

```text id="0ykzz0"
refresh database
factories
seeders
```

Test harus memastikan:

```text id="17m4ok"
unique constraints
foreign keys
tenant ownership
status transitions
```

---

# 66. Factory Strategy

Minimum factories:

```text id="2b49sf"
UserFactory
TenantFactory
EmployeeFactory
AttendanceFactory
HolidayFactory
HolidayPeriodFactory
ScheduleFactory
ScheduleDayFactory
LeaveFactory
LeaveTypeFactory
CorrectionFactory
```

Factory harus menghasilkan data realistis untuk testing.

---

# 67. Seeder Strategy

Seeder:

```text id="n9m1s8"
Roles
Permissions
Default Schedule
Leave Types
Development Users
Development Tenant
Development Employees
```

Production seeder tidak boleh memasukkan fake employee atau fake attendance.

---

# 68. Code Quality

Gunakan:

```text id="x8rvqk"
PSR-12
Laravel conventions
strict typing where practical
small methods
single responsibility
meaningful names
```

Quality checks dapat mencakup:

```text id="d4wb7q"
Pint
PHPStan / Larastan
ESLint
TypeScript
```

Tingkat strictness dapat dinaikkan bertahap.

---

# 69. Frontend Code Quality

Gunakan:

```text id="dk1u6q"
TypeScript
Reusable components
Typed props
Typed forms
No unnecessary any
No duplicated business logic
```

Hindari:

```typescript id="36qx1u"
const data: any = ...
```

kecuali memang diperlukan dan dibatasi.

---

# 70. UI Security Boundary

Frontend boleh:

```text id="c2auub"
hide unauthorized actions
disable buttons
show state
```

Tetapi frontend tidak boleh menjadi:

```text id="pdpxlq"
authorization mechanism
```

Backend tetap wajib memvalidasi semua action.

---

# 71. Deployment Architecture

Recommended production:

```text id="wdn3h6"
                     INTERNET
                         │
                         ▼
                    Cloudflare
                         │
                         ▼
                  Reverse Proxy
                         │
                         ▼
                 Laravel Application
                    /         \
                   /           \
                  ▼             ▼
               MySQL          Redis
                                │
                         ┌──────┴──────┐
                         ▼             ▼
                       Queue         Cache
```

---

# 72. Web Server

Production dapat menggunakan:

```text id="kdh1x4"
FrankenPHP / Octane
```

atau deployment PHP runtime lain yang kompatibel dengan Laravel 13.

Yang penting:

- HTTPS,
- process supervision,
- health monitoring,
- graceful restart,
- logging,
- queue worker.

---

# 73. Queue Worker

Queue worker harus menjalankan pekerjaan asynchronous:

```text id="x3in3k"
report generation
excel export
PDF generation
email
notification
heavy statistics
```

Clock-in dan clock-out jangan dibuat bergantung pada queue untuk menyimpan transaksi utama.

---

# 74. Scheduler

Laravel Scheduler digunakan untuk pekerjaan periodik.

Contoh:

```text id="6k0tr2"
daily attendance processing
report preparation
cleanup temporary files
notification reminders
health checks
```

Scheduler tidak boleh mengubah attendance valid secara sembarangan.

---

# 75. Cache

Gunakan cache untuk:

```text id="pmgj07"
system configuration
active location
active schedule
dashboard aggregates
reference data
```

Jangan cache authorization secara sembarangan sehingga user tetap dapat mengakses data setelah permission dicabut.

---

# 76. Redis

Redis dapat digunakan untuk:

```text id="cz74pf"
cache
queue
rate limiting
session
```

Penggunaan Redis harus dipantau agar failure Redis tidak menyebabkan kehilangan transaksi attendance.

---

# 77. Database Connection

Production database harus:

```text id="z1az8s"
private
authenticated
not directly exposed to public internet
```

Gunakan:

- strong password,
- least privilege,
- network restriction,
- backup.

---

# 78. Database Backup

Minimal:

```text id="ssy1wz"
daily backup
```

Disarankan:

```text id="pugjh2"
automated backup
retention policy
off-site copy
periodic restore test
```

Backup yang belum pernah diuji restore tidak dianggap reliable.

---

# 79. Deployment Process

Recommended:

```text id="w54kpx"
1. Pull release
2. Install dependencies
3. Build frontend
4. Put application in maintenance if needed
5. Run migrations
6. Cache configuration/routes
7. Restart workers
8. Restart application runtime if needed
9. Health check
10. Exit deployment
```

Migration production:

```bash id="s6c8v4"
php artisan migrate --force
```

Tidak boleh menjalankan:

```bash id="n7x6af"
php artisan migrate:fresh
```

di production.

---

# 80. Production Optimization

Laravel production dapat menggunakan:

```bash id="29qk8g"
php artisan optimize
```

dan mekanisme cache yang sesuai versi Laravel.

Pastikan configuration/cache invalidation menjadi bagian deployment process.

---

# 81. Queue Deployment

Setelah deployment:

```bash id="xun2jh"
php artisan queue:restart
```

atau mekanisme restart process manager yang digunakan.

Tujuan:

```text id="7c2qsv"
workers load latest code
```

---

# 82. Health Checks

Application minimal memiliki health endpoint/status.

Contoh:

```text id="gz8jwy"
GET /up
```

Health check dapat memastikan application aktif.

Infrastructure monitoring dapat menambahkan:

```text id="t8deu8"
database connectivity
redis connectivity
queue health
storage health
```

---

# 83. Monitoring

Pantau:

```text id="os7jzl"
HTTP 5xx
HTTP latency
database errors
queue failures
CPU
RAM
disk
storage
authentication failures
GPS rejection rate
```

---

# 84. Logging

Application log harus:

```text id="f82t9z"
structured
rotated
centralized where possible
```

Jangan menyimpan:

```text id="o2rd31"
password
tokens
API secrets
database credentials
```

---

# 85. Deployment Environment Variables

Minimal:

```text id="k4gvf3"
APP_ENV
APP_DEBUG=false
APP_KEY
APP_URL

DB_CONNECTION
DB_HOST
DB_PORT
DB_DATABASE
DB_USERNAME
DB_PASSWORD

CACHE_STORE
QUEUE_CONNECTION
SESSION_DRIVER

REDIS_HOST
REDIS_PORT
REDIS_PASSWORD
```

Production secrets disimpan di infrastructure secret management, bukan Git.

---

# 86. CI/CD

Pipeline minimum:

```text id="npv9bw"
Push
 ↓
Lint
 ↓
PHP Tests
 ↓
Static Analysis
 ↓
Frontend Tests
 ↓
Build
 ↓
Deploy Staging
 ↓
Smoke Test
 ↓
Production
```

Production deployment sebaiknya membutuhkan approval.

---

# 87. Pull Request Rules

Setiap PR harus menjelaskan:

```text id="7nrx98"
What changed
Why changed
Database changes
Security impact
Testing performed
Migration impact
Rollback consideration
```

Tidak boleh merge perubahan business rule penting tanpa update documentation apabila behavior berubah.

---

# 88. Migration Rules

Setiap migration production harus:

- reversible bila memungkinkan,
- tidak merusak existing data,
- memiliki index yang jelas,
- memiliki foreign key strategy,
- memperhatikan dataset size.

Migration destruktif harus dipisahkan dan dipertimbangkan secara khusus.

---

# 89. Backward Compatibility

Perubahan API harus mempertimbangkan frontend yang sedang aktif.

Untuk perubahan breaking:

```text id="s4j2r3"
update frontend and backend
```

dalam deployment yang terkoordinasi.

Untuk external API future, gunakan versioning.

---

# 90. Attendance Performance

Clock-in dan clock-out merupakan critical path.

Target:

```text id="t1uxvc"
fast validation
minimal queries
single transaction
minimal synchronous work
```

Jangan menjalankan:

```text id="ft3k8h"
PDF generation
email sending
heavy report
```

dalam request clock-in.

---

# 91. Attendance Query Optimization

Gunakan:

```text id="h8qpjf"
proper indexes
eager loading
select only required columns
aggregate queries
pagination
```

Hindari N+1.

---

# 92. Dashboard Optimization

Dashboard harus menghindari query terpisah yang tidak perlu.

Gunakan:

```text id="3k3r0d"
aggregates
groupBy
conditional counts
caching where appropriate
```

Dashboard tidak boleh melakukan loop:

```text id="7i4rde"
foreach tenant
    query attendance
```

untuk dataset besar.

---

# 93. Reporting Strategy

Report kecil:

```text id="52fyds"
synchronous
```

Report besar:

```text id="z6o0f7"
queued
```

Contoh:

```text id="1rj3zv"
1 day × 20 employees
→ synchronous

1 year × all tenants
→ queue
```

---

# 94. Export Security

Export harus mengikuti permission dan tenant scope yang sama dengan screen.

Contoh:

```text id="1f5eu9"
Admin Tenant A
→ Export
→ Tenant A only
```

Tidak boleh terjadi:

```text id="0lq4vx"
UI = Tenant A
Export = all tenants
```

---

# 95. File Export

Generated report files harus:

- private,
- memiliki expiration,
- hanya dapat diakses authorized user,
- dibersihkan sesuai retention policy.

---

# 96. Security Testing

Sebelum production, lakukan pengujian:

```text id="d1if2l"
Authentication bypass
Authorization bypass
IDOR
Cross-tenant access
CSRF
XSS
SQL injection
File upload
Rate limiting
Session security
```

---

# 97. Attendance Security Testing

Secara khusus:

```text id="0mhdep"
Spoofed distance
Manipulated client timestamp
Duplicate request
Outside-radius request
Invalid coordinates
Poor accuracy
Cross-tenant attendance
```

Backend harus menolak request yang tidak valid.

---

# 98. Location Security

Sistem tidak boleh mempercayai:

```text id="xq8xn4"
client distance
client status
client timestamp
client tenant_id
```

Backend harus menghitung/menentukan ulang.

---

# 99. GPS Spoofing

Browser geolocation sendiri tidak memberikan jaminan anti-spoofing absolut.

Sistem harus menggunakan defense in depth:

```text id="3h2u8h"
server-side distance
GPS accuracy
server timestamp
IP logging
user-agent
audit trail
rate limiting
```

Deteksi spoofing lanjutan dapat menjadi future enhancement.

---

# 100. Data Privacy

Simpan data sesuai kebutuhan sistem.

GPS attendance merupakan data operasional dan tidak boleh digunakan untuk tujuan di luar scope aplikasi tanpa kebijakan yang sesuai.

Jangan mengumpulkan data perangkat yang tidak diperlukan.

---

# 101. Least Privilege

Setiap role hanya memiliki akses yang diperlukan.

Contoh:

```text id="f8lkkv"
Staff
→ own attendance

Tenant Admin
→ own tenant

MPP Admin
→ operational scope

Super Admin
→ global administration

Viewer
→ read-only
```

---

# 102. Administrative Changes

Perubahan berikut harus memiliki audit:

```text id="z6e9jz"
location
radius
GPS accuracy
schedule
holiday
permissions
tenant status
employee status
```

Karena perubahan tersebut dapat mengubah behavior sistem.

---

# 103. Configuration Change Safety

Sebelum perubahan konfigurasi kritis:

```text id="lsp86c"
current value
new value
changed by
timestamp
```

harus dapat ditelusuri.

Contoh:

```text id="8aj1l8"
Radius:
20m → 30m

Changed by:
Admin MPP

At:
2026-09-11 10:32
```

---

# 104. Rollback Strategy

Application deployment harus memiliki rollback strategy.

Minimal:

```text id="7wr63r"
previous application release
database backup
migration rollback plan
frontend asset version
```

Migration rollback tidak boleh menjadi satu-satunya recovery strategy.

---

# 105. Incident Response

Jika attendance mengalami masalah:

```text id="0qdtzm"
1. identify incident
2. preserve logs
3. identify affected period
4. prevent further damage
5. restore service
6. reconcile attendance
7. document incident
```

Jangan langsung mengedit attendance tanpa audit.

---

# 106. Reconciliation

Jika terjadi gangguan sistem dan attendance terdampak, gunakan mekanisme:

```text id="7y9v49"
Correction Workflow
```

atau dedicated reconciliation process.

Jangan melakukan mass direct update tanpa audit trail.

---

# 107. Documentation Maintenance

Jika behavior berubah:

```text id="fdu81m"
PRD
System Specification
Database/API
Development/Security
```

harus diperiksa.

Tidak semua perubahan membutuhkan perubahan semua dokumen, tetapi source of truth yang relevan harus diperbarui.

---

# 108. AI Coding Agent Rules

AI coding agent wajib:

```text id="u3k2rh"
read 01-PRD.md
read 02-SYSTEM-SPECIFICATION.md
read 03-DATABASE-AND-API.md
read 04-DEVELOPMENT-AND-SECURITY.md
```

sebelum membuat perubahan besar.

AI agent tidak boleh:

```text id="tf3qvp"
invent new business rules
disable security
bypass tenant isolation
move authorization to frontend
use client timestamp as official attendance time
trust client distance
directly modify approved attendance
ignore tests
```

---

# 109. AI Implementation Workflow

Recommended:

```text id="4lkjp8"
Requirement
    ↓
Read Documentation
    ↓
Design
    ↓
Migration / Model
    ↓
Service / Action
    ↓
Policy
    ↓
Feature Test
    ↓
Frontend
    ↓
Browser Test
    ↓
Review
```

AI agent harus mengimplementasikan perubahan kecil dan terukur.

---

# 110. Code Review Checklist

Reviewer memeriksa:

```text id="9yqifg"
[ ] Authorization present
[ ] Tenant scope correct
[ ] Validation present
[ ] Business logic in proper layer
[ ] No client trust
[ ] Database constraint present
[ ] Audit requirement handled
[ ] Tests added
[ ] No N+1
[ ] No sensitive data exposure
[ ] Error handling safe
```

---

# 111. Attendance Code Review Checklist

Khusus attendance:

```text id="51j1fy"
[ ] Server timestamp
[ ] Server distance calculation
[ ] Radius validation
[ ] Accuracy validation
[ ] Schedule validation
[ ] Holiday validation
[ ] Duplicate protection
[ ] Transaction
[ ] Tenant validation
[ ] Audit
```

---

# 112. Definition of Done — Backend

Backend feature dianggap selesai apabila:

```text id="l3cq04"
Validation implemented
Authorization implemented
Business logic implemented
Tenant scope verified
Database constraints verified
Audit implemented where required
Feature tests pass
Static analysis pass
Code style pass
```

---

# 113. Definition of Done — Frontend

Frontend feature dianggap selesai apabila:

```text id="0oj0te"
Desktop responsive
Mobile responsive
Loading state
Error state
Empty state
Success feedback
Validation feedback
Permission-aware UI
Accessible interaction
Typed data
No business-rule duplication
```

---

# 114. Definition of Done — Attendance

Attendance dianggap selesai apabila:

```text id="q31r44"
Clock-in works
Clock-out works
20m radius works
GPS accuracy works
Server timestamp works
Friday schedule works
Holiday works
Partial holiday works
Duplicate prevention works
Tenant isolation works
Audit works
Tests pass
```

---

# 115. Definition of Done — Production

Production release dianggap siap apabila:

```text id="clnqiw"
Tests pass
Build succeeds
Migrations reviewed
Backup verified
HTTPS active
Environment configured
Queue running
Scheduler running
Monitoring active
Health check active
Rollback strategy available
```

---

# 116. Recommended Development Sequence

Tahapan implementasi:

```text id="meu5x9"
Phase 1
Project Foundation
    ↓
Authentication
    ↓
Roles & Permissions

Phase 2
Tenant
    ↓
Employee

Phase 3
Schedule
    ↓
Holiday
    ↓
Location

Phase 4
Attendance Engine
    ↓
Clock In
    ↓
Clock Out

Phase 5
Leave
    ↓
Correction

Phase 6
Audit
    ↓
Dashboard

Phase 7
Reports
    ↓
Export

Phase 8
Notification
    ↓
Optimization
    ↓
Production Hardening
```

---

# 117. MVP Technical Priority

Prioritas:

```text id="p5ec99"
P0
Authentication
Authorization
Tenant Isolation
Employee
Schedule
Holiday
Location
Attendance Engine
Clock In
Clock Out
Audit

P1
Leave
Correction
Dashboard
Reports

P2
Export
Notification
Real-time
PWA
QR
Advanced Anti-Spoofing
```

---

# 118. Final Architecture

```text id="g4yw3e"
                         USER
                           │
                           ▼
                    React + Inertia
                           │
                           ▼
                    Laravel Routes
                           │
                           ▼
                    Form Validation
                           │
                           ▼
                       Policy
                           │
                           ▼
                  Action / Service
                           │
             ┌─────────────┼─────────────┐
             │             │             │
             ▼             ▼             ▼
        Schedule        Holiday       Location
          Engine         Engine         Service
             │             │             │
             └─────────────┼─────────────┘
                           ▼
                    Attendance Engine
                           │
                           ▼
                    Database Transaction
                           │
                    ┌──────┴──────┐
                    ▼             ▼
                 MySQL          Audit
                    │
                    ▼
                 Reporting
```

---

# 119. Final Security Boundary

```text id="16kzq7"
                    CLIENT
                       │
                 UNTRUSTED INPUT
                       │
                       ▼
                  VALIDATION
                       │
                       ▼
                 AUTHENTICATION
                       │
                       ▼
                 AUTHORIZATION
                       │
                       ▼
                TENANT ISOLATION
                       │
                       ▼
                BUSINESS RULES
                       │
                       ▼
                SERVER VALIDATION
                       │
                       ▼
               DATABASE CONSTRAINT
                       │
                       ▼
                     AUDIT
```

Tidak ada layer client yang boleh melewati boundary tersebut.

---

# 120. Final Engineering Rules

Rule yang wajib dipertahankan sepanjang development:

```text id="bkyx5i"
1. Frontend is not trusted.
2. Server determines attendance time.
3. Server determines attendance distance.
4. Server determines attendance status.
5. Tenant scope is enforced on backend.
6. Database protects against duplicate attendance.
7. Attendance corrections use workflow.
8. Critical changes are audited.
9. Business logic lives outside controllers.
10. Heavy work goes to queues.
11. Reporting follows the same business definitions.
12. Security is tested, not assumed.
```

---

# 121. Final Project Documentation Contract

Empat dokumen utama:

```text id="u0rjkr"
docs/
├── 01-PRD.md
├── 02-SYSTEM-SPECIFICATION.md
├── 03-DATABASE-AND-API.md
└── 04-DEVELOPMENT-AND-SECURITY.md
```

Masing-masing memiliki tanggung jawab:

```text id="o3y3p1"
01-PRD
"What are we building?"

02-SYSTEM-SPECIFICATION
"How must the system behave?"

03-DATABASE-AND-API
"How is data structured and exchanged?"

04-DEVELOPMENT-AND-SECURITY
"How must it be implemented and secured?"
```

---

# 122. Source of Truth

Prioritas:

```text id="ly54jt"
01-PRD.md
      ↓
02-SYSTEM-SPECIFICATION.md
      ↓
03-DATABASE-AND-API.md
      ↓
04-DEVELOPMENT-AND-SECURITY.md
      ↓
CODE
```

Kode tidak boleh menjadi sumber kebenaran business rule.

Dokumentasi harus diperbarui apabila requirement atau behavior resmi berubah.

---

# 123. Final Definition

Sistem siap masuk production apabila:

```text id="qg9zq7"
PRODUCT
✓ Requirement implemented

SYSTEM
✓ Business rules implemented

DATA
✓ Database integrity implemented

API
✓ Contracts implemented

SECURITY
✓ Authorization implemented
✓ Tenant isolation implemented
✓ Audit implemented

TESTING
✓ Critical flows covered

OPERATIONS
✓ Backup
✓ Monitoring
✓ Queue
✓ Scheduler
✓ HTTPS
✓ Rollback
```

---

## End of Specification