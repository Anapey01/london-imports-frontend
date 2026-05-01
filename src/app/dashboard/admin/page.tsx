/**
 * London's Imports - Admin Dashboard Overview
 * Refactored: Premium Operational Command Center
 */
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useTheme } from '@/providers/ThemeProvider';
import { adminAPI } from '@/lib/api';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    Clock,
    ArrowUpRight,
    CheckCircle2,
    XCircle,
    LayoutDashboard,
    Search,
    Mail,
    ChevronRight,
    Trash2,
    Filter,
    AlertTriangle,
} from 'lucide-react';
import { ConfirmModal } from '@/components/dashboard/ConfirmModal';
import { AuraAlert, AlertType } from '@/components/AuraAlert';

// Components
import StatsPulse from '@/components/admin/StatsPulse';
import OperationsFunnel from '@/components/admin/OperationsFunnel';
import PerformanceChart from '@/components/admin/PerformanceChart';
import ActiveBatchWidget from '@/components/admin/ActiveBatchWidget';

import { Order } from '@/types';

interface DashboardData {
    stats: {
        total_users: number;
        total_orders: number;
        total_products: number;
        total_revenue: number;
        potential_revenue: number;
        new_users_today: number;
        pending_orders: number;
        active_batch: any;
        [key: string]: any;
    };
    analytics: {
        revenueChart: any[];
        funnel: {
            visitors: number;
            cart: number;
            checkout: number;
            paid: number;
        };
        [key: string]: any;
    };
    recentOrders: Order[];
}

