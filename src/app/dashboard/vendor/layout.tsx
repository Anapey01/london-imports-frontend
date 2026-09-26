/**
 * London's Imports - Vendor Dashboard Layout
 * Protected route wrapper with sidebar
 */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/providers/ThemeProvider';
import { authAPI } from '@/lib/api';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';

interface User {
    role: string;
    first_name: string;
    vendor_profile?: {
        business_name?: string;
    };
}

export default function VendorDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { theme } = useTheme();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await authAPI.me();
                const userData = response.data;

                if (userData.role !== 'VENDOR') {
                    // Redirect non-vendors
                    router.push('/dashboard');
                    return;
                }

                setUser(userData);
            } catch {
                router.push('/login');
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [router]);

    if (isLoading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'}`}>
                <div className="w-8 h-8 border-2 border-slate-900 dark:border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) return null;

    const isDark = theme === 'dark';

    return (
        <div className={`min-h-screen pt-28 md:pt-24 ${isDark ? 'bg-slate-950' : 'bg-gray-50'}`}>
            {/* Mobile Sidebar Toggle Header (Visible only on mobile) */}
            <div className={`md:hidden fixed top-14 left-0 right-0 z-30 px-4 py-2.5 border-b backdrop-blur-md flex items-center justify-between transition-colors ${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-gray-200'
                }`}>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        aria-label="Open sidebar"
                        className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-gray-100 text-gray-600'}`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <span className="font-semibold text-xs tracking-wider uppercase text-slate-500 dark:text-slate-400">Vendor Portal</span>
                </div>
                {/* User Avatar Mini */}
                <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{user.first_name}</span>
                    <div className="w-7 h-7 rounded-full bg-slate-900 dark:bg-slate-800 border border-slate-700/50 flex items-center justify-center text-white text-xs font-bold tracking-tight">
                        {user.first_name?.[0]}
                    </div>
                </div>
            </div>

            <DashboardSidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

            {/* Main Content Area */}
            <main className={`transition-all duration-300 p-4 md:p-8 md:ml-72 ${mobileMenuOpen ? 'blur-sm md:blur-none' : ''}`}>
                {/* Vendor Header Card */}
                <div className={`mb-6 md:mb-8 pb-5 border-b ${isDark ? 'border-slate-800/80' : 'border-slate-200/80'}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                    Storefront
                                </span>
                            </div>
                            <h1 className={`text-xl sm:text-2xl md:text-3xl font-bold tracking-tight ${isDark ? 'text-slate-50' : 'text-gray-900'}`}>
                                {user.vendor_profile?.business_name || 'Vendor Dashboard'}
                            </h1>
                            <p className={`text-xs sm:text-sm mt-0.5 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                Welcome back, {user.first_name}
                            </p>
                        </div>
                    </div>
                </div>

                {children}
            </main>
        </div>
    );
}
