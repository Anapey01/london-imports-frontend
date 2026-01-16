/**
 * London's Imports - Vendor Dashboard Overview
 */
'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/providers/ThemeProvider';
import { vendorsAPI } from '@/lib/api';
import {
    ShoppingBag,
    CheckCircle,
    TrendingUp,
    Clock,
    ArrowUpRight,
    ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts';

// Mock chart data for visual polish
const chartData = [
    { name: 'Mon', value: 400 },
    { name: 'Tue', value: 300 },
    { name: 'Wed', value: 550 },
    { name: 'Thu', value: 450 },
    { name: 'Fri', value: 650 },
    { name: 'Sat', value: 600 },
    { name: 'Sun', value: 700 },
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
        return <div className="animate-pulse space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-28 rounded-2xl bg-gray-200 dark:bg-gray-800"></div>
                ))}
            </div>
            <div className="h-64 rounded-2xl bg-gray-200 dark:bg-gray-800"></div>
        </div>;
    }

    const cards = [
        {
            label: "Total Orders",
            value: metrics?.total_orders || 0,
            icon: ShoppingBag,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            trend: "+12%"
        },
        {
            label: "Fulfilled",
            value: metrics?.fulfilled_orders || 0,
            icon: CheckCircle,
            color: "text-green-500",
            bg: "bg-green-500/10",
            trend: "+5%"
        },
        {
            label: "Success Rate",
            value: `${metrics?.fulfillment_rate || 0}%`,
            icon: TrendingUp,
            color: "text-pink-500",
            bg: "bg-pink-500/10",
            trend: "+2%"
        }
    ];

    return (
        <div className="space-y-8">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {cards.map((card, i) => (
                    <div
                        key={i}
                        className={`p-5 rounded-2xl border shadow-sm transition-all hover:shadow-md ${isDark
                            ? 'bg-slate-900/50 border-slate-800 backdrop-blur-xl'
                            : 'bg-white border-gray-100'
                            }`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-2.5 rounded-xl ${card.bg} ${card.color}`}>
                                <card.icon className="w-5 h-5" />
                            </div>
                            <span className={`text-xs font-medium flex items-center gap-1 ${isDark ? 'text-green-400' : 'text-green-600'
                                }`}>
                                {card.trend} <ArrowUpRight className="w-3 h-3" />
                            </span>
                        </div>
                        <div>
                            <div className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {card.value}
                            </div>
                            <div className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                {card.label}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales Chart Placeholder */}
                <div className={`lg:col-span-2 p-6 rounded-2xl border shadow-sm flex flex-col ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'
                    }`}>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Performance Overview
                        </h3>
                        <select aria-label="Performance period" className={`text-sm border-none bg-transparent font-medium focus:ring-0 ${isDark ? 'text-slate-400' : 'text-gray-500'
                            }`}>
                            <option>This Week</option>
                            <option>This Month</option>
                        </select>
                    </div>

                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: isDark ? '#1e293b' : '#fff',
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#ec4899"
                                    fillOpacity={1}
                                    fill="url(#colorValue)"
                                    strokeWidth={3}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Activity / CTA */}
                <div className={`p-6 rounded-2xl border shadow-sm ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'
                    }`}>
                    <h3 className={`font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Quick Actions
                    </h3>
                    <div className="space-y-3">
                        <Link
                            href="/dashboard/vendor/products/add"
                            className={`flex items-center justify-between p-4 rounded-xl transition-colors ${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-gray-50 hover:bg-gray-100'
                                }`}
                        >
                            <span className={`font-medium ${isDark ? 'text-slate-200' : 'text-gray-700'}`}>Add Product</span>
                            <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white">
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </Link>

                        <Link
                            href="/dashboard/vendor/orders"
                            className={`flex items-center justify-between p-4 rounded-xl transition-colors ${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-gray-50 hover:bg-gray-100'
                                }`}
                        >
                            <span className={`font-medium ${isDark ? 'text-slate-200' : 'text-gray-700'}`}>View Orders</span>
                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