export default function AdminDashboardPage() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [chartRange, setChartRange] = useState('7d');
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        variant?: 'danger' | 'warning';
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => {}
    });

    const [alerts, setAlerts] = useState<Array<{ id: string; message: string; type: AlertType }>>([]);
    const [filterStuck, setFilterStuck] = useState(false);

    const isRecent = (dateStr: string) => {
        const orderDate = new Date(dateStr).getTime();
        const twoHoursAgo = Date.now() - (2 * 60 * 60 * 1000);
        return orderDate > twoHoursAgo;
    };

    const isToday = (dateStr: string) => {
        if (!dateStr) return false;
        const orderDate = new Date(dateStr).toDateString();
        const today = new Date().toDateString();
        return orderDate === today;
    };

    const isStuck = (order: any) => {
        if (['DELIVERED', 'CANCELLED', 'COMPLETED'].includes(order.status)) return false;
        const lastUpdated = new Date(order.updated_at || order.created_at).getTime();
        const threshold = Date.now() - (5 * 24 * 60 * 60 * 1000);
        return lastUpdated < threshold;
    };

    const addAlert = (message: string, type: AlertType = 'success') => {
        const id = Math.random().toString(36).substring(7);
        setAlerts(prev => [...prev, { id, message, type }]);
    };

    const removeAlert = (id: string) => {
        setAlerts(prev => prev.filter(alert => alert.id !== id));
    };

    const loadData = useCallback(async () => {
        try {
            const [statsRes, analyticsRes, ordersRes] = await Promise.all([
                adminAPI.stats(),
                adminAPI.analytics({ period: chartRange }),
                adminAPI.orders({ limit: 20 })
            ]);

            // Strict Array Enforcement (Structural Immunity)
            const rawOrders = ordersRes.data;
            let validatedOrders: any[] = [];
            
            if (rawOrders) {
                if (Array.isArray(rawOrders.results)) {
                    validatedOrders = rawOrders.results;
                } else if (Array.isArray(rawOrders)) {
                    validatedOrders = rawOrders;
                }
            }

            setData({
                stats: statsRes.data,
                analytics: analyticsRes.data,
                recentOrders: validatedOrders
            });
        } catch (err) {
            console.error('Failed to load dashboard data:', err);
        } finally {
            setLoading(false);
        }
    }, [chartRange]);

    useEffect(() => {
        loadData();
        
        // Operational Heartbeat: Auto-refresh every 60 seconds
        const heartbeat = setInterval(() => {
            loadData();
        }, 60000);

        return () => clearInterval(heartbeat);
    }, [loadData]);

    const handleRangeChange = async (newRange: string) => {
        setChartRange(newRange);
        try {
            const res = await adminAPI.analytics({ period: newRange });
            setData(prev => prev ? {
                ...prev,
                analytics: res.data
            } : null);
        } catch (err) {
            console.error('Failed to refresh analytics:', err);
        }
    };

    const handleDeleteOrder = (orderId: string) => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete Order Record',
            message: 'Permanently delete this order record? This cannot be undone.',
            variant: 'danger',
            onConfirm: async () => {
                try {
                    await adminAPI.deleteOrder(orderId);
                    addAlert('Order record deleted successfully');
                    loadData();
                } catch (error) {
                    console.error('Delete failed:', error);
                    addAlert('Failed to delete order record', 'error');
                }
            }
        });
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

    // Logic for filtering recent transactions - Hardened
    const recentOrdersArray = Array.isArray(data?.recentOrders) ? data.recentOrders : [];
    
    const filteredOrders = recentOrdersArray.filter(order => {
        const query = searchTerm.toLowerCase();
        const matchesQuery = (
            order?.order_number?.toString().toLowerCase().includes(query) ||
            order?.customer?.name?.toLowerCase().includes(query) ||
            order?.customer?.email?.toLowerCase().includes(query) ||
            order?.phone?.toLowerCase().includes(query)
        );
        
        if (filterStuck) return matchesQuery && isStuck(order);
        return matchesQuery;
    });

    return (
        <div className="space-y-10 pb-32">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-nuclear-text text-white rounded-lg">
                            <LayoutDashboard className="w-5 h-5" />
                        </div>
                        <p className="text-sm font-black uppercase tracking-[0.3em] text-slate-500">Command Center</p>
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
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setFilterStuck(!filterStuck)}
                            className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${filterStuck ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-primary-surface border border-primary-surface opacity-60 hover:opacity-100'}`}
                        >
                            <Filter className="w-3.5 h-3.5" />
                            Delayed
                        </button>
                        <Link 
                            href="/dashboard/admin/broadcast"
                            className="p-3 bg-nuclear-text text-white rounded-2xl hover:bg-black transition-all shadow-lg shadow-nuclear-text/10"
                            title="New Broadcast"
                        >
                            <Mail className="w-5 h-5" />
                        </Link>
                    </div>
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
                        currentRange={chartRange}
                        onRangeChange={handleRangeChange}
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
                        <h2 className="text-xl font-black tracking-tight">Recent Transactions</h2>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">Live order flow monitor</p>
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
                                <th className="px-4 md:px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest opacity-60">Order Ref</th>
                                <th className="px-4 md:px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest opacity-60">Customer Identity</th>
                                <th className="px-4 md:px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest opacity-60 hidden md:table-cell">Origin</th>
                                <th className="px-4 md:px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest opacity-60 hidden md:table-cell">Protocol Status</th>
                                <th className="px-4 md:px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest opacity-60">Net Amount</th>
                                <th className="px-4 md:px-8 py-5"></th>
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
                                    <OrderRow 
                                        key={order.id}
                                        order={order}
                                        isDark={isDark}
                                        isExpanded={expandedOrder === order.id}
                                        onToggle={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                                        handleDeleteOrder={handleDeleteOrder}
                                        addAlert={addAlert}
                                        getStatusColor={getStatusColor}
                                        isRecent={isRecent}
                                        isToday={isToday}
                                        isStuck={isStuck(order)}
                                        showDivider={idx > 0 && isToday(filteredOrders[idx-1]?.created_at) && !isToday(order.created_at)}
                                        isFirstToday={idx === 0 && isToday(order.created_at)}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Confirmation Modal */}
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                variant={confirmModal.variant}
            />

            {/* Notification Toasts */}
            <div className="fixed bottom-8 left-0 right-0 z-[110] pointer-events-none flex flex-col items-center">
                <AnimatePresence mode="popLayout">
                    {alerts.map(alert => (
                        <AuraAlert
                            key={alert.id}
                            id={alert.id}
                            message={alert.message}
                            type={alert.type}
                            onClose={removeAlert}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}


interface OrderRowProps {
    order: Order;
    isDark: boolean;
    isExpanded: boolean;
    onToggle: () => void;
    handleDeleteOrder: (id: string) => void;
    addAlert: (msg: string, type?: 'success' | 'error' | 'warning') => void;
    getStatusColor: (status: string) => string;
    isRecent: (date: string) => boolean;
    isToday: (date: string) => boolean;
    isStuck: boolean;
    showDivider: boolean;
    isFirstToday: boolean;
}

// Optimized OrderRow Component to fix INP and Contrast
const OrderRow = React.memo(({ 
    order, 
    isDark, 
    isExpanded,
    onToggle,
    handleDeleteOrder, 
    addAlert,
    getStatusColor,
    isRecent,
    isToday,
    isStuck,
    showDivider,
    isFirstToday
}: OrderRowProps) => {
    const fresh = isRecent(order.created_at);
    const today = isToday(order.created_at);

    return (
        <React.Fragment>
            {(isFirstToday || showDivider) && (
                <tr className={isDark ? 'bg-slate-800/20' : 'bg-primary-surface/10'}>
                    <td colSpan={6} className="px-8 py-3">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                            {isFirstToday ? 'Current Cycle (Today)' : 'Archived (Earlier)'}
                        </span>
                    </td>
                </tr>
            )}
            <motion.tr 
                layout="position"
                initial={{ opacity: 0, x: fresh ? -20 : 0 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                onClick={onToggle}
                className={`group cursor-pointer transition-all ${
                    isExpanded 
                    ? (isDark ? 'bg-slate-800' : 'bg-primary-surface/10')
                    : (fresh 
                        ? (isDark ? 'bg-emerald-500/5 hover:bg-emerald-500/10' : 'bg-emerald-50 hover:bg-emerald-100/50') 
                        : (today ? (isDark ? 'bg-slate-800/40 hover:bg-slate-800' : 'bg-primary-surface/20 hover:bg-primary-surface/40') 
                                 : (isDark ? 'hover:bg-slate-800/40' : 'hover:bg-primary-surface/20')))
                }`}
            >
                <td className="px-4 md:px-8 py-6">
                    <div className="flex items-center gap-3">
                        <span className={`font-mono text-[13px] font-black tracking-tight ${fresh ? 'text-emerald-700' : 'text-slate-700 dark:text-slate-200'}`}>
                            #{order?.order_number}
                        </span>
                        {fresh && (
                            <div className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </div>
                        )}
                    </div>
                </td>
                <td className="px-4 md:px-8 py-6">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary-surface flex items-center justify-center text-xs font-black text-slate-500 border border-primary-surface shrink-0">
                            {order?.customer?.name?.[0] || 'U'}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-black truncate">{order?.customer?.name || (typeof order?.customer === 'string' ? order.customer : 'Anonymous')}</p>
                            <p className="text-[10px] font-medium text-slate-500 truncate hidden sm:block">{order?.customer?.email || ''}</p>
                        </div>
                    </div>
                </td>
                <td className="px-4 md:px-8 py-6 hidden md:table-cell">
                    <div className="flex items-center gap-2 text-[11px] font-bold">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(order?.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' })}
                    </div>
                </td>
                <td className="px-4 md:px-8 py-6 hidden md:table-cell">
                    <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(order?.status)}`}>
                            {order?.status === 'COMPLETED' ? <CheckCircle2 className="w-3 h-3" /> : 
                            order?.status === 'CANCELLED' ? <XCircle className="w-3 h-3" /> : 
                            <Clock className="w-3 h-3" />}
                            {order?.status?.replace('_', ' ')}
                        </span>
                        {isStuck && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 border border-amber-200 rounded-lg text-amber-600 animate-in fade-in zoom-in duration-500" title="Needs Attention: Delayed over 5 days">
                                <AlertTriangle className="w-3 h-3" />
                                <span className="text-[8px] font-black uppercase tracking-tighter">Delayed</span>
                            </div>
                        )}
                    </div>
                </td>
                <td className="px-4 md:px-8 py-6 text-right">
                    <span className="text-sm font-black whitespace-nowrap">₵{parseFloat(order?.total).toLocaleString()}</span>
                </td>
                <td className="px-4 md:px-8 py-6 text-right">
                    <div className="flex justify-end items-center gap-3">
                        <div className={`p-2 rounded-lg transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                        </div>
                        <div className="flex justify-end gap-3 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all">
                            <button
                                onClick={(e) => { e.stopPropagation(); handleDeleteOrder(order.id); }}
                                className="p-2.5 rounded-xl text-red-600 hover:bg-red-500/10 transition-colors"
                                title="Delete Entry"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <Link
                                href={`/dashboard/admin/orders/${order.id}`}
                                onClick={(e) => e.stopPropagation()}
                                className="p-2.5 rounded-xl bg-primary-surface hover:bg-nuclear-text hover:text-white transition-all shadow-sm"
                                title="Inspect Details"
                            >
                                <LayoutDashboard className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </td>
            </motion.tr>
            <AnimatePresence>
                {isExpanded && (
                    <motion.tr
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={isDark ? 'bg-slate-800' : 'bg-primary-surface/5'}
                    >
                        <td colSpan={6} className="px-4 md:px-8 py-8 border-t border-primary-surface/10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Community WhatsApp Link</p>
                                    <div className="flex items-center gap-4 p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/20">
                                        <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0">
                                            <Users className="w-5 h-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-black text-emerald-700 truncate">{order?.customer?.name}</p>
                                            <p className="text-xs font-mono font-bold tracking-tight truncate text-slate-600">{order.phone || 'No phone'}</p>
                                        </div>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigator.clipboard.writeText(order.phone || '');
                                                addAlert('Phone copied to clipboard!', 'success');
                                            }}
                                            className="ml-auto px-4 py-2 bg-emerald-600 text-white rounded-lg text-[10px] font-black uppercase whitespace-nowrap active:scale-95 transition-transform"
                                        >
                                            Copy
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Item Manifest</p>
                                    <div className="space-y-3">
                                        {order.items_summary?.map((item, i) => (
                                            <div key={i} className="flex justify-between items-center text-sm font-bold p-3 bg-nuclear-text/5 rounded-xl border border-nuclear-text/10">
                                                <span className="flex items-center gap-2">
                                                    <span className="w-5 h-5 rounded-md bg-nuclear-text text-white flex items-center justify-center text-[10px]">{item.quantity}</span>
                                                    {item.name}
                                                </span>
                                                <span className="text-slate-600">₵{item.price.toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </td>
                    </motion.tr>
                )}
            </AnimatePresence>
        </React.Fragment>
    );
});
