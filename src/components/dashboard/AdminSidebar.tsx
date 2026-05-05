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
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Users,
    Store,
    ShoppingBag,
    Package,
    BarChart3,
    FileText,
    Settings,
    PlayCircle,
    LogOut,
    Truck,
    X,
    ShieldCheck,
    LayoutPanelTop,
    Mail,
    ArrowRightLeft
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
        { name: 'OVERVIEW', href: '/dashboard/admin', icon: LayoutDashboard },
        { name: 'USERS', href: '/dashboard/admin/users', icon: Users },
        { name: 'VENDORS', href: '/dashboard/admin/vendors', icon: Store },
        { name: 'ORDERS', href: '/dashboard/admin/orders', icon: ShoppingBag },
        { name: 'TRANSFERS', href: '/dashboard/admin/payments/transfer', icon: ArrowRightLeft },
        { name: 'LOGISTICS', href: '/dashboard/admin/logistics', icon: Truck },
        { name: 'PRODUCTS', href: '/dashboard/admin/products', icon: Package },
        { name: 'JOURNAL', href: '/dashboard/admin/blog', icon: FileText },
        { name: 'BROADCAST', href: '/dashboard/admin/broadcast', icon: Mail },
        { name: 'ANALYTICS', href: '/dashboard/admin/analytics', icon: BarChart3 },
        { name: 'BANNERS', href: '/dashboard/admin/banners', icon: LayoutPanelTop },
        { name: 'CONFIG', href: '/dashboard/admin/settings', icon: Settings },
        { name: 'ACADEMY', href: '/dashboard/admin/tutorials', icon: PlayCircle },
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
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-white/80 backdrop-blur-md z-[50] md:hidden"
                        onClick={onClose}
                    />
                )}
            </AnimatePresence>

            <aside
                className={`w-64 h-[100dvh] border-r flex flex-col fixed left-0 top-0 z-[60] transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                } md:translate-x-0 ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-50'}`}
            >
                {/* 1. BRAND TERMINAL HEADER */}
                <div className={`px-8 py-10 border-b ${isDark ? 'border-slate-800' : 'border-slate-50'}`}>
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-none border border-slate-900 flex items-center justify-center">
                                <ShieldCheck className="w-4 h-4 text-slate-900" strokeWidth={1.5} />
                            </div>
                            <span className="text-[10px] font-black tracking-[0.4em] text-slate-900 uppercase">Menu</span>
                        </div>
                        <button onClick={onClose} className="md:hidden">
                            <X className="w-4 h-4 text-slate-300" />
                        </button>
                    </div>
                    
                    <div className="space-y-1">
                        <h2 className="text-[11px] font-black tracking-widest text-slate-900 uppercase">Administrator</h2>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Secure Session</span>
                        </div>
                    </div>
                </div>

                {/* 2. OPERATIONAL NAVIGATION */}
                <nav className="flex-1 py-8 px-4 space-y-1 overflow-y-auto custom-scrollbar">
                    {links.map((link) => {
                        const isActive = pathname === link.href || (link.href !== '/dashboard/admin' && pathname.startsWith(link.href));
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => onClose && onClose()}
                                className={`flex items-center justify-between px-4 py-3 group transition-all duration-300 ${
                                    isActive
                                        ? 'bg-slate-900 text-white'
                                        : 'text-slate-400 hover:text-slate-900 hover:translate-x-1'
                                }`}
                            >
                                <div className="flex items-center gap-4">
                                    <link.icon className={`w-4 h-4 transition-colors ${
                                        isActive ? 'text-emerald-400' : 'text-slate-300 group-hover:text-slate-900'
                                    }`} strokeWidth={isActive ? 2 : 1.5} />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{link.name}</span>
                                </div>
                                {isActive && (
                                    <motion.div 
                                        layoutId="active-indicator"
                                        className="w-1 h-1 bg-emerald-400"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* 3. TERMINAL FOOTER */}
                <div className={`p-6 border-t ${isDark ? 'border-slate-800' : 'border-slate-50'}`}>
                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-between px-4 py-4 w-full transition-all group hover:bg-red-50"
                    >
                        <div className="flex items-center gap-4">
                            <LogOut className="w-4 h-4 text-slate-300 group-hover:text-red-500 transition-colors" strokeWidth={1.5} />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-red-600 transition-colors">Log Out</span>
                        </div>
                    </button>
                    
                    <div className="mt-6 pt-6 border-t border-slate-50 opacity-20">
                        <p className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-950">London&apos;s Imports Hub</p>
                        <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest mt-1">Operational Environment v2.4</p>
                    </div>
                </div>
            </aside>
        </>
    );
}
