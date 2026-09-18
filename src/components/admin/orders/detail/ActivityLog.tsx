'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History as OrderHistoryIcon, ChevronDown } from 'lucide-react';
import { OrderDetail } from '@/types/order';

interface ActivityLogProps {
    order: OrderDetail;
    isDark: boolean;
}

export function ActivityLog({ order, isDark }: ActivityLogProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
            setIsExpanded(true);
        }
    }, []);

    return (
        <section className={`border ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
            <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full p-4 sm:p-6 md:p-8 border-b border-inherit flex items-center justify-between text-left cursor-pointer select-none group/header hover:bg-slate-500/5 transition-colors"
            >
                <div className="flex items-center gap-3 min-w-0">
                    <OrderHistoryIcon className="w-4 h-4 opacity-40 shrink-0" />
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Activity Log</h2>
                    {!isExpanded && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 ml-2 truncate max-w-[150px] sm:max-w-none">
                            • {order.status.replace(/_/g, ' ')}
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
                        <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-10 relative before:absolute before:left-[23px] sm:before:left-[31px] md:before:left-[39px] before:top-6 before:bottom-6 before:w-[1px] before:bg-inherit">
                            <div className="relative pl-8">
                                <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-4 border-slate-950 dark:border-slate-950 bg-emerald-500 z-10" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500 block mb-1">State: Active</span>
                                <p className="text-sm font-bold uppercase tracking-widest">{order.status.replace(/_/g, ' ')}</p>
                                <p className="text-[10px] opacity-30 mt-1 uppercase font-mono">Synced via London Hub Control</p>
                            </div>
                            <div className="relative pl-8 opacity-40">
                                <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-4 border-slate-950 dark:border-slate-950 bg-slate-500 z-10" />
                                <span className="text-[9px] font-black uppercase tracking-widest block mb-1">Event: Order Created</span>
                                <p className="text-sm font-bold uppercase tracking-widest">Order Created</p>
                                <p className="text-[10px] mt-1 font-mono">{new Date(order.created_at).toLocaleString()}</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
