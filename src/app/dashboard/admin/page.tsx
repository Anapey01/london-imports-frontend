/**
 * London's Imports - Admin Dashboard Overview
 * Refactored: Premium Operational Command Center
 */
'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/providers/ThemeProvider';
import { adminAPI } from '@/lib/api';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    ShoppingBag,
    Package,
    ArrowUpRight,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    ChevronRight,
    BarChart3,
    Trash2,
    Mail,
    LayoutDashboard,
    Search
} from 'lucide-react';

// Components
import StatsPulse from '@/components/admin/StatsPulse';
import OperationsFunnel from '@/components/admin/OperationsFunnel';
import PerformanceChart from '@/components/admin/PerformanceChart';
import ActiveBatchWidget from '@/components/admin/ActiveBatchWidget';

interface DashboardData {
    stats: any;
    analytics: any;
    recentOrders: any[];
}

export default function AdminDashboardPage() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const loadData = async () => {
        try {
            const [statsRes, analyticsRes, ordersRes] = await Promise.all([
                adminAPI.stats(),
                adminAPI.analytics({ period: '7d' }),
                adminAPI.orders({ limit: 8 })
            ]);

            setData({
                stats: statsRes.data,
                analytics: analyticsRes.data,
                recentOrders: ordersRes.data.results || ordersRes.data || []
            });
        } catch (err) {
            console.error('Failed to load dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDeleteOrder = async (orderId: string) => {
        if (!window.confirm('Delete this order record permanently?')) return;
        try {
            await adminAPI.deleteOrder(orderId);
            loadData();
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED': return 'text-emerald-600 border-emerald-500/20 bg-emerald-50';
            case 'PENDING_PAYMENT': return 'text-amber-600 border-amber-500/20 bg-amber-50';
            case 'PAID': return 'text-blue-600 border-blue-500/20 bg-blue-50';
            case 'IN_TRANSIT': return 'text-purple-600 border-purple-500/20 bg-purple-50';
            case 'CANCELLED': return 'text-red-600 border-red-500/20 bg-red-50';
            default: return 'text-gray-600 border-gray-200 bg-gray-50';
        }
    };

    if (loading) {
        return (
            <div className="space-y-10 animate-pulse pb-20">
                <div className="h-10 w-48 bg-primary-surface rounded-lg mb-8" />
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-40 rounded-[2rem] bg-primary-surface" />
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 h-80 rounded-[2.5rem] bg-primary-surface" />
                    <div className="h-80 rounded-[2.5rem] bg-primary-surface" />
                </div>
            </div>
        );
    }

    if (!data) return null;

    // Logic for filtering recent transactions
    const filteredOrders = data.recentOrders.filter(order => 
        order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-10 pb-32">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-nuclear-text text-white rounded-lg">
                            <LayoutDashboard className="w-5 h-5" />
                        </div>
                        <h2 className="text-sm font-black uppercase tracking-[0.3em] opacity-40">Command Center</h2>
                    </div>
                    <h1 className="text-4xl font-black nuclear-text tracking-tighter">System Overview</h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30 group-focus-within:opacity-100 transition-opacity" />
                        <input 
                            type="text" 
                            placeholder="Quick find orders..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-11 pr-6 py-3 bg-primary-surface border border-primary-surface rounded-2xl outline-none focus:border-emerald-500 transition-all text-sm font-medium w-full md:w-64"
                        />
                    </div>
                    <Link 
                        href="/dashboard/admin/broadcast"
                        className="p-3 bg-nuclear-text text-white rounded-2xl hover:bg-black transition-all shadow-lg shadow-nuclear-text/10"
                        title="New Broadcast"
                    >
                        <Mail className="w-5 h-5" />
                    </Link>
                </div>
            </div>

            {/* KPI Section */}
            <StatsPulse 
                isDark={isDark}
                stats={{
                    totalUsers: data.stats.total_users,
                    totalOrders: data.stats.total_orders,
                    totalProducts: data.stats.total_products,
                    totalRevenue: data.stats.total_revenue,
                    potentialRevenue: data.stats.potential_revenue,
                    newUsersToday: data.stats.new_users_today,
                    pendingOrders: data.stats.pending_orders
                }}
            />

            {/* Primary Analysis Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Performance Chart */}
                <div className="lg:col-span-8">
                    <PerformanceChart 
                        isDark={isDark} 
                        data={data.analytics.revenueChart} 
                    />
                </div>

                {/* Active Batch Control */}
                <div className="lg:col-span-4">
                    <ActiveBatchWidget 
                        isDark={isDark} 
                        batch={data.stats.active_batch} 
                    />
                </div>
            </div>

            {/* Logistics Funnel */}
            <OperationsFunnel 
                isDark={isDark} 
                data={data.analytics.logisticsFunnel} 
            />

            {/* Recent Orders Table */}
            <div className={`rounded-[2.5rem] border overflow-hidden ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-primary-surface shadow-sm'}`}>
                <div className="p-8 border-b border-primary-surface/20 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                        <h3 className="text-xl font-black tracking-tight">Recent Transactions</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mt-1">Live order flow monitor</p>
                    </div>
                    <Link
                        href="/dashboard/admin/orders"
                        className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-500 transition-colors"
                    >
                        Master Registry <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-primary-surface/10">
                                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest opacity-30">Order Ref</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest opacity-30">Customer Identity</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest opacity-30">Origin</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest opacity-30">Protocol Status</th>
                                <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest opacity-30">Net Amount</th>
                                <th className="px-8 py-5"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-primary-surface/10">
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center text-sm font-medium opacity-40 italic">
                                        The registry is currently silent. No recent activity detected.
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order, idx) => (
                                    <motion.tr 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: idx * 0.05 }}
                                        key={order.id} 
                                        className={`group transition-colors ${isDark ? 'hover:bg-slate-800/40' : 'hover:bg-primary-surface/20'}`}
                                    >
                                        <td className="px-8 py-6">
                                            <span className="font-mono text-sm font-black opacity-60">#{order.order_number}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-primary-surface flex items-center justify-center text-xs font-black opacity-40 border border-primary-surface">
                                                    {order.customer.name?.[0] || 'U'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black">{order.customer.name || 'Anonymous User'}</p>
                                                    <p className="text-[10px] font-medium opacity-40">{order.customer.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-[11px] font-bold">
                                                <Clock className="w-3.5 h-3.5 opacity-30" />
                                                {new Date(order.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' })}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                                                {order.status === 'COMPLETED' ? <CheckCircle2 className="w-3 h-3" /> : 
                                                 order.status === 'CANCELLED' ? <XCircle className="w-3 h-3" /> : 
                                                 <Clock className="w-3 h-3" />}
                                                {order.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <span className="text-sm font-black">₵{parseFloat(order.total).toLocaleString()}</span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-3 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all">
                                                <button
                                                    onClick={() => handleDeleteOrder(order.id)}
                                                    className="p-2.5 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors"
                                                    title="Delete Entry"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                                <Link
                                                    href={`/dashboard/admin/orders/${order.id}`}
                                                    className="p-2.5 rounded-xl bg-primary-surface hover:bg-nuclear-text hover:text-white transition-all shadow-sm"
                                                    title="Inspect Details"
                                                >
                                                    <ChevronRight className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
