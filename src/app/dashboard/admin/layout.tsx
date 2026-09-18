/**
 * London's Imports - Admin Dashboard Layout
 * Protected route wrapper with sidebar for admins only
 */
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from '@/providers/ThemeProvider';
import { useAuthStore } from '@/stores/authStore';
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
    const { user: storeUser, isAuthenticated, isLoading: authLoading } = useAuthStore();
    const [user, setUser] = useState<User | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [checking, setChecking] = useState(true);
    const isDark = theme === 'dark';

    useEffect(() => {
        // If authStore says we're not authenticated and it's not loading, redirect
        if (!authLoading && !isAuthenticated) {
            router.push('/admin/login');
            return;
        }

        // If authenticated, check roles
        if (isAuthenticated && storeUser) {
            if (storeUser.role !== 'ADMIN' && !storeUser.is_staff && !storeUser.is_superuser) {
                router.push('/admin/login');
                return;
            }
            setUser(storeUser as unknown as User);
            setChecking(false);
        }
    }, [isAuthenticated, storeUser, authLoading, router]);

    if (authLoading || checking) {
        return (
            <div className={`min-h-screen transition-colors duration-700 ${isDark ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'} selection:bg-emerald-100`}>
                <div className="hidden md:block fixed inset-y-0 left-0 w-64 bg-slate-950 border-r border-slate-900" />
                <main className="ml-0 md:ml-64 transition-all duration-700 min-h-screen border-l border-slate-50 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
                        <p className={`text-[10px] font-black tracking-widest uppercase ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>LOADING DASHBOARD...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className={`min-h-screen transition-colors duration-700 ${isDark ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'} selection:bg-emerald-100 print:bg-white print:text-slate-900 print:min-h-0`}>
            <div className="print:hidden">
                <AdminSidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                />
            </div>

            {/* Main Content Area */}
            <main className="ml-0 md:ml-64 transition-all duration-700 min-h-screen border-l border-slate-50 dark:border-slate-800 w-full max-w-full min-w-0 overflow-x-hidden print:!ml-0 print:border-none print:min-h-0 print:p-0">
                {/* 1. Header */}
                <div className={`sticky top-0 z-[30] backdrop-blur-md border-b ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-white/80 border-slate-50'} print:hidden`}>
                    <div className="max-w-[1600px] mx-auto px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-6 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 sm:gap-6 min-w-0">
                            {/* Mobile Navigation Toggle */}
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                aria-label="Open Navigation Menu"
                                className={`md:hidden p-2.5 min-w-[40px] min-h-[40px] flex items-center justify-center border ${
                                    isDark ? 'border-slate-800 hover:bg-slate-900 text-white' : 'border-slate-200 hover:bg-slate-50 text-slate-900'
                                } rounded-none transition-colors shrink-0`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>

                            <div className="space-y-0.5 min-w-0">
                                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                    <span className={`h-px w-4 sm:w-8 shrink-0 ${isDark ? 'bg-slate-200' : 'bg-slate-900'}`} />
                                    <h1 className={`text-[10px] sm:text-[11px] font-black tracking-[0.2em] sm:tracking-[0.4em] uppercase truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                        ADMIN / {pathname.split('/').pop()?.toUpperCase() || 'DASHBOARD'}
                                    </h1>
                                </div>
                                <p className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-6 sm:pl-11 truncate">
                                    Logged in as {user.username}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 sm:gap-8 shrink-0">
                            <div className="hidden lg:flex items-center gap-8 border-r border-slate-50 dark:border-slate-800 pr-8">
                                <div className="text-right">
                                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Environment</p>
                                    <p className={`text-[9px] font-bold uppercase tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>Production</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">System Status</p>
                                    <div className="flex items-center gap-1.5 justify-end">
                                        <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                        <p className="text-[9px] font-bold text-emerald-700 dark:text-emerald-500 uppercase tracking-tighter">Online</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className={`w-8 h-8 sm:w-10 sm:h-10 border flex items-center justify-center text-[10px] font-black shrink-0 ${
                                isDark ? 'border-slate-700 bg-slate-900 text-white' : 'border-slate-900 bg-white text-slate-900'
                            }`}>
                                {user.first_name?.[0] || user.username?.[0] || 'A'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. DASHBOARD CONTENT */}
                <div className="max-w-[1600px] mx-auto p-4 sm:p-6 md:p-8 lg:p-12 print:p-0 print:max-w-none print:m-0">
                    {children}
                </div>
            </main>
        </div>
    );
}
