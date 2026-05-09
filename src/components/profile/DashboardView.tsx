'use client';

import Link from 'next/link';
import NextImage from 'next/image';
import { 
    ShoppingBag, 
    Clock, 
    CheckCircle, 
    TrendingUp, 
    Package, 
    ChevronRight, 
    Gift,
    User as UserIcon,
    Crown,
    Calendar,
    ArrowRight,
    Terminal,
    ShieldCheck,
    History as OrderHistoryIcon
} from 'lucide-react';
import { Order, User } from '@/types';
import { getImageUrl } from '@/lib/image';
import { getTimeAgo } from '@/lib/date';
import { useTheme } from '@/providers/ThemeProvider';
import { motion } from 'framer-motion';

const DashboardView = ({ orders, user }: { orders: Order[]; user: User }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    
    const totalSpent = orders.reduce((acc: number, o: Order) => acc + parseFloat(o.total?.toString() || '0'), 0);
    const pendingCount = orders.filter((o: Order) => o.state === 'PENDING_PAYMENT').length;
    const completedCount = orders.filter((o: Order) => ['PAID', 'DELIVERED'].includes(o.state)).length;
    const recentOrders = orders.slice(0, 5);

    const displayName = user.first_name || user.email?.split('@')[0] || 'Member';

    return (
        <div className={`space-y-12 animate-in fade-in duration-700`}>
            {/* Header / Protocol Briefing */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-slate-100 dark:border-white/5 pb-10">
                <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 block mb-2">Authenticated Session</span>
                    <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-tighter">
                        Welcome, <span className="italic text-pink-500">{displayName}.</span>
                    </h1>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <span className="text-[8px] font-black uppercase tracking-widest opacity-20 block">Account Tier</span>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Verified Hub Access</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Main Content Node */}
                <div className="lg:col-span-8 space-y-12">
                    {/* Customer Intelligence Card */}
                    <div className={`border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'} relative group`}>
                        <div className="absolute top-0 left-0 w-1 h-full bg-slate-900 dark:bg-white/10" />
                        
                        <div className="p-8 sm:p-10">
                            <div className="flex items-center gap-3 mb-10 opacity-40">
                                <UserIcon className="w-4 h-4" />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em]">Identity Profile</h3>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-12 gap-8">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                                    <div className={`w-16 h-16 rounded-full border flex items-center justify-center text-xl font-serif font-bold shrink-0 ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-100 text-slate-900'}`}>
                                        {displayName[0].toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-3 mb-1">
                                            <h3 className={`text-xl sm:text-2xl font-serif font-bold tracking-tight break-words ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                {user.first_name} {user.last_name}
                                            </h3>
                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500 text-[8px] font-black text-white rounded-full uppercase tracking-widest">
                                                <Crown className="w-3 h-3" />
                                                Member
                                            </div>
                                        </div>
                                        <p className="text-[10px] sm:text-xs font-mono opacity-40 lowercase tracking-tight break-all">{user.email}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-px bg-slate-800/10 dark:bg-white/10 border border-inherit">
                                <div className="p-6 bg-white dark:bg-slate-900">
                                    <div className="flex items-center gap-2 mb-3 opacity-30">
                                        <TrendingUp className="w-3 h-3" />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Accumulated Value</span>
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-xs font-serif italic opacity-40">₵</span>
                                        <span className={`text-xl sm:text-2xl font-serif font-bold tracking-tighter ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {totalSpent.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6 bg-white dark:bg-slate-900 border-l border-inherit">
                                    <div className="flex items-center gap-2 mb-3 opacity-30">
                                        <ShoppingBag className="w-3 h-3" />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Order Manifest</span>
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <span className={`text-xl sm:text-2xl font-serif font-bold tracking-tighter ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {orders.length}
                                        </span>
                                        <span className="text-[9px] font-black opacity-20 uppercase tracking-widest">TXNS</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Manifest Section */}
                    <section className={`border ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                        <div className="p-8 border-b border-inherit flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Package className="w-5 h-5 opacity-20" />
                                <h2 className="text-[11px] font-black uppercase tracking-[0.4em] opacity-40">Recent Manifests</h2>
                            </div>
                            <Link href="/profile/orders" className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 hover:opacity-100 transition-colors flex items-center gap-2">
                                View Full Archive <ChevronRight className="w-3 h-3" />
                            </Link>
                        </div>
                        
                        <div className="divide-y divide-inherit">
                            {recentOrders.length > 0 ? (
                                recentOrders.map((order) => {
                                    const firstItem = order.items?.[0];
                                    const isPaid = ['PAID', 'DELIVERED'].includes(order.state);
                                    
                                    return (
                                        <Link 
                                            key={order.order_number} 
                                            href={`/profile/orders`}
                                            className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-8 p-6 sm:p-8 group hover:bg-slate-500/5 transition-colors"
                                        >
                                            <div className="relative w-16 h-16 overflow-hidden border border-inherit shrink-0 grayscale group-hover:grayscale-0 transition-all duration-700">
                                                {firstItem?.product.image ? (
                                                    <NextImage
                                                        src={getImageUrl(firstItem.product.image)}
                                                        alt={order.order_number}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-slate-50">
                                                        <Package className="w-6 h-6 opacity-10" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <p className="text-[10px] font-mono opacity-40 uppercase tracking-widest">REF: #{order.order_number}</p>
                                                    <div className={`px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest ${
                                                        isPaid ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                                                    }`}>
                                                        {order.state_display}
                                                    </div>
                                                </div>
                                                <p className="text-lg font-serif font-bold tracking-tight mb-1 truncate uppercase">
                                                    {firstItem?.product.name || 'Package Consignment'}
                                                </p>
                                                <p className="text-[9px] font-black uppercase tracking-widest opacity-20">
                                                    Registered: {new Date(order.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="w-full sm:w-auto text-left sm:text-right pt-4 sm:pt-0 border-t sm:border-t-0 border-inherit">
                                                <p className="text-xl font-mono tracking-tighter mb-1">₵{parseFloat(order.total?.toString() || '0').toLocaleString()}</p>
                                                <div className="flex items-center gap-2 sm:justify-end">
                                                    <span className="text-[8px] font-black uppercase tracking-widest opacity-20">Protocol View</span>
                                                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-all" />
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })
                            ) : (
                                <div className="p-20 text-center">
                                    <Package className="w-12 h-12 opacity-10 mx-auto mb-6" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">No active manifests found in local hub</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Sidebar Terminal Node */}
                <div className="lg:col-span-4 space-y-12">
                    <section className={`border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                        <div className="p-8 border-b border-inherit flex items-center gap-4">
                            <Terminal className="w-5 h-5 opacity-20" />
                            <h2 className="text-[11px] font-black uppercase tracking-[0.4em] opacity-40">System Node Status</h2>
                        </div>
                        
                        <div className="p-8 space-y-4">
                            <div className="grid grid-cols-2 gap-px bg-slate-800/10 dark:bg-white/10 border border-inherit">
                                <div className="p-6 bg-white dark:bg-slate-900 flex flex-col gap-3">
                                    <Clock className="w-5 h-5 text-amber-500" />
                                    <div className="space-y-1">
                                        <span className="text-[8px] font-black uppercase tracking-widest opacity-20">Pending Pay</span>
                                        <p className="text-xl font-mono font-bold tracking-tighter">{pendingCount}</p>
                                    </div>
                                </div>
                                <div className="p-6 bg-white dark:bg-slate-900 flex flex-col gap-3 border-l border-inherit">
                                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                                    <div className="space-y-1">
                                        <span className="text-[8px] font-black uppercase tracking-widest opacity-20">Fulfilled</span>
                                        <p className="text-xl font-mono font-bold tracking-tighter">{completedCount}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <Link 
                                    href="/profile/settings" 
                                    className="w-full flex items-center justify-between p-6 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest hover:bg-pink-600 transition-all rounded-sm shadow-lg"
                                >
                                    Modify Profile Parameters
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-500/5 border-t border-inherit flex items-center gap-3">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40">Identity Secure</span>
                        </div>
                    </section>

                    <section className={`p-8 border ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                        <div className="flex items-center gap-3 mb-10">
                            <OrderHistoryIcon className="w-4 h-4 opacity-20" />
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Activity Ledger</h2>
                        </div>
                        
                        <div className="space-y-10 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-100 dark:before:bg-white/5">
                            {orders.slice(0, 3).map((order) => {
                                const isCompleted = ['PAID', 'DELIVERED'].includes(order.state);
                                return (
                                    <div key={order.order_number} className="relative pl-8">
                                        <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-4 ${isDark ? 'border-slate-950' : 'border-white'} ${isCompleted ? 'bg-emerald-500' : 'bg-slate-900'} z-10`} />
                                        <span className={`text-[9px] font-black uppercase tracking-widest block mb-1 ${isCompleted ? 'text-emerald-500' : 'opacity-40'}`}>
                                            {isCompleted ? 'Node Reached' : 'Active Protocol'}
                                        </span>
                                        <p className="text-sm font-bold uppercase tracking-widest">Order #{order.order_number}</p>
                                        <p className="text-[10px] opacity-30 mt-1 uppercase font-mono">{getTimeAgo(new Date(order.created_at))}</p>
                                    </div>
                                );
                            })}
                            {orders.length === 0 && (
                                <p className="text-[9px] font-black uppercase tracking-widest opacity-20 text-center">No ledger entries</p>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default DashboardView;
