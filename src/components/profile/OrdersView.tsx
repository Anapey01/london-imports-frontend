'use client';

import { useState } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { Order } from '@/types';
import { getImageUrl } from '@/lib/image';

const OrdersView = ({ orders, theme }: { orders: Order[]; theme: string }) => {
    const isDark = theme === 'dark';
    const [filter, setFilter] = useState('ALL');

    const filteredOrders = filter === 'ALL'
        ? orders
        : orders.filter((o: Order) => {
            if (filter === 'PENDING') return o.state === 'PENDING_PAYMENT' || (parseFloat(o.balance_due?.toString() || '0') > 0);
            if (filter === 'COMPLETED') return o.state === 'DELIVERED';
            return true;
        });

    const getStatusColor = (state: string) => {
        switch (state) {
            case 'PAID':
            case 'DELIVERED': return 'text-green-600 dark:text-green-400';
            case 'PENDING_PAYMENT':
            case 'DRAFT': return 'text-amber-600 dark:text-amber-400';
            case 'CANCELLED':
            case 'FAILED': return 'text-red-600 dark:text-red-400';
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

    return (
        <div className="space-y-10 pb-20">
            <div className={`border-b pb-4 ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <h2 className={`text-2xl font-light tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        My Orders
                    </h2>
                    <div className="flex items-center gap-4">
                        {['ALL', 'PENDING', 'COMPLETED'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`text-xs uppercase tracking-wide transition-colors ${filter === status
                                    ? `${isDark ? 'text-white' : 'text-gray-900'} font-medium`
                                    : `${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-gray-400 hover:text-gray-600'} font-light`
                                    }`}
                            >
                                {status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid gap-6">
                {filteredOrders.length === 0 ? (
                    <div className="text-center py-20">
                        <svg className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-slate-700' : 'text-gray-200'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                        <p className={`text-sm font-light ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>No orders found</p>
                    </div>
                ) : (
                    filteredOrders.map((order: Order) => {
                        const balanceDue = parseFloat(order.balance_due?.toString() || '0');
                        const isPending = order.state === 'PENDING_PAYMENT' || (balanceDue > 0 && order.state !== 'CANCELLED');

                        return (
                            <div key={order.order_number} className={`group p-6 rounded-2xl border transition-all hover:shadow-md ${isDark ? 'bg-slate-900/40 border-slate-800 hover:border-slate-700' : 'bg-white border-gray-100 hover:border-gray-200'}`}>
                                <div className="flex flex-col md:flex-row justify-between gap-6">
                                    <div className="flex gap-6">
                                        {/* Images Stack */}
                                        <div className="flex -space-x-8 flex-shrink-0">
                                            {order.items?.slice(0, 3).map((item, idx) => (
                                                <div key={item.id} className={`relative w-24 h-32 rounded-lg overflow-hidden border-2 ${isDark ? 'border-slate-900' : 'border-white'} shadow-sm bg-gray-100 z-[${30 - idx}]`}>
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
                                            ))}
                                        </div>

                                        <div className="flex flex-col justify-between py-1">
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <div className={`w-2 h-2 rounded-full ${getStatusBg(order.state)}`} />
                                                    <p className={`text-base font-medium tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                        Order #{order.order_number}
                                                    </p>
                                                </div>
                                                <p className={`text-sm font-light ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                                                    Placed {new Date(order.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </p>
                                            </div>

                                            <div className="mt-4">
                                                <p className={`text-sm font-light ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                                                    {order.items?.length || 0} Item{order.items?.length !== 1 ? 's' : ''}
                                                </p>
                                                <p className={`text-lg font-light ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                    GHS {parseFloat(order.total.toString()).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-row md:flex-col justify-between md:justify-center items-end gap-3">
                                        <span className={`text-sm font-medium ${getStatusColor(order.state)}`}>
                                            {order.state_display}
                                        </span>

                                        <div className="flex gap-2 w-full sm:w-auto">
                                            <Link
                                                href={`/orders/${order.order_number}`}
                                                className={`px-5 py-2 rounded-full text-xs font-medium border transition-colors ${isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                            >
                                                Details
                                            </Link>
                                            {isPending && (
                                                <Link
                                                    href={`/checkout?order=${order.order_number}`}
                                                    className="px-5 py-2 rounded-full text-xs font-medium bg-gray-900 text-white hover:bg-pink-600 transition-colors shadow-sm"
                                                >
                                                    {balanceDue > 0 ? 'Pay Balance' : 'Pay Now'}
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default OrdersView;
