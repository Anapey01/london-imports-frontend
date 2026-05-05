/**
 * London's Imports - Admin Dashboard Layout
 * Protected route wrapper with sidebar for admins only
 */
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from '@/providers/ThemeProvider';
import { authAPI } from '@/lib/api';
import AdminSidebar from '@/components/dashboard/AdminSidebar';

interface User {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    role: string;
    is_staff: boolean;
    is_superuser: boolean;
    avatar?: string;
}

export default function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { theme } = useTheme();
    const router = useRouter();
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const isDark = theme === 'dark';

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('access_token');
                if (!token) throw new Error('No token');

                const response = await authAPI.me();
                const userData = response.data;

                // Only allow ADMIN users (or staff/superuser)
                if (userData.role !== 'ADMIN' && !userData.is_staff && !userData.is_superuser) {
                    router.push('/');
                    return;
                }

                setUser(userData);
            } catch {
                router.push('/admin/login');
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [router]);

    if (isLoading) {
        return (
            <div
                className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}
            >
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Loading admin panel...</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className={`min-h-screen transition-colors duration-700 ${isDark ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'} selection:bg-emerald-100`}>
            <AdminSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Main Content Area (Architectural Grid) */}
            <main className="ml-0 md:ml-64 transition-all duration-700 min-h-screen border-l border-slate-50">
                {/* 1. OPERATIONAL COMMAND HEADER */}
                <div className={`sticky top-0 z-[30] backdrop-blur-md border-b ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-white/80 border-slate-50'}`}>
                    <div className="max-w-[1600px] mx-auto px-8 py-8 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            {/* Mobile Terminal Toggle */}
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                aria-label="Open Terminal"
                                className={`md:hidden p-2 border border-slate-100 rounded-none hover:bg-slate-50 transition-colors`}
                            >
                                <svg className="w-4 h-4 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>

                            <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                    <span className="h-px w-8 bg-slate-900" />
                                    <h1 className="text-[11px] font-black tracking-[0.4em] text-slate-900 uppercase">
                                        PROTOCOL / {pathname.split('/').pop()?.toUpperCase()}
                                    </h1>
                                </div>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-11">
                                    Authenticated as {user.username} // ID: {user.email.split('@')[0]}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-8">
                            <div className="hidden lg:flex items-center gap-8 border-r border-slate-50 pr-8">
                                <div className="text-right">
                                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Environment</p>
                                    <p className="text-[9px] font-bold text-slate-900 uppercase tracking-tighter">Production Node</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Status</p>
                                    <div className="flex items-center gap-1.5 justify-end">
                                        <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                        <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-tighter">Live</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="w-10 h-10 border border-slate-900 flex items-center justify-center text-[10px] font-black text-slate-900 bg-white">
                                {user.first_name?.[0] || user.username?.[0] || 'A'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. OPERATIONAL PAYLOAD */}
                <div className="max-w-[1600px] mx-auto p-8 md:p-12">
                    {children}
                </div>
            </main>
        </div>
    );
}
