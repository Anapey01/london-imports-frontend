'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/providers/ThemeProvider';
import { useAuthStore } from '@/stores/authStore';
import { ordersAPI } from '@/lib/api';

// New Component Imports
import ProfileHeader from '@/components/profile/ProfileHeader';
import SidebarNav from '@/components/profile/SidebarNav';
import DashboardView from '@/components/profile/DashboardView';
import OrdersView from '@/components/profile/OrdersView';
import AddressesView from '@/components/profile/AddressesView';
import WalletView from '@/components/profile/WalletView';
import WishlistView from '@/components/profile/WishlistView';
import SettingsView from '@/components/profile/SettingsView';
import PlaceholderView from '@/components/profile/PlaceholderView';

export default function ProfilePage() {
    const { user, isAuthenticated, isLoading: authLoading, fetchUser, logout } = useAuthStore();
    const { theme } = useTheme();
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('dashboard');

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
            return;
        }
        if (isAuthenticated && !user) fetchUser();
        if (isAuthenticated) {
            ordersAPI.list().then(res => setOrders(res.data.results || res.data)).catch(console.error);
        }
    }, [isAuthenticated, authLoading, router, user, fetchUser]);

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    if (authLoading || !user) {
        const isDarkLoading = theme === 'dark';
        return (
            <div className={`min-h-screen ${isDarkLoading ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
                {/* Header skeleton */}
                <div className={`w-full border-b ${isDarkLoading ? 'border-slate-800' : 'border-gray-200'} pt-24 md:pt-28`}>
                    <div className="max-w-6xl mx-auto px-6 py-10">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                            <div className={`h-20 w-20 rounded-full animate-pulse ${isDarkLoading ? 'bg-slate-800' : 'bg-gray-200'}`} />
                            <div className="flex-1 text-center sm:text-left space-y-3">
                                <div className={`h-8 w-48 rounded animate-pulse ${isDarkLoading ? 'bg-slate-800' : 'bg-gray-200'}`} />
                                <div className={`h-4 w-32 rounded animate-pulse ${isDarkLoading ? 'bg-slate-800' : 'bg-gray-200'}`} />
                            </div>
                        </div>
                    </div>
                </div>
                {/* Main content skeleton */}
                <div className="max-w-6xl mx-auto px-6 py-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar skeleton */}
                        <div className="w-full lg:w-52 shrink-0 space-y-2">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className={`h-10 rounded-lg animate-pulse ${isDarkLoading ? 'bg-slate-800' : 'bg-gray-200'}`} />
                            ))}
                        </div>
                        {/* Content skeleton */}
                        <div className="flex-1 space-y-6">
                            <div className={`h-8 w-32 rounded animate-pulse ${isDarkLoading ? 'bg-slate-800' : 'bg-gray-200'}`} />
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className={`h-20 rounded-xl animate-pulse ${isDarkLoading ? 'bg-slate-800' : 'bg-gray-200'}`} />
                                ))}
                            </div>
                            <div className={`h-64 rounded-xl animate-pulse ${isDarkLoading ? 'bg-slate-800' : 'bg-gray-200'}`} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const isDark = theme === 'dark';

    return (
        <div className={`min-h-screen pb-20 ${isDark ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
            <ProfileHeader user={user} isDark={isDark} />

            {/* Main Content Area - Sidebar Layout */}
            <div className="max-w-6xl mx-auto px-6 relative z-20">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

                    {/* Sidebar */}
                    <SidebarNav activeTab={activeTab} setActiveTab={setActiveTab} isDark={isDark} handleLogout={handleLogout} />

                    {/* Content Area */}
                    <div className="flex-1 py-8 min-h-[600px]">
                        {activeTab === 'dashboard' && <DashboardView orders={orders} theme={theme} />}
                        {activeTab === 'orders' && <OrdersView orders={orders} theme={theme} />}
                        {activeTab === 'settings' && <SettingsView user={user} theme={theme} />}
                        {activeTab === 'addresses' && <AddressesView theme={theme} user={user} />}
                        {activeTab === 'wallet' && <WalletView theme={theme} />}
                        {activeTab === 'wishlist' && <WishlistView theme={theme} />}
                        {activeTab === 'support' && <PlaceholderView title="Support" theme={theme} icon={<svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>} />}
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
