import React from 'react';
import { User, Crown, Calendar, ShoppingBag, TrendingUp, Fingerprint } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
    customer: {
        name: string;
        email: string;
        phone: string;
        stats: {
            ltv: number;
            order_count: number;
            join_date: string;
            is_vip: boolean;
        }
    };
    isDark: boolean;
}

export default function CustomerIntelligenceCard({ customer, isDark }: Props) {
    const joinDate = new Date(customer.stats.join_date).toLocaleDateString('en-GB', { 
        month: 'long', 
        year: 'numeric' 
    });

    return (
        <div className={`border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'} relative group`}>
            {/* Structural Accent */}
            <div className="absolute top-0 left-0 w-1 h-full bg-slate-900 dark:bg-white/10" />
            
            <div className="p-10">
                <div className="flex items-center gap-3 mb-10 opacity-40">
                    <Fingerprint className="w-4 h-4" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em]">Client Identity Profile</h3>
                </div>

                <div className="flex items-start justify-between mb-12">
                    <div className="flex items-center gap-6">
                        <div className={`w-16 h-16 rounded-full border flex items-center justify-center text-xl font-serif font-bold ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-100 text-slate-900'}`}>
                            {customer.name[0].toUpperCase()}
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h3 className={`text-2xl font-serif font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {customer.name}
                                </h3>
                                {customer.stats.is_vip && (
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500 text-[8px] font-black text-white rounded-full uppercase tracking-widest">
                                        <Crown className="w-3 h-3" />
                                        VIP
                                    </div>
                                )}
                            </div>
                            <p className="text-xs font-mono opacity-40 lowercase tracking-tight">{customer.email}</p>
                            <p className="text-xs font-mono opacity-40 mt-1 uppercase tracking-widest">{customer.phone}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-px bg-slate-800/10 dark:bg-white/10 border border-inherit">
                    {/* LTV Metric */}
                    <div className="p-6 bg-white dark:bg-slate-900">
                        <div className="flex items-center gap-2 mb-3 opacity-30">
                            <TrendingUp className="w-3 h-3" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Lifetime Value</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-xs font-serif italic opacity-40">₵</span>
                            <span className={`text-2xl font-serif font-bold tracking-tighter ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {customer.stats.ltv.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    {/* Order Frequency */}
                    <div className="p-6 bg-white dark:bg-slate-900 border-l border-inherit">
                        <div className="flex items-center gap-2 mb-3 opacity-30">
                            <ShoppingBag className="w-3 h-3" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Order Count</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className={`text-2xl font-serif font-bold tracking-tighter ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {customer.stats.order_count}
                            </span>
                            <span className="text-[9px] font-black opacity-20 uppercase tracking-widest">TXNS</span>
                        </div>
                    </div>
                </div>

                {/* Footer Intelligence */}
                <div className="mt-10 pt-8 border-t border-inherit flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Calendar className="w-4 h-4 opacity-20" />
                        <div className="space-y-0.5">
                            <span className="text-[8px] font-black uppercase tracking-widest opacity-20 block">Established Member</span>
                            <p className="text-[10px] font-bold uppercase tracking-widest">{joinDate}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-[8px] font-black uppercase tracking-widest opacity-20 block">Account Status</span>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Verified Hub Access</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
