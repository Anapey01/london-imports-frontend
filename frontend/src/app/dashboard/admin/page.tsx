/**
 * London's Imports - Admin Dashboard Overview
 * Main admin dashboard with stats and recent activity
 */
'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/providers/ThemeProvider';
import { adminAPI } from '@/lib/api';
import Link from 'next/link';

export default function AdminDashboardPage() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        newUsersToday: 0,
        storageProvider: '',
    });
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [recentUsers, setRecentUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                // Fetch real stats from backend
                const statsResponse = await adminAPI.stats();
                const statsData = statsResponse.data;

                setStats({
                    totalUsers: statsData.total_users || 0,
                    totalOrders: statsData.total_orders || 0,
                    totalProducts: statsData.total_products || 0,
                    totalRevenue: statsData.total_revenue || 0,
                    pendingOrders: statsData.pending_orders || 0,
                    newUsersToday: statsData.new_users_today || 0,
                    storageProvider: statsData.storage_provider || 'Unknown',
                });

                // Fetch recent orders
                const ordersResponse = await adminAPI.orders({ limit: 5 });
                setRecentOrders(ordersResponse.data.results || ordersResponse.data || []);

                // Fetch recent users
                const usersResponse = await adminAPI.users({ limit: 5, ordering: '-date_joined' });
                setRecentUsers(usersResponse.data.results || usersResponse.data || []);

            } catch (err: any) {
                console.error('Failed to load admin stats:', err);
                setError('Failed to load dashboard data. Please check your connection.');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const statCards = [
        { label: 'Total Users', value: stats.totalUsers, icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', color: 'blue', change: `+${stats.newUsersToday} today` },
        { label: 'Total Orders', value: stats.totalOrders, icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', color: 'green', change: `${stats.pendingOrders} pending` },
        { label: 'Total Products', value: stats.totalProducts, icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', color: 'purple', change: 'Active listings' },
        { label: 'Total Revenue', value: `GHS ${stats.totalRevenue.toLocaleString()}`, icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'pink', change: 'This month' },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED': return isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-600';
            case 'PENDING': return isDark ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-600';
            case 'PROCESSING': return isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600';
            case 'CANCELLED': return isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-600';
            default: return isDark ? 'bg-slate-700 text-slate-400' : 'bg-gray-100 text-gray-600';
        }
    };

    const getColorClass = (color: string) => {
        const colors: Record<string, string> = {
            blue: isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600',
            green: isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-600',
            purple: isDark ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600',
            pink: isDark ? 'bg-pink-900/30 text-pink-400' : 'bg-pink-100 text-pink-600',
        };
        return colors[color] || colors.blue;
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className={`h-32 rounded-xl animate-pulse ${isDark ? 'bg-slate-800' : 'bg-gray-200'}`}></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* System Status Alert */}
            {stats.storageProvider && (
                <div className={`p-4 rounded-lg flex items-center justify-between ${stats.storageProvider.includes('Cloudinary')
                        ? (isDark ? 'bg-green-900/20 text-green-400 border border-green-900/50' : 'bg-green-50 text-green-700 border border-green-100')
                        : (isDark ? 'bg-red-900/20 text-red-400 border border-red-900/50' : 'bg-red-50 text-red-700 border border-red-100')
                    }`}>
                    <div className="flex items-center gap-3">
                        <span className="text-xl">{stats.storageProvider.includes('Cloudinary') ? '☁️' : '⚠️'}</span>
                        <div>
                            <p className="font-semibold">Image Storage System</p>
                            <p className="text-sm opacity-90">{stats.storageProvider}</p>
                        </div>
                    </div>
                    {!stats.storageProvider.includes('Cloudinary') && (
                        <span className="text-xs bg-red-600 text-white px-3 py-1 rounded-full animate-pulse">
                            Action Required in Render Env
                        </span>
                    )}
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <div
                        key={index}
                        className={`p-6 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-100'} shadow-sm`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getColorClass(stat.color)}`}>
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} />
                                </svg>
                            </div>
                        </div>
                        <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{stat.label}</p>
                        <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>{stat.change}</p>
                    </div>
                ))}
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Orders */}
                <div className={`rounded-xl border overflow-hidden ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-100'}`}>
                    <div className={`px-6 py-4 border-b flex items-center justify-between ${isDark ? 'border-slate-700' : 'border-gray-100'}`}>
                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Recent Orders</h3>
                        <Link href="/dashboard/admin/orders" className="text-sm text-pink-500 hover:text-pink-600">View all →</Link>
                    </div>
                    <div className="divide-y divide-slate-700">
                        {recentOrders.map((order) => (
                            <div key={order.id} className={`px-6 py-4 flex items-center justify-between ${isDark ? 'divide-slate-700' : 'divide-gray-100'}`}>
                                <div>
                                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>#{order.order_number}</p>
                                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{order.customer}</p>
                                </div>
                                <div className="text-right">
                                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>GHS {order.total}</p>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Users */}
                <div className={`rounded-xl border overflow-hidden ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-100'}`}>
                    <div className={`px-6 py-4 border-b flex items-center justify-between ${isDark ? 'border-slate-700' : 'border-gray-100'}`}>
                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Recent Users</h3>
                        <Link href="/dashboard/admin/users" className="text-sm text-pink-500 hover:text-pink-600">View all →</Link>
                    </div>
                    <div className="divide-y divide-slate-700">
                        {recentUsers.map((user) => (
                            <div key={user.id} className={`px-6 py-4 flex items-center justify-between ${isDark ? 'divide-slate-700' : 'divide-gray-100'}`}>
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${isDark ? 'bg-slate-700 text-white' : 'bg-gray-100 text-gray-700'}`}>
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{user.name}</p>
                                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{user.email}</p>
                                    </div>
                                </div>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${user.role === 'VENDOR'
                                    ? isDark ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600'
                                    : isDark ? 'bg-slate-700 text-slate-400' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                    {user.role}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className={`rounded-xl border p-6 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-100'}`}>
                <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Quick Actions</h3>
                <div className="flex flex-wrap gap-3">
                    <Link href="/dashboard/admin/users" className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors">
                        Manage Users
                    </Link>
                    <Link href="/dashboard/admin/orders" className="px-4 py-2 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition-colors">
                        View Orders
                    </Link>
                    <Link href="/dashboard/admin/products" className="px-4 py-2 rounded-lg bg-purple-500 text-white text-sm font-medium hover:bg-purple-600 transition-colors">
                        Manage Products
                    </Link>
                    <Link href="/dashboard/admin/analytics" className="px-4 py-2 rounded-lg bg-pink-500 text-white text-sm font-medium hover:bg-pink-600 transition-colors">
                        View Analytics
                    </Link>
                </div>
            </div>
        </div>
    );
}
