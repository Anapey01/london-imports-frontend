/**
 * London's Imports - Admin Order Management
 * View, filter, and bulk-manage all orders
 */
'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { useTheme } from '@/providers/ThemeProvider';
import { adminAPI } from '@/lib/api';
import { getImageUrl } from '@/lib/image';
import {
    ChevronRight, ChevronLeft, Eye, Trash2, Package, CheckCircle, X, CheckSquare, Square, Search
} from 'lucide-react';

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

function mapAPIOrder(order: APIOrder): Order {
    const customerObj = typeof order.customer === 'object' && order.customer !== null 
        ? order.customer 
        : { name: String(order.customer || 'Anonymous User'), email: '', avatar: '' };

    return {
        id: order.id,
        order_number: order.order_number,
        customer: {
            name: customerObj.name,
            email: customerObj.email,
            avatar: customerObj.avatar
        },
        items_count: order.items_count || (order.items as unknown[])?.length || 0,
        total_amount: typeof order.total === 'string' ? parseFloat(order.total) : (order.total || 0),
        status: order.status || 'PENDING',
        payment_status: order.payment_status || 'PENDING',
        amount_paid: typeof order.amount_paid === 'string' ? parseFloat(order.amount_paid) : (order.amount_paid || 0),
        balance_due: typeof order.balance_due === 'string' ? parseFloat(order.balance_due) : (order.balance_due || 0),
        is_installment: !!order.is_installment,
        created_at: order.created_at,
        thumbnail: order.thumbnail,
        items: order.items as Order['items'] || []
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

    const loadOrders = useCallback(async () => {
        setLoading(true);
        try {
            const params: any = { 
                page: currentPage,
                search: searchTerm || undefined
            };
            if (statusFilter !== 'All' && statusFilter !== 'ALL') {
                params.status = statusFilter;
            }
            
            const response = await adminAPI.orders(params);
            const data = response.data;
            
            // Handle DRF paginated response
            const ordersData = data.results || data || [];
            setOrders(ordersData.map(mapAPIOrder));
            
            // Assume 20 items per page if count/results present
            if (data.count !== undefined) {
                setTotalCount(data.count);
                setTotalPages(Math.ceil(data.count / 20)); // Adjust based on backend PAGE_SIZE
            }
        } catch (err) {
            console.error('Failed to load orders:', err);
        } finally {
            setLoading(false);
        }
    }, [currentPage, statusFilter, searchTerm]);

    useEffect(() => { loadOrders(); }, [loadOrders]);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this order?')) return;
        try {
            await adminAPI.deleteOrder(id);
            setOrders(prev => prev.filter(o => o.id !== id));
            setSelectedIds(prev => { const s = new Set(prev); s.delete(id); return s; });
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Failed to delete order');
        }
    };

    const handleClearPending = async () => {
        const pendingOrders = orders.filter(o => o.status === 'PENDING' || o.status === 'Pending');
        if (pendingOrders.length === 0) { alert('No pending orders to clear'); return; }
        if (!confirm(`Delete ${pendingOrders.length} pending orders? This cannot be undone.`)) return;
        setLoading(true);
        try {
            for (const order of pendingOrders) await adminAPI.deleteOrder(order.id);
            await loadOrders();
            alert('Pending orders cleared');
        } catch (err) {
            console.error(err);
            alert('Failed to clear some orders');
        } finally {
            setLoading(false);
        }
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

    const handleBulkStatus = async (newStatus: string) => {
        const ids = Array.from(selectedIds);
        if (ids.length === 0) return;
        const labelMap: Record<string, string> = {
            IN_TRANSIT: 'In Transit',
            ARRIVED: 'Arrived',
            DELIVERED: 'Delivered',
            OUT_FOR_DELIVERY: 'Out for Delivery',
            CANCELLED: 'Cancelled',
        };
        const label = labelMap[newStatus] || newStatus;
        if (!confirm(`Mark ${ids.length} order(s) as "${label}"?`)) return;
        setBulkUpdating(true);
        try {
            // BUG-07 FIX: backend field is `state`, not `status`
            await Promise.all(ids.map(id => adminAPI.updateOrder(id, { state: newStatus })));
            setOrders(prev => prev.map(o => selectedIds.has(o.id) ? { ...o, status: newStatus } : o));
            setSelectedIds(new Set());
        } catch (err) {
            console.error(err);
            alert('Some orders failed to update.');
        } finally {
            setBulkUpdating(false);
        }
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

    // BUG-06 FIX: STATUS_TABS now maps to real backend OrderState values (removed fake 'PROCESSING')
    const STATUS_TABS = ['All', 'PENDING_PAYMENT', 'PAID', 'OPEN_FOR_BATCH', 'IN_FULFILLMENT', 'IN_TRANSIT', 'ARRIVED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'] as const;
    const statusCounts: Record<string, number> = {
        All: orders.length,
        PENDING_PAYMENT: orders.filter(o => o.status === 'PENDING_PAYMENT' || o.balance_due > 0).length,
        PAID: orders.filter(o => o.status === 'PAID' || o.status === 'PROCESSING').length,
        OPEN_FOR_BATCH: orders.filter(o => o.status === 'OPEN_FOR_BATCH').length,
        IN_FULFILLMENT: orders.filter(o => o.status === 'IN_FULFILLMENT').length,
        IN_TRANSIT: orders.filter(o => o.status === 'IN_TRANSIT').length,
        ARRIVED: orders.filter(o => o.status === 'ARRIVED').length,
        OUT_FOR_DELIVERY: orders.filter(o => o.status === 'OUT_FOR_DELIVERY').length,
        DELIVERED: orders.filter(o => o.status === 'DELIVERED').length,
        CANCELLED: orders.filter(o => o.status === 'CANCELLED').length,
    };

    const statusLabel = (s: string) => s === 'All' ? 'All' : s.replace(/_/g, ' ');

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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Order Management</h2>
                    <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                        {orders.length} orders • GHS {orders.reduce((sum, o) => sum + o.total_amount, 0).toLocaleString()}
                    </span>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-gray-400'}`} />
                        <input
                            type="text"
                            placeholder="Find orders or customers..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className={`w-full pl-10 pr-4 py-2 rounded-xl text-sm border focus:ring-2 focus:ring-pink-500 outline-none transition-all ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-100 text-gray-900'}`}
                        />
                    </div>
                    <button
                        onClick={handleClearPending}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto"
                    >
                        <X className="w-4 h-4" />
                        Clear Pending ({statusCounts.PENDING})
                    </button>
                </div>
            </div>

            {/* Status Filters */}
            <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
                <div className="flex gap-2 min-w-max">
                    {STATUS_TABS.map(s => (
                        <button
                            key={s}
                            onClick={() => { 
                                setStatusFilter(s); 
                                setCurrentPage(1); // Reset to first page
                                setSelectedIds(new Set()); 
                            }}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${statusFilter === s
                                ? 'bg-pink-500 text-white'
                                : isDark
                                    ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {statusLabel(s)}
                            {statusFilter === 'All' && s === 'All' && <span className="ml-2 opacity-70">({totalCount})</span>}
                            {statusFilter !== 'All' && s === statusFilter && <span className="ml-2 opacity-70">({totalCount})</span>}
                        </button>
                    ))}
                </div>
            </div>

            {/* BULK ACTION TOOLBAR — appears when selection is active */}
            {selectedIds.size > 0 && (
                <div className={`flex flex-wrap items-center gap-3 p-3 rounded-xl border-2 border-pink-200 ${isDark ? 'bg-slate-800 border-pink-900/40' : 'bg-pink-50'}`}>
                    <span className={`text-sm font-semibold ${isDark ? 'text-pink-400' : 'text-pink-700'}`}>
                        {selectedIds.size} order{selectedIds.size > 1 ? 's' : ''} selected
                    </span>
                    <div className="flex flex-wrap gap-2 ml-auto">
                        <button
                            onClick={() => handleBulkStatus('IN_TRANSIT')}
                            disabled={bulkUpdating}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
                        >
                            <Package className="w-4 h-4" />
                            Mark In Transit
                        </button>
                        <button
                            onClick={() => handleBulkStatus('ARRIVED')}
                            disabled={bulkUpdating}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
                        >
                            <CheckCircle className="w-4 h-4" />
                            Mark Arrived
                        </button>
                        <button
                            onClick={() => handleBulkStatus('DELIVERED')}
                            disabled={bulkUpdating}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
                        >
                            <CheckCircle className="w-4 h-4" />
                            Mark Delivered
                        </button>
                        <button
                            onClick={() => setSelectedIds(new Set())}
                            disabled={bulkUpdating}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isDark ? 'text-slate-400 hover:bg-slate-700' : 'text-gray-500 hover:bg-gray-200'}`}
                        >
                            Clear
                        </button>
                    </div>
                </div>
            )}

            {/* Mobile View: Cards */}
            <div className="md:hidden space-y-4">
                {filteredOrders.map((order) => (
                    <div
                        key={order.id}
                        className={`p-4 rounded-xl border shadow-sm transition-colors ${selectedIds.has(order.id)
                            ? isDark ? 'bg-pink-900/20 border-pink-700' : 'bg-pink-50 border-pink-300'
                            : isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'
                            }`}
                    >
                        {/* Checkbox + Header */}
                        <div className="flex justify-between items-start mb-4 pb-3 border-b border-gray-100 dark:border-slate-700">
                            <div className="flex items-center gap-3">
                                <button onClick={() => toggleSelect(order.id)} className="shrink-0">
                                    {selectedIds.has(order.id)
                                        ? <CheckSquare className="w-5 h-5 text-pink-500" />
                                        : <Square className={`w-5 h-5 ${isDark ? 'text-slate-600' : 'text-gray-300'}`} />
                                    }
                                </button>
                                <div>
                                    <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        #{order.order_number || order.id.slice(0, 8)}
                                    </p>
                                    <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
                                        {new Date(order.created_at).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(order.status)}`}>
                                {order.status.replace(/_/g, ' ')}
                            </span>
                        </div>

                        {/* Customer Info */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`relative w-12 h-12 rounded-lg overflow-hidden shrink-0 ${isDark ? 'bg-slate-700' : 'bg-gray-100'}`}>
                                {order.thumbnail ? (
                                    <Image
                                        src={getImageUrl(order.thumbnail)}
                                        alt="Order Item"
                                        width={48}
                                        height={48}
                                        className="w-full h-full object-cover"
                                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                                    />
                                ) : (
                                    <div className={`w-full h-full flex items-center justify-center text-sm font-bold ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                                        {order.customer.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {order.customer.name}
                                </p>
                                <p className={`text-xs truncate ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                    {order.customer.email}
                                </p>
                            </div>
                        </div>

                        {/* Stats Row */}
                        <div className={`flex justify-between items-center py-3 rounded-lg px-3 mb-4 ${isDark ? 'bg-slate-900/50' : 'bg-gray-50'}`}>
                            <div className="text-center">
                                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>Items</p>
                                <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{order.items_count}</p>
                            </div>
                            <div className="text-center border-l border-gray-200 dark:border-slate-700 pl-4 ml-4">
                                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>Total</p>
                                <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>GHS {order.total_amount.toFixed(2)}</p>
                            </div>
                            <div className="text-center border-l border-gray-200 dark:border-slate-700 pl-4 ml-4">
                                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>Payment</p>
                                <div className="flex flex-col items-center gap-1">
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight ${getPaymentColor(order.payment_status)}`}>
                                        {order.payment_status === 'PARTIAL' ? 'Installment' : order.payment_status}
                                    </span>
                                    <p className={`text-[9px] font-bold ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                                        GHS {order.amount_paid.toFixed(0)} / {order.total_amount.toFixed(0)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => handleDelete(order.id)}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors border ${isDark ? 'border-red-900/30 text-red-400 hover:bg-red-900/20' : 'border-red-100 text-red-600 hover:bg-red-50'}`}
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete
                            </button>
                            <a
                                href={`/dashboard/admin/orders/${order.id}`}
                                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors bg-gray-900 text-white hover:bg-gray-800"
                            >
                                <Eye className="w-4 h-4" />
                                View Details
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop View: Table */}
            <div className={`hidden md:block rounded-xl border overflow-hidden ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-100'}`}>
                <table className="w-full">
                    <thead className={`${isDark ? 'bg-slate-800' : 'bg-gray-50'}`}>
                        <tr>
                            <th className="px-4 py-3 w-10">
                                <button onClick={toggleSelectAll} className="flex items-center justify-center" title="Select All">
                                    {selectedIds.size === filteredOrders.length && filteredOrders.length > 0
                                        ? <CheckSquare className="w-5 h-5 text-pink-500" />
                                        : <Square className={`w-5 h-5 ${isDark ? 'text-slate-600' : 'text-gray-300'}`} />
                                    }
                                </button>
                            </th>
                            <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Order</th>
                            <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Customer</th>
                            <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Items</th>
                            <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Total</th>
                            <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Status</th>
                            <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Payment</th>
                            <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Quick Action</th>
                            <th className={`px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Actions</th>
                        </tr>
                    </thead>
                    <tbody className={`divide-y ${isDark ? 'divide-slate-700' : 'divide-gray-100'}`}>
                        {filteredOrders.map((order) => (
                            <tr
                                key={order.id}
                                className={`transition-colors ${selectedIds.has(order.id)
                                    ? isDark ? 'bg-pink-900/20' : 'bg-pink-50'
                                    : isDark ? 'hover:bg-slate-800/50' : 'hover:bg-gray-50'
                                    }`}
                            >
                                <td className="px-4 py-4">
                                    <button onClick={() => toggleSelect(order.id)}>
                                        {selectedIds.has(order.id)
                                            ? <CheckSquare className="w-5 h-5 text-pink-500" />
                                            : <Square className={`w-5 h-5 ${isDark ? 'text-slate-600' : 'text-gray-300'}`} />
                                        }
                                    </button>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        {order.thumbnail && (
                                            <div className="relative w-10 h-10 rounded-md overflow-hidden shrink-0 border border-gray-200 dark:border-slate-700">
                                                <Image
                                                    src={getImageUrl(order.thumbnail)}
                                                    alt="Thumbnail"
                                                    width={40}
                                                    height={40}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                                                />
                                            </div>
                                        )}
                                        <div>
                                            <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                #{order.order_number || order.id.slice(0, 8)}...
                                            </p>
                                            <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                                                {new Date(order.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{order.customer.name}</p>
                                    <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>{order.customer.email}</p>
                                </td>
                                <td className={`px-6 py-4 text-sm ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                                    {order.items_count} items
                                </td>
                                <td className={`px-6 py-4 text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    GHS {order.total_amount.toFixed(2)}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(order.status)}`}>
                                        {order.status.replace(/_/g, ' ')}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1">
                                        <span className={`text-[10px] w-fit px-2 py-0.5 rounded-full font-bold uppercase tracking-tight ${getPaymentColor(order.payment_status)}`}>
                                            {order.payment_status === 'PARTIAL' ? 'Installment' : order.payment_status}
                                        </span>
                                        <p className={`text-[11px] font-bold ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                                            GHS {order.amount_paid.toFixed(2)} / {order.total_amount.toFixed(2)}
                                        </p>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {order.status === 'PAID' && (
                                        <button 
                                            onClick={() => adminAPI.updateOrder(order.id, { state: 'IN_TRANSIT' }).then(() => loadOrders())}
                                            className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                        >
                                            Ship to Ghana
                                        </button>
                                    )}
                                    {(order.status === 'OPEN_FOR_BATCH' || order.status === 'IN_FULFILLMENT') && (
                                        <button 
                                            onClick={() => adminAPI.updateOrder(order.id, { state: 'IN_TRANSIT' }).then(() => loadOrders())}
                                            className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                        >
                                            Ship to Ghana
                                        </button>
                                    )}
                                    {order.status === 'IN_TRANSIT' && (
                                        <button 
                                            onClick={() => adminAPI.updateOrder(order.id, { state: 'ARRIVED' }).then(() => loadOrders())}
                                            className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                                        >
                                            Arrived at Hub
                                        </button>
                                    )}
                                    {order.status === 'ARRIVED' && (
                                        <button 
                                            onClick={() => adminAPI.updateOrder(order.id, { state: 'OUT_FOR_DELIVERY' }).then(() => loadOrders())}
                                            className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                                        >
                                            Last Mile
                                        </button>
                                    )}
                                    {order.status === 'OUT_FOR_DELIVERY' && (
                                        <button 
                                            onClick={() => adminAPI.updateOrder(order.id, { state: 'DELIVERED' }).then(() => loadOrders())}
                                            className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                                        >
                                            Complete
                                        </button>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => handleDelete(order.id)}
                                            className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-red-900/30 text-red-400' : 'hover:bg-red-50 text-red-500'}`}
                                            title="Delete Order"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <a
                                            href={`/dashboard/admin/orders/${order.id}`}
                                            className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-gray-100 text-gray-500'}`}
                                            title="View Details"
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </a>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredOrders.length === 0 && (
                    <div className={`py-16 text-center ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                        <Package className="w-10 h-10 mx-auto mb-3 opacity-50" />
                        <p className="font-medium">No orders found</p>
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className={`flex items-center justify-between p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-100'}`}>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                        Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages}</span>
                        <span className="ml-2">({totalCount} total)</span>
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1 || loading}
                            className={`p-2 rounded-lg border transition-colors disabled:opacity-50 ${isDark ? 'border-slate-700 hover:bg-slate-700 text-white' : 'border-gray-100 hover:bg-gray-50 text-gray-900'}`}
                            title="Previous Page"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        {[...Array(Math.min(5, totalPages))].map((_, i) => {
                            // Simple logic to show pages around current
                            let pageNum = currentPage - 2 + i;
                            if (currentPage <= 2) pageNum = i + 1;
                            if (currentPage >= totalPages - 1) pageNum = totalPages - 4 + i;
                            
                            if (pageNum < 1 || pageNum > totalPages) return null;
                            
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${currentPage === pageNum
                                        ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30'
                                        : isDark 
                                            ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' 
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages || loading}
                            className={`p-2 rounded-lg border transition-colors disabled:opacity-50 ${isDark ? 'border-slate-700 hover:bg-slate-700 text-white' : 'border-gray-100 hover:bg-gray-50 text-gray-900'}`}
                            title="Next Page"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
