'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/providers/ThemeProvider';
import { vendorsAPI } from '@/lib/api';
import Link from 'next/link';

interface OrderSummary {
    id: string;
    order_number: string;
    created_at: string;
    state: string;
    total: string;
}

export default function VendorOrdersPage() {
    const { theme } = useTheme();
    const [orders, setOrders] = useState<OrderSummary[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await vendorsAPI.orders();
                setOrders(response.data);
            } catch (error) {
                console.error('Failed to fetch orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const isDark = theme === 'dark';

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                <div className="h-64 w-full bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Orders
            </h1>

            <div className={`rounded-xl border shadow-sm overflow-hidden ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className={`text-xs uppercase font-medium ${isDark ? 'bg-slate-950/50 text-slate-400' : 'bg-gray-50 text-gray-500'}`}>
                            <tr>
                                <th className="px-6 py-4 text-left">Order #</th>
                                <th className="px-6 py-4 text-left">Date</th>
                                <th className="px-6 py-4 text-left">Status</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-gray-100'}`}>
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No orders found.
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id} className={`group transition-colors ${isDark ? 'hover:bg-slate-800/50' : 'hover:bg-gray-50'}`}>
                                        <td className="px-6 py-4">
                                            <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                #{order.order_number}
                                            </span>
                                        </td>
                                        <td className={`px-6 py-4 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${order.state === 'DELIVERED'
                                                ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                                : order.state === 'CANCELLED'
                                                    ? 'bg-red-500/10 text-red-500 border-red-500/20'
                                                    : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                                }`}>
                                                {order.state.replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={`/dashboard/vendor/orders/${order.order_number}`}
                                                className="text-pink-500 hover:text-pink-400 font-medium text-sm transition-colors"
                                            >
                                                View Details
                                            </Link>
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
