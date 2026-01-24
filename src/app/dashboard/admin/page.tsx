/**
 * London's Imports - Admin Dashboard Overview
 * Mobile-first admin dashboard with stats and recent activity
 */
'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/providers/ThemeProvider';
import { adminAPI } from '@/lib/api';
import Link from 'next/link';
import {
    Users,
    ShoppingBag,
    Package,
    BadgeDollarSign,
    ArrowUpRight,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    ChevronRight,
    TrendingUp,
    BarChart3,
    Trash2
} from 'lucide-react';

interface DashboardStats {
    total_users: number;
    total_orders: number;
    total_products: number;
    total_revenue: number;
    pending_orders: number;
    new_users_today: number;
    storage_provider: string;
}

interface RecentOrder {
    id: string;
    order_number: string;
    customer: {
        name: string;
        email: string;
        avatar?: string;
    };
    total: string;
    status: string;
    created_at: string;
}

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
    const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            const statsResponse = await adminAPI.stats();
            const statsData = statsResponse.data as DashboardStats;

            setStats({
                totalUsers: statsData.total_users || 0,
                totalOrders: statsData.total_orders || 0,
                totalProducts: statsData.total_products || 0,
                totalRevenue: statsData.total_revenue || 0,
                pendingOrders: statsData.pending_orders || 0,
                newUsersToday: statsData.new_users_today || 0,
                storageProvider: statsData.storage_provider || 'Unknown',
            });

            const ordersResponse = await adminAPI.orders({ limit: 10 });
            setRecentOrders((ordersResponse.data.results || ordersResponse.data || []) as RecentOrder[]);
        } catch (err) {
            console.error('Failed to load admin stats:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDeleteOrder = async (orderId: string) => {
        if (!window.confirm('Are you sure you want to delete this order?')) return;

        try {
            await adminAPI.deleteOrder(orderId);
            // Reload data
            loadData();
        } catch (error) {
            console.error('Failed to delete order:', error);
            alert('Failed to delete order');
        }
    };

    const statCards = [
        {
            label: 'Total Users',
            value: stats.totalUsers,
            subtitle: `+${stats.newUsersToday} today`,
            icon: Users,
            color: 'blue',
            trend: stats.newUsersToday > 0 ? 'up' : 'neutral'
        },
        {
            label: 'Total Orders',
            value: stats.totalOrders,
            subtitle: `${stats.pendingOrders} pending`,
            icon: ShoppingBag,
            color: 'emerald',
            trend: 'up'
        },
        {
            label: 'Active Products',
            value: stats.totalProducts,
            subtitle: 'In catalog',
            icon: Package,
            color: 'violet',
            trend: 'neutral'
        },
        {
            label: 'Revenue',
            value: `₵${stats.totalRevenue.toLocaleString()}`,
            subtitle: 'Lifetime',
            icon: BadgeDollarSign,
            color: 'pink',
            trend: 'up'
        },
    ];

    const quickActions = [
        {
            label: 'Manage Users',
            href: '/dashboard/admin/users',
            icon: Users,
            color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
        },
        {
            label: 'View Orders',
            href: '/dashboard/admin/orders',
            icon: ShoppingBag,
            color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
        },
        {
            label: 'Products',
            href: '/dashboard/admin/products',
            icon: Package,
            color: 'bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400'
        },
        {
            label: 'Analytics',
            href: '/dashboard/admin/analytics',
            icon: BarChart3,
            color: 'bg-pink-50 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400'
        },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED': return 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20';
            case 'PENDING': return 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/20';
            case 'PROCESSING': return 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20';
            case 'CANCELLED': return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20';
            default: return 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="space-y-8 animate-pulse">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className={`h-32 rounded-2xl ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`}></div>
                    ))}
                </div>
                <div className={`h-64 rounded-2xl ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`}></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, index) => (
                    <div
                        key={index}
                        className={`p-5 rounded-2xl border transition-all hover:shadow-md ${isDark
                            ? 'bg-slate-800 border-slate-700 hover:border-slate-600'
                            : 'bg-white border-gray-100 hover:border-gray-200 shadow-sm'
                            }`}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-2.5 rounded-xl ${stat.color === 'blue' ? (isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600') :
                                stat.color === 'emerald' ? (isDark ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-50 text-emerald-600') :
                                    stat.color === 'violet' ? (isDark ? 'bg-violet-900/30 text-violet-400' : 'bg-violet-50 text-violet-600') :
                                        (isDark ? 'bg-pink-900/30 text-pink-400' : 'bg-pink-50 text-pink-600')
                                }`}>
                                <stat.icon className="w-5 h-5" strokeWidth={2} />
                            </div>
                            {stat.trend === 'up' && (
                                <div className="flex items-center gap-1 text-xs font-medium text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">
                                    <TrendingUp className="w-3 h-3" />
                                    <span>Growing</span>
                                </div>
                            )}
                        </div>

                        <div>
                            <p className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {stat.value}
                            </p>
                            <p className={`text-sm font-medium mt-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                {stat.label}
                            </p>
                            <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                                {stat.subtitle}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div>
                <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {quickActions.map((action, index) => (
                        <Link
                            key={index}
                            href={action.href}
                            className={`flex flex-col items-center justify-center p-6 rounded-2xl border transition-all hover:scale-[1.02] active:scale-[0.98] ${isDark
                                ? 'bg-slate-800 border-slate-700 hover:bg-slate-750'
                                : 'bg-white border-gray-100 hover:shadow-md'
                                }`}
                        >
                            <div className={`p-3 rounded-full mb-3 ${action.color}`}>
                                <action.icon className="w-6 h-6" strokeWidth={2} />
                            </div>
                            <span className={`font-medium text-sm ${isDark ? 'text-slate-200' : 'text-gray-900'}`}>
                                {action.label}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Recent Orders */}
            <div className={`rounded-3xl border overflow-hidden ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100 shadow-sm'}`}>
                <div className={`p-6 border-b flex items-center justify-between ${isDark ? 'border-slate-700' : 'border-gray-50'}`}>
                    <div>
                        <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Recent Orders</h3>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Latest customer transactions</p>
                    </div>
                    <Link
                        href="/dashboard/admin/orders"
                        className="flex items-center gap-1 text-sm font-semibold text-pink-600 hover:text-pink-700 transition-colors"
                    >
                        View All <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'bg-slate-900/50 text-slate-400' : 'bg-gray-50/50 text-gray-500'}`}>
                            <tr>
                                <th className="px-6 py-4 text-left">Order ID</th>
                                <th className="px-6 py-4 text-left">Customer</th>
                                <th className="px-6 py-4 text-left">Date</th>
                                <th className="px-6 py-4 text-left">Status</th>
                                <th className="px-6 py-4 text-right">Amount</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${isDark ? 'divide-slate-700' : 'divide-gray-50'}`}>
                            {recentOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        No orders found
                                    </td>
                                </tr>
                            ) : (
                                recentOrders.map((order) => (
                                    <tr key={order.id} className={`group transition-colors ${isDark ? 'hover:bg-slate-700/30' : 'hover:bg-gray-50/50'}`}>
                                        <td className="px-6 py-4">
                                            <span className={`font-mono text-sm ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                                                #{order.order_number}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-600'}`}>
                                                    {order.customer.name?.[0] || 'G'}
                                                </div>
                                                <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                    {order.customer.name || 'Guest'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400">
                                                <Clock className="w-3.5 h-3.5" />
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status).replace('text-', 'border-').replace('bg-', 'border-opacity-20 ')} ${getStatusColor(order.status)}`}>
                                                {order.status === 'COMPLETED' && <CheckCircle2 className="w-3 h-3" />}
                                                {order.status === 'PENDING' && <Clock className="w-3 h-3" />}
                                                {order.status === 'CANCELLED' && <XCircle className="w-3 h-3" />}
                                                {order.status === 'PROCESSING' && <AlertCircle className="w-3 h-3" />}
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                ₵{parseFloat(order.total).toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleDeleteOrder(order.id)}
                                                    className={`p-2 rounded-lg transition-colors ${isDark ? 'text-red-400 hover:bg-red-400/10' : 'text-red-400 hover:bg-red-50'}`}
                                                    title="Delete Order"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                                <Link
                                                    href={`/dashboard/admin/orders/${order.id}`}
                                                    className={`p-2 rounded-lg inline-flex transition-colors ${isDark ? 'text-slate-400 hover:text-pink-400 hover:bg-pink-400/10' : 'text-gray-400 hover:text-pink-600 hover:bg-pink-50'}`}
                                                >
                                                    <ChevronRight className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
