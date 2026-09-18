'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Crown, TrendingUp, ShoppingBag, Calendar, ChevronDown } from 'lucide-react';
import { Customer } from '@/types/order';

export function CustomerIntelligenceCard({ customer, isDark }: { customer: Customer; isDark: boolean }) {
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
            setIsExpanded(true);
        }
    }, []);

    const joinDate = new Date(customer.stats.join_date).toLocaleDateString('en-GB', { 
        month: 'long', 
        year: 'numeric' 
    });

    return (
        <div className={`border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'} relative group`}>
            <div className="absolute top-0 left-0 w-1 h-full bg-slate-900 dark:bg-white/10" />
            
            {/* Clickable Header */}
            <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full p-4 sm:p-6 md:p-8 flex items-center justify-between text-left cursor-pointer select-none group/header hover:bg-slate-500/5 transition-colors"
            >
                <div className="flex items-center gap-3 min-w-0">
                    <User className="w-4 h-4 opacity-40 shrink-0" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">Customer Details</h3>
                    {!isExpanded && (
                        <span className="text-[11px] font-serif font-bold text-slate-700 dark:text-slate-300 ml-2 truncate max-w-[150px] sm:max-w-none">
                            • {customer.name}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 lg:hidden">
                        {isExpanded ? 'Compress' : 'Expand'}
                    </span>
                    <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                    </motion.div>
                </div>
            </button>

            <AnimatePresence initial={false}>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4 sm:px-6 sm:pb-6 md:px-10 md:pb-10 pt-0 sm:pt-2">

                <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-6 sm:mb-12 gap-6 sm:gap-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                        <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full border flex items-center justify-center text-lg sm:text-xl font-serif font-bold shrink-0 ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-100 text-slate-900'}`}>
                            {customer.name[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
                                <h3 className={`text-lg sm:text-2xl font-serif font-bold tracking-tight break-words ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {customer.name}
                                </h3>
                                {customer.stats.is_vip && (
                                    <div className="flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 bg-amber-500 text-[8px] font-black text-white rounded-full uppercase tracking-widest">
                                        <Crown className="w-3 h-3" />
                                        VIP
                                    </div>
                                )}
                            </div>
                            <p className="text-[10px] sm:text-xs font-mono opacity-40 lowercase tracking-tight break-all">{customer.email}</p>
                            <p className="text-[10px] sm:text-xs font-mono opacity-40 mt-1 uppercase tracking-widest">{customer.phone}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-800/10 dark:bg-white/10 border border-inherit">
                    <div className="p-4 sm:p-6 bg-white dark:bg-slate-900">
                        <div className="flex items-center gap-2 mb-2 sm:mb-3 opacity-30">
                            <TrendingUp className="w-3 h-3" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Lifetime Value</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-xs font-serif italic opacity-40">₵</span>
                            <span className={`text-xl sm:text-2xl font-serif font-bold tracking-tighter ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {customer.stats.ltv.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    <div className="p-4 sm:p-6 bg-white dark:bg-slate-900 border-t sm:border-t-0 sm:border-l border-inherit">
                        <div className="flex items-center gap-2 mb-2 sm:mb-3 opacity-30">
                            <ShoppingBag className="w-3 h-3" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Order Count</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className={`text-xl sm:text-2xl font-serif font-bold tracking-tighter ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {customer.stats.order_count}
                            </span>
                            <span className="text-[9px] font-black opacity-20 uppercase tracking-widest">TXNS</span>
                        </div>
                    </div>
                </div>

                <div className="mt-6 pt-6 sm:mt-10 sm:pt-8 border-t border-inherit flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
                    <div className="flex items-center gap-4">
                        <Calendar className="w-4 h-4 opacity-20" />
                        <div className="space-y-0.5">
                            <span className="text-[8px] font-black uppercase tracking-widest opacity-20 block">Established Member</span>
                            <p className="text-[10px] font-bold uppercase tracking-widest">{joinDate}</p>
                        </div>
                    </div>
                    <div className="text-left sm:text-right">
                        <span className="text-[8px] font-black uppercase tracking-widest opacity-20 block">Account Status</span>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Verified Customer</p>
                    </div>
                </div>
            </div>
        </motion.div>
    )}
</AnimatePresence>
</div>
);
}
