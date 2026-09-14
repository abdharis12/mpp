# Task List — Sistem Absensi Tenant MPP Kabupaten Muara Enim

Status: `[x]` selesai · `[ ]` belum · `[~]` berjalan / environmental issue

## Fase 1 — Engine Absensi (inti sistem)

- [x] Tingkat/Database: migrations, models, factories, seeders
- [x] 1.1 `LocationService` — Haversine + validasi radius & accuracy
- [x] 1.2 `ScheduleResolver` — resolve Employee → Tenant → Global
- [x] 1.3 `HolidayResolver` — full/partial/multi-day holiday + effective work period
- [x] 1.4 `AttendanceEngine` — planFor, clock-in/out evaluation
- [x] 1.5 `ClockIn` / `ClockOut` (Actions) — transactional + audit
- [x] 1.6 Endpoint: `GET /attendance/today`, `POST /clock-in`, `POST /clock-out`
- [x] 1.7 Policies + Gate definitions
- [x] 1.8 Audit logging (`AuditLogger`)
- [~] 1.9 Feature tests (tulis, environmental CSRF 419 persist — pre-existing)

## Fase 2 — Dashboard & Modul Master

- [x] 2.1 Dashboard Admin MPP: `DashboardController` + `resources/js/pages/dashboard.tsx`
- [x] 2.2 CRUD Tenant (policies, requests, index + form)
- [x] 2.3 CRUD Employee (hereditas user + tenant scope)
- [x] 2.4 AttendanceLocation (index + update)
- [x] 2.5 UI Clock In/Out petugas + GPS frontend (`attendance/today.tsx`)
- [x] 2.6 Sidebar dynamic menu berdasarkan role/permission
- [~] 2.7 Feature tests ditulis (environmental CSRF issue persists)

## Fase 3 — Workflow Pendukung

- [x] 3.1 CRUD Schedule + AttendanceScheduleDay (`schedules/index`, `form`)
- [x] 3.2 CRUD Holiday full/partial/multi-day (`holidays/index`, `form` + period management)
- [x] 3.3 Leave: request (`leaves/form`), approve/reject/cancel (`LeaveController`)
- [x] 3.4 Attendance Correction: request (`corrections/form`), approve/reject (`AttendanceCorrectionController`)
- [~] 3.5 Feature tests ditulis

## Fase 4 — Laporan & Penyempurnaan

- [x] 4.1 Dashboard/Report attendance (aggregate, rekap bulanan) — `AttendanceReportController`, `resources/js/pages/reports/attendance.tsx`
- [x] 4.2 Export Excel/PDF — `app/Exports/AttendanceExport.php` (Excel via maatwebsite/excel), PDF via dompdf (route `reports.attendance.export`)
- [x] 4.3 Audit log viewer — `AuditLogController`, `resources/js/pages/audit-logs/index.tsx`
- [x] 4.4 Notification (holiday baru, perubahan jadwal) — `InAppNotification` model, `NotificationService`, bell di header (`notification-bell.tsx`), dispatch di `HolidayController` & `AttendanceScheduleController`
- [x] 4.5 Rate limiting clock-in/clock-out — sudah diterapkan di Fase 1 (`throttle:attendance` 10/menit per user/IP)
- [x] 4.6 Security review & test — verifikasi policies, test existing lulus (5 gagal pre-existing CSRF/Docker)

## Fase 5 — Penguatan & Polishing

- [ ] 5.1 QR / PWA / push notification
- [ ] 5.2 GPS spoofing detection
- [ ] 5.3 Face recognition
- [ ] 5.4 External integration / API v1
- [ ] 5.5 Final audit & performance review

---

## File Kunci (backend)

| Domain | Controller | Policy | Request |
|---|---|---|---|
| Dashboard | `DashboardController` | — | — |
| Tenant | `TenantController` | `TenantPolicy` | `StoreTenantRequest`, `UpdateTenantRequest` |
| Employee | `EmployeeController` | `EmployeePolicy` | `StoreEmployeeRequest`, `UpdateEmployeeRequest` |
| AttendanceLocation | `AttendanceLocationController` | `LocationPolicy` | — |
| Schedule | `AttendanceScheduleController` | `AttendanceSchedulePolicy` | — |
| Holiday | `HolidayController` | `HolidayPolicy` | — |
| Leave | `LeaveController` | `LeavePolicy` | — |
| Correction | `AttendanceCorrectionController` | `AttendanceCorrectionPolicy` | — |
| Attendance (Fase 1) | `AttendanceController` | `AttendancePolicy` | `ClockInRequest`, `ClockOutRequest` |
| **Report (Fase 4)** | `AttendanceReportController` | — | — |
| **Audit Log (Fase 4)** | `AuditLogController` | — | — |
| **Notification (Fase 4)** | `NotificationController` | — | — |

## Key Services (Fase 1)

- `LocationService` — Haversine + validasi
- `ScheduleResolver` — resolve jadwal efektif per employee
- `HolidayResolver` — holiday + effective period
- `AttendanceEngine` — planFor + working period subtraction
- `AuditLogger` — centralized audit logging
- `ClockIn` / `ClockOut` actions — transaksi + snapshot
- `NotificationService` — in-app notification dispatch (Fase 4)

## Frontend Pages

- `dashboard.tsx` — metrics + quick actions
- `tenants/index.tsx`, `tenants/form.tsx`
- `employees/index.tsx`, `employees/form.tsx`
- `locations/index.tsx`
- `attendance/today.tsx` — GPS + clock in/out
- `schedules/index.tsx`, `schedules/form.tsx`
- `holidays/index.tsx`, `holidays/form.tsx`
- `leaves/index.tsx`, `leaves/form.tsx`
- `corrections/index.tsx`, `corrections/form.tsx`
- `reports/attendance.tsx` — rekap bulanan + export Excel (Fase 4)
- `audit-logs/index.tsx` — log aktivitas + filter (Fase 4)
- `notification-bell.tsx` — header bell + dropdown (Fase 4)

## Known Issues

- **CSRF 419 di POST requests pada Docker** — Baseline auth test (`AuthenticationTest`) juga gagal dengan `assertAuthenticated` di environment Docker, bukan kode Fase 1. Kemungkinan root cause: `app()->runningUnitTests()` tidak terdeteksi atau ada issue Octane + session driver di environment test. Fix: environment debugging di luar scope Fase 2-3.