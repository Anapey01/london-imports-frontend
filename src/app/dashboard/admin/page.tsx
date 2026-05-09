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
    ArrowUpRight,
    Search,
    ChevronRight,
    Trash2,
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
        active_batch: {
            id: string;
            name: string;
            total_orders: number;
            target_orders: number;
            cutoff_datetime: string;
            days_left: number;
        } | null;
        [key: string]: unknown;
    };
    analytics: {
        revenueChart: Array<{ day: string; value: number }>;
        funnel: {
            visitors: number;
            cart: number;
            checkout: number;
            paid: number;
        };
        logisticsFunnel: Array<{ label: string; count: number }>;
        [key: string]: unknown;
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

    const isStuck = (order: Order) => {
        if (['DELIVERED', 'CANCELLED', 'COMPLETED'].includes(order.status || '')) return false;
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
            let validatedOrders: Order[] = [];
            
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
        <div className="space-y-16 pb-32">
            {/* 1. OPERATIONAL TELEMETRY */}
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

            {/* 2. SYSTEM ANALYTICS BRIDGE */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-px bg-slate-50 lg:bg-slate-100 border border-slate-100">
                {/* Main Performance Chart */}
                <div className="lg:col-span-8 bg-white px-4 py-10 sm:p-12">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 sm:gap-0 mb-12 sm:mb-16">
                        <div>
                            <h2 className="text-xs font-black tracking-[0.4em] text-slate-900 uppercase">REVENUE TRENDS</h2>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Revenue over time</p>
                        </div>
                        <div className="flex bg-slate-50 p-1 w-fit">
                            {['7d', '30d', '90d'].map(range => (
                                <button
                                    key={range}
                                    onClick={() => handleRangeChange(range)}
                                    className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                                        chartRange === range ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                    }`}
                                >
                                    {range}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="h-[400px]">
                        <PerformanceChart 
                            isDark={isDark} 
                            data={data.analytics.revenueChart} 
                            currentRange={chartRange}
                            onRangeChange={handleRangeChange}
                        />
                    </div>
                </div>

                {/* Active Batch Control (Manifest Integration) */}
                <div className="lg:col-span-4 bg-slate-50/50 px-4 py-10 sm:p-12 border-t lg:border-t-0 lg:border-l border-slate-100">
                    <ActiveBatchWidget 
                        isDark={isDark} 
                        batch={data.stats.active_batch} 
                    />
                </div>
            </div>

            {/* 3. LOGISTICS PIPELINE STATUS */}
            <div className="bg-white border border-slate-100 px-4 py-10 sm:p-12">
                <div className="flex items-center gap-4 mb-12">
                    <span className="h-px w-8 bg-slate-900" />
                    <h2 className="text-xs font-black tracking-[0.4em] text-slate-900 uppercase">ORDER FUNNEL</h2>
                </div>
                <OperationsFunnel 
                    isDark={isDark} 
                    data={data.analytics.logisticsFunnel} 
                />
            </div>

            {/* 4. TRANSACTION ARCHIVE (THE LEDGER) */}
            <div className="bg-white border border-slate-100 overflow-hidden">
                <div className="p-12 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-8">
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-slate-900 tracking-tighter">Recent Orders</h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mt-4">Latest activity across the platform</p>
                    </div>
                    
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
                            <input 
                                type="text" 
                                placeholder="SEARCH ORDERS..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-12 pr-6 py-4 bg-slate-50 border border-slate-50 text-[10px] font-black uppercase tracking-widest outline-none focus:bg-white focus:border-slate-900 transition-all w-full md:w-64"
                            />
                        </div>
                        <button 
                            onClick={() => setFilterStuck(!filterStuck)}
                            className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all border ${
                                filterStuck ? 'bg-amber-500 text-white border-amber-500' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-900 hover:text-slate-900'
                            }`}
                        >
                            {filterStuck ? 'SHOWING DELAYED' : 'SHOW DELAYED'}
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-slate-50 bg-slate-50/30">
                                <th className="px-8 py-6 text-left text-[11px] font-black uppercase tracking-[0.4em] text-slate-500">Order ID</th>
                                <th className="px-8 py-6 text-left text-[11px] font-black uppercase tracking-[0.4em] text-slate-500">Customer</th>
                                <th className="px-8 py-6 text-left text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 hidden md:table-cell">Date</th>
                                <th className="px-8 py-6 text-left text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 hidden md:table-cell">Status</th>
                                <th className="px-8 py-6 text-right text-[11px] font-black uppercase tracking-[0.4em] text-slate-500">Total</th>
                                <th className="px-8 py-6"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-32 text-center">
                                        <p className="text-[12px] font-black uppercase tracking-[0.5em] text-slate-300">No recent orders found</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order, idx) => (
                                    <OrderRow 
                                        key={order.id}
                                        order={order}
                                        isExpanded={expandedOrder === order.id}
                                        onToggle={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                                        handleDeleteOrder={handleDeleteOrder}
                                        addAlert={addAlert}
                                        isRecent={isRecent}
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
            <div className="fixed bottom-12 left-0 right-0 z-[110] pointer-events-none flex flex-col items-center">
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
    isExpanded: boolean;
    onToggle: () => void;
    handleDeleteOrder: (id: string) => void;
    addAlert: (msg: string, type?: 'success' | 'error' | 'warning') => void;
    isRecent: (date: string) => boolean;
    isStuck: boolean;
    showDivider: boolean;
    isFirstToday: boolean;
}

// Optimized OrderRow Component to fix INP and Contrast
const OrderRow = React.memo(({ 
    order, 
    isExpanded,
    onToggle,
    handleDeleteOrder, 
    addAlert,
    isRecent,
    isStuck,
    showDivider,
    isFirstToday
}: OrderRowProps) => {
    const fresh = isRecent(order.created_at);

    return (
        <React.Fragment>
            {(isFirstToday || showDivider) && (
                <tr className="bg-slate-50/50">
                    <td colSpan={6} className="px-8 py-4">
                        <div className="flex items-center gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900">
                                {isFirstToday ? "TODAY'S ORDERS" : 'PAST ORDERS'}
                            </span>
                        </div>
                    </td>
                </tr>
            )}
            <motion.tr 
                layout="position"
                onClick={onToggle}
                className={`group cursor-pointer transition-all duration-500 ${
                    isExpanded 
                    ? 'bg-slate-50'
                    : 'bg-white hover:bg-slate-50/50'
                }`}
            >
                <td className="px-8 py-8">
                    <div className="flex items-center gap-4">
                        <span className={`font-mono text-[12px] font-black tracking-tighter ${fresh ? 'text-emerald-600' : 'text-slate-900'}`}>
                            #{order?.order_number}
                        </span>
                        {fresh && (
                            <div className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        )}
                    </div>
                </td>
                <td className="px-8 py-8">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 border border-slate-100 flex items-center justify-center text-xs font-black text-slate-500 group-hover:border-slate-900 group-hover:text-slate-900 transition-all">
                            {order?.customer?.name?.[0] || 'U'}
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-black uppercase tracking-widest truncate">{order?.customer?.name || 'GUEST'}</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter truncate hidden sm:block">{order?.customer?.email || ''}</p>
                        </div>
                    </div>
                </td>
                <td className="px-8 py-8 hidden md:table-cell">
                    <p className="text-[10px] font-black text-slate-400 uppercase tabular-nums">
                        {new Date(order?.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' }).toUpperCase()}
                    </p>
                </td>
                <td className="px-8 py-8 hidden md:table-cell">
                    <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${
                            order?.status === 'COMPLETED' ? 'text-emerald-600' : 
                            order?.status === 'CANCELLED' ? 'text-red-600' : 'text-slate-500'
                        }`}>
                            {order?.status?.replace('_', ' ')}
                        </span>
                        {isStuck && (
                            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" title="Execution Delayed" />
                        )}
                    </div>
                </td>
                <td className="px-8 py-8 text-right">
                    <span className="text-[12px] font-black text-slate-950 tabular-nums">₵{Number(order?.total || 0).toLocaleString()}</span>
                </td>
                <td className="px-8 py-8 text-right">
                    <div className="flex justify-end items-center gap-6">
                        <ChevronRight className={`w-3.5 h-3.5 text-slate-200 group-hover:text-slate-900 transition-all ${isExpanded ? 'rotate-90' : ''}`} />
                        <div className="hidden group-hover:flex items-center gap-4 transition-all animate-in fade-in slide-in-from-right-2">
                            <button
                                onClick={(e) => { e.stopPropagation(); handleDeleteOrder(order.id); }}
                                className="p-2 text-slate-300 hover:text-red-600 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <Link
                                href={`/dashboard/admin/orders/${order.id}`}
                                onClick={(e) => e.stopPropagation()}
                                className="p-2 text-slate-300 hover:text-slate-900 transition-colors"
                            >
                                <ArrowUpRight className="w-4 h-4" />
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
                        className="bg-slate-50/30"
                    >
                        <td colSpan={6} className="px-12 py-12 border-t border-slate-50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                                <div className="space-y-8">
                                    <div>
                                        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 mb-6">CUSTOMER DETAILS</p>
                                        <div className="border-l-2 border-slate-900 pl-8 space-y-2">
                                            <p className="text-sm font-black uppercase tracking-widest">{order?.customer?.name}</p>
                                            <p className="text-xs font-mono font-bold text-slate-500">{order.phone || 'No contact information'}</p>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigator.clipboard.writeText(order.phone || '');
                                                    addAlert('Phone number copied.', 'success');
                                                }}
                                                className="text-[9px] font-black uppercase tracking-widest text-emerald-600 border-b border-emerald-600 pb-1 mt-4 hover:text-emerald-500"
                                            >
                                                COPY PHONE
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-8">
                                    <div>
                                        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 mb-6">ORDER ITEMS</p>
                                        <div className="space-y-px bg-slate-100 border border-slate-100">
                                            {order.items_summary?.map((item, i) => (
                                                <div key={i} className="flex justify-between items-center p-4 bg-white">
                                                    <span className="flex items-center gap-4">
                                                        <span className="text-xs font-black text-slate-300 tabular-nums">{item.quantity.toString().padStart(2, '0')}</span>
                                                        <span className="text-xs font-black uppercase tracking-widest text-slate-700">{item.name}</span>
                                                    </span>
                                                    <span className="text-xs font-black tabular-nums text-slate-900">₵{item.price.toLocaleString()}</span>
                                                </div>
                                            ))}
                                        </div>
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
