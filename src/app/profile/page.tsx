'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('dashboard');

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
            return;
        }
        
        // Refresh user data on mount to ensure fresh state (e.g. after checkout address save)
        if (isAuthenticated) {
            fetchUser();
        }

        if (isAuthenticated) {
            ordersAPI.list().then(res => setOrders(res.data.results || res.data)).catch(console.error);
        }

        // Handle cross-tab navigation (e.g. from Addresses to Settings)
        const handleTabSwitch = (e: Event) => {
            const detail = (e as CustomEvent).detail;
            if (detail) setActiveTab(detail);
        };
        window.addEventListener('switch-profile-tab', handleTabSwitch);
        return () => window.removeEventListener('switch-profile-tab', handleTabSwitch);
    }, [isAuthenticated, authLoading, router, fetchUser]);

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    if (authLoading || !user) {
        return (
            <div className="min-h-screen bg-surface">
                {/* Header skeleton */}
                <div className="w-full border-b border-border-standard pt-24 md:pt-28">
                    <div className="max-w-6xl mx-auto px-6 py-10">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                            <div className="h-20 w-20 rounded-full animate-pulse bg-surface-card" />
                            <div className="flex-1 text-center sm:text-left space-y-3">
                                <div className="h-8 w-48 rounded animate-pulse bg-surface-card" />
                                <div className="h-4 w-32 rounded animate-pulse bg-surface-card" />
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
                                <div key={i} className="h-10 rounded-lg animate-pulse bg-surface-card" />
                            ))}
                        </div>
                        {/* Content skeleton */}
                        <div className="flex-1 space-y-6">
                            <div className="h-8 w-32 rounded animate-pulse bg-surface-card" />
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="h-20 rounded-xl animate-pulse bg-surface-card" />
                                ))}
                            </div>
                            <div className="h-64 rounded-xl animate-pulse bg-surface-card" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div className="min-h-screen pb-20 bg-surface">
            {/* ProfileHeader is now hidden globally across all dashboard tabs for a scroll-free experience */}
            {/* {activeTab !== 'dashboard' && <ProfileHeader user={user} />} */}

            {/* Main Content Area - Sidebar Layout */}
            <div className="max-w-6xl mx-auto px-6 relative z-20 pt-24 md:pt-32">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

                    {/* Sidebar */}
                    <SidebarNav activeTab={activeTab} setActiveTab={setActiveTab} handleLogout={handleLogout} />

                    {/* Content Area */}
                    <div className="flex-1 py-8 min-h-[600px]">
                        {activeTab === 'dashboard' && <DashboardView orders={orders} user={user} />}
                        {activeTab === 'orders' && <OrdersView orders={orders} />}
                        {activeTab === 'settings' && <SettingsView user={user} />}
                        {activeTab === 'addresses' && <AddressesView user={user} />}
                        {activeTab === 'wallet' && <WalletView />}
                        {activeTab === 'wishlist' && <WishlistView />}
                        {activeTab === 'support' && <PlaceholderView title="Support" icon={<svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>} />}
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
