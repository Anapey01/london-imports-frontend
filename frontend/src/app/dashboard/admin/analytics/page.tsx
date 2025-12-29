/**
 * London's Imports - Admin Analytics Dashboard
 * Charts and insights for business metrics
 */
'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/providers/ThemeProvider';
import { adminAPI } from '@/lib/api';

export default function AdminAnalyticsPage() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [period, setPeriod] = useState('7d');
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);

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
        <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-100'}`}>
            <p className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{label}</p>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {prefix}{typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            <div className={`flex items-center gap-1 mt-1 text-sm ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className={`h-32 rounded-xl animate-pulse ${isDark ? 'bg-slate-800' : 'bg-gray-200'}`}></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Analytics</h2>
                <div className="flex gap-2">
                    {[
                        { value: '7d', label: '7 Days' },
                        { value: '30d', label: '30 Days' },
                        { value: '90d', label: '90 Days' },
                    ].map((option) => (
                        <button
                            key={option.value}
                            onClick={() => setPeriod(option.value)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${period === option.value
                                ? 'bg-pink-500 text-white'
                                : isDark
                                    ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Total Revenue" value={data.revenue.total} change={data.revenue.change} prefix="GHS " />
                <StatCard label="Total Orders" value={data.orders.total} change={data.orders.change} />
                <StatCard label="New Users" value={data.users.total} change={data.users.change} />
                <StatCard label="Avg. Order Value" value={data.avgOrderValue.total} change={data.avgOrderValue.change} prefix="GHS " />
            </div>

            {/* Revenue Chart */}
            <div className={`rounded-xl border p-6 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-100'}`}>
                <h3 className={`font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Revenue Overview</h3>
                <BarChart data={data.revenueChart} />
            </div>

            {/* Two Column Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Products */}
                <div className={`rounded-xl border overflow-hidden ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-100'}`}>
                    <div className={`px-6 py-4 border-b ${isDark ? 'border-slate-700' : 'border-gray-100'}`}>
                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Top Products</h3>
                    </div>
                    <div className="divide-y divide-slate-700">
                        {data.topProducts.map((product: any, index: number) => (
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
                        {data.topVendors.map((vendor: any, index: number) => (
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
