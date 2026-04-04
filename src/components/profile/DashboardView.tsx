'use client';

import Link from 'next/link';
import NextImage from 'next/image';
import { ShoppingBag, Clock, CheckCircle, TrendingUp, Calendar, Package, ChevronRight } from 'lucide-react';
import { Order } from '@/types';
import { getImageUrl } from '@/lib/image';
import { getTimeAgo } from '@/lib/date';

const DashboardView = ({ orders, theme }: { orders: Order[]; theme: string }) => {
    const isDark = theme === 'dark';
    const totalSpent = orders.reduce((acc: number, o: Order) => acc + parseFloat(o.total?.toString() || '0'), 0);
    const pendingCount = orders.filter((o: Order) => o.state === 'PENDING_PAYMENT').length;
    const completedCount = orders.filter((o: Order) => ['PAID', 'DELIVERED'].includes(o.state)).length;
    const recentOrders = orders.slice(0, 5);

    return (
        <div className="space-y-10">
            {/* Page Title */}
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h2 className="text-4xl font-light tracking-tight nuclear-text">
                        My Activity
                    </h2>
                    <p className="text-sm font-light mt-1 nuclear-text opacity-60">
                        A quick look at your orders and profile.
                    </p>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    { label: 'On its way', value: pendingCount, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                    { label: 'Completed', value: completedCount, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                    { label: 'Total Spent', value: `GHS ${totalSpent.toLocaleString()}`, icon: TrendingUp, color: 'text-pink-500', bg: 'bg-pink-500/10' },
                ].map((stat, i) => (
                    <div key={i} className={`p-6 rounded-3xl border border-primary-surface bg-primary-surface/40 transition-all hover:scale-[1.02] duration-300`}>
                        <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
                            <stat.icon size={22} strokeWidth={1.5} />
                        </div>
                        <div>
                            <p className="text-2xl font-light tracking-tight nuclear-text">{stat.value}</p>
                            <p className="text-xs mt-1 uppercase tracking-widest font-medium nuclear-text opacity-40">{stat.label}</p>
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
                            <h3 className="text-sm font-semibold uppercase tracking-widest nuclear-text opacity-70">Recent Orders</h3>
                        </div>
                        {orders.length > 5 && (
                            <button className={`text-xs font-medium px-4 py-1.5 rounded-full border border-gray-200 transition-all ${isDark ? 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800' : 'border-gray-100 text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
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
                                        <div className="relative w-16 h-20 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0">
                                            {firstItem?.product.image ? (
                                                <NextImage
                                                    src={getImageUrl(firstItem.product.image)}
                                                    alt={firstItem.product_name}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300">
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
                                                <span className="text-sm font-medium nuclear-text">#{order.order_number}</span>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-tighter font-bold ${isPaid
                                                    ? 'bg-emerald-500/10 text-emerald-500'
                                                    : 'bg-amber-500/10 text-amber-500'
                                                    }`}>
                                                    {order.state_display || order.state}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-light text-gray-500">
                                                <Calendar size={12} />
                                                <span>{new Date(order.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-base font-light tracking-tight nuclear-text">
                                                GHS {parseFloat(order.total?.toString() || '0').toLocaleString()}
                                            </p>
                                            <div className={`mt-1 inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-tighter ${isDark ? 'text-slate-500' : 'text-gray-400'} group-hover:text-pink-500 transition-colors`}>
                                                View <ChevronRight size={10} />
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <div className={`py-16 text-center rounded-3xl border border-dashed ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
                            <ShoppingBag size={40} className={`mx-auto mb-4 ${isDark ? 'text-slate-700' : 'text-gray-300'}`} strokeWidth={1} />
                            <p className={`text-sm font-light ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>No orders yet</p>
                            <Link href="/products" className="inline-flex items-center gap-2 mt-4 text-xs font-medium text-pink-600 hover:gap-3 transition-all">
                                Start shopping <ChevronRight size={12} />
                            </Link>
                        </div>
                    )}
                </div>

                {/* Recent Activity - Side column on desktop */}
                <div className="lg:col-span-5 xl:col-span-4 space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Clock size={18} className="text-emerald-500" />
                        <h3 className="text-sm font-semibold uppercase tracking-widest nuclear-text opacity-70">Activity</h3>
                    </div>

                    <div className="grid gap-4">
                        {orders.length > 0 ? (
                            <div className="space-y-4">
                                {orders.slice(0, 5).map((order: Order) => {
                                    const date = new Date(order.created_at);
                                    const isCompleted = ['PAID', 'DELIVERED'].includes(order.state);
                                    const timeAgo = getTimeAgo(date);

                                    return (
                                        <div key={order.order_number} className={`flex items-start gap-3 p-4 rounded-3xl border ${isDark ? 'bg-slate-900/10 border-slate-800/50' : 'bg-gray-50/50 border-gray-100 shadow-sm'}`}>
                                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${isCompleted ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'
                                                }`}>
                                                {isCompleted ? <CheckCircle size={14} /> : <Package size={14} />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-medium nuclear-text mb-0.5">
                                                    {isCompleted ? 'Order Delivered' : 'Order Placed'}
                                                </p>
                                                <div className={`text-[10px] font-light ${isDark ? 'text-slate-500' : 'text-gray-500'} flex items-center justify-between`}>
                                                    <span>#{order.order_number}</span>
                                                    <span>{timeAgo}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className={`py-12 text-center rounded-3xl border border-dashed ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
                                <p className={`text-sm font-light ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>No activity yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardView;
