/**
 * London's Imports - Admin Order Management
 * View and manage all orders
 */
'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/providers/ThemeProvider';
import { adminAPI } from '@/lib/api';
import { getImageUrl } from '@/lib/image';
import { ChevronRight, Eye, X, Trash2 } from 'lucide-react';


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
    created_at: string;
    thumbnail?: string;
}

export default function AdminOrdersPage() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('All');

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this order?')) return;
        try {
            await adminAPI.deleteOrder(id);
            setOrders(prev => prev.filter(o => o.id !== id));
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Failed to delete order');
        }
    };

    const handleClearPending = async () => {
        const pendingOrders = orders.filter(o => o.status === 'PENDING' || o.status === 'Pending');
        if (pendingOrders.length === 0) {
            alert('No pending orders to clear');
            return;
        }

        if (!confirm(`Are you sure you want to delete ${pendingOrders.length} pending orders? This cannot be undone.`)) return;

        setLoading(true);
        try {
            // Delete sequentially
            for (const order of pendingOrders) {
                await adminAPI.deleteOrder(order.id);
            }

            // Reload
            const response = await adminAPI.orders();
            const ordersData = response.data.results || response.data || [];
            setOrders(ordersData.map((order: APIOrder) => ({
                id: order.id,
                order_number: order.order_number,
                customer: {
                    name: order.customer.name,
                    email: order.customer.email,
                    avatar: order.customer.avatar
                },
                items_count: order.items_count || order.items?.length || 0,
                total_amount: typeof order.total === 'string' ? parseFloat(order.total) : (order.total || 0),
                status: order.status || 'PENDING',
                payment_status: order.payment_status || 'PENDING',
                created_at: order.created_at,
                items: order.items || []
            })));
            alert('Pending orders cleared');
        } catch (err) {
            console.error(err);
            alert('Failed to clear some orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const loadOrders = async () => {
            try {
                const response = await adminAPI.orders();
                const ordersData = response.data.results || response.data || [];
                setOrders(ordersData.map((order: APIOrder) => ({
                    id: order.id,
                    order_number: order.order_number,
                    customer: {
                        name: order.customer.name,
                        email: order.customer.email,
                        avatar: order.customer.avatar
                    },
                    items_count: order.items_count || order.items?.length || 0,
                    total_amount: typeof order.total === 'string' ? parseFloat(order.total) : (order.total || 0),
                    status: order.status || 'PENDING',
                    payment_status: order.payment_status || 'PENDING',
                    created_at: order.created_at,
                    thumbnail: order.thumbnail,
                    items: order.items || []
                })));
            } catch (err: unknown) {
                console.error('Failed to load orders:', err);
            } finally {
                setLoading(false);
            }
        };
        loadOrders();
    }, []);

    const filteredOrders = orders.filter((order: Order) => {
        const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
        return matchesStatus;
    });

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            PENDING: isDark ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-600',
            PROCESSING: isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600',
            COMPLETED: isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-600',
            CANCELLED: isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-600',
        };
        return colors[status] || colors.PENDING;
    };

    const getPaymentColor = (status: string) => {
        const colors: Record<string, string> = {
            PAID: isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-600',
            PENDING: isDark ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-600',
            REFUNDED: isDark ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600',
        };
        return colors[status] || colors.PENDING;
    };

    const statusCounts = {
        ALL: orders.length,
        PENDING: orders.filter(o => o.status === 'PENDING').length,
        PROCESSING: orders.filter(o => o.status === 'PROCESSING').length,
        COMPLETED: orders.filter(o => o.status === 'COMPLETED').length,
        CANCELLED: orders.filter(o => o.status === 'CANCELLED').length,
    };

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
                <button
                    onClick={handleClearPending}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto"
                >
                    <X className="w-4 h-4" />
                    Clear Pending ({statusCounts.PENDING})
                </button>
            </div>

            {/* Status Filters - Scrollable on mobile */}
            <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
                <div className="flex gap-2 min-w-max">
                    {(['ALL', 'PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED'] as const).map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${statusFilter === status
                                ? 'bg-pink-500 text-white'
                                : isDark
                                    ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
                            <span className="ml-2 opacity-70">({statusCounts[status]})</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Mobile View: Cards */}
            <div className="md:hidden space-y-4">
                {filteredOrders.map((order) => (
                    <div
                        key={order.id}
                        className={`p-4 rounded-xl border shadow-sm ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}
                    >
                        {/* Header: ID + Date */}
                        <div className="flex justify-between items-start mb-4 pb-3 border-b border-gray-100 dark:border-slate-700">
                            <div>
                                <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    #{order.order_number || order.id.slice(0, 8)}
                                </p>
                                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
                                    {new Date(order.created_at).toLocaleString()}
                                </p>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(order.status)}`}>
                                {order.status}
                            </span>
                        </div>

                        {/* Customer Info & Thumbnail */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`relative w-12 h-12 rounded-lg overflow-hidden shrink-0 ${isDark ? 'bg-slate-700' : 'bg-gray-100'}`}>
                                {order.thumbnail ? (
                                    <img
                                        src={getImageUrl(order.thumbnail)}
                                        alt="Order Item"
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
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getPaymentColor(order.payment_status)}`}>
                                    {order.payment_status}
                                </span>
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
                                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors bg-gray-900 text-white hover:bg-gray-800`}
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
                            <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Order</th>
                            <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Customer</th>
                            <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Items</th>
                            <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Total</th>
                            <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Status</th>
                            <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Payment</th>
                            <th className={`px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Actions</th>
                        </tr>
                    </thead>
                    <tbody className={`divide-y ${isDark ? 'divide-slate-700' : 'divide-gray-100'}`}>
                        {filteredOrders.map((order: Order) => (
                            <tr key={order.id} className={`${isDark ? 'hover:bg-slate-800/50' : 'hover:bg-gray-50'} transition-colors`}>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        {order.thumbnail && (
                                            <div className="relative w-10 h-10 rounded-md overflow-hidden shrink-0 border border-gray-200 dark:border-slate-700">
                                                <img
                                                    src={getImageUrl(order.thumbnail)}
                                                    alt="Thumbnail"
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
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPaymentColor(order.payment_status)}`}>
                                        {order.payment_status}
                                    </span>
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
            </div>


        </div>
    );
}
