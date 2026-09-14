import { Link, usePage } from '@inertiajs/react';
import { BookOpen, FolderGit2, LayoutGrid, Users, MapPin, Building2, CalendarDays, CalendarOff, FileText, AlertCircle, Clock, BarChart3, Shield } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
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
    const permissions: string[] = user?.all_permissions?.map((p: any) => p.name) ?? [];

    const mainNavItems: NavItem[] = [
        { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
    ];

    if (user?.employee) {
        mainNavItems.push({ title: 'Absensi Hari Ini', href: '/attendance/today', icon: Clock });
    }

    if (permissions.includes('view_tenants') || permissions.includes('manage_settings')) {
        mainNavItems.push({ title: 'Tenant', href: '/tenants', icon: Building2 });
    }

    if (permissions.includes('view_employees')) {
        mainNavItems.push({ title: 'Petugas', href: '/employees', icon: Users });
    }

    if (permissions.includes('manage_location')) {
        mainNavItems.push({ title: 'Lokasi Absensi', href: '/locations', icon: MapPin });
    }

    if (permissions.includes('manage_schedule')) {
        mainNavItems.push({ title: 'Jadwal Kerja', href: '/schedules', icon: CalendarDays });
    }

    if (permissions.includes('manage_holiday') || permissions.includes('view_attendance')) {
        mainNavItems.push({ title: 'Hari Libur', href: '/holidays', icon: CalendarOff });
    }

    if (permissions.includes('request_leave') || permissions.includes('view_attendance')) {
        mainNavItems.push({ title: 'Izin', href: '/leaves', icon: FileText });
    }

    if (permissions.includes('request_correction') || permissions.includes('view_attendance')) {
        mainNavItems.push({ title: 'Koreksi', href: '/corrections', icon: AlertCircle });
    }

    if (permissions.includes('view_reports')) {
        mainNavItems.push({ title: 'Laporan Absensi', href: '/reports/attendance', icon: BarChart3 });
    }

    if (permissions.includes('view_audit_logs')) {
        mainNavItems.push({ title: 'Log Aktivitas', href: '/audit-logs', icon: Shield });
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
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}