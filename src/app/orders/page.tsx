/**
 * London's Imports - Orders List Page
 */
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { ordersAPI } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';

const statusColors: Record<string, string> = {
    DRAFT: 'bg-gray-100 text-gray-600',
    PENDING_PAYMENT: 'bg-yellow-100 text-yellow-700',
    PAID: 'bg-blue-100 text-blue-700',
    OPEN_FOR_BATCH: 'bg-purple-100 text-purple-700',
    CUTOFF_REACHED: 'bg-indigo-100 text-indigo-700',
    IN_FULFILLMENT: 'bg-cyan-100 text-cyan-700',
    OUT_FOR_DELIVERY: 'bg-orange-100 text-orange-700',
    DELIVERED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
    REFUNDED: 'bg-gray-100 text-gray-600',
};

export default function OrdersPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();

    const { data, isLoading } = useQuery({
        queryKey: ['orders'],
        queryFn: () => ordersAPI.list(),
        enabled: isAuthenticated,
    });

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login?redirect=/orders');
        }
    }, [isAuthenticated, router]);

    const orders = data?.data?.results || data?.data || [];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-xl p-6">
                                <div className="h-6 skeleton rounded w-1/4 mb-4"></div>
                                <div className="h-4 skeleton rounded w-2/3 mb-2"></div>
                                <div className="h-4 skeleton rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center">
                        <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h2>
                        <p className="text-gray-600 mb-6">Start pre-ordering products today</p>
                        <Link href="/products" className="btn-primary">
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order: any) => (
                            <Link
                                key={order.id}
                                href={`/orders/${order.order_number}`}
                                className="block bg-white rounded-xl p-6 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Order #{order.order_number}</h3>
                                        <p className="text-sm text-gray-500">
                                            {new Date(order.created_at).toLocaleDateString('en-GB', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.state] || 'bg-gray-100'}`}>
                                        {order.state_display}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div className="text-sm text-gray-600">
                                        <span>{order.items_count} item{order.items_count !== 1 ? 's' : ''}</span>
                                        {order.delivery_window && (
                                            <span className="ml-3">• Est. {order.delivery_window}</span>
                                        )}
                                    </div>
                                    <span className="font-semibold text-gray-900">
                                        GHS {order.total?.toLocaleString()}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
