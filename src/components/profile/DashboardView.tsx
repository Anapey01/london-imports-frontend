'use client';

import Link from 'next/link';
import NextImage from 'next/image';
import { ShoppingBag, Clock, CheckCircle, TrendingUp, Package, ChevronRight, Gift } from 'lucide-react';
import { Order, User } from '@/types';
import { getImageUrl } from '@/lib/image';
import { getTimeAgo } from '@/lib/date';

const DashboardView = ({ orders, user }: { orders: Order[]; user: User }) => {
    const totalSpent = orders.reduce((acc: number, o: Order) => acc + parseFloat(o.total?.toString() || '0'), 0);
    const pendingCount = orders.filter((o: Order) => o.state === 'PENDING_PAYMENT').length;
    const completedCount = orders.filter((o: Order) => ['PAID', 'DELIVERED'].includes(o.state)).length;
    const recentOrders = orders.slice(0, 5);

    return (
        <div className="space-y-12">
            {/* Architectural Stats Bridge */}
            <div className="grid grid-cols-2 lg:grid-cols-4 border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm">
                {[
                    { label: 'Total Orders', value: orders.length, icon: ShoppingBag },
                    { label: 'To Pay', value: pendingCount, icon: Clock },
                    { label: 'Completed', value: completedCount, icon: CheckCircle },
                    { label: 'Total Spent', value: `GHC ${totalSpent.toLocaleString()}`, icon: TrendingUp },
                ].map((stat, i) => (
                    <div key={i} className={`px-6 py-8 flex flex-col gap-4 group transition-colors hover:bg-slate-50/50 ${i !== 3 ? 'border-r border-slate-100' : ''}`}>
                        <div className="flex items-center justify-between">
                            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 group-hover:text-slate-900 transition-colors">
                                {stat.label}
                            </p>
                            <stat.icon size={14} className="text-slate-400 group-hover:text-brand-emerald transition-colors" />
                        </div>
                        <p className="text-2xl font-black text-slate-900 tracking-tighter uppercase tabular-nums">
                            {stat.value}
                        </p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                {/* Shipment Manifest Section */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-4">
                            <Package size={14} className="text-slate-400" />
                            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-900">Recent Orders</h3>
                        </div>
                        <Link href="/profile/orders" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-2">
                            View All <ChevronRight size={12} />
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {recentOrders.length > 0 ? (
                            recentOrders.map((order: Order) => {
                                const isPaid = ['PAID', 'DELIVERED'].includes(order.state);
                                const firstItem = order.items?.[0];

                                return (
                                    <Link
                                        key={order.order_number}
                                        href={`/profile/orders`}
                                        className="group block bg-white border border-slate-100 rounded-xl p-4 hover:border-slate-300 transition-all duration-300"
                                    >
                                        <div className="flex items-center gap-6">
                                            {/* Manifest ID */}
                                            <div className="flex flex-col min-w-[80px]">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Order #</p>
                                                <p className="text-xs font-black text-slate-900">#{order.order_number}</p>
                                            </div>

                                            {/* Payload Node */}
                                            <div className="h-12 w-10 relative rounded border border-slate-100 overflow-hidden bg-slate-50 flex-shrink-0 grayscale group-hover:grayscale-0 transition-all duration-500">
                                                {firstItem?.product.image ? (
                                                    <NextImage
                                                        src={getImageUrl(firstItem.product.image)}
                                                        alt={order.order_number}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Package size={12} className="text-slate-200" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Manifest Data */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <p className="text-xs font-black text-slate-900 truncate uppercase tracking-tight">
                                                        {firstItem?.product.name || 'Package'}
                                                    </p>
                                                    <span className={`h-2 w-2 rounded-full ${isPaid ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
                                                </div>
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                                    {new Date(order.created_at).toLocaleDateString()} • {order.items?.length || 0} UNITS
                                                </p>
                                            </div>

                                            {/* Valuation */}
                                            <div className="text-right flex-shrink-0">
                                                <p className="text-sm font-black text-slate-900 tabular-nums">
                                                    ₵{parseFloat(order.total?.toString() || '0').toLocaleString()}
                                                </p>
                                                <p className={`text-[10px] font-black uppercase tracking-widest ${isPaid ? 'text-emerald-500' : 'text-amber-500'}`}>
                                                    {order.state_display}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })
                        ) : (
                            <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                                <Package size={32} className="mx-auto mb-4 text-slate-200" strokeWidth={1} />
                                <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">No orders found</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Logistics Intelligence Section */}
                <div className="lg:col-span-4 space-y-10">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                            <TrendingUp size={14} className="text-slate-400" />
                            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-900">Order Status</h3>
                        </div>
                        
                        <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-100">
                            {orders.length > 0 ? (
                                orders.slice(0, 4).map((order: Order) => {
                                    const isCompleted = ['PAID', 'DELIVERED'].includes(order.state);
                                    return (
                                        <div key={order.order_number} className="relative pl-10">
                                            <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full border border-white shadow-sm flex items-center justify-center z-10 transition-transform hover:scale-110 cursor-pointer ${isCompleted ? 'bg-emerald-500' : 'bg-slate-900'}`}>
                                                <div className="w-1 h-1 bg-white rounded-full" />
                                            </div>
                                            <div className="group">
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 group-hover:text-brand-emerald transition-colors leading-tight mb-1">
                                                    {isCompleted ? 'Order Delivered' : 'In Transit'}
                                                </p>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order #{order.order_number}</span>
                                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest opacity-60 italic">{getTimeAgo(new Date(order.created_at))}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-10 opacity-30">
                                    <div className="w-1 h-20 bg-slate-100 mx-auto rounded-full mb-4" />
                                    <p className="text-[10px] font-black uppercase tracking-widest">No recent updates</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Architectural Action Terminal */}
                    {(!user?.date_of_birth) && user?.role === 'CUSTOMER' && (
                        <div className="bg-slate-900 rounded-2xl p-8 relative overflow-hidden group shadow-2xl">
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <Gift size={14} className="text-brand-emerald" />
                                    <span className="text-[11px] font-black text-white uppercase tracking-[0.4em]">Exclusive Rewards</span>
                                </div>
                                <h4 className="text-2xl font-serif italic text-white mb-4">The Atelier Club.</h4>
                                <p className="text-xs font-medium text-slate-400 uppercase tracking-[0.2em] leading-relaxed mb-8">
                                    Secure exclusive annual privileges and personalized asset allocation.
                                </p>
                                <Link 
                                    href="/profile/settings" 
                                    className="block w-full py-4 border border-white/10 rounded-xl text-xs font-black text-white text-center uppercase tracking-[0.4em] hover:bg-white hover:text-slate-900 transition-all duration-500"
                                >
                                    Join Club
                                </Link>
                            </div>
                            {/* Terminal Texture */}
                            <div className="absolute inset-0 bg-[radial-gradient(#ffffff_0.5px,transparent_0.5px)] [background-size:16px_16px] opacity-[0.03]" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardView;
