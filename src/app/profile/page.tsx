/**
 * London's Imports - Premium User Profile
 * High-end design with glassmorphism, tabs, and transitions
 */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/providers/ThemeProvider';
import { useAuthStore } from '@/stores/authStore';
import { ordersAPI } from '@/lib/api';
import Link from 'next/link';

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
// Polished Minimal Profile Header with Avatar Upload
const ProfileHeader = ({ user, isDark }: any) => {
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
                // Save to localStorage for persistence
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

    const InfoRow = () => (
        <div className={`mt-2 flex flex-wrap items-center gap-3 text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
            <a href={`mailto:${user.email}`} className="flex items-center gap-1.5 hover:text-pink-500 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                {user.email}
            </a>
            {user.phone && (
                <>
                    <span className="opacity-30">•</span>
                    <span className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                        {user.phone}
                    </span>
                </>
            )}
            {user.city && (
                <>
                    <span className="opacity-30">•</span>
                    <span className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                        {user.city}
                    </span>
                </>
            )}
        </div>
    );

    return (
        <div className={`w-full border-b ${isDark ? 'bg-gradient-to-b from-slate-900 to-slate-900/95 border-slate-800' : 'bg-gradient-to-b from-gray-50/80 to-white border-gray-100'} transition-all`}>
            <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

                    {/* Avatar with Upload */}
                    <div className="flex flex-col items-center gap-1.5">
                        <div className="relative group">
                            {/* Hidden file input */}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarUpload}
                                className="hidden"
                                id="avatar-upload"
                            />
                            {/* Avatar Display */}
                            <label
                                htmlFor="avatar-upload"
                                className="cursor-pointer block rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                            >
                                <div className={`h-16 w-16 sm:h-20 sm:w-20 rounded-full flex items-center justify-center overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-gray-100'} transition-transform group-hover:scale-105`}>
                                    {avatarUrl ? (
                                        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <svg className={`w-8 h-8 sm:w-10 sm:h-10 ${isDark ? 'text-slate-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                                    )}
                                </div>
                                {/* Camera overlay on hover */}
                                <div className={`absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? 'bg-black/50' : 'bg-black/40'}`}>
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                </div>
                            </label>
                            {/* Info toggle button */}
                            <button
                                onClick={() => setShowInfo(!showInfo)}
                                className={`absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center border-2 shadow-sm transition-transform ${isDark ? 'bg-slate-800 border-slate-900 text-slate-400' : 'bg-white border-gray-50 text-gray-400'} ${showInfo ? 'rotate-180' : ''}`}
                                style={{ outline: 'none' }}
                            >
                                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                            </button>
                        </div>
                        <span className={`text-[11px] font-medium ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                            Edit profile
                        </span>
                    </div>

                    {/* User Info */}
                    <div className="flex-1 text-center sm:text-left min-w-0">
                        <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-2 sm:gap-3">
                            <h1 className={`text-xl sm:text-2xl font-semibold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {user.first_name} {user.last_name}
                            </h1>
                            <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide ${user.role === 'VENDOR'
                                    ? 'bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400'
                                    : 'bg-gray-100 text-gray-500 dark:bg-slate-700 dark:text-slate-400'
                                    }`}>
                                    {user.role}
                                </span>
                                <span className={`text-[11px] ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                                    · Member since {memberSince}
                                </span>
                            </div>
                        </div>

                        {!showInfo ? (
                            <button
                                onClick={() => setShowInfo(true)}
                                className={`mt-2 text-sm flex items-center gap-1 ${isDark ? 'text-slate-500 hover:text-slate-400' : 'text-gray-400 hover:text-gray-600'} transition-colors`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                View contact info
                            </button>
                        ) : (
                            <InfoRow />
                        )}
                    </div>

                    {/* CTA Button */}
                    <div className="mt-2 sm:mt-1">
                        {user.role === 'VENDOR' ? (
                            <Link
                                href="/dashboard/vendor"
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${isDark ? 'bg-white text-gray-900 hover:bg-gray-100' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                                Dashboard
                            </Link>
                        ) : (user.role === 'ADMIN' || user.is_staff || user.is_superuser) ? (
                            <Link
                                href="/dashboard/admin"
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${isDark ? 'bg-white text-gray-900 hover:bg-gray-100' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                Admin Dashboard
                            </Link>
                        ) : (
                            <Link
                                href="/register/vendor"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-medium shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-[1.02] transition-all"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                Start Selling
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Sidebar Navigation Component
const SidebarNav = ({ activeTab, setActiveTab, isDark, handleLogout }: any) => {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
        { id: 'orders', label: 'Orders', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
        { id: 'addresses', label: 'Addresses', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z' },
        { id: 'wallet', label: 'Wallet', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
        { id: 'wishlist', label: 'Wishlist', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
        { id: 'settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z' },
        { id: 'support', label: 'Support', icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z' },
    ];

    return (
        <div className={`w-full lg:w-48 shrink-0 py-4 lg:pr-6 lg:border-r ${isDark ? 'border-slate-800' : 'border-gray-100'}`}>
            <nav className="space-y-1">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${activeTab === item.id
                            ? `${isDark ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-900'} font-medium`
                            : `${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800/50' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`
                            }`}
                    >
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                        </svg>
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className={`my-4 border-t ${isDark ? 'border-slate-800' : 'border-gray-100'}`}></div>

            <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
            >
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
            </button>
        </div>
    );
};

const DashboardView = ({ orders, theme }: any) => {
    const isDark = theme === 'dark';
    const totalSpent = orders.reduce((acc: number, o: any) => acc + parseFloat(o.total_amount || '0'), 0);
    const pendingCount = orders.filter((o: any) => o.status === 'PENDING').length;
    const completedCount = orders.filter((o: any) => o.status === 'COMPLETED').length;
    const recentOrders = orders.slice(0, 5);

    return (
        <div className="space-y-6">
            {/* Page Title */}
            <div>
                <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Overview</h2>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className={`p-4 rounded-lg border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-100'}`}>
                    <p className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{orders.length}</p>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Total Orders</p>
                </div>
                <div className={`p-4 rounded-lg border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-100'}`}>
                    <p className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{pendingCount}</p>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Pending</p>
                </div>
                <div className={`p-4 rounded-lg border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-100'}`}>
                    <p className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{completedCount}</p>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Completed</p>
                </div>
                <div className={`p-4 rounded-lg border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-100'}`}>
                    <p className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>GHS {totalSpent.toFixed(0)}</p>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Total Spent</p>
                </div>
            </div>

            {/* Recent Orders */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h3 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Recent Orders</h3>
                    {orders.length > 5 && (
                        <button className={`text-xs ${isDark ? 'text-slate-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>
                            View all →
                        </button>
                    )}
                </div>

                {recentOrders.length > 0 ? (
                    <div className={`rounded-lg border divide-y ${isDark ? 'bg-slate-800/50 border-slate-700 divide-slate-700' : 'bg-white border-gray-100 divide-gray-50'}`}>
                        {recentOrders.map((order: any) => (
                            <div key={order.order_number} className="flex items-center justify-between px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${order.status === 'COMPLETED'
                                        ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                                        : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                                        }`}>
                                        {order.status === 'COMPLETED' ? '✓' : '⏳'}
                                    </div>
                                    <div>
                                        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            #{order.order_number}
                                        </p>
                                        <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        GHS {order.total_amount}
                                    </p>
                                    <p className={`text-xs capitalize ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                                        {(order.status || '').toLowerCase()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={`py-12 text-center rounded-lg border border-dashed ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                        <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>No orders yet</p>
                    </div>
                )}
            </div>

            {/* Activity Timeline */}
            <div>
                <h3 className={`text-sm font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Recent Activity</h3>
                <div className={`rounded-lg border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-100'} p-4`}>
                    {orders.length > 0 ? (
                        <div className="relative">
                            {/* Timeline line */}
                            <div className={`absolute left-3 top-2 bottom-2 w-px ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`}></div>

                            <div className="space-y-4">
                                {orders.slice(0, 4).map((order: any, index: number) => {
                                    const date = new Date(order.created_at);
                                    const isCompleted = order.status === 'COMPLETED';
                                    const timeAgo = getTimeAgo(date);

                                    return (
                                        <div key={order.order_number} className="flex gap-4 relative">
                                            {/* Timeline dot */}
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 ${isCompleted
                                                ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                                                : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                                                }`}>
                                                {isCompleted ? (
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                ) : (
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" /></svg>
                                                )}
                                            </div>
                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                    {isCompleted ? 'Order delivered' : 'Order placed'}
                                                    <span className={`font-medium`}> #{order.order_number}</span>
                                                </p>
                                                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                                                    {timeAgo} • GHS {order.total_amount}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <p className={`text-sm text-center py-4 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                            No activity yet
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

const OrdersView = ({ orders, theme }: any) => {
    const isDark = theme === 'dark';
    const [filter, setFilter] = useState('ALL');

    const filteredOrders = filter === 'ALL' ? orders : orders.filter((o: any) => o.status === filter);

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>My Orders</h2>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Track and manage your purchases.</p>
                </div>

                <div className={`flex p-1 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`}>
                    {['ALL', 'PENDING', 'COMPLETED'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === status
                                ? 'bg-white text-gray-900 shadow-sm dark:bg-slate-700 dark:text-white'
                                : 'text-gray-500 hover:text-gray-900 dark:text-gray-400'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                    <div className="text-center py-20">
                        <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>No orders found.</p>
                    </div>
                ) : (
                    filteredOrders.map((order: any) => (
                        <div key={order.order_number} className={`group p-6 rounded-2xl border transition-all duration-300 hover:shadow-md ${isDark ? 'bg-slate-800 border-slate-700 hover:border-slate-600' : 'bg-white border-gray-100 hover:border-pink-100'}`}>
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center font-bold ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                                        order.status === 'PENDING' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' :
                                            'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-400'
                                        }`}>
                                        {order.status === 'COMPLETED' ? '✓' : '⟳'}
                                    </div>
                                    <div>
                                        <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Order #{order.order_number}</p>
                                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                            {new Date(order.created_at).toLocaleDateString()} • {order.items?.length || 0} Items
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-6">
                                    <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>GHS {order.total_amount}</p>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                        order.status === 'PENDING' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                            'bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-slate-300'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

// Placeholder View
const PlaceholderView = ({ title, icon, theme }: any) => {
    const isDark = theme === 'dark';
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] animate-fade-in-up text-center p-8">
            <div className={`p-6 rounded-full mb-6 ${isDark ? 'bg-slate-800' : 'bg-gray-50'}`}>
                <div className={`w-12 h-12 ${isDark ? 'text-slate-500' : 'text-gray-300'}`}>
                    {icon}
                </div>
            </div>
            <h2 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</h2>
            <p className={`max-w-md ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>This section is under construction. Soon you'll be able to manage your {(title || '').toLowerCase()} here.</p>
            <button className="mt-8 px-6 py-2 rounded-full border border-dashed border-gray-300 text-sm font-medium text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-colors">
                Coming Soon
            </button>
        </div>
    );
};

const SettingsView = ({ user, theme }: any) => {
    const isDark = theme === 'dark';
    const inputClass = `w-full px-4 py-3 rounded-xl border outline-none transition-colors ${isDark
        ? 'bg-slate-900 border-slate-700 text-white focus:border-pink-500'
        : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-pink-500'
        }`;
    const labelClass = `block text-xs font-bold uppercase tracking-wide mb-2 ${isDark ? 'text-slate-400' : 'text-gray-500'}`;

    return (
        <div className="animate-fade-in-up">
            <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Account Settings</h2>

            <div className={`rounded-3xl p-8 border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
                <h3 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={labelClass}>First Name</label>
                        <input type="text" defaultValue={user.first_name} className={inputClass} readOnly />
                    </div>
                    <div>
                        <label className={labelClass}>Last Name</label>
                        <input type="text" defaultValue={user.last_name} className={inputClass} readOnly />
                    </div>
                    <div>
                        <label className={labelClass}>Email Address</label>
                        <input type="email" defaultValue={user.email} className={inputClass} readOnly />
                    </div>
                    <div>
                        <label className={labelClass}>Phone</label>
                        <input type="tel" defaultValue={user.phone} className={inputClass} readOnly />
                    </div>
                </div>
                <div className="mt-8 flex justify-end">
                    <button className="px-6 py-3 bg-pink-500 text-white font-bold rounded-xl hover:bg-pink-600 transition-colors shadow-lg shadow-pink-500/30">
                        Save Changes
                    </button>
                </div>
            </div>

            <div className={`mt-8 rounded-3xl p-8 border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
                <h3 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Security</h3>
                <button className="w-full flex items-center justify-between p-4 rounded-xl border border-dashed border-gray-300 dark:border-slate-700 text-left hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                    <div>
                        <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Change Password</p>
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Update your password securely</p>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
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

                        {/* Placeholders */}
                        {activeTab === 'addresses' && <PlaceholderView title="Addresses" theme={theme} icon={<svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} />}
                        {activeTab === 'wallet' && <PlaceholderView title="Wallet" theme={theme} icon={<svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>} />}
                        {activeTab === 'wishlist' && <PlaceholderView title="Wishlist" theme={theme} icon={<svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>} />}
                        {activeTab === 'support' && <PlaceholderView title="Support" theme={theme} icon={<svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>} />}
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
