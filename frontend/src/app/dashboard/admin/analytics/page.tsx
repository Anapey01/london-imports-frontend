/**
 * London's Imports - Admin Analytics Dashboard
 * Charts and insights for business metrics
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
    const [period, setPeriod] = useState('This Week');
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

    const StatCard = ({ label, value, change, prefix = '' }: { label: string; value: number | string; change: number; prefix?: string }) => (
        <div className={`p-4 sm:p-6 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-100'}`}>
            <p className={`text-xs sm:text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{label}</p>
            <p className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {prefix}{typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            <div className={`flex items-center gap-1 mt-1 text-xs sm:text-sm ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={change >= 0 ? 'M5 10l7-7m0 0l7 7m-7-7v18' : 'M19 14l-7 7m0 0l-7-7m7 7V3'} />
                </svg>
                {Math.abs(change)}%
            </div>
        </div>
    );

    // Simple bar chart using divs
    const BarChart = ({ data }: { data: { day: string; value: number }[] }) => {
        const maxValue = Math.max(...data.map(d => d.value));
        return (
            <div className="flex items-end justify-between h-48 gap-2">
                {data.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <div
                            className="w-full bg-gradient-to-t from-pink-500 to-pink-400 rounded-t-lg transition-all hover:from-pink-600 hover:to-pink-500"
                            style={{ height: `${(item.value / maxValue) * 100}%` }}
                        ></div>
                        <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>{item.day}</span>
                    </div>
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className={`h-24 rounded-2xl animate-pulse ${isDark ? 'bg-slate-800' : 'bg-gray-200'}`}></div>
                    ))}
                </div>
            </div>
        );
    }

    // Fallback data if API fails
    const safeData = data || {
        revenue: { total: 0, change: 0 },
        orders: { total: 0, change: 0 },
        users: { total: 0, change: 0 },
        avgOrderValue: { total: 0, change: 0 },
        revenueChart: [
            { day: 'Mon', value: 0 },
            { day: 'Tue', value: 0 },
            { day: 'Wed', value: 0 },
            { day: 'Thu', value: 0 },
            { day: 'Fri', value: 0 },
            { day: 'Sat', value: 0 },
            { day: 'Sun', value: 0 },
        ],
        topProducts: [],
        topVendors: [],
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className={`text-lg sm:text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Analytics</h2>
                <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                    {[
                        { value: '7d', label: '7D' },
                        { value: '30d', label: '30D' },
                        { value: '90d', label: '90D' },
                    ].map((option) => (
                        <button
                            key={option.value}
                            onClick={() => setPeriod(option.value)}
                            className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${period === option.value
                                ? 'bg-pink-500 text-white'
                                : isDark
                                    ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {option.label}
                        </button>
                    ))
                    }
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                <StatCard label="Total Revenue" value={safeData.revenue.total} change={safeData.revenue.change} prefix="GHS " />
                <StatCard label="Total Orders" value={safeData.orders.total} change={safeData.orders.change} />
                <StatCard label="New Users" value={safeData.users.total} change={safeData.users.change} />
                <StatCard label="Avg. Order Value" value={safeData.avgOrderValue.total} change={safeData.avgOrderValue.change} prefix="GHS " />
            </div>

            {/* Revenue Chart */}
            <div className={`rounded-xl border p-6 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-100'}`}>
                <h3 className={`font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Revenue Overview</h3>
                <BarChart data={safeData.revenueChart} />
            </div>

            {/* Two Column Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Products */}
                <div className={`rounded-xl border overflow-hidden ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-100'}`}>
                    <div className={`px-6 py-4 border-b ${isDark ? 'border-slate-700' : 'border-gray-100'}`}>
                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Top Products</h3>
                    </div>
                    <div className="divide-y divide-slate-700">
                        {safeData.topProducts.map((product, index: number) => (
                            <div key={index} className={`px-6 py-4 flex items-center justify-between ${isDark ? 'divide-slate-700' : 'divide-gray-100'}`}>
                                <div className="flex items-center gap-3">
                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index < 3 ? 'bg-amber-500 text-white' : isDark ? 'bg-slate-700 text-slate-400' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {index + 1}
                                    </span>
                                    <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{product.name}</span>
                                </div>
                                <div className="text-right">
                                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>GHS {product.revenue.toLocaleString()}</p>
                                    <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>{product.sales} sold</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Vendors */}
                <div className={`rounded-xl border overflow-hidden ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-100'}`}>
                    <div className={`px-6 py-4 border-b ${isDark ? 'border-slate-700' : 'border-gray-100'}`}>
                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Top Vendors</h3>
                    </div>
                    <div className="divide-y divide-slate-700">
                        {safeData.topVendors.map((vendor, index: number) => (
                            <div key={index} className={`px-6 py-4 flex items-center justify-between ${isDark ? 'divide-slate-700' : 'divide-gray-100'}`}>
                                <div className="flex items-center gap-3">
                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index < 3 ? 'bg-purple-500 text-white' : isDark ? 'bg-slate-700 text-slate-400' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {index + 1}
                                    </span>
                                    <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{vendor.name}</span>
                                </div>
                                <div className="text-right">
                                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>GHS {vendor.revenue.toLocaleString()}</p>
                                    <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>{vendor.orders} orders</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
