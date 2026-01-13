'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTheme } from '@/providers/ThemeProvider';
import { vendorsAPI } from '@/lib/api';
import Image from 'next/image';

interface OrderDetail {
    id: string;
    order_number: string;
    created_at: string;
    state: string;
    total: string;
    items: Array<{
        id: string;
        product_name: string;
        quantity: number;
        unit_price: string;
        items_total: string;
        image?: string;
        selected_size?: string;
        selected_color?: string;
    }>;
    delivery_address: string;
    delivery_city: string;
    delivery_region: string;
    customer_notes?: string;
}

export default function VendorOrderDetailPage() {
    const { theme } = useTheme();
    const params = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<OrderDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                // Ensure order_number is a string
                const orderId = Array.isArray(params.id) ? params.id[0] : params.id;
                if (!orderId) {
                    throw new Error('Invalid order ID');
                }

                const response = await vendorsAPI.orderDetail(orderId);
                setOrder(response.data);
            } catch (error) {
                console.error('Failed to fetch order:', error);
                // router.push('/dashboard/vendor/orders');
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchOrder();
        }
    }, [params.id, router]);

    const isDark = theme === 'dark';

    if (loading) {
        return (
            <div className="animate-pulse space-y-8">
                <div className="h-10 w-64 bg-gray-200 dark:bg-gray-800 rounded" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 h-96 bg-gray-200 dark:bg-gray-800 rounded-xl" />
                    <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-xl" />
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
                <p className="text-gray-500 mb-6">The requested order could not be found or you do not have permission to view it.</p>
                <button
                    onClick={() => router.push('/dashboard/vendor/orders')}
                    className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
                >
                    Back to Orders
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <button
                            onClick={() => router.back()}
                            className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-gray-100 text-gray-500'}`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </button>
                        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Order #{order.order_number}
                        </h1>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${order.state === 'DELIVERED'
                            ? 'bg-green-500/10 text-green-500 border-green-500/20'
                            : order.state === 'CANCELLED'
                                ? 'bg-red-500/10 text-red-500 border-red-500/20'
                                : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                            }`}>
                            {order.state.replace(/_/g, ' ')}
                        </span>
                    </div>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                        Placed on {new Date(order.created_at).toLocaleString()}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Order Items */}
                <div className="md:col-span-2 space-y-6">
                    <div className={`rounded-xl border shadow-sm overflow-hidden ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
                        <div className={`p-6 border-b ${isDark ? 'border-slate-800' : 'border-gray-100'}`}>
                            <h2 className="font-semibold text-lg">Order Items</h2>
                        </div>
                        <div className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-gray-100'}`}>
                            {order.items.map((item) => (
                                <div key={item.id} className="p-6 flex gap-4 sm:gap-6">
                                    <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-lg flex-shrink-0 relative overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`}>
                                        {item.image ? (
                                            <Image
                                                src={item.image}
                                                alt={item.product_name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className={`font-medium mb-1 truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {item.product_name}
                                        </h3>
                                        <div className={`text-sm space-y-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                            {item.selected_size && <p>Size: {item.selected_size}</p>}
                                            {item.selected_color && <p>Color: {item.selected_color}</p>}
                                            <p>Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            GH₵ {parseFloat(item.items_total).toFixed(2)}
                                        </div>
                                        <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                                            GH₵ {parseFloat(item.unit_price).toFixed(2)} each
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Side Panel: Customer & Delivery */}
                <div className="space-y-6">
                    <div className={`rounded-xl border shadow-sm p-6 space-y-6 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
                        <div>
                            <h3 className={`text-sm font-medium uppercase mb-4 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                Delivery Details
                            </h3>
                            <div className="space-y-3">
                                <div className="flex gap-3">
                                    <svg className="w-5 h-5 text-pink-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <div className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                                        <p className="font-medium">Delivery Address</p>
                                        <p>{order.delivery_address}</p>
                                        <p>{order.delivery_city}, {order.delivery_region}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {order.customer_notes && (
                            <div className={`pt-6 border-t ${isDark ? 'border-slate-800' : 'border-gray-100'}`}>
                                <h3 className={`text-sm font-medium uppercase mb-2 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                    Customer Notes
                                </h3>
                                <p className={`text-sm italic ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                                    &quot;{order.customer_notes}&quot;
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
