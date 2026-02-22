/**
 * London's Imports - Orders List Page
 * High-end design with product images and quick actions
 */
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { ordersAPI } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { getImageUrl } from '@/lib/image';
import { Order, OrderItem } from '@/types';

const getStatusColor = (state: string) => {
    switch (state) {
        case 'PAID':
        case 'DELIVERED': return 'text-green-600';
        case 'PENDING_PAYMENT':
        case 'DRAFT': return 'text-amber-600';
        case 'CANCELLED':
        case 'FAILED': return 'text-red-600';
        default: return 'text-gray-500';
    }
};

const getStatusBg = (state: string) => {
    switch (state) {
        case 'PAID':
        case 'DELIVERED': return 'bg-green-500';
        case 'PENDING_PAYMENT':
        case 'DRAFT': return 'bg-amber-500';
        case 'CANCELLED':
        case 'FAILED': return 'bg-red-500';
        default: return 'bg-gray-400';
    }
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
        <div className="min-h-screen bg-gray-50 pt-24 pb-20 md:pt-32">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <div className="flex items-end justify-between mb-8 border-b border-gray-200 pb-4">
                    <h1 className="text-3xl font-light text-gray-900 tracking-tight">My Orders</h1>
                </div>

                {isLoading ? (
                    <div className="space-y-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
                                <div className="flex gap-6">
                                    <div className="w-24 h-32 bg-gray-100 rounded-lg"></div>
                                    <div className="flex-1 py-1">
                                        <div className="h-5 bg-gray-100 rounded w-1/4 mb-4"></div>
                                        <div className="h-4 bg-gray-100 rounded w-1/3"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white rounded-3xl p-16 text-center border border-gray-100">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-light text-gray-900 mb-2">No orders yet</h2>
                        <p className="text-gray-500 mb-8 font-light">Start your pre-order journey today</p>
                        <Link href="/products" className="inline-flex items-center px-8 py-3 bg-gray-900 text-white rounded-full hover:bg-pink-600 transition-colors">
                            Explore Collections
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order: Order) => {
                            const balanceDue = parseFloat(order.balance_due?.toString() || '0');
                            const isPending = order.state === 'PENDING_PAYMENT' || (balanceDue > 0 && order.state !== 'CANCELLED');

                            return (
                                <div key={order.order_number} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-all">
                                    <div className="flex flex-col md:flex-row justify-between gap-6">
                                        <div className="flex gap-6">
                                            {/* Image Stack */}
                                            <div className="flex -space-x-8 flex-shrink-0">
                                                {order.items?.slice(0, 3).map((item: OrderItem, idx: number) => {
                                                    const zIndexMap = ['z-30', 'z-20', 'z-10'];
                                                    return (
                                                        <div key={item.id} className={`relative w-24 h-32 rounded-lg overflow-hidden border-2 border-white shadow-sm bg-gray-100 ${zIndexMap[idx] || 'z-0'}`}>
                                                            {item.product.image ? (
                                                                <NextImage
                                                                    src={getImageUrl(item.product.image)}
                                                                    alt={item.product_name}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" strokeWidth={1.5} /></svg>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            <div className="flex flex-col justify-between py-1">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <div className={`w-2 h-2 rounded-full ${getStatusBg(order.state)}`} />
                                                        <h3 className="text-lg font-medium text-gray-900">Order #{order.order_number}</h3>
                                                    </div>
                                                    <p className="text-sm text-gray-500 font-light">
                                                        Placed on {new Date(order.created_at).toLocaleDateString(undefined, {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                                <div className="mt-4">
                                                    <p className="text-sm text-gray-500 font-light">{order.items_count} item{order.items_count !== 1 ? 's' : ''}</p>
                                                    <p className="text-lg font-light text-gray-900">GHS {parseFloat(order.total?.toString() || '0').toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-row md:flex-col justify-between md:justify-center items-end gap-3">
                                            <span className={`text-sm font-medium ${getStatusColor(order.state)}`}>
                                                {order.state_display}
                                            </span>
                                            <div className="flex gap-2">
                                                <Link
                                                    href={`/orders/${order.order_number}`}
                                                    className="px-6 py-2 rounded-full text-xs font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                                                >
                                                    Details
                                                </Link>
                                                {isPending && (
                                                    <Link
                                                        href={`/checkout?order=${order.order_number}`}
                                                        className="px-6 py-2 rounded-full text-xs font-medium bg-gray-900 text-white hover:bg-pink-600 transition-colors shadow-sm"
                                                    >
                                                        {balanceDue > 0 ? 'Pay Balance' : 'Pay Now'}
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
