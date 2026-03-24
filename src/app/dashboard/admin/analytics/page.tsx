/**
 * London's Imports - Financial Analytics Dashboard
 * Professional-grade analytics with high data density and clean typography
 */
'use client';

import { useEffect, useState, useRef } from 'react';
import { useTheme } from '@/providers/ThemeProvider';
import { adminAPI } from '@/lib/api';

interface AnalyticsData {
    revenue: { total: number; change: number; yoy_change: number }; // Added YoY
    orders: { total: number; change: number };
    users: { total: number; change: number };
    avgOrderValue: { total: number; change: number };
    revenueChart: Array<{ day: string; value: number }>;
    logisticsFunnel: Array<{ label: string; count: number }>; // Added funnel
    inventoryHealth: Array<{ name: string; rate: number; sold: number; stock: number }>; // Added inventory
    categoryBreakdown: Array<{ name: string; value: number }>;
    geographicBreakdown: Array<{ region: string; revenue: number }>;
    quickStats: {
        conversionRate: number;
        yoyGrowth: number;
    };
}

export default function AdminAnalyticsPage() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [period, setPeriod] = useState('7d');
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
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

    const handleExport = async () => {
        setExporting(true);
        try {
            const response = await adminAPI.exportAnalytics({ period });
            const url = window.URL.createObjectURL(new Blob([response.data as BlobPart]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `analytics_export_${period}_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error('Export failed:', err);
        } finally {
            setExporting(false);
        }
    };

    // Financial Sparkline - Minimalist
    const Sparkline = ({ data: chartData }: { data: number[] }) => {
        if (!chartData || chartData.length === 0) return null;
        const max = Math.max(...chartData);
        const min = Math.min(...chartData);
        const range = max - min || 1;
        const width = 120;
        const height = 40;

        const start = chartData[0];
        const end = chartData[chartData.length - 1];
        const isUp = end >= start;
        const strokeColor = isDark
            ? (isUp ? '#34d399' : '#f87171')
            : (isUp ? '#059669' : '#dc2626');

        const points = chartData.map((v, i) => {
            const x = (i / (chartData.length - 1)) * width;
            const y = height - ((v - min) / range) * height;
            return `${x},${y}`;
        }).join(' ');

        return (
            <svg width={width} height={height} className="overflow-visible opacity-80">
                <polyline points={points} fill="none" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
                        {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
                            <line key={i} x1="0" y1={height * p} x2={width} y2={height * p} stroke={isDark ? '#334155' : '#e2e8f0'} strokeWidth="1" strokeDasharray="4 4" />
                        ))}
                        <path d={areaPath} fill="url(#financeGradient)" />
                        <path d={linePath} fill="none" stroke={isDark ? '#818cf8' : '#6366f1'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <div className="flex justify-between mt-2 pl-12 text-[10px] uppercase tracking-wider font-medium text-slate-400">
                    {chartData.filter((_, i) => i % Math.ceil(chartData.length / 6) === 0).map((d, i) => (
                        <span key={i}>{d.day}</span>
                    ))}
                </div>
            </div>
        );
    };
    
    const ProgressBar = ({ rate, isDark }: { rate: number; isDark: boolean }) => {
        const barRef = useRef<HTMLDivElement>(null);
        useEffect(() => {
            if (barRef.current) {
                barRef.current.style.width = `${rate}%`;
            }
        }, [rate]);

        return (
            <div className={`h-1.5 w-full rounded-full ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                <div 
                    ref={barRef}
                    className="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out w-0" 
                />
            </div>
        );
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
            yoy: data?.revenue?.yoy_change || 0,
            sparklineData: data?.revenueChart?.map(d => d.value) || [0, 0, 0, 0, 0, 0, 0],
        },
        {
            label: 'Active Orders',
            value: (data?.orders?.total || 0).toLocaleString(),
            change: data?.orders?.change || 0,
            sparklineData: data?.revenueChart?.map(d => d.value) || [0, 0, 0, 0, 0, 0, 0],
        },
        {
            label: 'New Customers',
            value: (data?.users?.total || 0).toLocaleString(),
            change: data?.users?.change || 0,
            sparklineData: data?.revenueChart?.map(d => d.value) || [0, 0, 0, 0, 0, 0, 0],
        },
        {
            label: 'Avg Order Value',
            value: `₵${(data?.avgOrderValue?.total || 0).toLocaleString()}`,
            change: data?.avgOrderValue?.change || 0,
            sparklineData: data?.revenueChart?.map(d => d.value) || [0, 0, 0, 0, 0, 0, 0],
        },
    ];

    return (
        <div className="space-y-8 max-w-[1600px] mx-auto pb-12">
            {/* Header with Segmented Control and Export */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-gray-200 dark:border-slate-800 pb-6">
                <div>
                    <h1 className={`text-3xl font-bold tracking-tight mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Business Intelligence</h1>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Advanced financial data visualization • Last updated: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={handleExport}
                        disabled={exporting}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                            isDark ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white'
                        } disabled:opacity-50`}
                    >
                        {exporting ? 'Generating...' : 'Download CSV'}
                    </button>

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
            </div>

            {/* KPI Cards - Clean Style */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, i) => (
                    <div key={i} className={`p-6 rounded-xl border transition-all ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                        <div className="flex justify-between items-start mb-4">
                            <span className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                {stat.label}
                            </span>
                            <div className="flex flex-col items-end gap-1">
                                <span className={`flex items-center text-[10px] font-bold tabular-nums px-1.5 py-0.5 rounded ${stat.change >= 0
                                    ? (isDark ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-50 text-emerald-700')
                                    : (isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-50 text-red-700')
                                    }`}>
                                    {stat.change >= 0 ? '+' : ''}{stat.change}% vs Prev
                                </span>
                                {stat.yoy !== undefined && (
                                    <span className={`text-[10px] font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                        {stat.yoy >= 0 ? '+' : ''}{stat.yoy}% YoY
                                    </span>
                                )}
                            </div>
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

            {/* Main Charts & Funnel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className={`lg:col-span-2 p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <div className="flex justify-between items-center mb-8">
                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Revenue Trajectory</h3>
                        {data?.revenue?.total === 0 && (
                            <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded tracking-tight">
                                NO PAID ACTIVITY IN {period.toUpperCase()}
                            </span>
                        )}
                    </div>
                    {data?.revenue?.total === 0 ? (
                        <div className={`h-[300px] flex flex-col items-center justify-center text-center ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                            <TrendingUp className="w-8 h-8 mb-3 opacity-20" />
                            <p className="text-sm font-medium">No paid revenue recorded for this period.</p>
                            <p className="text-[10px] mt-1 opacity-60">Try selecting a longer period (30D/90D) or check your open orders.</p>
                        </div>
                    ) : (
                        <AreaChart chartData={data?.revenueChart || []} />
                    )}
                </div>

                <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <h3 className={`font-semibold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>Logistics Funnel</h3>
                    <div className="space-y-6 flex flex-col justify-center h-[calc(100%-2rem)]">
                        {data?.logisticsFunnel?.map((step, i) => (
                            <div key={i} className="relative group">
                                <div className={`p-4 rounded-lg flex items-center justify-between transition-colors ${
                                    isDark ? 'bg-slate-800 group-hover:bg-slate-700' : 'bg-slate-50 group-hover:bg-slate-100'
                                }`}>
                                    <div className="flex flex-col">
                                        <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{step.label}</span>
                                        <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{step.count}</span>
                                    </div>
                                    <div className={`text-xs font-medium px-2 py-1 rounded bg-indigo-500/10 text-indigo-400`}>
                                        In Stack
                                    </div>
                                </div>
                                {i < (data?.logisticsFunnel?.length || 0) - 1 && (
                                    <div className="flex justify-center -my-2">
                                        <div className={`w-0.5 h-4 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Insight Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Inventory Health */}
                <div className={`rounded-xl border overflow-hidden ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <div className={`px-6 py-4 border-b flex justify-between items-center ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Inventory Hot List</h3>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Sell-Through Rate</span>
                    </div>
                    <div className="space-y-4 p-6">
                        {data?.inventoryHealth?.map((p, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-xs font-medium">
                                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{p.name}</span>
                                    <span className="text-indigo-400">{p.rate}%</span>
                                </div>
                                <ProgressBar rate={p.rate} isDark={isDark} />
                                <div className="flex justify-between text-[10px] text-slate-500 opacity-60">
                                    <span>Sold: {p.sold}</span>
                                    <span>In Stock: {p.stock}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Geography */}
                <div className={`rounded-xl border overflow-hidden ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <div className={`px-6 py-4 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Regional Growth</h3>
                    </div>
                    <div className="p-6 space-y-4">
                        {data?.geographicBreakdown?.map((r, i) => (
                            <div key={i} className={`flex items-center justify-between p-3 rounded-lg ${isDark ? 'bg-slate-800/30' : 'bg-slate-50'}`}>
                                <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{r.region || 'Other'}</span>
                                <span className={`text-sm font-mono font-bold ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>₵{r.revenue.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Categories */}
                <div className={`rounded-xl border overflow-hidden ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <div className={`px-6 py-4 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Category Revenue</h3>
                    </div>
                    <div className="p-6 space-y-4">
                        {data?.categoryBreakdown?.map((c, i) => (
                            <div key={i} className={`flex items-center justify-between p-3 rounded-lg ${isDark ? 'bg-indigo-900/10' : 'bg-indigo-50/50'}`}>
                                <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{c.name}</span>
                                <span className={`text-sm font-mono font-bold ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>₵{c.value.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
