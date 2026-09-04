/**
 * London's Imports - High-Precision Exam Voucher Analytics & Financial Dashboard
 * Purpose-built financial terminal for WASSCE & BECE voucher sales tracking in Ghana.
 */
'use client';

import { useState, useEffect } from 'react';
import { adminAPI } from '@/lib/api';
import { 
    TrendingUp, 
    Layers, 
    Filter, 
    Calendar, 
    AlertTriangle, 
    DollarSign, 
    Package, 
    CheckCircle2, 
    Clock, 
    RefreshCw,
    ArrowUpRight
} from 'lucide-react';

interface DailyTrendPoint {
    date: string;
    revenue: number;
    profit: number;
    quantity: number;
}

interface CheckerAnalyticsData {
    selected_category: 'ALL' | 'WASSCE' | 'BECE';
    selected_period: string;
    start_date_str: string;
    end_date_str: string;
    since_upload_timestamp: string | null;

    active_revenue: string;
    active_profit: string;
    active_cost: string;
    active_margin: string;
    active_sold: number;
    active_available: number;
    active_total: number;
    active_reserved: number;
    active_pending: string;
    active_unsold_val: string;
    active_unsold_profit: string;
    total_potential: string;
    total_potential_net_profit: string;

    cost_per_unit: string;
    sparkline_revenue: number[];
    sparkline_profit: number[];
    daily_trend: DailyTrendPoint[];

    total_wassce: number;
    total_bece: number;
    sold_wassce: number;
    sold_bece: number;
    available_wassce: number;
    available_bece: number;
    reserved_wassce: number;
    reserved_bece: number;

    revenue_wassce: string;
    revenue_bece: string;
    revenue_all: string;
}

