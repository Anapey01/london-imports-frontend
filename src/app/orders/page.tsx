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
        case 'IN_TRANSIT':
        case 'DELIVERED': return 'text-green-600';
        case 'PENDING_PAYMENT':
        case 'DRAFT': return 'text-amber-600';
        case 'CANCELLED':
        case 'FAILED': return 'text-red-600';
        default: return 'text-gray-500';
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

    const rawOrders = data?.data?.results || data?.data || [];
    const orders = rawOrders.filter((order: Order) => (order.items_count || 0) > 0);

    return (
        <div className="min-h-screen bg-primary-surface pt-24 pb-20 md:pt-32 font-sans transition-all duration-500">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <div className="flex items-end justify-between mb-12 border-b border-slate-50 dark:border-slate-900 pb-8">
                    <h1 className="text-4xl md:text-6xl font-serif font-black nuclear-text tracking-tighter">My Orders</h1>
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
                                <div key={order.order_number} className="bg-white dark:bg-slate-950 p-5 sm:p-8 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-500 group">
                                    <div className="flex flex-col sm:flex-row justify-between gap-8">
                                        <div className="flex flex-col sm:flex-row gap-6">
                                            {/* Image Stack - Grid on mobile, Stack on desktop */}
                                            <div className="flex -space-x-12 sm:-space-x-8 flex-shrink-0 justify-center sm:justify-start mb-2 sm:mb-0">
                                                {order.items?.slice(0, 3).map((item: OrderItem, idx: number) => {
                                                    const zIndexMap = ['z-30', 'z-20', 'z-10'];
                                                    return (
                                                        <div key={item.id} className={`relative w-28 h-36 sm:w-24 sm:h-32 rounded-xl overflow-hidden border border-white dark:border-slate-800 shadow-xl bg-gray-50 ${zIndexMap[idx] || 'z-0'}`}>
                                                            {item.product.image ? (
                                                                <NextImage
                                                                    src={getImageUrl(item.product.image)}
                                                                    alt={item.product_name}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" strokeWidth={1} /></svg>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            <div className="flex flex-col justify-between py-1 text-center sm:text-left">
                                                <div>
                                                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                                                        <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded border ${getStatusColor(order.state).replace('text-', 'border-').replace('600', '200')} ${getStatusColor(order.state)}`}>
                                                            {order.state_display}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-sm sm:text-lg font-black font-sans text-slate-900 dark:text-white uppercase tracking-widest leading-relaxed">
                                                        Order #{order.order_number}
                                                    </h3>
                                                    <p className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-light mt-1">
                                                        Placed {new Date(order.created_at).toLocaleDateString(undefined, {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                                <div className="mt-6 sm:mt-4">
                                                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300 dark:text-slate-700">{order.items_count} item{order.items_count !== 1 ? 's' : ''}</p>
                                                    <p className="text-2xl sm:text-3xl font-serif font-black text-slate-900 dark:text-white tracking-tighter tabular-nums mt-1">GHS {parseFloat(order.total?.toString() || '0').toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col justify-end gap-3 min-w-[140px]">
                                            {isPending && (
                                                <Link
                                                    href={`/checkout?order=${order.order_number}`}
                                                    className="w-full text-center px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] bg-slate-950 text-white dark:bg-white dark:text-slate-950 hover:bg-emerald-600 dark:hover:bg-emerald-50 transition-all duration-500 shadow-sm"
                                                >
                                                    {balanceDue > 0 ? 'Pay Balance' : 'Pay Now'}
                                                </Link>
                                            )}
                                            <Link
                                                href={`/orders/${order.order_number}`}
                                                className="w-full text-center px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-950 dark:hover:border-white hover:text-slate-950 dark:hover:text-white transition-all duration-500"
                                            >
                                                Details
                                            </Link>
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
