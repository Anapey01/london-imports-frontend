/**
 * London's Imports - Premium Analytics Dashboard
 * Executive-grade analytics with beautiful visualizations
 */
'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/providers/ThemeProvider';
import { adminAPI } from '@/lib/api';

interface AnalyticsData {
    revenue: { total: number; change: number };
    orders: { total: number; change: number };
    users: { total: number; change: number };
    avgOrderValue: { total: number; change: number };
    revenueChart: Array<{ day: string; value: number }>;
    topProducts: Array<{ name: string; sales: number; revenue: number }>;
    topVendors: Array<{ name: string; orders: number; revenue: number }>;
}

export default function AdminAnalyticsPage() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [period, setPeriod] = useState('7d');
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<AnalyticsData | null>(null);

    useEffect(() => {
        const loadAnalytics = async () => {
            setLoading(true);
            try {
                const response = await adminAPI.analytics({ period });
                setData(response.data);
            } catch (err) {
                console.error('Failed to load analytics:', err);
            } finally {
                setLoading(false);
            }
        };
        loadAnalytics();
    }, [period]);

    // Fallback data
    const safeData = data || {
        revenue: { total: 0, change: 12.5 },
        orders: { total: 0, change: 8.2 },
        users: { total: 0, change: 15.3 },
        avgOrderValue: { total: 0, change: -2.1 },
        revenueChart: [
            { day: 'Mon', value: 1200 },
            { day: 'Tue', value: 1800 },
            { day: 'Wed', value: 1400 },
            { day: 'Thu', value: 2200 },
            { day: 'Fri', value: 1900 },
            { day: 'Sat', value: 2800 },
            { day: 'Sun', value: 2100 },
        ],
        topProducts: [],
        topVendors: [],
    };

    const statCards = [
        {
            label: 'Total Revenue',
            value: `₵${safeData.revenue.total.toLocaleString()}`,
            change: safeData.revenue.change,
            icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
            gradient: 'from-violet-500 to-purple-600',
            bgPattern: 'bg-violet-500/10'
        },
        {
            label: 'Total Orders',
            value: safeData.orders.total.toLocaleString(),
            change: safeData.orders.change,
            icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
            gradient: 'from-emerald-500 to-teal-600',
            bgPattern: 'bg-emerald-500/10'
        },
        {
            label: 'New Users',
            value: safeData.users.total.toLocaleString(),
            change: safeData.users.change,
            icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
            gradient: 'from-blue-500 to-cyan-600',
            bgPattern: 'bg-blue-500/10'
        },
        {
            label: 'Avg. Order',
            value: `₵${safeData.avgOrderValue.total.toLocaleString()}`,
            change: safeData.avgOrderValue.change,
            icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
            gradient: 'from-pink-500 to-rose-600',
            bgPattern: 'bg-pink-500/10'
        },
    ];

    // Premium Bar Chart Component
    const PremiumChart = ({ chartData }: { chartData: { day: string; value: number }[] }) => {
        const maxValue = Math.max(...chartData.map(d => d.value), 1);
        return (
            <div className="flex items-end justify-between h-56 gap-2 sm:gap-4 px-2">
                {chartData.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-3">
                        <div className="relative w-full flex justify-center">
                            <div
                                className="w-full max-w-[40px] rounded-t-xl bg-gradient-to-t from-pink-500 via-pink-400 to-pink-300 shadow-lg shadow-pink-500/20 transition-all duration-500 hover:shadow-pink-500/40 hover:scale-105"
                                style={{
                                    height: `${Math.max((item.value / maxValue) * 180, 8)}px`,
                                }}
                            >
                                {/* Glow effect */}
                                <div className="absolute inset-0 rounded-t-xl bg-gradient-to-t from-white/0 to-white/20"></div>
                            </div>
                        </div>
                        <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{item.day}</span>
                    </div>
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className={`h-32 rounded-2xl animate-pulse ${isDark ? 'bg-slate-800' : 'bg-gray-200'}`}></div>
                    ))}
                </div>
                <div className={`h-80 rounded-2xl animate-pulse ${isDark ? 'bg-slate-800' : 'bg-gray-200'}`}></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with Period Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Analytics</h2>
                    <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Track your business performance</p>
                </div>
                <div className={`inline-flex p-1 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`}>
                    {[
                        { value: '7d', label: '7 Days' },
                        { value: '30d', label: '30 Days' },
                        { value: '90d', label: '90 Days' },
                    ].map((option) => (
                        <button
                            key={option.value}
                            onClick={() => setPeriod(option.value)}
                            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${period === option.value
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : isDark
                                        ? 'text-slate-400 hover:text-white'
                                        : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Premium Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, index) => (
                    <div
                        key={index}
                        className={`relative overflow-hidden p-4 sm:p-5 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-gray-100'} shadow-sm hover:shadow-lg transition-shadow`}
                    >
                        {/* Background gradient decoration */}
                        <div className={`absolute -right-8 -top-8 w-24 h-24 rounded-full ${stat.bgPattern} blur-2xl`}></div>

                        <div className="relative">
                            {/* Icon */}
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg mb-3`}>
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} />
                                </svg>
                            </div>

                            {/* Value */}
                            <p className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>

                            {/* Label & Change */}
                            <div className="flex items-center justify-between mt-1">
                                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{stat.label}</p>
                                <div className={`flex items-center gap-0.5 text-xs font-medium ${stat.change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.change >= 0 ? 'M5 10l7-7m0 0l7 7m-7-7v18' : 'M19 14l-7 7m0 0l-7-7m7 7V3'} />
                                    </svg>
                                    {Math.abs(stat.change)}%
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Revenue Chart Card */}
            <div className={`rounded-2xl border p-5 sm:p-6 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-gray-100'} shadow-sm`}>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Revenue Overview</h3>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Daily revenue for the selected period</p>
                    </div>
                    <div className={`px-3 py-1.5 rounded-full text-xs font-medium ${isDark ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-600'}`}>
                        +12.5% vs last period
                    </div>
                </div>
                <PremiumChart chartData={safeData.revenueChart} />
            </div>

            {/* Two Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Products */}
                <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-gray-100'} shadow-sm`}>
                    <div className={`px-5 py-4 border-b ${isDark ? 'border-slate-700/50' : 'border-gray-100'}`}>
                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Top Products</h3>
                        <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Best performing products</p>
                    </div>
                    <div className={`divide-y ${isDark ? 'divide-slate-700/50' : 'divide-gray-100'}`}>
                        {safeData.topProducts.length === 0 ? (
                            <div className={`px-5 py-8 text-center ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>
                                No product data yet
                            </div>
                        ) : (
                            safeData.topProducts.slice(0, 5).map((product, index) => (
                                <div key={index} className="px-5 py-3 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${index === 0 ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' :
                                                index === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-white' :
                                                    index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white' :
                                                        isDark ? 'bg-slate-700 text-slate-400' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {index + 1}
                                        </span>
                                        <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{product.name}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>₵{product.revenue.toLocaleString()}</p>
                                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>{product.sales} sold</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Top Vendors */}
                <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-gray-100'} shadow-sm`}>
                    <div className={`px-5 py-4 border-b ${isDark ? 'border-slate-700/50' : 'border-gray-100'}`}>
                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Top Vendors</h3>
                        <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Best performing vendors</p>
                    </div>
                    <div className={`divide-y ${isDark ? 'divide-slate-700/50' : 'divide-gray-100'}`}>
                        {safeData.topVendors.length === 0 ? (
                            <div className={`px-5 py-8 text-center ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>
                                No vendor data yet
                            </div>
                        ) : (
                            safeData.topVendors.slice(0, 5).map((vendor, index) => (
                                <div key={index} className="px-5 py-3 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${index === 0 ? 'bg-gradient-to-br from-violet-400 to-purple-500 text-white' :
                                                index === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-white' :
                                                    index === 2 ? 'bg-gradient-to-br from-violet-600 to-purple-700 text-white' :
                                                        isDark ? 'bg-slate-700 text-slate-400' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {index + 1}
                                        </span>
                                        <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{vendor.name}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>₵{vendor.revenue.toLocaleString()}</p>
                                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>{vendor.orders} orders</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
