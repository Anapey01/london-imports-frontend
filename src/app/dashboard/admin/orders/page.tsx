/**
 * London's Imports - Admin Order Management
 * View and manage all orders
 */
'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/providers/ThemeProvider';
import { adminAPI } from '@/lib/api';
import { Search, Filter, ChevronRight, Eye, MoreVertical, X, Trash2 } from 'lucide-react';

interface Order {
    id: string;
    order_number?: string; // Optional if not always present
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
    items?: Array<{
        id: number;
        product_name: string;
        quantity: number;
        price: number;
    }>;
}

export default function AdminOrdersPage() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [error, setError] = useState('');

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this order?')) return;
        try {
            await adminAPI.deleteOrder(id);
            setOrders(prev => prev.filter(o => o.id !== id));
        } catch (err) {
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
            setOrders(ordersData.map((order: any) => ({
                id: order.id,
                order_number: order.order_number,
                customer: {
                    name: order.customer.name,
                    email: order.customer.email,
                    avatar: order.customer.avatar
                },
                items_count: order.items_count || order.items?.length || 0,
                total_amount: parseFloat(order.total) || 0,
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
                setOrders(ordersData.map((order: any) => ({
                    id: order.id,
                    order_number: order.order_number,
                    customer: {
                        name: order.customer.name,
                        email: order.customer.email,
                        avatar: order.customer.avatar
                    },
                    items_count: order.items_count || order.items?.length || 0,
                    total_amount: parseFloat(order.total) || 0,
                    status: order.status || 'PENDING',
                    payment_status: order.payment_status || 'PENDING',
                    created_at: order.created_at,
                    items: order.items || []
                })));
            } catch (err: any) {
                console.error('Failed to load orders:', err);
                setError('Failed to load orders');
            } finally {
                setLoading(false);
            }
        };
        loadOrders();
    }, []);

    const filteredOrders = orders.filter((order: Order) => {
        const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customer.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
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
                    className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg text-sm font-medium transition-colors"
                >
                    <X className="w-4 h-4" />
                    Clear Pending ({statusCounts.PENDING})
                </button>
            </div>

            {/* Status Filters */}
            <div className="flex flex-wrap gap-2">
                {(['ALL', 'PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED'] as const).map((status) => (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === status
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

            {/* Orders Table */}
            <div className={`rounded-xl border overflow-hidden ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-100'}`}>
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
                                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>#{order.id}</p>
                                    <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                                        {new Date(order.created_at).toLocaleString()}
                                    </p>
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
