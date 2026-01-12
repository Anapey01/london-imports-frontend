/**
 * London's Imports - Admin Dashboard Sidebar
 * Navigation for admin dashboard
 */
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from '@/providers/ThemeProvider';
import { useAuthStore } from '@/stores/authStore';
import { authAPI } from '@/lib/api';
import {
    LayoutDashboard,
    Users,
    Store,
    ShoppingBag,
    Package,
    BarChart3,
    Settings,
    PlayCircle,
    LogOut,
    X,
    ShieldCheck
} from 'lucide-react';

interface AdminSidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export default function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
    const { logout } = useAuthStore();
    const { theme } = useTheme();
    const pathname = usePathname();
    const router = useRouter();
    const isDark = theme === 'dark';

    const links = [
        { name: 'Overview', href: '/dashboard/admin', icon: LayoutDashboard },
        { name: 'Users', href: '/dashboard/admin/users', icon: Users },
        { name: 'Vendors', href: '/dashboard/admin/vendors', icon: Store },
        { name: 'Orders', href: '/dashboard/admin/orders', icon: ShoppingBag },
        { name: 'Products', href: '/dashboard/admin/products', icon: Package },
        { name: 'Analytics', href: '/dashboard/admin/analytics', icon: BarChart3 },
        { name: 'Settings', href: '/dashboard/admin/settings', icon: Settings },
        { name: 'Tutorials', href: '/dashboard/admin/tutorials', icon: PlayCircle },
    ];

    const handleLogout = async () => {
        try {
            await authAPI.logout();
            logout();
            router.push('/admin/login');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <>
            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden animate-fade-in"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            <aside
                className={`w-64 min-h-screen border-r flex flex-col fixed left-0 top-0 pt-[var(--navbar-height,4rem)] z-40 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    } md:translate-x-0 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'}`}
            >
                {/* Close Button for Mobile */}
                <div className="md:hidden absolute top-4 right-4 z-50">
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-lg ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Logo Area */}
                <div className={`px-6 py-6 border-b ${isDark ? 'border-slate-800' : 'border-gray-50'}`}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg shadow-pink-500/20">
                            <ShieldCheck className="w-6 h-6 text-white" strokeWidth={2} />
                        </div>
                        <div>
                            <p className={`font-bold text-sm tracking-wide ${isDark ? 'text-white' : 'text-gray-900'}`}>ADMIN PANEL</p>
                            <p className={`text-xs font-medium ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>London&apos;s Imports</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
                    {links.map((link) => {
                        const isActive = pathname === link.href || (link.href !== '/dashboard/admin' && pathname.startsWith(link.href));
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => onClose && onClose()}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium group ${isActive
                                    ? isDark
                                        ? 'bg-pink-500/10 text-pink-400 shadow-sm'
                                        : 'bg-pink-50 text-pink-700 shadow-sm'
                                    : isDark
                                        ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                <link.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-pink-500 group-hover:text-pink-600' : 'text-gray-400 group-hover:text-gray-600 dark:text-slate-500 dark:group-hover:text-slate-300'}`} strokeWidth={isActive ? 2 : 1.5} />
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className={`p-4 border-t ${isDark ? 'border-slate-800' : 'border-gray-50'} mt-auto`}>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl w-full transition-colors text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 dark:text-red-400"
                    >
                        <LogOut className="w-5 h-5" strokeWidth={1.5} />
                        Sign Out
                    </button>
                </div>
            </aside>
        </>
    );
}