export default function AdminCheckersAnalyticsPage() {
    const [category, setCategory] = useState<'ALL' | 'WASSCE' | 'BECE'>('ALL');
    const [period, setPeriod] = useState<string>('all');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<CheckerAnalyticsData | null>(null);
    const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

    const fetchAnalytics = async () => {
        setLoading(true);
        setError(null);
        try {
            const params: Record<string, unknown> = {
                category,
                period,
            };
            if (period === 'custom' && startDate) {
                params.start_date = startDate;
                if (endDate) params.end_date = endDate;
            }
            const res = await adminAPI.checkerAnalytics(params);
            setData(res.data);
            setLastRefreshed(new Date());
        } catch (err: unknown) {
            console.error('Failed to load checker analytics:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch financial analytics');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, [category, period]);

    const handleApplyCustomDates = (e: React.FormEvent) => {
        e.preventDefault();
        fetchAnalytics();
    };

    // SVG Sparkline Line Chart Component
    const Sparkline = ({ points, color = '#10b981' }: { points: number[]; color?: string }) => {
        if (!points || points.length < 2) return null;
        const max = Math.max(...points) || 1;
        const min = Math.min(...points);
        const range = max - min || 1;
        const width = 140;
        const height = 42;

        const coords = points.map((val, idx) => {
            const x = (idx / (points.length - 1)) * width;
            const y = height - ((val - min) / range) * (height - 8) - 4;
            return `${x},${y}`;
        }).join(' ');

        return (
            <svg width={width} height={height} className="overflow-visible">
                <polyline
                    fill="none"
                    stroke={color}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={coords}
                />
            </svg>
        );
    };

    return (
        <div className="min-h-screen bg-[#0b0f19] text-[#f8fafc] p-6 sm:p-10 space-y-8 font-sans">
            {/* 1. TOP HEADER & GLOBAL CONTROLS */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-[#1e293b] pb-6">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-tight uppercase">
                            Voucher Financial & Inventory Intelligence
                        </h1>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-2 font-mono">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        Live Sync: {lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        {data?.since_upload_timestamp && period === 'since_last_upload' && (
                            <span className="text-sky-400 ml-2">
                                (Since Upload: {data.since_upload_timestamp})
                            </span>
                        )}
                    </p>
                </div>

                {/* Filter Controls Group */}
                <div className="flex flex-wrap items-center gap-3">
                    {/* Category Pill Buttons */}
                    <div className="inline-flex bg-[#090d16] p-1 rounded-xl border border-[#1e293b]">
                        {(['ALL', 'WASSCE', 'BECE'] as const).map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`px-4 py-2 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all duration-200 ${
                                    category === cat
                                        ? cat === 'WASSCE'
                                            ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40 shadow-sm'
                                            : cat === 'BECE'
                                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm'
                                            : 'bg-slate-700 text-white shadow-sm'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Date Range Select */}
                    <div className="relative">
                        <select
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            className="bg-[#090d16] text-white border border-[#1e293b] rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider outline-none focus:border-sky-500 transition-colors"
                        >
                            <option value="all">All Time</option>
                            <option value="7d">Last 7 Days</option>
                            <option value="30d">Last 30 Days</option>
                            <option value="since_last_upload">Since Last Upload</option>
                            <option value="custom">Custom Range</option>
                        </select>
                    </div>

                    {/* Custom Range Picker */}
                    {period === 'custom' && (
                        <form onSubmit={handleApplyCustomDates} className="flex items-center gap-2 bg-[#090d16] p-1 border border-[#1e293b] rounded-xl">
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="bg-transparent text-white text-xs font-mono px-2 py-1 outline-none"
                            />
                            <span className="text-xs text-slate-500">to</span>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="bg-transparent text-white text-xs font-mono px-2 py-1 outline-none"
                            />
                            <button
                                type="submit"
                                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold uppercase rounded-lg transition-colors"
                            >
                                Apply
                            </button>
                        </form>
                    )}

                    <button
                        onClick={fetchAnalytics}
                        className="p-2.5 bg-[#090d16] hover:bg-slate-800 text-slate-400 hover:text-white border border-[#1e293b] rounded-xl transition-all"
                        title="Refresh Analytics"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>

                    <div className="bg-[#090d16] border border-[#1e293b] px-3 py-2 rounded-xl text-xs font-extrabold uppercase text-slate-400 tracking-wider">
                        Unit Cost: <span className="font-mono text-white">GHS {data?.cost_per_unit || '15.00'}</span>
                    </div>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-bold uppercase tracking-wider flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                    {error}
                </div>
            )}

            {/* 2. GROUP 1: FINANCIAL HEALTH & PROFITABILITY (3 Equal Grid Columns) */}
            <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-widest text-slate-400">
                    <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        Financial & Profitability Performance
                    </span>
                    {category !== 'ALL' && (
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-black ${
                            category === 'WASSCE' ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                            FILTERED: {category} ONLY
                        </span>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1: Realized Revenue */}
                    <div className="bg-[#131c2e] border border-[#1e293b] hover:border-slate-700 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300">
                        <div>
                            <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
                                <span>Realized Revenue</span>
                                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold">
                                    +Realized
                                </span>
                            </div>
                            <div className="flex items-end justify-between gap-4">
                                <div className="text-3xl font-black font-mono tracking-tight text-white tabular-nums">
                                    GHS {data?.active_revenue || '0.00'}
                                </div>
                                {data?.sparkline_revenue && data.sparkline_revenue.length > 1 && (
                                    <div className="opacity-90">
                                        <Sparkline points={data.sparkline_revenue} color="#10b981" />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-medium">
                            {category === 'ALL' ? (
                                <>
                                    <span>WASSCE: <strong className="text-white font-mono">GHS {data?.revenue_wassce}</strong></span>
                                    <span>BECE: <strong className="text-white font-mono">GHS {data?.revenue_bece}</strong></span>
                                </>
                            ) : (
                                <>
                                    <span>Units Sold: <strong className="text-white font-mono">{data?.active_sold}</strong></span>
                                    <span>COGS: <strong className="text-white font-mono">GHS {data?.active_cost}</strong></span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Card 2: Net Realized Profit & Margin */}
                    <div className="bg-[#131c2e] border border-[#1e293b] hover:border-slate-700 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300">
                        <div>
                            <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
                                <span>Net Realized Profit</span>
                                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-extrabold">
                                    {data?.active_margin || '0.0'}% Margin
                                </span>
                            </div>
                            <div className="text-3xl font-black font-mono tracking-tight text-emerald-400 tabular-nums">
                                GHS {data?.active_profit || '0.00'}
                            </div>
                        </div>
                        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-medium">
                            <span>COGS: <strong className="text-white font-mono">GHS {data?.active_cost}</strong></span>
                            <span>({data?.active_sold} Sold @ GHS {data?.cost_per_unit})</span>
                        </div>
                    </div>

                    {/* Card 3: Unsold Stock Valuation & Pipeline */}
                    <div className="bg-[#131c2e] border border-[#1e293b] hover:border-slate-700 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300">
                        <div>
                            <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
                                <span>Unsold Stock Valuation</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    Potential Net
                                </span>
                            </div>
                            <div className="text-3xl font-black font-mono tracking-tight text-white tabular-nums">
                                GHS {data?.active_unsold_val || '0.00'}
                            </div>
                        </div>
                        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-medium">
                            <span>Potential Profit: <strong className="text-sky-400 font-mono">GHS {data?.active_unsold_profit}</strong></span>
                            <span>Pending Checkout: <strong className="text-white font-mono">GHS {data?.active_pending}</strong></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. GROUP 2: INVENTORY & STOCK VOLUME (4 Equal Grid Columns) */}
            <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-widest text-slate-400">
                    <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-sky-400" />
                        Inventory Quantity & Volume Status
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Card 1: Total Uploaded Vouchers */}
                    <div className="bg-[#131c2e] border border-[#1e293b] hover:border-slate-700 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300">
                        <div>
                            <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
                                Total Batch Uploaded
                            </div>
                            <div className="text-3xl font-black font-mono tracking-tight text-white tabular-nums">
                                {data?.active_total || 0}
                            </div>
                        </div>
                        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-medium">
                            {category === 'ALL' ? (
                                <>
                                    <span><span className="px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400 text-[9px] font-extrabold">WASSCE</span> <strong className="text-white font-mono">{data?.total_wassce}</strong></span>
                                    <span><span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[9px] font-extrabold">BECE</span> <strong className="text-white font-mono">{data?.total_bece}</strong></span>
                                </>
                            ) : (
                                <span>Category: <strong className="text-white">{category}</strong></span>
                            )}
                        </div>
                    </div>

                    {/* Card 2: Total Vouchers Sold */}
                    <div className="bg-[#131c2e] border border-[#1e293b] hover:border-slate-700 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300">
                        <div>
                            <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
                                Total Vouchers Sold
                            </div>
                            <div className="text-3xl font-black font-mono tracking-tight text-sky-400 tabular-nums">
                                {data?.active_sold || 0}
                            </div>
                        </div>
                        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-medium">
                            {category === 'ALL' ? (
                                <>
                                    <span><span className="px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400 text-[9px] font-extrabold">WASSCE</span> <strong className="text-white font-mono">{data?.sold_wassce}</strong></span>
                                    <span><span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[9px] font-extrabold">BECE</span> <strong className="text-white font-mono">{data?.sold_bece}</strong></span>
                                </>
                            ) : (
                                <span>Delivered Cards</span>
                            )}
                        </div>
                    </div>

                    {/* Card 3: Reserved (In Checkout) */}
                    <div className="bg-[#131c2e] border border-[#1e293b] hover:border-slate-700 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300">
                        <div>
                            <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
                                Reserved in Checkout
                            </div>
                            <div className="text-3xl font-black font-mono tracking-tight text-purple-400 tabular-nums">
                                {data?.active_reserved || 0}
                            </div>
                        </div>
                        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-medium">
                            {category === 'ALL' ? (
                                <>
                                    <span><span className="px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400 text-[9px] font-extrabold">WASSCE</span> <strong className="text-white font-mono">{data?.reserved_wassce}</strong></span>
                                    <span><span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[9px] font-extrabold">BECE</span> <strong className="text-white font-mono">{data?.reserved_bece}</strong></span>
                                </>
                            ) : (
                                <span>Pending Payment Carts</span>
                            )}
                        </div>
                    </div>

                    {/* Card 4: Available Stock Left */}
                    <div className="bg-[#131c2e] border border-[#1e293b] hover:border-slate-700 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300">
                        <div>
                            <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
                                <span>Available Stock Left</span>
                                {(data?.active_available || 0) < 10 && (
                                    <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 text-[9px] font-extrabold animate-pulse">
                                        LOW STOCK
                                    </span>
                                )}
                            </div>
                            <div className={`text-3xl font-black font-mono tracking-tight tabular-nums ${
                                (data?.active_available || 0) < 10 ? 'text-red-400' : 'text-emerald-400'
                            }`}>
                                {data?.active_available || 0}
                            </div>
                        </div>
                        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-medium">
                            {category === 'ALL' ? (
                                <>
                                    <span><span className="px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400 text-[9px] font-extrabold">WASSCE</span> <strong className="text-white font-mono">{data?.available_wassce}</strong></span>
                                    <span><span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[9px] font-extrabold">BECE</span> <strong className="text-white font-mono">{data?.available_bece}</strong></span>
                                </>
                            ) : (
                                <span>Instant Redeemable</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. DAILY SALES & REVENUE TRAJECTORY MATRIX */}
            {data?.daily_trend && data.daily_trend.length > 0 && (
                <div className="bg-[#131c2e] border border-[#1e293b] rounded-2xl p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">
                                Daily Sales and Earnings
                            </h3>
                            <p className="text-xs text-slate-400 font-medium mt-0.5">
                                Money made each day across selected days
                            </p>
                        </div>
                        <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
                            Total Portfolio Potential: GHS {data.total_potential}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-2">
                        {data.daily_trend.map((point, idx) => (
                            <div key={idx} className="bg-[#090d16] border border-[#1e293b] rounded-xl p-3 flex flex-col justify-between space-y-2">
                                <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider font-mono">
                                    {point.date}
                                </span>
                                <div>
                                    <div className="text-sm font-bold font-mono text-white">
                                        ₵{point.revenue.toLocaleString()}
                                    </div>
                                    <div className="text-[10px] font-mono font-semibold text-emerald-400">
                                        +₵{point.profit.toLocaleString()}
                                    </div>
                                </div>
                                <div className="text-[9px] text-slate-500 uppercase font-bold">
                                    {point.quantity} Vouchers
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
