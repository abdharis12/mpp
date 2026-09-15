import { Link, router, usePage } from '@inertiajs/react';
import { Bell, CheckCheck } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const TYPE_DOTS: Record<string, string> = {
    holiday: 'bg-amber-500',
    schedule: 'bg-blue-500',
    leave: 'bg-purple-500',
    correction: 'bg-red-500',
    system: 'bg-gray-400',
};

type NotificationItem = {
    id: number;
    title: string;
    message: string;
    type: string;
    url: string | null;
    is_read: boolean;
    created_at: string;
    read_at: string | null;
};

export function NotificationBell() {
    const { notifications } = usePage().props as any;
    const [unreadCount, setUnreadCount] = useState<number>(
        notifications?.unread_count ?? 0,
    );
    const [items, setItems] = useState<NotificationItem[]>([]);
    const [loading, setLoading] = useState(false);
    const fetchedRef = useRef(false);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const res = await fetch('/notifications');
            const data = await res.json();
            setItems(data.notifications?.data ?? []);
            setUnreadCount(data.unread_count ?? 0);
        } catch {
            // silently ignore
        } finally {
            setLoading(false);
        }
    };

    const handleOpen = () => {
        if (!fetchedRef.current) {
            fetchedRef.current = true;
            fetchNotifications();
        }
    };

    const markAllRead = async () => {
        try {
            await fetch('/notifications/read-all', { method: 'POST' });
            await fetchNotifications();
        } catch {
            // silently ignore
        }
    };

    return (
        <DropdownMenu onOpenChange={(open) => open && handleOpen()}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-9 w-9 cursor-pointer"
                    aria-label={`Notifikasi${unreadCount > 0 ? ` (${unreadCount} belum dibaca)` : ''}`}
                >
                    <Bell className="!size-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0">
                <div className="flex items-center justify-between px-4 py-3">
                    <DropdownMenuLabel className="p-0 text-sm font-semibold">
                        Notifikasi
                    </DropdownMenuLabel>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllRead}
                            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                        >
                            <CheckCheck className="h-3.5 w-3.5" />
                            Tandai dibaca
                        </button>
                    )}
                </div>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-y-auto">
                    {loading && items.length === 0 ? (
                        <p className="text-muted-foreground px-4 py-8 text-center text-sm">
                            Memuat…
                        </p>
                    ) : items.length === 0 ? (
                        <p className="text-muted-foreground px-4 py-8 text-center text-sm">
                            Tidak ada notifikasi.
                        </p>
                    ) : (
                        items.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    router.post(
                                        `/notifications/${item.id}/read`,
                                        {},
                                        {
                                            preserveScroll: true,
                                            onSuccess: () => {
                                                setUnreadCount((c) =>
                                                    Math.max(0, c - 1),
                                                );
                                                setItems((prev) =>
                                                    prev.map((n) =>
                                                        n.id === item.id
                                                            ? {
                                                                  ...n,
                                                                  is_read: true,
                                                              }
                                                            : n,
                                                    ),
                                                );
                                                if (item.url) {
                                                    router.visit(item.url);
                                                }
                                            },
                                        },
                                    );
                                }}
                                className={cn(
                                    'border-border hover:bg-muted/50 block w-full border-b px-4 py-3 text-left transition-colors last:border-b-0',
                                    !item.is_read && 'bg-blue-50/50',
                                )}
                            >
                                <div className="flex items-center gap-2">
                                    <span
                                        className={cn(
                                            'size-2 shrink-0 rounded-full',
                                            TYPE_DOTS[item.type] ??
                                                'bg-gray-400',
                                        )}
                                        aria-hidden="true"
                                    />
                                    <span className="truncate text-sm font-medium">
                                        {item.title}
                                    </span>
                                    {!item.is_read && (
                                        <span
                                            className="ml-auto size-2 shrink-0 rounded-full bg-blue-500"
                                            aria-hidden="true"
                                        />
                                    )}
                                </div>
                                <p className="text-muted-foreground mt-1 line-clamp-2 text-xs leading-relaxed">
                                    {item.message}
                                </p>
                                <p className="text-muted-foreground/70 mt-1 text-[10px]">
                                    {new Date(item.created_at).toLocaleString(
                                        'id-ID',
                                        {
                                            day: '2-digit',
                                            month: 'short',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        },
                                    )}
                                </p>
                            </button>
                        ))
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
