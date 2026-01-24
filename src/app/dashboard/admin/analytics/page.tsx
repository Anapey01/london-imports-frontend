/**
 * London's Imports - Data Science Grade Analytics Dashboard
 * Executive-level analytics with real backend data
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
    orderStatusCounts: {
        completed: number;
        processing: number;
        pending: number;
        cancelled: number;
    };
    topProducts: Array<{ name: string; sales: number; revenue: number }>;
    topVendors: Array<{ name: string; orders: number; revenue: number }>;
    quickStats: {
        conversionRate: number;
        repeatCustomerRate: number;
    };
}

export default function AdminAnalyticsPage() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [period, setPeriod] = useState('7d');
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    useEffect(() => {
        const loadAnalytics = async () => {
            setLoading(true);
            try {
                const response = await adminAPI.analytics({ period });
                setData(response.data);
                setLastUpdated(new Date());
            } catch (err) {
                console.error('Failed to load analytics:', err);
            } finally {
                setLoading(false);
            }
        };
        loadAnalytics();
    }, [period]);

    // Sparkline component - mini line chart
    const Sparkline = ({ data: chartData, color = '#ec4899' }: { data: number[]; color?: string }) => {
        if (!chartData || chartData.length === 0) return null;
        const max = Math.max(...chartData);
        const min = Math.min(...chartData);
        const range = max - min || 1;
        const width = 80;
        const height = 24;
        const points = chartData.map((v, i) => {
            const x = (i / (chartData.length - 1)) * width;
            const y = height - ((v - min) / range) * height;
            return `${x},${y}`;
        }).join(' ');

        return (
            <svg width={width} height={height} className="overflow-visible">
                <polyline
                    points={points}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        );
    };

    // Area Chart Component
    const AreaChart = ({ chartData }: { chartData: { day: string; value: number }[] }) => {
        if (!chartData || chartData.length === 0) {
            return <div className={`h-64 flex items-center justify-center ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>No data available</div>;
        }

        const values = chartData.map(d => d.value);
        const max = Math.max(...values) || 1;
        // Increase resolution to minimize distortion and improve line quality
        const width = 800;
        const height = 300;

        const points = values.map((v, i) => {
            const x = (i / (values.length - 1)) * width;
            const y = height - (v / max) * height;
            return { x, y, value: v };
        });

        const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
        const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;

        return (
            <div className="relative h-64">
                <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-right pr-3">
                    <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>₵{max.toLocaleString()}</span>
                    <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>₵{Math.round(max / 2).toLocaleString()}</span>
                    <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>₵0</span>
                </div>

                <div className="ml-12 h-full">
                    <svg viewBox={`0 0 ${width} ${height + 10}`} className="w-full h-56" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#ec4899" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
                            </linearGradient>
                        </defs>

                        {/* Grid lines - scaled for height 300 */}
                        {[0, 75, 150, 225, 300].map((y) => (
                            <line key={y} x1="0" y1={y} x2={width} y2={y} stroke={isDark ? '#334155' : '#e5e7eb'} strokeWidth="1" />
                        ))}

                        <path d={areaPath} fill="url(#areaGradient)" />
                        <path d={linePath} fill="none" stroke="#ec4899" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>

                    <div className="flex justify-between mt-2">
                        {chartData.map((d, i) => (
                            <span key={i} className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>{d.day}</span>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    // Donut Chart Component - uses real data
    const DonutChart = ({ statusCounts }: { statusCounts: AnalyticsData['orderStatusCounts'] | undefined }) => {
        const chartData = [
            { label: 'Completed', value: statusCounts?.completed || 0, color: '#10b981' },
            { label: 'Processing', value: statusCounts?.processing || 0, color: '#3b82f6' },
            { label: 'Pending', value: statusCounts?.pending || 0, color: '#f59e0b' },
            { label: 'Cancelled', value: statusCounts?.cancelled || 0, color: '#ef4444' },
        ];

        const total = chartData.reduce((sum, d) => sum + d.value, 0);
        if (total === 0) {
            return <div className={`h-32 flex items-center justify-center ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>No orders yet</div>;
        }

        let currentAngle = -90;
        const segments = chartData.map(d => {
            const angle = (d.value / total) * 360;
            const startAngle = currentAngle;
            currentAngle += angle;
            return { ...d, startAngle, angle };
        });

        const polarToCartesian = (angle: number, radius: number) => {
            const rad = (angle * Math.PI) / 180;
            return { x: 50 + radius * Math.cos(rad), y: 50 + radius * Math.sin(rad) };
        };

        return (
            <div className="flex items-center gap-6">
                <div className="relative w-32 h-32">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                        {segments.map((seg, i) => {
                            if (seg.value === 0) return null;
                            const start = polarToCartesian(seg.startAngle, 40);
                            const end = polarToCartesian(seg.startAngle + seg.angle, 40);
                            const largeArc = seg.angle > 180 ? 1 : 0;
                            const d = `M 50 50 L ${start.x} ${start.y} A 40 40 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
                            return <path key={i} d={d} fill={seg.color} className="hover:opacity-80 transition-opacity" />;
                        })}
                        <circle cx="50" cy="50" r="25" fill={isDark ? '#1e293b' : '#fff'} />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{total}</span>
                        <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Total</span>
                    </div>
                </div>
                <div className="space-y-2">
                    {chartData.map((d, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
                            <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>{d.label}</span>
                            <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{d.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Generate sparkline data from revenue chart
    const getSparklineData = (chartData: { day: string; value: number }[] | undefined) => {
        if (!chartData || chartData.length === 0) return [0, 0, 0, 0, 0, 0, 0];
        return chartData.map(d => d.value);
    };

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className={`h-28 rounded-2xl ${isDark ? 'bg-slate-800' : 'bg-gray-200'}`}></div>
                    ))}
                </div>
                <div className={`h-80 rounded-2xl ${isDark ? 'bg-slate-800' : 'bg-gray-200'}`}></div>
            </div>
        );
    }

    // Use real data from API
    const statCards = [
        {
            label: 'Total Revenue',
            value: `₵${(data?.revenue?.total || 0).toLocaleString()}`,
            change: data?.revenue?.change || 0,
            sparklineData: getSparklineData(data?.revenueChart),
            color: '#8b5cf6'
        },
        {
            label: 'Orders',
            value: (data?.orders?.total || 0).toLocaleString(),
            change: data?.orders?.change || 0,
            sparklineData: getSparklineData(data?.revenueChart),
            color: '#10b981'
        },
        {
            label: 'New Users',
            value: (data?.users?.total || 0).toLocaleString(),
            change: data?.users?.change || 0,
            sparklineData: getSparklineData(data?.revenueChart),
            color: '#3b82f6'
        },
        {
            label: 'Avg. Order',
            value: `₵${(data?.avgOrderValue?.total || 0).toLocaleString()}`,
            change: data?.avgOrderValue?.change || 0,
            sparklineData: getSparklineData(data?.revenueChart),
            color: '#ec4899'
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Analytics Dashboard</h1>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                        Real-time data • Updated: {lastUpdated.toLocaleTimeString()}
                    </p>
                </div>
                <div className={`flex items-center gap-2 p-1 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`}>
                    {['7d', '30d', '90d', '1y'].map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${period === p
                                ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/25'
                                : isDark ? 'text-slate-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            {p === '1y' ? '1 Year' : p === '90d' ? '90 Days' : p === '30d' ? '30 Days' : '7 Days'}
                        </button>
                    ))}
                </div>
            </div>

            {/* KPI Cards with Sparklines */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, index) => (
                    <div
                        key={index}
                        className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-gray-100'} hover:shadow-lg transition-shadow`}
                    >
                        <div className="flex items-start justify-between mb-2">
                            <p className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{stat.label}</p>
                            <div className={`flex items-center gap-0.5 text-xs font-semibold ${stat.change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.change >= 0 ? 'M5 10l7-7m0 0l7 7m-7-7v18' : 'M19 14l-7 7m0 0l-7-7m7 7V3'} />
                                </svg>
                                {Math.abs(stat.change)}%
                            </div>
                        </div>
                        <p className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
                        <Sparkline data={stat.sparklineData} color={stat.color} />
                    </div>
                ))}
            </div>

            {/* Main Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Trend - Takes 2 columns */}
                <div className={`lg:col-span-2 p-6 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-gray-100'}`}>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Revenue Trend</h3>
                            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Daily revenue for selected period</p>
                        </div>
                        {(data?.revenue?.change || 0) !== 0 && (
                            <div className={`px-3 py-1.5 rounded-full text-xs font-semibold ${(data?.revenue?.change || 0) >= 0
                                ? isDark ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
                                : isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-600'
                                }`}>
                                {(data?.revenue?.change || 0) >= 0 ? '↑' : '↓'} {Math.abs(data?.revenue?.change || 0)}% vs last period
                            </div>
                        )}
                    </div>
                    <AreaChart chartData={data?.revenueChart || []} />
                </div>

                {/* Order Status Breakdown */}
                <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-gray-100'}`}>
                    <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Order Status</h3>
                    <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Current order breakdown</p>
                    <DonutChart statusCounts={data?.orderStatusCounts} />
                </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Products Table */}
                <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-gray-100'}`}>
                    <div className={`px-6 py-4 border-b ${isDark ? 'border-slate-700/50' : 'border-gray-100'}`}>
                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Top Products</h3>
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>By revenue this period</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className={`text-xs uppercase ${isDark ? 'bg-slate-900/50 text-slate-400' : 'bg-gray-50 text-gray-500'}`}>
                                <tr>
                                    <th className="px-6 py-3 text-left font-medium">Product</th>
                                    <th className="px-6 py-3 text-right font-medium">Sales</th>
                                    <th className="px-6 py-3 text-right font-medium">Revenue</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${isDark ? 'divide-slate-700/50' : 'divide-gray-100'}`}>
                                {(!data?.topProducts || data.topProducts.length === 0) ? (
                                    <tr>
                                        <td colSpan={3} className={`px-6 py-8 text-center ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>
                                            No products yet
                                        </td>
                                    </tr>
                                ) : (
                                    data.topProducts.map((product, i) => (
                                        <tr key={i} className={`${isDark ? 'hover:bg-slate-700/30' : 'hover:bg-gray-50'} transition-colors`}>
                                            <td className={`px-6 py-3 text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                <div className="flex items-center gap-3">
                                                    <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-amber-500 text-white' :
                                                        i === 1 ? 'bg-slate-400 text-white' :
                                                            i === 2 ? 'bg-amber-700 text-white' :
                                                                isDark ? 'bg-slate-700 text-slate-400' : 'bg-gray-100 text-gray-500'
                                                        }`}>{i + 1}</span>
                                                    {product.name}
                                                </div>
                                            </td>
                                            <td className={`px-6 py-3 text-sm text-right ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>{product.sales}</td>
                                            <td className={`px-6 py-3 text-sm font-semibold text-right ${isDark ? 'text-white' : 'text-gray-900'}`}>₵{product.revenue.toLocaleString()}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Vendors & Quick Stats */}
                <div className="space-y-6">
                    {/* Top Vendors */}
                    <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-gray-100'}`}>
                        <div className={`px-6 py-4 border-b ${isDark ? 'border-slate-700/50' : 'border-gray-100'}`}>
                            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Top Vendors</h3>
                        </div>
                        <div className={`divide-y ${isDark ? 'divide-slate-700/50' : 'divide-gray-100'}`}>
                            {(!data?.topVendors || data.topVendors.length === 0) ? (
                                <div className={`px-6 py-8 text-center ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>
                                    No vendors yet
                                </div>
                            ) : (
                                data.topVendors.map((vendor, i) => (
                                    <div key={i} className="px-6 py-3 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isDark ? 'bg-gradient-to-br from-violet-500 to-purple-600' : 'bg-gradient-to-br from-violet-400 to-purple-500'
                                                } text-white`}>
                                                {vendor.name.charAt(0)}
                                            </div>
                                            <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{vendor.name}</span>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{vendor.orders} orders</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Quick Stats - Now uses real data */}
                    <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-gray-100'}`}>
                        <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Quick Insights</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Conversion Rate</span>
                                <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {data?.quickStats?.conversionRate || 0}%
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Repeat Customer Rate</span>
                                <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {data?.quickStats?.repeatCustomerRate || 0}%
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Total Orders (All Time)</span>
                                <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {(data?.orderStatusCounts?.completed || 0) +
                                        (data?.orderStatusCounts?.processing || 0) +
                                        (data?.orderStatusCounts?.pending || 0) +
                                        (data?.orderStatusCounts?.cancelled || 0)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
