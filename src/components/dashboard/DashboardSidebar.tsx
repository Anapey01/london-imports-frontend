/**
 * London's Imports - Dashboard Sidebar
 * Navigation for vendor dashboard
 */
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from '@/providers/ThemeProvider';
import { authAPI } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Wallet,
    Settings,
    LogOut,
    X,
    Store
} from 'lucide-react';

interface DashboardSidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export default function DashboardSidebar({ isOpen, onClose }: DashboardSidebarProps) {
    const { logout } = useAuthStore();
    const { theme } = useTheme();
    const pathname = usePathname();
    const router = useRouter();

    const isDark = theme === 'dark';

    const links = [
        {
            name: 'Overview',
            href: '/dashboard/vendor',
            icon: LayoutDashboard
        },
        {
            name: 'Products',
            href: '/dashboard/vendor/products',
            icon: Package
        },
        {
            name: 'Orders',
            href: '/dashboard/vendor/orders',
            icon: ShoppingBag
        },
        {
            name: 'Payouts',
            href: '/dashboard/vendor/payouts',
            icon: Wallet
        },
        {
            name: 'Settings',
            href: '/dashboard/vendor/settings',
            icon: Settings
        },
    ];

    const handleLogout = async () => {
        try {
            await authAPI.logout();
            logout();
            router.push('/login');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`w-72 min-h-screen border-r flex flex-col fixed left-0 top-0 pt-0 md:pt-20 z-50 transition-transform duration-300 ease-in-out md:translate-x-0 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                } ${
                    isDark
                        ? 'bg-slate-950/95 border-slate-800/80 backdrop-blur-xl'
                        : 'bg-white/95 border-slate-200/80 backdrop-blur-xl'
                }`}
            >
                {/* Mobile Header */}
                <div className={`md:hidden p-5 flex items-center justify-between border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                    <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-slate-800 text-white' : 'bg-slate-900 text-white'}`}>
                            <Store className="w-4 h-4" />
                        </div>
                        <div>
                            <span className={`font-bold text-sm tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Merchant Hub</span>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">Active Store</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Close menu"
                        className={`p-2 rounded-lg transition-colors ${isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-100'}`}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 py-6 px-3.5 space-y-1.5 overflow-y-auto">
                    {links.map((link) => {
                        const isActive = pathname === link.href || (link.href !== '/dashboard/vendor' && pathname.startsWith(link.href));
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={onClose}
                                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-150 group font-medium text-sm ${
                                    isActive
                                        ? isDark
                                            ? 'bg-slate-800 text-white font-semibold shadow-sm'
                                            : 'bg-slate-900 text-white font-semibold shadow-sm'
                                        : isDark
                                            ? 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                }`}
                            >
                                <link.icon className={`w-5 h-5 transition-colors ${
                                    isActive
                                        ? isDark ? 'text-emerald-400' : 'text-emerald-400'
                                        : isDark ? 'text-slate-400 group-hover:text-white' : 'text-slate-500 group-hover:text-slate-900'
                                }`} />
                                <span>{link.name}</span>
                                {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer / Sign Out */}
                <div className={`p-4 border-t ${isDark ? 'border-slate-800/80' : 'border-slate-100'}`}>
                    <button
                        onClick={handleLogout}
                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl w-full text-sm font-medium transition-colors ${
                            isDark
                                ? 'text-slate-400 hover:bg-red-500/10 hover:text-red-400'
                                : 'text-slate-600 hover:bg-red-50 hover:text-red-600'
                        }`}
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                    </button>

                    <div className="mt-4 px-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/50">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                            London&apos;s Imports Merchant
                        </p>
                    </div>
                </div>
            </aside>
        </>
    );
}
