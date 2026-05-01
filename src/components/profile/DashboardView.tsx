'use client';

import Link from 'next/link';
import NextImage from 'next/image';
import { ShoppingBag, Clock, CheckCircle, TrendingUp, Calendar, Package, ChevronRight } from 'lucide-react';
import { Order } from '@/types';
import { getImageUrl } from '@/lib/image';
import { getTimeAgo } from '@/lib/date';

const DashboardView = ({ orders, user }: { orders: Order[]; user: any }) => {
    const totalSpent = orders.reduce((acc: number, o: Order) => acc + parseFloat(o.total?.toString() || '0'), 0);
    const pendingCount = orders.filter((o: Order) => o.state === 'PENDING_PAYMENT').length;
    const completedCount = orders.filter((o: Order) => ['PAID', 'DELIVERED'].includes(o.state)).length;
    const recentOrders = orders.slice(0, 5);

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Tighter Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-content-primary uppercase">
                        Welcome, {user.first_name}
                    </h2>
                    <p className="text-[9px] font-black mt-1 text-content-secondary uppercase tracking-[0.2em] opacity-60">
                        Operational Overview & Global Logistics Hub
                    </p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                    {user.role === 'VENDOR' && (
                        <Link
                            href="/dashboard/vendor"
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-wider hover:bg-emerald-100 transition-all border border-emerald-100"
                        >
                            <ShoppingBag size={12} />
                            Vendor
                        </Link>
                    )}
                    {(user.role === 'ADMIN' || user.is_staff || user.is_superuser) && (
                        <Link
                            href="/dashboard/admin"
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-[9px] font-black uppercase tracking-wider hover:bg-slate-800 transition-all shadow-sm"
                        >
                            <TrendingUp size={12} />
                            Admin
                        </Link>
                    )}
                </div>
            </div>

            {/* Compact Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Orders', value: orders.length, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Pending', value: pendingCount, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Delivered', value: completedCount, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Total Volume', value: `GHS ${totalSpent.toLocaleString()}`, icon: TrendingUp, color: 'text-pink-600', bg: 'bg-pink-50' },
                ].map((stat, i) => (
                    <div key={i} className="px-5 py-4 rounded-xl border border-border-standard bg-white flex items-center gap-4 group hover:border-brand-emerald/30 transition-all">
                        <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                            <stat.icon size={18} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[8px] uppercase tracking-[0.2em] font-black text-content-secondary opacity-50 mb-0.5">{stat.label}</p>
                            <p className="text-sm sm:text-base font-black text-content-primary truncate uppercase tabular-nums">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Compact Order Row List */}
                <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-content-primary">Recent Orders</h3>
                        </div>
                        {orders.length > 5 && (
                            <Link href="/profile/orders" className="text-[9px] font-black uppercase tracking-widest text-brand-emerald hover:underline">
                                View all
                            </Link>
                        )}
                    </div>

                    <div className="border border-border-standard rounded-xl overflow-hidden bg-white shadow-sm">
                        {recentOrders.length > 0 ? (
                            recentOrders.map((order: Order) => {
                                const isPaid = ['PAID', 'DELIVERED'].includes(order.state);
                                const firstItem = order.items?.[0];

                                return (
                                    <Link
                                        key={order.order_number}
                                        href={`/profile/orders`}
                                        className="flex items-center gap-4 p-3 hover:bg-slate-50 transition-colors border-b last:border-0 border-border-standard"
                                    >
                                        <div className="w-12 h-12 relative rounded border border-border-standard overflow-hidden bg-surface-muted flex-shrink-0">
                                            {firstItem?.product.image ? (
                                                <NextImage
                                                    src={getImageUrl(firstItem.product.image)}
                                                    alt={order.order_number}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Package size={14} className="text-content-secondary opacity-30" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className="text-[11px] font-black text-content-primary tracking-tight">#{order.order_number}</span>
                                                <span className={`text-[7px] px-1.5 py-0.5 rounded font-black uppercase tracking-[0.1em] ${isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                                    {order.state_display}
                                                </span>
                                            </div>
                                            <p className="text-[8px] font-bold text-content-secondary uppercase tracking-widest truncate">
                                                {new Date(order.created_at).toLocaleDateString()} • {order.items?.length || 0} ITEMS
                                            </p>
                                        </div>

                                        <div className="text-right flex-shrink-0">
                                            <p className="text-xs sm:text-sm font-black text-content-primary">
                                                GHS {parseFloat(order.total?.toString() || '0').toLocaleString()}
                                            </p>
                                            <div className="text-[8px] font-black uppercase tracking-widest text-content-secondary opacity-50 flex items-center justify-end gap-1">
                                                Details <ChevronRight size={8} />
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })
                        ) : (
                            <div className="py-12 text-center">
                                <Package size={24} className="mx-auto mb-3 text-content-secondary opacity-20" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-content-secondary">No active orders</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Compact Activity List */}
                <div className="lg:col-span-4 space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-content-primary">Logistics Timeline</h3>
                    <div className="bg-slate-50 border border-border-standard rounded-xl p-5 space-y-5">
                        {orders.length > 0 ? (
                            orders.slice(0, 5).map((order: Order) => {
                                const isCompleted = ['PAID', 'DELIVERED'].includes(order.state);
                                return (
                                    <div key={order.order_number} className="relative pl-6 border-l border-border-standard last:pb-0 pb-1">
                                        <div className={`absolute -left-1.5 top-0 w-3 h-3 rounded-full border-2 border-white shadow-sm ${isCompleted ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-content-primary leading-tight">
                                                {isCompleted ? 'Order Finalized' : 'Order Initiated'}
                                            </p>
                                            <p className="text-[8px] font-bold text-content-secondary uppercase tracking-widest flex items-center justify-between">
                                                <span>#{order.order_number}</span>
                                                <span className="opacity-60">{getTimeAgo(new Date(order.created_at))}</span>
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-[10px] font-black text-content-secondary text-center py-4">Timeline empty</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardView;
