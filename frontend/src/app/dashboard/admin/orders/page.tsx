/**
 * London's Imports - Admin Order Management
 * View and manage all orders
 */
'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/providers/ThemeProvider';

export default function AdminOrdersPage() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [selectedOrder, setSelectedOrder] = useState<any>(null);

    useEffect(() => {
        // Mock data - replace with API call
        setOrders([
            { id: '1', order_number: 'ORD-2024-001', customer: { name: 'John Doe', email: 'john@example.com' }, items: 3, total: 125.00, status: 'PENDING', payment_status: 'PAID', created_at: '2024-12-27T10:30:00' },
            { id: '2', order_number: 'ORD-2024-002', customer: { name: 'Jane Smith', email: 'jane@example.com' }, items: 1, total: 89.50, status: 'COMPLETED', payment_status: 'PAID', created_at: '2024-12-26T15:45:00' },
            { id: '3', order_number: 'ORD-2024-003', customer: { name: 'Mike Johnson', email: 'mike@example.com' }, items: 5, total: 234.00, status: 'PROCESSING', payment_status: 'PAID', created_at: '2024-12-26T09:20:00' },
            { id: '4', order_number: 'ORD-2024-004', customer: { name: 'Sarah Wilson', email: 'sarah@example.com' }, items: 2, total: 67.25, status: 'COMPLETED', payment_status: 'PAID', created_at: '2024-12-25T14:10:00' },
            { id: '5', order_number: 'ORD-2024-005', customer: { name: 'Tom Brown', email: 'tom@example.com' }, items: 4, total: 156.75, status: 'CANCELLED', payment_status: 'REFUNDED', created_at: '2024-12-25T11:30:00' },
            { id: '6', order_number: 'ORD-2024-006', customer: { name: 'Alice Cooper', email: 'alice@example.com' }, items: 2, total: 98.00, status: 'PENDING', payment_status: 'PENDING', created_at: '2024-12-24T16:45:00' },
        ]);
        setLoading(false);
    }, []);

    const filteredOrders = orders.filter(order => {
        return statusFilter === 'ALL' || order.status === statusFilter;
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
                    {orders.length} orders • GHS {orders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}
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
                        {filteredOrders.map((order) => (
                            <tr key={order.id} className={`${isDark ? 'hover:bg-slate-800/50' : 'hover:bg-gray-50'} transition-colors`}>
                                <td className="px-6 py-4">
                                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>#{order.order_number}</p>
                                    <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                                        {new Date(order.created_at).toLocaleString()}
                                    </p>
                                </td>
                                <td className="px-6 py-4">
                                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{order.customer.name}</p>
                                    <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>{order.customer.email}</p>
                                </td>
                                <td className={`px-6 py-4 text-sm ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                                    {order.items} items
                                </td>
                                <td className={`px-6 py-4 text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    GHS {order.total.toFixed(2)}
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
                                    <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>GHS {selectedOrder.total.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className={`text-xs font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Items</p>
                                    <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedOrder.items}</p>
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
