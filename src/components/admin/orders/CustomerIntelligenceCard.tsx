import React from 'react';
import { User, Crown, Calendar, ShoppingBag, TrendingUp } from 'lucide-react';
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
        <div className={`p-6 rounded-[2.5rem] border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100 shadow-sm'} overflow-hidden relative group`}>
            {/* Background Accent */}
            {customer.stats.is_vip && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[50px] -mr-10 -mt-10" />
            )}

            <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black ${isDark ? 'bg-slate-800 text-white' : 'bg-gray-50 text-gray-900'}`}>
                        {customer.name[0].toUpperCase()}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className={`text-lg font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {customer.name}
                            </h3>
                            {customer.stats.is_vip && (
                                <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-500 text-[10px] font-black text-white rounded-full uppercase tracking-tighter">
                                    <Crown className="w-3 h-3" />
                                    VIP Member
                                </div>
                            )}
                        </div>
                        <p className={`text-sm opacity-40 font-medium`}>{customer.email}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* LTV Metric */}
                <div className={`p-4 rounded-3xl ${isDark ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                    <div className="flex items-center gap-2 mb-2 opacity-40">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Lifetime Value</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-xs font-bold opacity-40">₵</span>
                        <span className={`text-xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {customer.stats.ltv.toLocaleString()}
                        </span>
                    </div>
                </div>

                {/* Order Frequency */}
                <div className={`p-4 rounded-3xl ${isDark ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                    <div className="flex items-center gap-2 mb-2 opacity-40">
                        <ShoppingBag className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Total Orders</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className={`text-xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {customer.stats.order_count}
                        </span>
                        <span className="text-[10px] font-bold opacity-40 uppercase">Transactions</span>
                    </div>
                </div>
            </div>

            {/* Join Date footer */}
            <div className="mt-6 pt-6 border-t border-primary-surface/20 flex items-center gap-3">
                <div className={`p-2 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-gray-50'}`}>
                    <Calendar className="w-4 h-4 opacity-40" />
                </div>
                <div className="text-[10px]">
                    <p className="opacity-40 font-black uppercase tracking-widest">Member Since</p>
                    <p className={`font-bold ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>{joinDate}</p>
                </div>
            </div>
        </div>
    );
}
