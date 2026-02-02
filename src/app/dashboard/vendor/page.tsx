'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';

export default function VendorDashboard() {
    const { user, isLoading } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login?role=vendor');
        } else if (!isLoading && user && user.role !== 'VENDOR') {
            router.push('/profile?error=unauthorized_vendor');
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900">Vendor Dashboard</h1>
                <p className="mt-2 text-gray-600">Welcome back, {user?.first_name || 'Vendor'}.</p>
                <div className="mt-8 bg-white shadow rounded-lg p-6">
                    <p>Dashboard statistics and management tools coming here.</p>
                </div>
            </div>
        </div>
    );
}
