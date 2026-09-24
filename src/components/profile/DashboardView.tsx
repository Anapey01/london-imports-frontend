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
    User as UserIcon,
    Crown,
    ArrowRight,
    Terminal,
    ShieldCheck,
    History as OrderHistoryIcon
} from 'lucide-react';
import { Order, User } from '@/types';
import { getImageUrl } from '@/lib/image';
import { getTimeAgo } from '@/lib/date';
import { useTheme } from '@/providers/ThemeProvider';
import { cleanProductName } from '@/lib/format';

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
            {/* Header / Account Overview */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-slate-100 dark:border-white/10 pb-10">
                <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.4em] block mb-2 text-slate-400 dark:text-slate-500">Account Summary</span>
                    <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight text-slate-900 dark:text-white">
                        Welcome, <span className="italic font-normal text-slate-500 dark:text-slate-400">{displayName}.</span>
                    </h1>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <span className="text-[8px] font-mono uppercase tracking-widest block text-slate-400 dark:text-slate-500">Account Status</span>
                        <p className="text-[9px] font-mono uppercase tracking-widest text-slate-600 dark:text-slate-400">Verified Account</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                {/* Main Content Node */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Customer Intelligence Card */}
                    <div className={`rounded-2xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'} p-6 sm:p-8 relative`}>
                        <div className="flex items-center gap-3 mb-8 text-slate-400 dark:text-slate-500">
                            <UserIcon className="w-4 h-4" />
                            <h3 className="text-[9px] font-mono uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Profile Information</h3>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-8 gap-6">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                                <div className={`w-14 h-14 rounded-full border flex items-center justify-center text-lg font-serif font-bold shrink-0 ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200/80 text-slate-900'}`}>
                                    {displayName[0].toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-3 mb-1">
                                        <h3 className={`text-xl sm:text-2xl font-serif font-bold tracking-tight break-words ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                            {user.first_name} {user.last_name}
                                        </h3>
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-[8px] font-mono uppercase tracking-widest text-slate-600 dark:text-slate-300 rounded-full">
                                            <Crown className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                                            Member
                                        </div>
                                    </div>
                                    <p className="text-[10px] sm:text-xs font-mono lowercase tracking-tight break-all text-slate-500 dark:text-slate-400">{user.email}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/40">
                                <div className="flex items-center gap-2 mb-2">
                                    <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
                                    <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Spent</span>
                                </div>
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-xs font-serif text-slate-400">₵</span>
                                    <span className={`text-xl sm:text-2xl font-serif font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                        {totalSpent.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                            <div className="p-5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/40">
                                <div className="flex items-center gap-2 mb-2">
                                    <ShoppingBag className="w-3.5 h-3.5 text-slate-400" />
                                    <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Orders</span>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className={`text-xl sm:text-2xl font-serif font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                        {orders.length}
                                    </span>
                                    <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400">Orders</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Orders Section */}
                    <section className={`rounded-2xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'} overflow-hidden`}>
                        <div className="p-6 sm:p-8 border-b border-inherit flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Package className="w-4 h-4 text-slate-400" />
                                <h2 className="text-[10px] font-mono uppercase tracking-[0.3em] text-slate-600 dark:text-slate-300">Recent Orders</h2>
                            </div>
                            <Link href="/profile/orders" className="text-[9px] font-mono uppercase tracking-[0.2em] hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1.5 text-slate-500">
                                View All <ChevronRight className="w-3 h-3" />
                            </Link>
                        </div>
                        
                        <div className="divide-y divide-inherit">
                            {recentOrders.length > 0 ? (
                                recentOrders.map((order) => {
                                    const firstItem = order.items?.[0];
                                    
                                    return (
                                        <Link 
                                            key={order.order_number} 
                                            href={`/profile/orders`}
                                            className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-8 p-6 sm:p-8 group hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                                        >
                                            <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 shrink-0 bg-slate-50 dark:bg-slate-800/50">
                                                {firstItem?.product.image ? (
                                                    <NextImage
                                                        src={getImageUrl(firstItem.product.image)}
                                                        alt={order.order_number}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600">
                                                        <Package className="w-5 h-5" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-1.5">
                                                    <p className="text-[9px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">#{order.order_number}</p>
                                                    <div className="px-2 py-0.5 rounded-full text-[8px] font-mono uppercase tracking-wider border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300">
                                                        {order.state_display}
                                                    </div>
                                                </div>
                                                <h4 className="text-lg sm:text-xl font-serif font-bold tracking-tight mb-1 text-slate-900 dark:text-white truncate">
                                                    {firstItem?.product ? cleanProductName(firstItem.product) : 'Your Package'}
                                                </h4>
                                                <p className="text-[9px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                                    {new Date(order.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </p>
                                            </div>
                                            <div className="w-full sm:w-auto text-left sm:text-right pt-4 sm:pt-0 border-t sm:border-t-0 border-inherit">
                                                <p className="text-lg font-mono font-bold tracking-tight text-slate-900 dark:text-white mb-1">₵{parseFloat(order.total?.toString() || '0').toLocaleString()}</p>
                                                <div className="flex items-center gap-1.5 sm:justify-end text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                                                    <span className="text-[8px] font-mono uppercase tracking-wider">Details</span>
                                                    <ArrowRight className="w-3 h-3" />
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })
                            ) : (
                                <div className="p-16 text-center">
                                    <Package className="w-10 h-10 mx-auto mb-4 text-slate-200 dark:text-slate-700" strokeWidth={1} />
                                    <p className="text-[9px] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500">No active orders found</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Sidebar Order Status */}
                <div className="lg:col-span-4 space-y-8">
                    <section className={`rounded-2xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'} overflow-hidden`}>
                        <div className="p-6 border-b border-inherit flex items-center gap-3">
                            <Terminal className="w-4 h-4 text-slate-400" />
                            <h2 className="text-[10px] font-mono uppercase tracking-[0.3em] text-slate-600 dark:text-slate-300">Account Overview</h2>
                        </div>
                        
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/40 flex flex-col gap-2">
                                    <Clock className="w-4 h-4 text-slate-400" />
                                    <div className="space-y-0.5">
                                        <span className="text-[8px] font-mono uppercase tracking-wider text-slate-400">Unpaid</span>
                                        <p className="text-xl font-mono font-bold tracking-tight text-slate-900 dark:text-white">{pendingCount}</p>
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/40 flex flex-col gap-2">
                                    <CheckCircle className="w-4 h-4 text-slate-400" />
                                    <div className="space-y-0.5">
                                        <span className="text-[8px] font-mono uppercase tracking-wider text-slate-400">Delivered</span>
                                        <p className="text-xl font-mono font-bold tracking-tight text-slate-900 dark:text-white">{completedCount}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2">
                                <Link 
                                    href="/profile/settings" 
                                    className="w-full flex items-center justify-between p-4 bg-slate-950 text-white font-mono text-[9px] uppercase tracking-wider hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 transition-all rounded-xl"
                                >
                                    <span>Account Settings</span>
                                    <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                                </Link>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50/50 border-t border-inherit dark:bg-white/5 flex items-center gap-2.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-[8px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400">Secure & Encrypted</span>
                        </div>
                    </section>

                    <section className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'}`}>
                        <div className="flex items-center gap-2.5 mb-8">
                            <OrderHistoryIcon className="w-4 h-4 text-slate-400" />
                            <h2 className="text-[10px] font-mono uppercase tracking-[0.3em] text-slate-600 dark:text-slate-300">Recent Activity</h2>
                        </div>
                        
                        <div className="space-y-8 relative before:absolute before:left-[5px] before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-200 dark:before:bg-white/10">
                            {orders.slice(0, 3).map((order) => {
                                const isCompleted = ['PAID', 'DELIVERED'].includes(order.state);
                                return (
                                    <div key={order.order_number} className="relative pl-8">
                                        <div className={`absolute left-0 top-1.5 w-3 h-3 rounded-full border-2 ${isDark ? 'border-slate-950 bg-slate-400' : 'border-white bg-slate-800'} z-10`} />
                                        <span className="text-[8px] font-mono uppercase tracking-widest block mb-1 text-slate-400 dark:text-slate-500">
                                            {isCompleted ? 'Completed' : 'In Progress'}
                                        </span>
                                        <p className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">#{order.order_number}</p>
                                        <p className="text-[9px] mt-0.5 uppercase font-mono text-slate-400">{getTimeAgo(new Date(order.created_at))}</p>
                                    </div>
                                );
                            })}
                            {orders.length === 0 && (
                                <p className="text-[9px] font-mono uppercase tracking-widest opacity-60 text-center text-slate-400">No activity found</p>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default DashboardView;
