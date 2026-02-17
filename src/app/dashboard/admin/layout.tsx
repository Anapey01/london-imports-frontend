/**
 * London's Imports - Admin Dashboard Layout
 * Protected route wrapper with sidebar for admins only
 */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
        <div className={`min-h-screen pt-16 transition-colors duration-300 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
            <AdminSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Main Content Area */}
            <main className="ml-0 md:ml-64 p-4 md:p-8 transition-all duration-300">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            aria-label="Open sidebar"
                            className={`md:hidden p-2 rounded-lg -ml-2 ${isDark ? 'text-white hover:bg-slate-800' : 'text-gray-900 hover:bg-gray-100'}`}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        <div>
                            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Admin Dashboard
                            </h1>
                            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                Welcome back, {user.first_name || user.username}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${isDark ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-700'}`}>
                            {user.first_name?.[0] || user.username?.[0] || 'A'}
                        </div>
                    </div>
                </div>

                {children}
            </main>
        </div>
    );
}
