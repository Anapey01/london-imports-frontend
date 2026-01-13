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
                const token = localStorage.getItem('access_token');
                if (!token) throw new Error('No token');

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
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme === 'dark' ? '#0f172a' : '#f9fafb' }}>
                <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) return null;

    const isDark = theme === 'dark';

    return (
        <div className="min-h-screen pt-16 md:pt-20" style={{ backgroundColor: isDark ? '#020617' : '#f9fafb' }}>
            {/* Mobile Sidebar Toggle Header (Visible only on mobile) */}
            <div className={`md:hidden fixed top-14 left-0 right-0 z-30 px-4 py-3 border-b backdrop-blur-md flex items-center justify-between transition-colors ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-gray-200'
                }`}>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-gray-100 text-gray-600'}`}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <span className="font-semibold text-sm">Dashboard</span>
                </div>
                {/* User Avatar Mini */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white text-xs font-bold">
                    {user.first_name?.[0]}
                </div>
            </div>

            <DashboardSidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

            {/* Main Content Area */}
            <main className={`transition-all duration-300 p-4 md:p-8 md:ml-72 ${mobileMenuOpen ? 'blur-sm md:blur-none' : ''}`}>
                {/* Desktop Header (Hidden on mobile to save space) */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1" style={{ color: isDark ? '#f8fafc' : '#111827' }}>
                            {user.vendor_profile?.business_name || 'Vendor Dashboard'}
                        </h1>
                        <p className="text-sm md:text-base font-light" style={{ color: isDark ? '#94a3b8' : '#6b7280' }}>
                            Welcome back, {user.first_name}
                        </p>
                    </div>
                </div>

                {children}
            </main>
        </div>
    );
}
