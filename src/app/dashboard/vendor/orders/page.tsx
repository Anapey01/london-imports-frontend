'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/providers/ThemeProvider';
import { vendorsAPI } from '@/lib/api';
import Link from 'next/link';
import { ShoppingBag, ChevronRight, PackageCheck } from 'lucide-react';

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
                const data = response.data?.results || response.data;
                setOrders(Array.isArray(data) ? data : []);
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
                <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
                <div className="h-64 w-full bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className={`text-xl md:text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Order Fulfillment
                    </h1>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Monitor client purchases and dispatch statuses
                    </p>
                </div>
            </div>

            <div className={`rounded-2xl border shadow-sm overflow-hidden ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80'
            }`}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className={`text-[11px] uppercase font-semibold tracking-wider ${
                            isDark ? 'bg-slate-950/60 text-slate-400 border-b border-slate-800' : 'bg-slate-50 text-slate-500 border-b border-slate-100'
                        }`}>
                            <tr>
                                <th className="px-6 py-3.5 text-left">Order Reference</th>
                                <th className="px-6 py-3.5 text-left">Date Placed</th>
                                <th className="px-6 py-3.5 text-left">Fulfillment Status</th>
                                <th className="px-6 py-3.5 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y text-sm ${isDark ? 'divide-slate-800/80' : 'divide-slate-100'}`}>
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                                isDark ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-400'
                                            }`}>
                                                <PackageCheck className="w-6 h-6" />
                                            </div>
                                            <p className={`font-semibold text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                                No incoming orders yet
                                            </p>
                                            <p className="text-xs text-slate-400 max-w-sm">
                                                When customers purchase items from your inventory, their order details will appear here for fulfillment.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id} className={`group transition-colors ${
                                        isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50/70'
                                    }`}>
                                        <td className="px-6 py-4">
                                            <span className={`font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                                #{order.order_number}
                                            </span>
                                        </td>
                                        <td className={`px-6 py-4 text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                            {new Date(order.created_at).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${
                                                order.state === 'DELIVERED'
                                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                                    : order.state === 'CANCELLED'
                                                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                                                        : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                                            }`}>
                                                {order.state.replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={`/dashboard/vendor/orders/${order.order_number}`}
                                                className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                                                    isDark
                                                        ? 'border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
                                                        : 'border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                                                }`}
                                            >
                                                <span>View Details</span>
                                                <ChevronRight className="w-3.5 h-3.5" />
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
