/**
 * London's Imports - Admin Order Management
 * View, filter, and bulk-manage all orders
 */
'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from '@/providers/ThemeProvider';
import { adminAPI } from '@/lib/api';
import { getImageUrl } from '@/lib/image';
import {
    ChevronRight, ChevronLeft, Eye, Trash2, Package, CheckCircle, X, CheckSquare, Square, Search
} from 'lucide-react';
import { ConfirmModal } from '@/components/dashboard/ConfirmModal';
import { AuraAlert, AlertType } from '@/components/AuraAlert';
import { AnimatePresence, motion } from 'framer-motion';

const STATUS_TABS = ['All', 'PENDING_PAYMENT', 'PAID', 'OPEN_FOR_BATCH', 'IN_FULFILLMENT', 'IN_TRANSIT', 'ARRIVED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'] as const;

const labelMap: Record<string, string> = {
    IN_TRANSIT: 'In Transit',
    ARRIVED: 'Arrived',
    DELIVERED: 'Delivered',
    OUT_FOR_DELIVERY: 'Out for Delivery',
    CANCELLED: 'Cancelled',
};

const statusLabel = (s: string) => s === 'All' ? 'All' : s.replace(/_/g, ' ');

interface Order {
    id: string;
    order_number?: string;
    customer: {
        name: string;
        email: string;
        avatar?: string;
    };
    items_count: number;
    total_amount: number;
    status: string;
    payment_status: string;
    amount_paid: number;
    balance_due: number;
    is_installment: boolean;
    created_at: string;
    thumbnail?: string;
    items?: Array<{
        id: number;
        product_name: string;
        quantity: number;
        price: number;
    }>;
}

interface APIOrder {
    id: string;
    order_number?: string;
    customer: {
        name: string;
        email: string;
        avatar?: string;
    };
    items_count?: number;
    items?: unknown[];
    total: number | string;
    status?: string;
    payment_status?: string;
    amount_paid?: number;
    balance_due?: number;
    is_installment?: boolean;
    created_at: string;
    thumbnail?: string;
}

function mapAPIOrder(order: any): Order {
    if (!order) return {
        id: Math.random().toString(),
        customer: { name: 'Unknown', email: '' },
        items_count: 0,
        total_amount: 0,
        status: 'PENDING',
        payment_status: 'PENDING',
        amount_paid: 0,
        balance_due: 0,
        is_installment: false,
        created_at: new Date().toISOString()
    };

    const customerObj = typeof order.customer === 'object' && order.customer !== null 
        ? order.customer 
        : { name: String(order.customer || 'Anonymous User'), email: '', avatar: '' };

    return {
        id: String(order.id || ''),
        order_number: order.order_number,
        customer: {
            name: customerObj.name || 'Anonymous User',
            email: customerObj.email || '',
            avatar: customerObj.avatar || ''
        },
        items_count: order.items_count || (order.items_summary?.length) || (order.items?.length) || 0,
        total_amount: Number(order.total || 0),
        status: order.status || 'PENDING',
        payment_status: order.payment_status || 'PENDING',
        amount_paid: Number(order.amount_paid || 0),
        balance_due: Number(order.balance_due || 0),
        is_installment: !!order.is_installment,
        created_at: order.created_at || new Date().toISOString(),
        thumbnail: order.thumbnail || (order.items_summary?.[0]?.product?.image) || (order.items?.[0]?.product?.image),
        items: order.items_summary || order.items || []
    };
}

