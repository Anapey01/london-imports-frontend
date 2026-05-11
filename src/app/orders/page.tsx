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
import { Package } from 'lucide-react';
import { Order } from '@/types';





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
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-24 bg-white rounded-xl border border-slate-50 animate-pulse" />
                        ))}
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white rounded-3xl p-16 text-center border border-slate-50">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 opacity-40">
                            <Package size={32} className="text-slate-400" />
                        </div>
                        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-3">No shipments yet</h2>
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-8">Start your pre-order journey today</p>
                        <Link href="/products" className="inline-flex items-center px-10 py-4 bg-slate-950 text-white rounded-lg text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-sm">
                            Explore Collections
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {orders.map((order: Order) => {
                            const balanceDue = parseFloat(order.balance_due?.toString() || '0');
                            const isPaid = order.state === 'PAID' || order.state === 'DELIVERED' || order.state === 'COMPLETED';
                            const isPendingPayment = (order.state === 'PENDING_PAYMENT' || balanceDue > 0) && !isPaid && order.state !== 'CANCELLED';

                            return (
                                <div key={order.order_number} className="group relative bg-white border border-border-standard rounded-xl hover:border-brand-emerald/40 transition-all duration-300 shadow-sm overflow-hidden">
                                    <div className="p-3 sm:p-5 flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-8">
                                        {/* Ultra-Compact Thumbnail Node */}
                                        <div className="flex-shrink-0 w-16 h-20 sm:w-14 sm:h-18 relative rounded-lg border border-border-standard overflow-hidden bg-slate-50 flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                                            {order.items?.[0]?.product.image ? (
                                                <NextImage
                                                    src={getImageUrl(order.items[0].product.image)}
                                                    alt={order.order_number}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-200">
                                                    <Package size={16} />
                                                </div>
                                            )}
                                            {order.items && order.items.length > 1 && (
                                                <div className="absolute bottom-1.5 right-1.5 bg-slate-950/80 text-white text-[10px] font-black px-1.5 py-0.5 rounded backdrop-blur-sm">
                                                    +{order.items.length - 1}
                                                </div>
                                            )}
                                        </div>

                                        {/* Core Identification */}
                                        <div className="flex-1 min-w-0 flex flex-col justify-center text-center sm:text-left">
                                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                                                <h3 className="text-sm font-black text-slate-900 tracking-tight">
                                                    #{order.order_number}
                                                </h3>
                                                <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest border border-black/5 ${
                                                    isPaid ? 'bg-emerald-500 text-white shadow-sm' : 'bg-amber-500 text-white shadow-sm'
                                                }`}>
                                                    {order.state_display}
                                                </span>
                                            </div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest">
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </p>
                                            <span className="w-1 h-1 rounded-full bg-slate-100" />
                                            <p className="text-[10px] font-bold uppercase tracking-widest">
                                                {order.items?.length || 0} ITEMS
                                            </p>
                                        </div>

                                        {/* Financial Ledger */}
                                        <div className="flex flex-col items-center sm:items-end justify-center gap-0.5 text-center sm:text-right min-w-[100px]">
                                            <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Total Amount</p>
                                            <p className="text-sm sm:text-base font-black text-slate-900 tabular-nums tracking-tighter">
                                                GHS {parseFloat(order.total.toString()).toLocaleString()}
                                            </p>
                                            {balanceDue > 0 && !isPaid && (
                                                <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">
                                                    DUE: {balanceDue.toLocaleString()}
                                                </p>
                                            )}
                                        </div>

                                        {/* Action Node */}
                                        <div className="flex flex-row sm:flex-col items-center justify-center gap-2 w-full sm:w-36 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-50">
                                            <Link
                                                href={`/orders/${order.order_number}`}
                                                className="flex-1 sm:w-full py-3 rounded-lg text-[10px] font-black uppercase tracking-widest text-center transition-all bg-slate-950 text-white hover:bg-slate-800 shadow-sm"
                                            >
                                                Details
                                            </Link>
                                            {isPendingPayment ? (
                                                <Link
                                                    href={`/checkout?order=${order.order_number}`}
                                                    className="flex-1 sm:w-full py-3 rounded-lg text-[10px] font-black uppercase tracking-widest text-center bg-brand-emerald text-white hover:bg-brand-emerald/90 transition-all shadow-sm"
                                                >
                                                    Pay Balance
                                                </Link>
                                            ) : (
                                                <Link
                                                    href={`/track?order=${order.order_number}`}
                                                    className="flex-1 sm:w-full py-3 rounded-lg text-[10px] font-black uppercase tracking-widest text-center border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all"
                                                >
                                                    Track
                                                </Link>
                                            )}
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
