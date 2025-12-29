/**
 * London's Imports - Admin Order Management
 * View and manage all orders
 */
'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/providers/ThemeProvider';
import { adminAPI } from '@/lib/api';
import { Search, Filter, ChevronRight, Eye, MoreVertical, X } from 'lucide-react';

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
            <div className="flex items-center justify-between">
                <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Order Management</h2>
                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                    {orders.length} orders • GHS {orders.reduce((sum, o) => sum + o.total_amount, 0).toLocaleString()}
                </span>
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
                                            onClick={() => setSelectedOrder(order)}
                                            className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-gray-100 text-gray-500'}`}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedOrder(null)}>
                    <div
                        className={`w-full max-w-lg rounded-xl p-6 ${isDark ? 'bg-slate-900' : 'bg-white'}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Order #{selectedOrder.order_number}
                            </h3>
                            <button onClick={() => setSelectedOrder(null)} className={`p-1 rounded ${isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-100'}`}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-gray-50'}`}>
                                <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedOrder.customer.name}</p>
                                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{selectedOrder.customer.email}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className={`text-xs font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Total Amount</p>
                                    <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>GHS {selectedOrder.total_amount.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className={`text-xs font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Items</p>
                                    <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedOrder.items?.length || 0} items</p>
                                </div>
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Update Status</label>
                                <select
                                    defaultValue={selectedOrder.status}
                                    className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                                >
                                    <option value="PENDING">Pending</option>
                                    <option value="PROCESSING">Processing</option>
                                    <option value="COMPLETED">Completed</option>
                                    <option value="CANCELLED">Cancelled</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className={`flex-1 py-2 rounded-lg border font-medium ${isDark ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="flex-1 py-2 rounded-lg bg-pink-500 text-white font-medium hover:bg-pink-600"
                            >
                                Update Order
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
