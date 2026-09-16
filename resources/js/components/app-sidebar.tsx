import { Link, usePage } from '@inertiajs/react';
import {
    LayoutGrid,
    Users,
    MapPin,
    Building2,
    CalendarDays,
    CalendarOff,
    FileText,
    AlertCircle,
    Clock,
    BarChart3,
    Shield,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain, type NavGroup } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const { auth } = usePage().props as any;
    const user = auth?.user;
    const permissions: string[] =
        user?.all_permissions?.map((p: any) => p.name) ?? [];

    const mainItems: NavItem[] = [];

    if (permissions.includes('view_dashboard')) {
        mainItems.push({
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        });
    }

    if (user?.employee) {
        mainItems.push({
            title: 'Absensi Hari Ini',
            href: '/attendance/today',
            icon: Clock,
        });
    }

    const managementItems: NavItem[] = [];

    if (
        permissions.includes('view_tenants') ||
        permissions.includes('manage_settings')
    ) {
        managementItems.push({
            title: 'Tenant',
            href: '/tenants',
            icon: Building2,
        });
    }

    if (permissions.includes('view_employees')) {
        managementItems.push({
            title: 'Petugas',
            href: '/employees',
            icon: Users,
        });
    }

    if (permissions.includes('manage_location')) {
        managementItems.push({
            title: 'Lokasi Absensi',
            href: '/locations',
            icon: MapPin,
        });
    }

    if (permissions.includes('manage_schedule')) {
        managementItems.push({
            title: 'Jadwal Kerja',
            href: '/schedules',
            icon: CalendarDays,
        });
    }

    if (permissions.includes('manage_holiday')) {
        managementItems.push({
            title: 'Hari Libur',
            href: '/holidays',
            icon: CalendarOff,
        });
    }

    const attendanceItems: NavItem[] = [];

    if (
        permissions.includes('request_leave') ||
        permissions.includes('view_attendance')
    ) {
        attendanceItems.push({
            title: 'Izin',
            href: '/leaves',
            icon: FileText,
        });
    }

    if (
        permissions.includes('request_correction') ||
        permissions.includes('view_attendance')
    ) {
        attendanceItems.push({
            title: 'Koreksi',
            href: '/corrections',
            icon: AlertCircle,
        });
    }

    const reportItems: NavItem[] = [];

    if (permissions.includes('view_reports')) {
        reportItems.push({
            title: 'Laporan Absensi',
            href: '/reports/attendance',
            icon: BarChart3,
        });
    }

    if (permissions.includes('view_audit_logs')) {
        reportItems.push({
            title: 'Log Aktivitas',
            href: '/audit-logs',
            icon: Shield,
        });
    }

    const navGroups: NavGroup[] = [];

    if (mainItems.length > 0) {
        navGroups.push({ label: 'Utama', items: mainItems });
    }

    if (managementItems.length > 0) {
        navGroups.push({ label: 'Pengelolaan', items: managementItems });
    }

    if (attendanceItems.length > 0) {
        navGroups.push({ label: 'Kehadiran & Izin', items: attendanceItems });
    }

    if (reportItems.length > 0) {
        navGroups.push({ label: 'Laporan & Sistem', items: reportItems });
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain groups={navGroups} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