export default function AdminOrdersPage() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [bulkUpdating, setBulkUpdating] = useState(false);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

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

    const addAlert = (message: string, type: AlertType = 'success') => {
        const id = Math.random().toString(36).substring(7);
        setAlerts(prev => [...prev, { id, message, type }]);
    };

    const removeAlert = (id: string) => {
        setAlerts(prev => prev.filter(alert => alert.id !== id));
    };

    const loadOrders = useCallback(async () => {
        setLoading(true);
        try {
            const params: Record<string, string | number | undefined> = { 
                page: currentPage,
                search: searchTerm || undefined
            };
            if (statusFilter !== 'All' && statusFilter !== 'ALL') {
                params.status = statusFilter;
            }
            
            const response = await adminAPI.orders(params);
            const data = response.data;
            
            // Structural Immunity: Handle all response formats
            let ordersArray: any[] = [];
            if (data) {
                if (Array.isArray(data.results)) {
                    ordersArray = data.results;
                    setTotalCount(data.count || data.results.length);
                    setTotalPages(Math.ceil((data.count || data.results.length) / 100)); // Match backend PAGE_SIZE=100
                } else if (Array.isArray(data)) {
                    ordersArray = data;
                    setTotalCount(data.length);
                    setTotalPages(1);
                }
            }
            
            setOrders(ordersArray.map(mapAPIOrder));
        } catch (err) {
            console.error('Failed to load orders:', err);
            addAlert('Failed to load orders from server', 'error');
        } finally {
            setLoading(false);
        }
    }, [currentPage, statusFilter, searchTerm]);

    useEffect(() => { loadOrders(); }, [loadOrders]);

    const handleDelete = (id: string) => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete Order',
            message: 'Are you sure you want to delete this order? This action cannot be undone.',
            variant: 'danger',
            onConfirm: async () => {
                try {
                    await adminAPI.deleteOrder(id);
                    setOrders(prev => prev.filter(o => o.id !== id));
                    setSelectedIds(prev => { const s = new Set(prev); s.delete(id); return s; });
                    addAlert('Order deleted successfully');
                } catch (error) {
                    console.error('Delete failed:', error);
                    addAlert('Failed to delete order', 'error');
                }
            }
        });
    };

    const handleClearPending = async () => {
        const pendingOrders = orders.filter(o => o.status === 'PENDING' || o.status === 'Pending' || o.status === 'PENDING_PAYMENT');
        if (pendingOrders.length === 0) {
            addAlert('No pending orders to clear', 'info');
            return;
        }
        
        setConfirmModal({
            isOpen: true,
            title: 'Clear Pending Orders',
            message: `You are about to delete ${pendingOrders.length} pending orders. Are you sure?`,
            variant: 'danger',
            onConfirm: async () => {
                setLoading(true);
                try {
                    for (const order of pendingOrders) await adminAPI.deleteOrder(order.id);
                    await loadOrders();
                    addAlert(`Successfully cleared ${pendingOrders.length} orders`);
                } catch (err) {
                    console.error(err);
                    addAlert('Error clearing some orders', 'error');
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    // BULK ACTIONS
    const toggleSelectAll = () => {
        if (selectedIds.size === filteredOrders.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredOrders.map(o => o.id)));
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => {
            const s = new Set(prev);
            if (s.has(id)) s.delete(id); else s.add(id);
            return s;
        });
    };

    const handleBulkStatus = (newStatus: string) => {
        const ids = Array.from(selectedIds);
        if (ids.length === 0) return;
        const label = labelMap[newStatus] || newStatus;

        setConfirmModal({
            isOpen: true,
            title: 'Bulk Status Update',
            message: `Are you sure you want to mark ${ids.length} order(s) as "${label}"?`,
            variant: 'warning',
            onConfirm: async () => {
                setBulkUpdating(true);
                try {
                    // BUG-07 FIX: backend field is `state`, not `status`
                    await Promise.all(ids.map(id => adminAPI.updateOrder(id, { state: newStatus })));
                    setOrders(prev => prev.map(o => {
                        if (selectedIds.has(o.id)) {
                            const isPaid = newStatus === 'PAID' || newStatus === 'OPEN_FOR_BATCH';
                            return { 
                                ...o, 
                                status: newStatus,
                                payment_status: isPaid ? 'PAID' : o.payment_status,
                                amount_paid: isPaid ? o.total_amount : o.amount_paid,
                                balance_due: isPaid ? 0 : o.balance_due
                            };
                        }
                        return o;
                    }));
                    setSelectedIds(new Set());
                    addAlert(`Successfully updated ${ids.length} orders to ${label}`);
                } catch (err) {
                    console.error(err);
                    addAlert('Some orders failed to update', 'error');
                } finally {
                    setBulkUpdating(false);
                }
            }
        });
    };

    // Server-side filtering is now used, so filteredOrders is just orders
    const filteredOrders = orders;

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            PENDING: isDark ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-600',
            PROCESSING: isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600',
            IN_TRANSIT: isDark ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-100 text-indigo-600',
            ARRIVED: isDark ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-600',
            OUT_FOR_DELIVERY: isDark ? 'bg-orange-900/30 text-orange-400' : 'bg-orange-100 text-orange-600',
            DELIVERED: isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-600',
            CANCELLED: isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-600',
        };
        return colors[status] || colors.PENDING;
    };

    const getPaymentColor = (status: string) => {
        const colors: Record<string, string> = {
            PAID: isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-600',
            PARTIAL: isDark ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-600',
            PENDING: isDark ? 'bg-slate-900/30 text-slate-400' : 'bg-gray-100 text-gray-500',
            REFUNDED: isDark ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600',
        };
        return colors[status] || colors.PENDING;
    };

    const handleQuickUpdate = (orderId: string, newState: string, label: string) => {
        setConfirmModal({
            isOpen: true,
            title: `Confirm ${label}`,
            message: `Transition order to ${label}? This will trigger automated logistics notifications.`,
            variant: 'warning',
            onConfirm: async () => {
                setLoading(true);
                try {
                    await adminAPI.updateOrder(orderId, { state: newState });
                    addAlert(`Status updated to ${label}`);
                    await loadOrders();
                } catch (err) {
                    console.error(err);
                    addAlert('Update failed', 'error');
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    const statusCounts = useMemo(() => ({
        All: orders.length,
        PENDING_PAYMENT: orders.filter(o => o.payment_status !== 'PAID' && (o.status === 'PENDING_PAYMENT' || o.balance_due > 0)).length,
        PAID: orders.filter(o => o.status === 'PAID' || o.status === 'PROCESSING').length,
        OPEN_FOR_BATCH: orders.filter(o => o.status === 'OPEN_FOR_BATCH').length,
        IN_FULFILLMENT: orders.filter(o => o.status === 'IN_FULFILLMENT').length,
        IN_TRANSIT: orders.filter(o => o.status === 'IN_TRANSIT').length,
        ARRIVED: orders.filter(o => o.status === 'ARRIVED').length,
        OUT_FOR_DELIVERY: orders.filter(o => o.status === 'OUT_FOR_DELIVERY').length,
        DELIVERED: orders.filter(o => o.status === 'DELIVERED').length,
        CANCELLED: orders.filter(o => o.status === 'CANCELLED').length,
    }), [orders]);

    if (loading) {
        return (
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className={`h-16 rounded-lg animate-pulse ${isDark ? 'bg-slate-800' : 'bg-gray-200'}`}></div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-32">
            {/* 1. COMMAND HEADER */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-50 pb-12">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-slate-950 tracking-tighter">Order Management</h1>
                    <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900">{totalCount} ORDERS</span>
                        </div>
                        <span className="h-4 w-px bg-slate-200" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Total Sales: ₵{orders.reduce((sum, o) => sum + o.total_amount, 0).toLocaleString()}</span>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                        <input
                            type="text"
                            placeholder="SEARCH ORDERS..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-50 text-[10px] font-black uppercase tracking-widest outline-none focus:bg-white focus:border-slate-900 transition-all"
                        />
                    </div>
                    <button
                        onClick={handleClearPending}
                        className="flex items-center justify-center gap-3 px-8 py-4 bg-white border border-slate-100 text-slate-400 hover:text-red-600 hover:border-red-100 transition-all text-[10px] font-black uppercase tracking-widest w-full md:w-auto"
                    >
                        <X className="w-3.5 h-3.5" />
                        CLEAR PENDING ({statusCounts.PENDING_PAYMENT})
                    </button>
                </div>
            </div>

            {/* 2. PROTOCOL FILTERS */}
            <div className="overflow-x-auto pb-6 -mx-8 px-8 scrollbar-hide">
                <div className="flex gap-4 min-w-max">
                    {STATUS_TABS.map(s => (
                        <button
                            key={s}
                            onClick={() => { 
                                setStatusFilter(s); 
                                setCurrentPage(1);
                                setSelectedIds(new Set()); 
                            }}
                            className={`px-6 py-3 text-[10px] font-black uppercase tracking-[0.3em] transition-all border ${statusFilter === s
                                ? 'bg-slate-950 text-white border-slate-950 shadow-lg'
                                : 'bg-white text-slate-400 border-slate-100 hover:border-slate-900 hover:text-slate-900'
                                }`}
                        >
                            {statusLabel(s)}
                            <span className="ml-3 opacity-30 tabular-nums">[{statusCounts[s as keyof typeof statusCounts] || 0}]</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* 3. BULK EXECUTION BRIDGE */}
            <AnimatePresence>
                {selectedIds.size > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="sticky top-32 z-40 flex flex-wrap items-center gap-6 p-6 bg-slate-950 border border-slate-800 shadow-2xl"
                    >
                        <div className="flex items-center gap-4 border-r border-slate-800 pr-8">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">
                                {selectedIds.size} ORDERS SELECTED
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            {[
                                { status: 'IN_TRANSIT', label: 'SHIP TO GHANA', color: 'bg-white text-slate-950 hover:bg-emerald-500 hover:text-white' },
                                { status: 'ARRIVED', label: 'MARK AS ARRIVED', color: 'bg-white text-slate-950 hover:bg-emerald-500 hover:text-white' },
                                { status: 'DELIVERED', label: 'MARK AS DELIVERED', color: 'bg-white text-slate-950 hover:bg-emerald-500 hover:text-white' }
                            ].map(action => (
                                <button
                                    key={action.status}
                                    onClick={() => handleBulkStatus(action.status)}
                                    disabled={bulkUpdating}
                                    className={`px-6 py-3 text-[9px] font-black uppercase tracking-widest transition-all disabled:opacity-50 ${action.color}`}
                                >
                                    {action.label}
                                </button>
                            ))}
                            <button
                                onClick={() => setSelectedIds(new Set())}
                                className="px-6 py-3 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
                            >
                                CANCEL
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 4. MASTER REGISTRY TABLE */}
            <div className="bg-white border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-6 w-16">
                                    <button onClick={toggleSelectAll} className="flex items-center justify-center">
                                        {selectedIds.size === filteredOrders.length && filteredOrders.length > 0
                                            ? <CheckSquare className="w-4 h-4 text-slate-950" />
                                            : <Square className="w-4 h-4 text-slate-300" />
                                        }
                                    </button>
                                </th>
                                <th className="px-8 py-6 text-left text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Order ID</th>
                                <th className="px-8 py-6 text-left text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Item</th>
                                <th className="px-8 py-6 text-left text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Customer</th>
                                <th className="px-8 py-6 text-left text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 hidden lg:table-cell">Date</th>
                                <th className="px-8 py-6 text-left text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 hidden lg:table-cell">Status</th>
                                <th className="px-8 py-6 text-right text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">
                                    {statusFilter === 'PENDING_PAYMENT' ? 'Balance Due' : 'Total'}
                                </th>
                                <th className="px-8 py-6"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredOrders.map((order) => (
                                <OrderRow
                                    key={order.id}
                                    order={order}
                                    isDark={isDark}
                                    isSelected={selectedIds.has(order.id)}
                                    toggleSelect={toggleSelect}
                                    getStatusColor={getStatusColor}
                                    getPaymentColor={getPaymentColor}
                                    statusFilter={statusFilter}
                                    handleQuickUpdate={handleQuickUpdate}
                                    handleDelete={handleDelete}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredOrders.length === 0 && (
                    <div className="py-32 text-center">
                        <Package className="w-12 h-12 mx-auto mb-6 text-slate-100" strokeWidth={1} />
                        <p className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-300">No Orders Found</p>
                    </div>
                )}
            </div>

            {/* 5. ARCHIVE NAVIGATION */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between py-12 border-t border-slate-50">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">
                        Page <span className="text-slate-950">{currentPage}</span> / {totalPages}
                    </p>
                    <div className="flex gap-px bg-slate-100 border border-slate-100">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1 || loading}
                            className="px-6 py-4 bg-white hover:bg-slate-50 text-slate-900 disabled:opacity-30 transition-all"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        {[...Array(Math.min(5, totalPages))].map((_, i) => {
                            let pageNum = currentPage - 2 + i;
                            if (currentPage <= 2) pageNum = i + 1;
                            if (currentPage >= totalPages - 1) pageNum = totalPages - 4 + i;
                            if (pageNum < 1 || pageNum > totalPages) return null;
                            
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${currentPage === pageNum
                                        ? 'bg-slate-950 text-white'
                                        : 'bg-white text-slate-400 hover:text-slate-900'
                                    }`}
                                >
                                    {pageNum.toString().padStart(2, '0')}
                                </button>
                            );
                        })}
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages || loading}
                            className="px-6 py-4 bg-white hover:bg-slate-50 text-slate-900 disabled:opacity-30 transition-all"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                variant={confirmModal.variant}
            />

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

const OrderRow = React.memo(({ 
    order, 
    isDark, 
    isSelected, 
    toggleSelect, 
    getStatusColor, 
    getPaymentColor, 
    statusFilter,
    handleQuickUpdate, 
    handleDelete 
}: any) => {
    return (
        <tr className={`group transition-all duration-500 ${isSelected
                ? 'bg-slate-50'
                : 'bg-white hover:bg-slate-50/50'
            }`}
        >
            <td className="px-8 py-8">
                <button onClick={() => toggleSelect(order.id)}>
                    {isSelected
                        ? <CheckSquare className="w-4 h-4 text-slate-950" />
                        : <Square className="w-4 h-4 text-slate-200 group-hover:text-slate-400" />
                    }
                </button>
            </td>
            <td className="px-8 py-8">
                <div className="flex items-center gap-4">
                    <span className="font-mono text-[12px] font-black tracking-tighter text-slate-900">
                        #{order.order_number || order.id.slice(0, 8)}
                    </span>
                </div>
            </td>
            <td className="px-8 py-8">
                <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-lg overflow-hidden flex items-center justify-center relative group-hover:border-slate-900 transition-all">
                    {order.thumbnail ? (
                        <Image 
                            src={getImageUrl(order.thumbnail)} 
                            alt="Order Preview" 
                            fill 
                            className="object-cover"
                        />
                    ) : (
                        <Package size={16} className="text-slate-200" />
                    )}
                </div>
            </td>
            <td className="px-8 py-8">
                <div className="flex items-center gap-4">
                    <div className="w-8 h-8 border border-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:border-slate-900 group-hover:text-slate-900 transition-all">
                        {order.customer.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <p className="text-[11px] font-black uppercase tracking-widest truncate text-slate-950">{order.customer.name}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter truncate hidden sm:block italic">{order.customer.email}</p>
                    </div>
                </div>
            </td>
            <td className="px-8 py-8 hidden lg:table-cell">
                <p className="text-[10px] font-black text-slate-400 uppercase tabular-nums">
                    {new Date(order.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' }).toUpperCase()}
                </p>
            </td>
            <td className="px-8 py-8 hidden lg:table-cell">
                <div className="flex items-center gap-3">
                    <span className={`text-[9px] font-black uppercase tracking-[0.3em] ${
                        order.status === 'DELIVERED' ? 'text-emerald-600' : 
                        order.status === 'CANCELLED' ? 'text-red-600' : 'text-slate-400'
                    }`}>
                        {order.status.replace(/_/g, ' ')}
                    </span>
                    <div className="w-1 h-1 rounded-full bg-slate-200" />
                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${getPaymentColor(order.payment_status)}`}>
                        {order.payment_status}
                    </span>
                </div>
            </td>
            <td className="px-8 py-8 text-right">
                <span className="text-[12px] font-black text-slate-950 tabular-nums">
                    ₵{(statusFilter === 'PENDING_PAYMENT' ? Number(order.balance_due) : Number(order.total_amount)).toLocaleString()}
                </span>
            </td>
            <td className="px-8 py-8 text-right">
                <div className="flex justify-end items-center gap-6">
                    <div className="hidden group-hover:flex items-center gap-4 transition-all animate-in fade-in slide-in-from-right-2">
                        {order.status === 'PAID' && (
                            <button 
                                onClick={() => handleQuickUpdate(order.id, 'IN_TRANSIT', 'Ship to Ghana')}
                                className="text-[9px] font-black uppercase tracking-widest px-4 py-2 border border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white transition-all"
                            >
                                SHIP ORDER
                            </button>
                        )}
                        <button
                            onClick={() => handleDelete(order.id)}
                            className="p-2 text-slate-300 hover:text-red-600 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                        <Link
                            href={`/dashboard/admin/orders/${order.id}`}
                            className="p-2 text-slate-300 hover:text-slate-900 transition-colors"
                        >
                            <Eye className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </td>
        </tr>
    );
});
