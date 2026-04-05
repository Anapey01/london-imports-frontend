'use client';

import Link from 'next/link';
import NextImage from 'next/image';
import { ShoppingBag, Clock, CheckCircle, TrendingUp, Calendar, Package, ChevronRight } from 'lucide-react';
import { Order } from '@/types';
import { getImageUrl } from '@/lib/image';
import { getTimeAgo } from '@/lib/date';

const DashboardView = ({ orders }: { orders: Order[] }) => {
    const totalSpent = orders.reduce((acc: number, o: Order) => acc + parseFloat(o.total?.toString() || '0'), 0);
    const pendingCount = orders.filter((o: Order) => o.state === 'PENDING_PAYMENT').length;
    const completedCount = orders.filter((o: Order) => ['PAID', 'DELIVERED'].includes(o.state)).length;
    const recentOrders = orders.slice(0, 5);

    return (
        <div className="space-y-10">
            {/* Page Title */}
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h2 className="text-4xl font-black tracking-tight text-content-primary uppercase">
                        My Activity
                    </h2>
                    <p className="text-[10px] font-black mt-1 text-content-secondary uppercase tracking-[0.2em]">
                        A quick look at your orders and profile.
                    </p>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/10' },
                    { label: 'On its way', value: pendingCount, icon: Clock, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10' },
                    { label: 'Completed', value: completedCount, icon: CheckCircle, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
                    { label: 'Total Spent', value: `GHS ${totalSpent.toLocaleString()}`, icon: TrendingUp, color: 'text-pink-600 dark:text-pink-400', bg: 'bg-pink-500/10' },
                ].map((stat, i) => (
                    <div key={i} className="p-6 rounded-3xl border border-border-standard bg-surface-card transition-all hover:scale-[1.02] duration-300">
                        <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
                            <stat.icon size={22} strokeWidth={1.5} />
                        </div>
                        <div>
                            <p className="text-2xl font-black tracking-tight text-content-primary uppercase">{stat.value}</p>
                            <p className="text-[10px] mt-1 uppercase tracking-widest font-black text-content-secondary">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Content Grid: Orders & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* Recent Orders - Taking more space on desktop */}
                <div className="lg:col-span-7 xl:col-span-8 space-y-6">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <ShoppingBag size={18} className="text-emerald-500" />
                            <h3 className="text-[11px] font-black uppercase tracking-widest text-content-primary">Recent Orders</h3>
                        </div>
                        {orders.length > 5 && (
                            <button className="text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-border-standard text-content-secondary hover:text-content-primary hover:bg-surface-card transition-all">
                                View all
                            </button>
                        )}
                    </div>

                    {recentOrders.length > 0 ? (
                        <div className="grid gap-4">
                            {recentOrders.map((order: Order) => {
                                const isPaid = ['PAID', 'DELIVERED'].includes(order.state);
                                const firstItem = order.items?.[0];

                                return (
                                    <Link
                                        key={order.order_number}
                                        href={`/orders/${order.order_number}`}
                                        className="group flex items-center gap-4 p-4 rounded-3xl border border-primary-surface bg-primary-surface/40 hover:bg-primary-surface transition-all duration-300 shadow-sm hover:shadow-md"
                                    >
                                        <div className="relative w-16 h-20 rounded-2xl overflow-hidden bg-surface flex-shrink-0 border border-border-standard">
                                            {firstItem?.product.image ? (
                                                <NextImage
                                                    src={getImageUrl(firstItem.product.image)}
                                                    alt={firstItem.product_name}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-content-secondary">
                                                    <Package size={24} />
                                                </div>
                                            )}
                                            {order.items && order.items.length > 1 && (
                                                <div className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-md text-white text-[10px] px-1.5 py-0.5 rounded-lg border border-white/10">
                                                    +{order.items.length - 1}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm font-black text-content-primary tracking-widest uppercase">#{order.order_number}</span>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-tighter font-black ${isPaid
                                                    ? 'bg-emerald-500 text-white'
                                                    : 'bg-amber-500 text-white'
                                                    }`}>
                                                    {order.state_display || order.state}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-content-secondary">
                                                <Calendar size={12} />
                                                <span>{new Date(order.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-base font-black tracking-tight text-content-primary">
                                                GHS {parseFloat(order.total?.toString() || '0').toLocaleString()}
                                            </p>
                                            <div className="mt-1 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-content-secondary group-hover:text-pink-500 transition-colors">
                                                View <ChevronRight size={10} />
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-16 text-center rounded-3xl border border-dashed border-border-standard">
                            <ShoppingBag size={40} className="mx-auto mb-4 text-content-secondary" strokeWidth={1} />
                            <p className="text-sm font-black uppercase tracking-widest text-content-secondary">No orders yet</p>
                            <Link href="/products" className="inline-flex items-center gap-2 mt-4 text-[10px] font-black uppercase tracking-widest text-pink-600 hover:gap-3 transition-all">
                                Start shopping <ChevronRight size={12} />
                            </Link>
                        </div>
                    )}
                </div>

                {/* Recent Activity - Side column on desktop */}
                <div className="lg:col-span-5 xl:col-span-4 space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Clock size={18} className="text-emerald-500" />
                        <h3 className="text-[11px] font-black uppercase tracking-widest text-content-primary">Activity</h3>
                    </div>

                    <div className="grid gap-4">
                        {orders.length > 0 ? (
                            <div className="space-y-4">
                                {orders.slice(0, 5).map((order: Order) => {
                                    const date = new Date(order.created_at);
                                    const isCompleted = ['PAID', 'DELIVERED'].includes(order.state);
                                    const timeAgo = getTimeAgo(date);

                                    return (
                                        <div key={order.order_number} className="flex items-start gap-3 p-4 rounded-3xl border border-border-standard bg-surface-card">
                                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${isCompleted ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'
                                                }`}>
                                                {isCompleted ? <CheckCircle size={14} /> : <Package size={14} />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-content-primary mb-0.5">
                                                    {isCompleted ? 'Order Delivered' : 'Order Placed'}
                                                </p>
                                                <div className="text-[10px] font-black uppercase tracking-widest text-content-secondary flex items-center justify-between">
                                                    <span>#{order.order_number}</span>
                                                    <span>{timeAgo}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="py-12 text-center rounded-3xl border border-dashed border-border-standard">
                                <p className="text-sm font-black uppercase tracking-widest text-content-secondary">No activity yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardView;
