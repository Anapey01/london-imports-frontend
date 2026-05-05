'use client';

import { 
    Users, 
    ShoppingBag, 
    Package, 
    BadgeDollarSign, 
    TrendingUp, 
    TrendingDown,
    Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

interface StatsPulseProps {
    stats: {
        totalUsers: number;
        totalOrders: number;
        totalProducts: number;
        totalRevenue: number;
        potentialRevenue: number;
        newUsersToday: number;
        pendingOrders: number;
    };
    isDark: boolean;
}

export default function StatsPulse({ stats, isDark }: StatsPulseProps) {
    const cards = [
        {
            label: 'Total Customers',
            value: stats.totalUsers.toLocaleString(),
            subtitle: `+${stats.newUsersToday} Today`,
            icon: Users,
            trend: stats.newUsersToday >= 0 ? 12 : -5,
            prefix: ''
        },
        {
            label: 'Total Revenue',
            value: stats.totalRevenue.toLocaleString(),
            subtitle: `Realized Net`,
            icon: BadgeDollarSign,
            trend: 8.2,
            prefix: '₵'
        },
        {
            label: 'Pipeline Value',
            value: stats.potentialRevenue.toLocaleString(),
            subtitle: `${stats.pendingOrders} Pending`,
            icon: Zap,
            trend: 14.5,
            prefix: '₵'
        },
        {
            label: 'Active Catalog',
            value: stats.totalProducts.toLocaleString(),
            subtitle: 'Verified SKU',
            icon: Package,
            trend: 0,
            prefix: ''
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-100 border border-slate-100">
            {cards.map((card, idx) => (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    key={card.label}
                    className={`relative p-8 group transition-all duration-700 ${
                        isDark ? 'bg-slate-950 hover:bg-slate-900' : 'bg-white hover:bg-slate-50'
                    }`}
                >
                    {/* Architectural Grid Anchor */}
                    <div className="absolute top-4 right-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <card.icon className="w-12 h-12 text-slate-900" strokeWidth={1} />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 group-hover:text-slate-900 transition-colors">
                                Node_{idx.toString().padStart(2, '0')}
                            </span>
                            <div className="flex-1 h-px bg-slate-50 group-hover:bg-slate-200 transition-colors" />
                            {card.trend !== 0 && (
                                <span className={`text-[9px] font-black tabular-nums ${card.trend > 0 ? 'text-emerald-500' : 'text-slate-400'}`}>
                                    {card.trend > 0 ? '+' : ''}{card.trend}%
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="flex items-baseline gap-1">
                                {card.prefix && (
                                    <span className="text-sm font-black text-slate-300 uppercase">{card.prefix}</span>
                                )}
                                <p className="text-4xl font-serif font-bold text-slate-900 tracking-tighter leading-none group-hover:italic transition-all duration-700">
                                    {card.value}
                                </p>
                            </div>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-950 mt-2">
                                {card.label}
                            </h2>
                            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-50">
                                <div className="w-1 h-1 rounded-full bg-emerald-500" />
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">
                                    {card.subtitle}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
