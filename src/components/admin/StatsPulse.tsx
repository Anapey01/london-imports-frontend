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
            subtitle: `+${stats.newUsersToday} joining today`,
            icon: Users,
            color: 'emerald',
            trend: stats.newUsersToday >= 0 ? 12 : -5, // Synthetic trend for demo
            prefix: ''
        },
        {
            label: 'Total Revenue',
            value: stats.totalRevenue.toLocaleString(),
            subtitle: `Realized income`,
            icon: BadgeDollarSign,
            color: 'emerald',
            trend: 8.2,
            prefix: '₵'
        },
        {
            label: 'Pipeline Value',
            value: stats.potentialRevenue.toLocaleString(),
            subtitle: `${stats.pendingOrders} unpaid orders`,
            icon: Zap,
            color: 'amber',
            trend: 14.5,
            prefix: '₵'
        },
        {
            label: 'Active Catalog',
            value: stats.totalProducts.toLocaleString(),
            subtitle: 'Published items',
            icon: Package,
            color: 'blue',
            trend: 0,
            prefix: ''
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, idx) => (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={card.label}
                    className={`relative p-6 rounded-[2rem] border overflow-hidden transition-all hover:shadow-diffusion-lg ${
                        isDark 
                        ? 'bg-slate-900 border-slate-800' 
                        : 'bg-white border-primary-surface shadow-sm'
                    }`}
                >
                    {/* Background Accent */}
                    <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-3xl opacity-10 ${
                        card.color === 'emerald' ? 'bg-emerald-500' : 
                        card.color === 'amber' ? 'bg-amber-500' : 'bg-blue-500'
                    }`} />

                    <div className="flex items-start justify-between mb-4 relative z-10">
                        <div className={`p-3 rounded-2xl ${
                            card.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-600' : 
                            card.color === 'amber' ? 'bg-amber-500/10 text-amber-600' :
                            'bg-blue-500/10 text-blue-600'
                        }`}>
                            <card.icon className="w-6 h-6" strokeWidth={2.5} />
                        </div>

                        {card.trend !== 0 && (
                            <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full ${
                                card.trend > 0 
                                ? 'text-emerald-700 bg-emerald-500/15' 
                                : 'text-red-700 bg-red-500/15'
                            }`}>
                                {card.trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                {Math.abs(card.trend)}%
                            </div>
                        )}
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-baseline gap-1">
                            <span className={`text-[12px] font-black ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                                {card.prefix}
                            </span>
                            <p className={`text-3xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-nuclear-text'}`}>
                                {card.value}
                            </p>
                        </div>
                        <h2 className={`text-[10px] font-black uppercase tracking-[0.2em] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            {card.label}
                        </h2>
                        <p className={`text-[11px] mt-2 font-medium ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
                            {card.subtitle}
                        </p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
