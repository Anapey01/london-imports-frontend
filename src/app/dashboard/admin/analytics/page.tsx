/**
 * London's Imports - Financial Analytics Dashboard
 * Professional-grade analytics with high data density and clean typography
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

    // Financial Sparkline - Minimalist
    const Sparkline = ({ data: chartData }: { data: number[] }) => {
        if (!chartData || chartData.length === 0) return null;
        const max = Math.max(...chartData);
        const min = Math.min(...chartData);
        const range = max - min || 1;
        const width = 120;
        const height = 40;

        // Determine trend color based on start vs end
        const start = chartData[0];
        const end = chartData[chartData.length - 1];
        const isUp = end >= start;
        const strokeColor = isDark
            ? (isUp ? '#34d399' : '#f87171') // Emerald-400 : Red-400
            : (isUp ? '#059669' : '#dc2626'); // Emerald-600 : Red-600

        const points = chartData.map((v, i) => {
            const x = (i / (chartData.length - 1)) * width;
            const y = height - ((v - min) / range) * height; // Invert Y
            return `${x},${y}`;
        }).join(' ');

        return (
            <svg width={width} height={height} className="overflow-visible opacity-80">
                <polyline
                    points={points}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        );
    };

    // Professional Area Chart
    const AreaChart = ({ chartData }: { chartData: { day: string; value: number }[] }) => {
        if (!chartData || chartData.length === 0) {
            return <div className={`h-[300px] flex items-center justify-center text-sm font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>No data available</div>;
        }

        const values = chartData.map(d => d.value);
        const max = Math.max(...values) || 1;
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
            <div className="relative h-[300px] w-full mt-4">
                {/* Y-Axis Labels - Minimal */}
                <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-right pr-4 pointer-events-none z-10">
                    <span className={`text-[10px] font-mono opacity-50 ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>₵{max.toLocaleString()}</span>
                    <span className={`text-[10px] font-mono opacity-50 ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>₵{Math.round(max / 2).toLocaleString()}</span>
                    <span className={`text-[10px] font-mono opacity-50 ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>₵0</span>
                </div>

                <div className="pl-12 h-full w-full">
                    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="financeGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={isDark ? '#818cf8' : '#6366f1'} stopOpacity="0.2" />
                                <stop offset="100%" stopColor={isDark ? '#818cf8' : '#6366f1'} stopOpacity="0" />
                            </linearGradient>
                        </defs>

                        {/* Subtle Grid */}
                        {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
                            <line
                                key={i}
                                x1="0"
                                y1={height * p}
                                x2={width}
                                y2={height * p}
                                stroke={isDark ? '#334155' : '#e2e8f0'}
                                strokeWidth="1"
                                strokeDasharray="4 4"
                            />
                        ))}

                        <path d={areaPath} fill="url(#financeGradient)" />
                        <path
                            d={linePath}
                            fill="none"
                            stroke={isDark ? '#818cf8' : '#6366f1'} // Indigo
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>

                {/* X-Axis Labels */}
                <div className="flex justify-between mt-2 pl-12 text-[10px] uppercase tracking-wider font-medium text-slate-400">
                    {chartData.filter((_, i) => i % Math.ceil(chartData.length / 6) === 0).map((d, i) => (
                        <span key={i}>{d.day}</span>
                    ))}
                </div>
            </div>
        );
    };

    // Donut Chart - Side Legend Layout
    const DonutChart = ({ statusCounts }: { statusCounts: AnalyticsData['orderStatusCounts'] | undefined }) => {
        const chartData = [
            { label: 'Completed', value: statusCounts?.completed || 0, color: '#10b981', colorClass: 'bg-emerald-500' },
            { label: 'Processing', value: statusCounts?.processing || 0, color: '#3b82f6', colorClass: 'bg-blue-500' },
            { label: 'Pending', value: statusCounts?.pending || 0, color: '#f59e0b', colorClass: 'bg-amber-500' },
            { label: 'Cancelled', value: statusCounts?.cancelled || 0, color: '#ef4444', colorClass: 'bg-red-500' },
        ];

        const total = chartData.reduce((sum, d) => sum + d.value, 0);
        if (total === 0) return <div className="h-40 flex items-center justify-center text-sm text-slate-400">No data</div>;

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
            <div className="flex items-center justify-between gap-8 h-full">
                <div className="relative w-32 h-32 flex-shrink-0">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                        {segments.map((seg, i) => {
                            if (seg.value === 0) return null;
                            const start = polarToCartesian(seg.startAngle, 40);
                            const end = polarToCartesian(seg.startAngle + seg.angle, 40);
                            const largeArc = seg.angle > 180 ? 1 : 0;
                            const d = `M 50 50 L ${start.x} ${start.y} A 40 40 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
                            return <path key={i} d={d} fill={seg.color} className="transition-opacity hover:opacity-80" />;
                        })}
                        <circle cx="50" cy="50" r="28" fill={isDark ? '#1e293b' : '#ffffff'} />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className={`text-xl font-bold font-mono tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>{total}</span>
                    </div>
                </div>

                <div className="flex-1 space-y-2">
                    {chartData.map((d, i) => (
                        <div key={i} className="flex items-center justify-between text-sm group">
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-sm ${d.colorClass}`}></span>
                                <span className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{d.label}</span>
                            </div>
                            <span className={`font-mono font-medium ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                                {d.value} <span className="text-xs opacity-50 ml-0.5">({Math.round((d.value / total) * 100)}%)</span>
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const getSparklineData = (chartData: { day: string; value: number }[] | undefined) => {
        if (!chartData || chartData.length === 0) return [0, 0, 0, 0, 0, 0, 0];
        return chartData.map(d => d.value);
    };

    if (loading) {
        return (
            <div className="grid grid-cols-4 gap-6 animate-pulse">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className={`h-32 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}></div>
                ))}
            </div>
        );
    }

    const statCards = [
        {
            label: 'Total Revenue',
            value: `₵${(data?.revenue?.total || 0).toLocaleString()}`,
            change: data?.revenue?.change || 0,
            sparklineData: getSparklineData(data?.revenueChart),
        },
        {
            label: 'Active Orders',
            value: (data?.orders?.total || 0).toLocaleString(),
            change: data?.orders?.change || 0,
            sparklineData: getSparklineData(data?.revenueChart),
        },
        {
            label: 'New Customers',
            value: (data?.users?.total || 0).toLocaleString(),
            change: data?.users?.change || 0,
            sparklineData: getSparklineData(data?.revenueChart),
        },
        {
            label: 'Avg Order Value',
            value: `₵${(data?.avgOrderValue?.total || 0).toLocaleString()}`,
            change: data?.avgOrderValue?.change || 0,
            sparklineData: getSparklineData(data?.revenueChart),
        },
    ];

    return (
        <div className="space-y-8 max-w-[1600px] mx-auto pb-12">
            {/* Header with Segmented Control */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-gray-200 dark:border-slate-800 pb-6">
                <div>
                    <h1 className={`text-3xl font-bold tracking-tight mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Financial Overview</h1>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Business performance metrics • Last updated: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>

                <div className={`inline-flex p-1 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                    {['7d', '30d', '90d', '1y'].map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${period === p
                                ? (isDark ? 'bg-slate-700 text-white shadow-sm' : 'bg-white text-slate-900 shadow-sm ring-1 ring-black/5')
                                : (isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900')
                                }`}
                        >
                            {p === '1y' ? '1Y' : p.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* KPI Cards - Clean Style */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, i) => (
                    <div key={i} className={`p-6 rounded-xl border transition-all ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                        <div className="flex justify-between items-start mb-4">
                            <span className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                {stat.label}
                            </span>
                            <span className={`flex items-center text-xs font-bold tabular-nums px-1.5 py-0.5 rounded ${stat.change >= 0
                                ? (isDark ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-50 text-emerald-700')
                                : (isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-50 text-red-700')
                                }`}>
                                {stat.change >= 0 ? '+' : ''}{stat.change}%
                            </span>
                        </div>

                        <div className="flex items-end justify-between">
                            <div className={`text-3xl font-bold font-mono tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                {stat.value}
                            </div>
                            <div className="mb-1">
                                <Sparkline data={stat.sparklineData} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Trend - 2/3 width */}
                <div className={`lg:col-span-2 p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <div className="flex items-center justify-between mb-8">
                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Revenue Trajectory</h3>
                        <div className={`px-2 py-1 rounded text-xs font-medium ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                            Net Earnings
                        </div>
                    </div>
                    <AreaChart chartData={data?.revenueChart || []} />
                </div>

                {/* Order Distribution - 1/3 width */}
                <div className={`p-6 rounded-xl border flex flex-col ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <h3 className={`font-semibold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>Order Composition</h3>
                    <div className="flex-1 flex flex-col justify-center">
                        <DonutChart statusCounts={data?.orderStatusCounts} />
                    </div>
                </div>
            </div>

            {/* Data Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Products */}
                <div className={`rounded-xl border overflow-hidden ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <div className={`px-6 py-4 border-b flex justify-between items-center ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Top Performers</h3>
                        <button className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'}`}>
                            Full Report →
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className={`text-xs uppercase tracking-wider font-semibold ${isDark ? 'bg-slate-800/50 text-slate-400' : 'bg-slate-50 text-slate-500'}`}>
                                <tr>
                                    <th className="px-6 py-3 text-left">Product</th>
                                    <th className="px-6 py-3 text-right">Vol</th>
                                    <th className="px-6 py-3 text-right">Rev</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
                                {data?.topProducts?.map((p, i) => (
                                    <tr key={i} className={`group ${isDark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50'}`}>
                                        <td className="px-6 py-3 font-medium">
                                            <div className="flex items-center gap-3">
                                                <span className={`w-5 h-5 flex items-center justify-center rounded text-[10px] font-bold ${i < 3 ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                                                    }`}>
                                                    {i + 1}
                                                </span>
                                                <span className={isDark ? 'text-slate-200' : 'text-slate-700'}>{p.name}</span>
                                            </div>
                                        </td>
                                        <td className={`px-6 py-3 text-right font-mono ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{p.sales}</td>
                                        <td className={`px-6 py-3 text-right font-mono font-medium ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>₵{p.revenue.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {(!data?.topProducts || data.topProducts.length === 0) && (
                        <div className="p-8 text-center text-sm text-slate-400">No product data available</div>
                    )}
                </div>

                {/* Top Vendors */}
                <div className={`rounded-xl border overflow-hidden ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <div className={`px-6 py-4 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Vendor Volume</h3>
                    </div>
                    <div className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
                        {data?.topVendors?.length ? data.topVendors.map((v, i) => (
                            <div key={i} className={`px-6 py-3 flex items-center justify-between ${isDark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50'}`}>
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm ${isDark ? 'bg-slate-700' : 'bg-slate-600'
                                        }`}>
                                        {v.name.charAt(0)}
                                    </div>
                                    <span className={`font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{v.name}</span>
                                </div>
                                <div className="text-right">
                                    <span className={`block font-mono font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{v.orders}</span>
                                    <span className="text-[10px] text-slate-400 uppercase tracking-wide">Orders</span>
                                </div>
                            </div>
                        )) : (
                            <div className="p-8 text-center text-sm text-slate-400">No vendor data available</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
