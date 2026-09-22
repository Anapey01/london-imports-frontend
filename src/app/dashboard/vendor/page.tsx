/**
 * London's Imports - Vendor Dashboard Overview
 */
'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/providers/ThemeProvider';
import { vendorsAPI } from '@/lib/api';
import {
    ShoppingBag,
    CheckCircle2,
    TrendingUp,
    Clock,
    Plus,
    Package,
    ArrowUpRight,
    Store,
    Settings
} from 'lucide-react';
import Link from 'next/link';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// Performance chart weekly reference
const weeklyData = [
    { day: 'Mon', orders: 0 },
    { day: 'Tue', orders: 0 },
    { day: 'Wed', orders: 0 },
    { day: 'Thu', orders: 0 },
    { day: 'Fri', orders: 0 },
    { day: 'Sat', orders: 0 },
    { day: 'Sun', orders: 0 },
];

interface VendorMetrics {
    total_orders: number;
    fulfilled_orders: number;
    fulfillment_rate: number;
    on_time_rate: number;
}

export default function VendorDashboardPage() {
    const { theme } = useTheme();
    const [metrics, setMetrics] = useState<VendorMetrics | null>(null);
    const [loading, setLoading] = useState(true);

    const isDark = theme === 'dark';

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const response = await vendorsAPI.dashboard();
                setMetrics(response.data.metrics);
            } catch (error) {
                console.error('Failed to fetch dashboard metrics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
    }, []);

    if (loading) {
        return (
            <div className="animate-pulse space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-28 rounded-2xl bg-slate-200 dark:bg-slate-800" />
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 h-72 rounded-2xl bg-slate-200 dark:bg-slate-800" />
                    <div className="h-72 rounded-2xl bg-slate-200 dark:bg-slate-800" />
                </div>
            </div>
        );
    }

    const cards = [
        {
            label: "Total Orders",
            value: metrics?.total_orders || 0,
            icon: ShoppingBag,
            subtitle: "All incoming orders",
            badge: "Volume"
        },
        {
            label: "Fulfilled Orders",
            value: metrics?.fulfilled_orders || 0,
            icon: CheckCircle2,
            subtitle: "Delivered to clients",
            badge: "Completed"
        },
        {
            label: "Fulfillment Rate",
            value: `${metrics?.fulfillment_rate ?? 100}%`,
            icon: TrendingUp,
            subtitle: "Order execution success",
            badge: "Target 95%+"
        },
        {
            label: "On-Time Dispatch",
            value: `${metrics?.on_time_rate ?? 100}%`,
            icon: Clock,
            subtitle: "Punctuality index",
            badge: "Service Level"
        }
    ];

    const chartColor = isDark ? '#10b981' : '#0f172a';

    return (
        <div className="space-y-8">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {cards.map((card, i) => (
                    <div
                        key={i}
                        className={`p-5 md:p-6 rounded-2xl border shadow-sm transition-all duration-200 hover:shadow-md ${
                            isDark
                                ? 'bg-slate-900 border-slate-800'
                                : 'bg-white border-slate-200/80'
                        }`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-2.5 rounded-xl ${
                                isDark ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-800'
                            }`}>
                                <card.icon className="w-5 h-5" />
                            </div>
                            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                                isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
                            }`}>
                                {card.badge}
                            </span>
                        </div>
                        <div>
                            <div className={`text-2xl md:text-3xl font-bold tracking-tight mb-1 ${
                                isDark ? 'text-white' : 'text-slate-900'
                            }`}>
                                {card.value}
                            </div>
                            <div className={`text-xs font-semibold ${
                                isDark ? 'text-slate-300' : 'text-slate-700'
                            }`}>
                                {card.label}
                            </div>
                            <div className={`text-[11px] mt-0.5 ${
                                isDark ? 'text-slate-500' : 'text-slate-400'
                            }`}>
                                {card.subtitle}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Performance Overview & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales & Orders Trajectory */}
                <div className={`lg:col-span-2 p-6 rounded-2xl border shadow-sm flex flex-col justify-between ${
                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80'
                }`}>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className={`font-bold text-lg tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                Fulfillment Trajectory
                            </h3>
                            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                Weekly dispatched orders and client fulfillment activity
                            </p>
                        </div>
                        <div className={`text-xs font-medium px-3 py-1.5 rounded-lg border ${
                            isDark ? 'border-slate-700 text-slate-300 bg-slate-800' : 'border-slate-200 text-slate-600 bg-slate-50'
                        }`}>
                            Current Cycle
                        </div>
                    </div>

                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="orderGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={chartColor} stopOpacity={0.25} />
                                        <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="day"
                                    stroke={isDark ? '#64748b' : '#94a3b8'}
                                    fontSize={12}
                                    tickLine={false}
                                />
                                <YAxis
                                    stroke={isDark ? '#64748b' : '#94a3b8'}
                                    fontSize={12}
                                    tickLine={false}
                                    allowDecimals={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: isDark ? '#0f172a' : '#ffffff',
                                        borderRadius: '12px',
                                        border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                        color: isDark ? '#ffffff' : '#0f172a'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="orders"
                                    stroke={chartColor}
                                    fillOpacity={1}
                                    fill="url(#orderGrad)"
                                    strokeWidth={2.5}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Merchant Actions */}
                <div className={`p-6 rounded-2xl border shadow-sm flex flex-col justify-between ${
                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80'
                }`}>
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className={`font-bold text-lg tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                Merchant Shortcuts
                            </h3>
                            <Store className={`w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                        </div>
                        <p className={`text-xs mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            Quick access to your store operations and inventory controls.
                        </p>

                        <div className="space-y-3">
                            <Link
                                href="/dashboard/vendor/products/add"
                                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all duration-150 group ${
                                    isDark
                                        ? 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600'
                                        : 'bg-slate-50 border-slate-200/70 hover:bg-slate-100 hover:border-slate-300'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                        isDark ? 'bg-slate-700 text-white' : 'bg-slate-900 text-white'
                                    }`}>
                                        <Plus className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                            Add New Product
                                        </div>
                                        <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                            Create listing & variants
                                        </div>
                                    </div>
                                </div>
                                <ArrowUpRight className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                                    isDark ? 'text-slate-400' : 'text-slate-500'
                                }`} />
                            </Link>

                            <Link
                                href="/dashboard/vendor/products"
                                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all duration-150 group ${
                                    isDark
                                        ? 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600'
                                        : 'bg-slate-50 border-slate-200/70 hover:bg-slate-100 hover:border-slate-300'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                        isDark ? 'bg-slate-700 text-slate-200' : 'bg-white border border-slate-200 text-slate-800'
                                    }`}>
                                        <Package className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                            Catalog Inventory
                                        </div>
                                        <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                            Manage listings & stock
                                        </div>
                                    </div>
                                </div>
                                <ArrowUpRight className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                                    isDark ? 'text-slate-400' : 'text-slate-500'
                                }`} />
                            </Link>

                            <Link
                                href="/dashboard/vendor/orders"
                                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all duration-150 group ${
                                    isDark
                                        ? 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600'
                                        : 'bg-slate-50 border-slate-200/70 hover:bg-slate-100 hover:border-slate-300'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                        isDark ? 'bg-slate-700 text-slate-200' : 'bg-white border border-slate-200 text-slate-800'
                                    }`}>
                                        <ShoppingBag className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                            Incoming Orders
                                        </div>
                                        <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                            Fulfill orders & tracking
                                        </div>
                                    </div>
                                </div>
                                <ArrowUpRight className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                                    isDark ? 'text-slate-400' : 'text-slate-500'
                                }`} />
                            </Link>
                        </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                        <Link
                            href="/dashboard/vendor/settings"
                            className={`flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs font-semibold border transition-colors ${
                                isDark
                                    ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                            <Settings className="w-3.5 h-3.5" />
                            Store Configuration & Branding
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
