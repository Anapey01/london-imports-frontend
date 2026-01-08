/**
 * London's Imports - Admin Dashboard Overview
 * Mobile-first admin dashboard with stats and recent activity
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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
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

                const ordersResponse = await adminAPI.orders({ limit: 5 });
                setRecentOrders(ordersResponse.data.results || ordersResponse.data || []);
            } catch (err: any) {
                console.error('Failed to load admin stats:', err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const statCards = [
        {
            label: 'Users',
            value: stats.totalUsers,
            subtitle: `+${stats.newUsersToday} today`,
            bgColor: isDark ? 'bg-blue-900/20' : 'bg-blue-50',
            textColor: 'text-blue-500',
            circleColor: isDark ? 'bg-blue-400/30' : 'bg-blue-200'
        },
        {
            label: 'Orders',
            value: stats.totalOrders,
            subtitle: `${stats.pendingOrders} pending`,
            bgColor: isDark ? 'bg-emerald-900/20' : 'bg-emerald-50',
            textColor: 'text-emerald-500',
            circleColor: isDark ? 'bg-emerald-400/30' : 'bg-emerald-200'
        },
        {
            label: 'Products',
            value: stats.totalProducts,
            subtitle: 'Active',
            bgColor: isDark ? 'bg-violet-900/20' : 'bg-violet-50',
            textColor: 'text-violet-500',
            circleColor: isDark ? 'bg-violet-400/30' : 'bg-violet-200'
        },
        {
            label: 'Revenue',
            value: `₵${stats.totalRevenue.toLocaleString()}`,
            subtitle: 'This month',
            bgColor: isDark ? 'bg-pink-900/20' : 'bg-pink-50',
            textColor: 'text-pink-500',
            circleColor: isDark ? 'bg-pink-400/30' : 'bg-pink-200'
        },
    ];

    const quickActions = [
        {
            label: 'Users',
            href: '/dashboard/admin/users',
            icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
            bgColor: isDark ? 'bg-pink-900/30' : 'bg-pink-100'
        },
        {
            label: 'Orders',
            href: '/dashboard/admin/orders',
            icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
            bgColor: isDark ? 'bg-pink-900/30' : 'bg-pink-100'
        },
        {
            label: 'Products',
            href: '/dashboard/admin/products',
            icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
            bgColor: isDark ? 'bg-pink-900/30' : 'bg-pink-100'
        },
        {
            label: 'Analytics',
            href: '/dashboard/admin/analytics',
            icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
            bgColor: isDark ? 'bg-pink-900/30' : 'bg-pink-100'
        },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED': return 'text-green-500';
            case 'PENDING': return 'text-amber-500';
            case 'PROCESSING': return 'text-blue-500';
            case 'CANCELLED': return 'text-red-500';
            default: return 'text-gray-500';
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-3">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className={`h-24 rounded-2xl animate-pulse ${isDark ? 'bg-slate-800' : 'bg-gray-200'}`}></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats Grid - 2x2 with decorative circles */}
            <div className="grid grid-cols-2 gap-3">
                {statCards.map((stat, index) => (
                    <div
                        key={index}
                        className={`relative overflow-hidden p-4 rounded-2xl ${stat.bgColor}`}
                    >
                        {/* Decorative circle */}
                        <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full ${stat.circleColor}`}></div>
                        <div className={`absolute right-6 top-6 w-8 h-8 rounded-full ${stat.circleColor}`}></div>

                        {/* Content */}
                        <div className="relative z-10">
                            <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
                            <p className={`text-sm font-medium mt-1 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>{stat.label}</p>
                            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{stat.subtitle}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions - Circular buttons */}
            <div className={`rounded-2xl p-5 ${isDark ? 'bg-slate-800/50' : 'bg-white'} shadow-sm`}>
                <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Quick Actions</h3>
                <div className="flex justify-between px-2">
                    {quickActions.map((action, index) => (
                        <Link
                            key={index}
                            href={action.href}
                            className="flex flex-col items-center gap-2 group"
                        >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${action.bgColor} group-hover:scale-105 transition-transform`}>
                                <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={action.icon} />
                                </svg>
                            </div>
                            <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>{action.label}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Recent Orders */}
            <div className={`rounded-2xl overflow-hidden ${isDark ? 'bg-slate-800/50' : 'bg-white'} shadow-sm`}>
                <div className={`px-5 py-4 flex items-center justify-between border-b ${isDark ? 'border-slate-700' : 'border-gray-100'}`}>
                    <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Recent Orders</h3>
                    <Link href="/dashboard/admin/orders" className="text-sm text-pink-500 hover:text-pink-600">View all →</Link>
                </div>
                <div className={`divide-y ${isDark ? 'divide-slate-700' : 'divide-gray-100'}`}>
                    {recentOrders.length === 0 ? (
                        <div className={`px-5 py-8 text-center ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>
                            No orders yet
                        </div>
                    ) : (
                        recentOrders.slice(0, 3).map((order) => (
                            <div key={order.id} className="px-5 py-3 flex items-center justify-between">
                                <div>
                                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>#{order.order_number}</p>
                                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{order.customer}</p>
                                </div>
                                <div className="text-right">
                                    <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>GHS {order.total}</p>
                                    <p className={`text-xs ${getStatusColor(order.status)}`}>{order.status}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
