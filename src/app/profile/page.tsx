/**
 * London's Imports - Premium User Profile
 * High-end design with glassmorphism, tabs, and transitions
 */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/providers/ThemeProvider';
import { useAuthStore } from '@/stores/authStore';
import { useWishlistStore } from '@/stores/wishlistStore';
import { ordersAPI } from '@/lib/api';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';

// Helper function to get relative time
const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
};

// TypeScript interfaces
interface User {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    date_joined?: string;
    is_vendor?: boolean;
    is_staff?: boolean;
    is_superuser?: boolean;
    role?: string;
}

interface Order {
    order_number: string;
    total_amount: string;
    status: string;
    created_at: string;
    items?: unknown[];
}

interface ToggleSwitchProps {
    enabled: boolean;
    onChange: () => void;
    label: string;
    description: string;
    isDark: boolean;
}

// Toggle Switch Component (defined outside render)
const ToggleSwitch = ({ enabled, onChange, label, description, isDark }: ToggleSwitchProps) => (
    <div className="flex items-center justify-between py-4">
        <div>
            <p className={`font-light ${isDark ? 'text-white' : 'text-gray-900'}`}>{label}</p>
            <p className={`text-xs font-light ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>{description}</p>
        </div>
        <button
            onClick={onChange}
            className={`relative w-11 h-6 rounded-full transition-colors ${enabled ? 'bg-pink-500' : isDark ? 'bg-slate-700' : 'bg-gray-200'}`}
        >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${enabled ? 'translate-x-5' : ''}`} />
        </button>
    </div>
);
// Polished Minimal Profile Header with Avatar Upload
const ProfileHeader = ({ user, isDark }: { user: User; isDark: boolean }) => {
    const [showInfo, setShowInfo] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const memberSince = user.date_joined ? new Date(user.date_joined).getFullYear() : new Date().getFullYear();

    // Handle avatar upload
    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarUrl(reader.result as string);
                localStorage.setItem('userAvatar', reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Load avatar from localStorage on mount
    useEffect(() => {
        const savedAvatar = localStorage.getItem('userAvatar');
        if (savedAvatar) setAvatarUrl(savedAvatar);
    }, []);

    return (
        <div className={`w-full border-b ${isDark ? 'border-slate-800' : 'border-gray-200'} transition-all pt-24 md:pt-28`}>
            <div className="max-w-6xl mx-auto px-6 py-10">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

                    {/* Avatar */}
                    <div className="relative group">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="hidden"
                            id="avatar-upload"
                        />
                        <label
                            htmlFor="avatar-upload"
                            className="cursor-pointer block focus:outline-none"
                        >
                            <div className={`h-20 w-20 rounded-full flex items-center justify-center overflow-hidden border-2 ${isDark ? 'border-slate-700 bg-slate-800' : 'border-gray-200 bg-gray-50'} transition-transform group-hover:scale-105`}>
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <svg className={`w-10 h-10 ${isDark ? 'text-slate-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                    </svg>
                                )}
                            </div>
                            <div className={`absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30`}>
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                                </svg>
                            </div>
                        </label>
                    </div>

                    {/* User Info */}
                    <div className="flex-1 text-center sm:text-left min-w-0">
                        <h1 className={`text-2xl sm:text-3xl font-light tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {user.first_name} {user.last_name}
                        </h1>
                        <div className={`mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wide ${user.role === 'VENDOR'
                                ? 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400'
                                : 'bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-slate-400'
                                }`}>
                                {user.role}
                            </span>
                            <span className="opacity-50">·</span>
                            <span className="font-light">Member since {memberSince}</span>
                        </div>

                        {/* Contact Info (expandable) */}
                        <button
                            onClick={() => setShowInfo(!showInfo)}
                            className={`mt-3 text-xs flex items-center gap-1.5 ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-gray-400 hover:text-gray-600'} transition-colors`}
                        >
                            <svg className={`w-3.5 h-3.5 transition-transform ${showInfo ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                            {showInfo ? 'Hide contact info' : 'View contact info'}
                        </button>

                        {showInfo && (
                            <div className={`mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                <a href={`mailto:${user.email}`} className="flex items-center gap-1.5 hover:text-pink-500 transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                    </svg>
                                    {user.email}
                                </a>
                                {user.phone && (
                                    <span className="flex items-center gap-1.5">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                        </svg>
                                        {user.phone}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* CTA */}
                    <div className="mt-2 sm:mt-0">
                        {user.role === 'VENDOR' ? (
                            <Link
                                href="/dashboard/vendor"
                                className={`group inline-flex items-center gap-2 border-b pb-0.5 text-sm font-medium transition-colors ${isDark ? 'border-slate-400 text-slate-300 hover:text-white hover:border-white' : 'border-gray-900 text-gray-900 hover:text-pink-600 hover:border-pink-600'}`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                                </svg>
                                Vendor Dashboard
                            </Link>
                        ) : (user.role === 'ADMIN' || user.is_staff || user.is_superuser) ? (
                            <Link
                                href="/dashboard/admin"
                                className={`group inline-flex items-center gap-2 border-b pb-0.5 text-sm font-medium transition-colors ${isDark ? 'border-slate-400 text-slate-300 hover:text-white hover:border-white' : 'border-gray-900 text-gray-900 hover:text-pink-600 hover:border-pink-600'}`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                                </svg>
                                Admin Dashboard
                            </Link>
                        ) : (
                            <Link
                                href="/register/vendor"
                                className={`group inline-flex items-center gap-2 border-b pb-0.5 text-sm font-medium transition-colors ${isDark ? 'border-pink-400 text-pink-400 hover:text-pink-300 hover:border-pink-300' : 'border-pink-600 text-pink-600 hover:text-pink-700 hover:border-pink-700'}`}
                            >
                                Start Selling
                                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Sidebar Navigation Component
const SidebarNav = ({ activeTab, setActiveTab, isDark, handleLogout }: { activeTab: string; setActiveTab: (tab: string) => void; isDark: boolean; handleLogout: () => void }) => {
    const navItems = [
        { id: 'dashboard', label: 'Overview', icon: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z' },
        { id: 'orders', label: 'Orders', icon: 'M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z' },
        { id: 'addresses', label: 'Addresses', icon: 'M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z' },
        { id: 'wallet', label: 'Wallet', icon: 'M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z' },
        { id: 'wishlist', label: 'Wishlist', icon: 'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z' },
        { id: 'settings', label: 'Settings', icon: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
        { id: 'support', label: 'Help', icon: 'M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z' },
    ];

    return (
        <div className={`w-full lg:w-52 shrink-0 py-6 lg:pr-8 lg:border-r ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
            <nav className="space-y-0.5">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-all relative ${activeTab === item.id
                            ? `${isDark ? 'text-white' : 'text-gray-900'}`
                            : `${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-gray-400 hover:text-gray-700'}`
                            }`}
                    >
                        {/* Left border indicator */}
                        <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full transition-all ${activeTab === item.id
                            ? `${isDark ? 'bg-white' : 'bg-gray-900'}`
                            : 'bg-transparent'
                            }`} />
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                        </svg>
                        <span className="font-light">{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className={`my-6 border-t ${isDark ? 'border-slate-800' : 'border-gray-200'}`}></div>

            <button
                onClick={handleLogout}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${isDark ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-600'}`}
            >
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
                <span className="font-light">Sign out</span>
            </button>
        </div>
    );
};

const DashboardView = ({ orders, theme }: { orders: Order[]; theme: string }) => {
    const isDark = theme === 'dark';
    const totalSpent = orders.reduce((acc: number, o: Order) => acc + parseFloat(o.total_amount || '0'), 0);
    const pendingCount = orders.filter((o: Order) => o.status === 'PENDING').length;
    const completedCount = orders.filter((o: Order) => o.status === 'COMPLETED').length;
    const recentOrders = orders.slice(0, 5);

    return (
        <div className="space-y-10">
            {/* Page Title */}
            <div className={`border-b pb-4 ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
                <h2 className={`text-2xl font-light tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Overview
                </h2>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                <div>
                    <p className={`text-3xl font-light tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{orders.length}</p>
                    <p className={`text-xs mt-1 font-light ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Total Orders</p>
                </div>
                <div>
                    <p className={`text-3xl font-light tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{pendingCount}</p>
                    <p className={`text-xs mt-1 font-light ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>In Progress</p>
                </div>
                <div>
                    <p className={`text-3xl font-light tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{completedCount}</p>
                    <p className={`text-xs mt-1 font-light ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Completed</p>
                </div>
                <div>
                    <p className={`text-3xl font-light tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>GHS {totalSpent.toFixed(0)}</p>
                    <p className={`text-xs mt-1 font-light ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Total Spent</p>
                </div>
            </div>

            {/* Recent Orders */}
            <div>
                <div className="flex items-end justify-between mb-4">
                    <h3 className={`text-sm font-medium uppercase tracking-wide ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Recent Orders</h3>
                    {orders.length > 5 && (
                        <button className={`text-xs font-light border-b pb-0.5 transition-colors ${isDark ? 'border-slate-500 text-slate-400 hover:text-white hover:border-white' : 'border-gray-400 text-gray-500 hover:text-gray-900 hover:border-gray-900'}`}>
                            View all
                        </button>
                    )}
                </div>

                {recentOrders.length > 0 ? (
                    <div className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-gray-100'}`}>
                        {recentOrders.map((order: Order) => (
                            <div key={order.order_number} className="flex items-center justify-between py-4">
                                <div className="flex items-center gap-4">
                                    <div className={`w-2 h-2 rounded-full ${order.status === 'COMPLETED' ? 'bg-green-500' : 'bg-amber-500'}`} />
                                    <div>
                                        <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            #{order.order_number}
                                        </p>
                                        <p className={`text-xs font-light ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`text-sm font-light ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        GHS {order.total_amount}
                                    </p>
                                    <p className={`text-xs font-light capitalize ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                                        {(order.status || '').toLowerCase()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={`py-16 text-center`}>
                        <svg className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-slate-700' : 'text-gray-200'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                        <p className={`text-sm font-light ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>No orders yet</p>
                        <Link href="/products" className={`inline-block mt-4 text-xs border-b pb-0.5 ${isDark ? 'border-pink-400 text-pink-400' : 'border-pink-600 text-pink-600'}`}>
                            Start shopping
                        </Link>
                    </div>
                )}
            </div>

            {/* Activity Timeline */}
            <div>
                <h3 className={`text-sm font-medium uppercase tracking-wide mb-4 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Recent Activity</h3>
                <div className={`${isDark ? '' : ''}`}>
                    {orders.length > 0 ? (
                        <div className="relative pl-6">
                            {/* Timeline line */}
                            <div className={`absolute left-[3px] top-1 bottom-1 w-px ${isDark ? 'bg-slate-800' : 'bg-gray-200'}`}></div>

                            <div className="space-y-5">
                                {orders.slice(0, 4).map((order: any) => {
                                    const date = new Date(order.created_at);
                                    const isCompleted = order.status === 'COMPLETED';
                                    const timeAgo = getTimeAgo(date);

                                    return (
                                        <div key={order.order_number} className="flex gap-4 relative">
                                            {/* Timeline dot */}
                                            <div className={`absolute -left-6 top-1 w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-amber-500'}`} />
                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm font-light ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                    {isCompleted ? 'Order delivered' : 'Order placed'}
                                                    <span className="font-normal"> #{order.order_number}</span>
                                                </p>
                                                <p className={`text-xs font-light ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                                                    {timeAgo} · GHS {order.total_amount}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <p className={`text-sm font-light text-center py-8 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                            No activity yet
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

const OrdersView = ({ orders, theme }: { orders: Order[]; theme: string }) => {
    const isDark = theme === 'dark';
    const [filter, setFilter] = useState('ALL');

    const filteredOrders = filter === 'ALL' ? orders : orders.filter((o: Order) => o.status === filter);

    return (
        <div className="space-y-10">
            <div className={`border-b pb-4 ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <h2 className={`text-2xl font-light tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Orders
                    </h2>
                    <div className="flex items-center gap-4">
                        {['ALL', 'PENDING', 'COMPLETED'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`text-xs uppercase tracking-wide transition-colors ${filter === status
                                    ? `${isDark ? 'text-white' : 'text-gray-900'} font-medium`
                                    : `${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-gray-400 hover:text-gray-600'} font-light`
                                    }`}
                            >
                                {status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-gray-100'}`}>
                {filteredOrders.length === 0 ? (
                    <div className="text-center py-20">
                        <svg className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-slate-700' : 'text-gray-200'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                        <p className={`text-sm font-light ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>No orders found</p>
                    </div>
                ) : (
                    filteredOrders.map((order: Order) => (
                        <div key={order.order_number} className="py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className={`w-2 h-2 rounded-full ${order.status === 'COMPLETED' ? 'bg-green-500' : order.status === 'PENDING' ? 'bg-amber-500' : 'bg-gray-400'}`} />
                                <div>
                                    <p className={`font-light ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        Order #{order.order_number}
                                    </p>
                                    <p className={`text-xs font-light ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                                        {new Date(order.created_at).toLocaleDateString()} · {order.items?.length || 0} items
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-6">
                                <p className={`font-light ${isDark ? 'text-white' : 'text-gray-900'}`}>GHS {order.total_amount}</p>
                                <span className={`text-xs font-light capitalize ${order.status === 'COMPLETED' ? 'text-green-600 dark:text-green-400' : order.status === 'PENDING' ? 'text-amber-600 dark:text-amber-400' : 'text-gray-500'}`}>
                                    {(order.status || '').toLowerCase()}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

// Placeholder View
const PlaceholderView = ({ title, icon, theme }: { title: string; icon: React.ReactNode; theme: string }) => {
    const isDark = theme === 'dark';
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <div className={`mb-6 ${isDark ? 'text-slate-700' : 'text-gray-200'}`}>
                <div className="w-16 h-16">
                    {icon}
                </div>
            </div>
            <h2 className={`text-xl font-light tracking-tight mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</h2>
            <p className={`text-sm font-light max-w-sm ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                This feature is coming soon. We&apos;re working on making your {(title || '').toLowerCase()} experience even better.
            </p>
        </div>
    );
};

// Address interface
interface Address {
    id: string;
    label: string;
    city: string;
    area: string;
    landmark: string;
    phone: string;
    isDefault: boolean;
}

// Addresses View
const AddressesView = ({ theme }: { theme: string }) => {
    const isDark = theme === 'dark';
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ label: '', city: '', area: '', landmark: '', phone: '' });

    // Load from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('user-addresses');
        if (saved) setAddresses(JSON.parse(saved));
    }, []);

    // Save to localStorage
    const saveAddresses = (newAddresses: Address[]) => {
        setAddresses(newAddresses);
        localStorage.setItem('user-addresses', JSON.stringify(newAddresses));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            saveAddresses(addresses.map(a => a.id === editingId ? { ...formData, id: editingId, isDefault: a.isDefault } : a));
        } else {
            const newAddress: Address = { ...formData, id: Date.now().toString(), isDefault: addresses.length === 0 };
            saveAddresses([...addresses, newAddress]);
        }
        setFormData({ label: '', city: '', area: '', landmark: '', phone: '' });
        setShowForm(false);
        setEditingId(null);
    };

    const handleDelete = (id: string) => {
        saveAddresses(addresses.filter(a => a.id !== id));
    };

    const setDefault = (id: string) => {
        saveAddresses(addresses.map(a => ({ ...a, isDefault: a.id === id })));
    };

    const inputClass = `w-full px-4 py-3 rounded-lg border outline-none transition-colors text-sm ${isDark
        ? 'bg-slate-900 border-slate-700 text-white focus:border-pink-500 placeholder:text-slate-600'
        : 'bg-white border-gray-200 text-gray-900 focus:border-pink-500 placeholder:text-gray-400'
        }`;

    return (
        <div className="space-y-8">
            <div className={`border-b pb-4 ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
                <div className="flex items-end justify-between">
                    <h2 className={`text-2xl font-light tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Addresses
                    </h2>
                    {!showForm && (
                        <button
                            onClick={() => setShowForm(true)}
                            className={`text-xs font-light border-b pb-0.5 transition-colors ${isDark ? 'border-pink-400 text-pink-400' : 'border-pink-600 text-pink-600'}`}
                        >
                            + Add address
                        </button>
                    )}
                </div>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className={`p-6 rounded-xl border ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-gray-200 bg-gray-50'}`}>
                    <h3 className={`text-sm font-medium uppercase tracking-wide mb-4 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                        {editingId ? 'Edit Address' : 'New Address'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" placeholder="Label (e.g., Home, Office)" value={formData.label} onChange={e => setFormData({ ...formData, label: e.target.value })} className={inputClass} required />
                        <input type="text" placeholder="City" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} className={inputClass} required />
                        <input type="text" placeholder="Area / Neighborhood" value={formData.area} onChange={e => setFormData({ ...formData, area: e.target.value })} className={inputClass} required />
                        <input type="text" placeholder="Landmark" value={formData.landmark} onChange={e => setFormData({ ...formData, landmark: e.target.value })} className={inputClass} />
                        <input type="tel" placeholder="Phone Number" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className={inputClass} required />
                    </div>
                    <div className="flex gap-3 mt-6">
                        <button type="submit" className="px-5 py-2.5 bg-pink-600 text-white text-sm font-medium rounded-lg hover:bg-pink-700 transition-colors">
                            {editingId ? 'Update' : 'Save Address'}
                        </button>
                        <button type="button" onClick={() => { setShowForm(false); setEditingId(null); setFormData({ label: '', city: '', area: '', landmark: '', phone: '' }); }} className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {addresses.length === 0 && !showForm ? (
                <div className="text-center py-16">
                    <svg className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-slate-700' : 'text-gray-200'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    <p className={`text-sm font-light ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>No saved addresses</p>
                    <button onClick={() => setShowForm(true)} className={`mt-4 text-xs border-b pb-0.5 ${isDark ? 'border-pink-400 text-pink-400' : 'border-pink-600 text-pink-600'}`}>
                        Add your first address
                    </button>
                </div>
            ) : (
                <div className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-gray-100'}`}>
                    {addresses.map(address => (
                        <div key={address.id} className="py-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <p className={`font-light ${isDark ? 'text-white' : 'text-gray-900'}`}>{address.label}</p>
                                    {address.isDefault && (
                                        <span className={`text-[10px] uppercase tracking-wide px-2 py-0.5 rounded ${isDark ? 'bg-pink-900/30 text-pink-400' : 'bg-pink-50 text-pink-600'}`}>Default</span>
                                    )}
                                </div>
                                <p className={`text-sm font-light mt-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                    {address.area}, {address.city}
                                    {address.landmark && ` · Near ${address.landmark}`}
                                </p>
                                <p className={`text-xs font-light mt-1 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>{address.phone}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                {!address.isDefault && (
                                    <button onClick={() => setDefault(address.id)} className={`text-xs font-light ${isDark ? 'text-slate-500 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`}>Set default</button>
                                )}
                                <button onClick={() => { setFormData({ label: address.label, city: address.city, area: address.area, landmark: address.landmark, phone: address.phone }); setEditingId(address.id); setShowForm(true); }} className={`text-xs font-light ${isDark ? 'text-slate-500 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`}>Edit</button>
                                <button onClick={() => handleDelete(address.id)} className="text-xs font-light text-red-500 hover:text-red-400">Remove</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Wallet View
const WalletView = ({ theme }: { theme: string }) => {
    const isDark = theme === 'dark';
    const [paymentMethods, setPaymentMethods] = useState<{ id: string; type: string; number: string; isDefault: boolean }[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('user-payment-methods');
        if (saved) setPaymentMethods(JSON.parse(saved));
    }, []);

    const savePaymentMethods = (methods: { id: string; type: string; number: string; isDefault: boolean }[]) => {
        setPaymentMethods(methods);
        localStorage.setItem('user-payment-methods', JSON.stringify(methods));
    };

    const handleAddMomo = (e: React.FormEvent) => {
        e.preventDefault();
        const newMethod = { id: Date.now().toString(), type: 'momo', number: phoneNumber, isDefault: paymentMethods.length === 0 };
        savePaymentMethods([...paymentMethods, newMethod]);
        setPhoneNumber('');
        setShowForm(false);
    };

    const handleDelete = (id: string) => {
        savePaymentMethods(paymentMethods.filter(m => m.id !== id));
    };

    const setDefault = (id: string) => {
        savePaymentMethods(paymentMethods.map(m => ({ ...m, isDefault: m.id === id })));
    };

    const maskNumber = (num: string) => num.slice(0, 3) + ' *** ' + num.slice(-3);

    return (
        <div className="space-y-8">
            <div className={`border-b pb-4 ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
                <div className="flex items-end justify-between">
                    <h2 className={`text-2xl font-light tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Payment Methods
                    </h2>
                    {!showForm && (
                        <button onClick={() => setShowForm(true)} className={`text-xs font-light border-b pb-0.5 transition-colors ${isDark ? 'border-pink-400 text-pink-400' : 'border-pink-600 text-pink-600'}`}>
                            + Add MoMo
                        </button>
                    )}
                </div>
            </div>

            {showForm && (
                <form onSubmit={handleAddMomo} className={`p-6 rounded-xl border ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-gray-200 bg-gray-50'}`}>
                    <h3 className={`text-sm font-medium uppercase tracking-wide mb-4 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Add Mobile Money</h3>
                    <input
                        type="tel"
                        placeholder="Mobile Money Number (e.g., 024 XXX XXXX)"
                        value={phoneNumber}
                        onChange={e => setPhoneNumber(e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border outline-none transition-colors text-sm ${isDark ? 'bg-slate-900 border-slate-700 text-white focus:border-pink-500' : 'bg-white border-gray-200 text-gray-900 focus:border-pink-500'}`}
                        required
                    />
                    <div className="flex gap-3 mt-4">
                        <button type="submit" className="px-5 py-2.5 bg-pink-600 text-white text-sm font-medium rounded-lg hover:bg-pink-700 transition-colors">Save</button>
                        <button type="button" onClick={() => setShowForm(false)} className={`px-5 py-2.5 text-sm font-medium rounded-lg ${isDark ? 'text-slate-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>Cancel</button>
                    </div>
                </form>
            )}

            {paymentMethods.length === 0 && !showForm ? (
                <div className="text-center py-16">
                    <svg className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-slate-700' : 'text-gray-200'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                    </svg>
                    <p className={`text-sm font-light ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>No payment methods saved</p>
                    <button onClick={() => setShowForm(true)} className={`mt-4 text-xs border-b pb-0.5 ${isDark ? 'border-pink-400 text-pink-400' : 'border-pink-600 text-pink-600'}`}>
                        Add Mobile Money
                    </button>
                </div>
            ) : (
                <div className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-gray-100'}`}>
                    {paymentMethods.map(method => (
                        <div key={method.id} className="py-5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-yellow-900/30' : 'bg-yellow-50'}`}>
                                    <svg className="w-5 h-5 text-yellow-600" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className={`font-light ${isDark ? 'text-white' : 'text-gray-900'}`}>Mobile Money</p>
                                        {method.isDefault && (
                                            <span className={`text-[10px] uppercase tracking-wide px-2 py-0.5 rounded ${isDark ? 'bg-pink-900/30 text-pink-400' : 'bg-pink-50 text-pink-600'}`}>Default</span>
                                        )}
                                    </div>
                                    <p className={`text-sm font-light ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>{maskNumber(method.number)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                {!method.isDefault && (
                                    <button onClick={() => setDefault(method.id)} className={`text-xs font-light ${isDark ? 'text-slate-500 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`}>Set default</button>
                                )}
                                <button onClick={() => handleDelete(method.id)} className="text-xs font-light text-red-500 hover:text-red-400">Remove</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Wishlist View (uses existing store)
const WishlistViewComponent = ({ theme }: { theme: string }) => {
    const isDark = theme === 'dark';
    const { items } = useWishlistStore();

    return (
        <div className="space-y-8">
            <div className={`border-b pb-4 ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
                <div className="flex items-end justify-between">
                    <h2 className={`text-2xl font-light tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Wishlist
                        <sup className={`ml-2 text-sm font-light ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>{items.length}</sup>
                    </h2>
                    {items.length > 0 && (
                        <Link href="/wishlist" className={`text-xs font-light border-b pb-0.5 transition-colors ${isDark ? 'border-slate-500 text-slate-400 hover:text-white hover:border-white' : 'border-gray-400 text-gray-500 hover:text-gray-900 hover:border-gray-900'}`}>
                            View full page
                        </Link>
                    )}
                </div>
            </div>

            {items.length === 0 ? (
                <div className="text-center py-16">
                    <svg className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-slate-700' : 'text-gray-200'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                    <p className={`text-sm font-light ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Your wishlist is empty</p>
                    <Link href="/products" className={`inline-block mt-4 text-xs border-b pb-0.5 ${isDark ? 'border-pink-400 text-pink-400' : 'border-pink-600 text-pink-600'}`}>
                        Start shopping
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {items.slice(0, 8).map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};


const SettingsView = ({ user, theme }: { user: User; theme: string }) => {
    const isDark = theme === 'dark';
    const [notifications, setNotifications] = useState({
        orders: true,
        promotions: true,
        newsletter: false
    });

    const inputClass = `w-full px-4 py-3 rounded-lg border outline-none transition-colors text-sm ${isDark
        ? 'bg-slate-900 border-slate-700 text-white focus:border-pink-500 placeholder:text-slate-600'
        : 'bg-white border-gray-200 text-gray-900 focus:border-pink-500 placeholder:text-gray-400'
        }`;


    return (
        <div className="space-y-10">
            {/* Header */}
            <div className={`border-b pb-4 ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
                <h2 className={`text-2xl font-light tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Settings
                </h2>
            </div>

            {/* Personal Information */}
            <div>
                <h3 className={`text-sm font-medium uppercase tracking-wide mb-4 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                    Personal Information
                </h3>
                <div className={`p-6 rounded-xl border ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className={`block text-xs font-light mb-2 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>First Name</label>
                            <input type="text" defaultValue={user.first_name} className={inputClass} />
                        </div>
                        <div>
                            <label className={`block text-xs font-light mb-2 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Last Name</label>
                            <input type="text" defaultValue={user.last_name} className={inputClass} />
                        </div>
                        <div>
                            <label className={`block text-xs font-light mb-2 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Email Address</label>
                            <input type="email" defaultValue={user.email} className={`${inputClass} cursor-not-allowed opacity-60`} readOnly />
                        </div>
                        <div>
                            <label className={`block text-xs font-light mb-2 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Phone Number</label>
                            <input type="tel" defaultValue={user.phone || ''} placeholder="Add phone number" className={inputClass} />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <button className="px-5 py-2.5 bg-pink-600 text-white text-sm font-medium rounded-lg hover:bg-pink-700 transition-colors">
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>

            {/* Notifications */}
            <div>
                <h3 className={`text-sm font-medium uppercase tracking-wide mb-4 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                    Notifications
                </h3>
                <div className={`px-6 rounded-xl border divide-y ${isDark ? 'border-slate-800 divide-slate-800' : 'border-gray-200 divide-gray-100'}`}>
                    <ToggleSwitch
                        enabled={notifications.orders}
                        onChange={() => setNotifications({ ...notifications, orders: !notifications.orders })}
                        label="Order updates"
                        description="Receive notifications about your order status"
                        isDark={isDark}
                    />
                    <ToggleSwitch
                        enabled={notifications.promotions}
                        onChange={() => setNotifications({ ...notifications, promotions: !notifications.promotions })}
                        label="Promotions & offers"
                        description="Get notified about sales and special deals"
                        isDark={isDark}
                    />
                    <ToggleSwitch
                        enabled={notifications.newsletter}
                        onChange={() => setNotifications({ ...notifications, newsletter: !notifications.newsletter })}
                        label="Newsletter"
                        description="Weekly updates on new arrivals"
                        isDark={isDark}
                    />
                </div>
            </div>

            {/* Security */}
            <div>
                <h3 className={`text-sm font-medium uppercase tracking-wide mb-4 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                    Security
                </h3>
                <div className={`rounded-xl border ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
                    <Link
                        href="/reset-password"
                        className={`flex items-center justify-between p-5 transition-colors ${isDark ? 'hover:bg-slate-800/50' : 'hover:bg-gray-50'}`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`}>
                                <svg className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                </svg>
                            </div>
                            <div>
                                <p className={`font-light ${isDark ? 'text-white' : 'text-gray-900'}`}>Change Password</p>
                                <p className={`text-xs font-light ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Update your password securely</p>
                            </div>
                        </div>
                        <svg className={`w-5 h-5 ${isDark ? 'text-slate-600' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </Link>
                </div>
            </div>

            {/* Danger Zone */}
            <div>
                <h3 className={`text-sm font-medium uppercase tracking-wide mb-4 text-red-500`}>
                    Danger Zone
                </h3>
                <div className={`p-6 rounded-xl border ${isDark ? 'border-red-900/50 bg-red-900/10' : 'border-red-100 bg-red-50/50'}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <p className={`font-light ${isDark ? 'text-white' : 'text-gray-900'}`}>Delete Account</p>
                            <p className={`text-xs font-light ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Permanently delete your account and all data</p>
                        </div>
                        <button className="px-5 py-2.5 text-sm font-medium rounded-lg border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

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
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
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
                        {activeTab === 'addresses' && <AddressesView theme={theme} />}
                        {activeTab === 'wallet' && <WalletView theme={theme} />}
                        {activeTab === 'wishlist' && <WishlistViewComponent theme={theme} />}
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
