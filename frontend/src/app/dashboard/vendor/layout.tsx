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
import Image from 'next/image';

export default function VendorDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { theme } = useTheme();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

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
            } catch (error) {
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

    return (
        <div className="min-h-screen pt-16" style={{ backgroundColor: theme === 'dark' ? '#0f172a' : '#f9fafb' }}>
            <DashboardSidebar />

            {/* Main Content Area */}
            <main className="ml-64 p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold" style={{ color: theme === 'dark' ? '#f8fafc' : '#111827' }}>
                            {user.vendor_profile?.business_name || 'Vendor Dashboard'}
                        </h1>
                        <p className="text-sm" style={{ color: theme === 'dark' ? '#94a3b8' : '#6b7280' }}>
                            Welcome back, {user.first_name}
                        </p>
                    </div>
                </div>

                {children}
            </main>
        </div>
    );
}
