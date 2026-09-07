/**
 * London's Imports - High-Precision Exam Voucher Analytics & Financial Dashboard
 * Purpose-built financial terminal for WASSCE & BECE voucher sales tracking in Ghana.
 */
'use client';

import { useState, useEffect, useMemo } from 'react';
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
    ArrowUpRight,
    Users,
    Copy,
    Check,
    ExternalLink,
    Search,
    ShieldCheck,
    Send,
    AlertCircle
} from 'lucide-react';

interface AgentPayoutItem {
    id: string;
    reference: string;
    amount: string;
    momo_network: string;
    momo_number: string;
    status: string;
    status_display: string;
    notes: string;
    created_at: string;
    updated_at: string;
    agent: {
        id: string;
        store_name: string;
        slug: string;
        email: string;
        momo_network: string;
        momo_number: string;
        wallet_balance: string;
        total_checkers_sold: number;
        total_sales_value: string;
        lifetime_commission: string;
    };
}

interface AgentListItem {
    id: string;
    store_name: string;
    slug: string;
    email: string;
    momo_network: string;
    momo_number: string;
    wallet_balance: string;
    total_checkers_sold: number;
    total_sales_value: string;
    lifetime_commission: string;
    created_at: string;
}

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
    // Navigation tab
    const [mainTab, setMainTab] = useState<'vouchers' | 'resellers'>('vouchers');

    // === Voucher Analytics State ===
    const [category, setCategory] = useState<'ALL' | 'WASSCE' | 'BECE'>('ALL');
    const [period, setPeriod] = useState<string>('all');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    
    const [analyticsLoading, setAnalyticsLoading] = useState<boolean>(true);
    const [analyticsError, setAnalyticsError] = useState<string | null>(null);
    const [data, setData] = useState<CheckerAnalyticsData | null>(null);
    const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

    // === Reseller Agents & Payouts State ===
    const [payouts, setPayouts] = useState<AgentPayoutItem[]>([]);
    const [agents, setAgents] = useState<AgentListItem[]>([]);
    const [pendingPayoutsCount, setPendingPayoutsCount] = useState<number>(0);
    const [totalCompletedPayoutsVal, setTotalCompletedPayoutsVal] = useState<string>('0.00');
    const [totalAgentsCount, setTotalAgentsCount] = useState<number>(0);
    const [resellersLoading, setResellersLoading] = useState<boolean>(false);
    const [resellersError, setResellersError] = useState<string | null>(null);

    // Filters & Actions
    const [payoutFilter, setPayoutFilter] = useState<'PENDING' | 'COMPLETED' | 'ALL'>('PENDING');
    const [agentSearch, setAgentSearch] = useState<string>('');
    const [copiedKey, setCopiedKey] = useState<string | null>(null);
    const [selectedPayoutToPay, setSelectedPayoutToPay] = useState<AgentPayoutItem | null>(null);
    const [payingInProgress, setPayingInProgress] = useState<boolean>(false);
    const [notificationMessage, setNotificationMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const fetchAnalytics = async () => {
        setAnalyticsLoading(true);
        setAnalyticsError(null);
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
            setAnalyticsError(err instanceof Error ? err.message : 'Failed to fetch financial analytics');
        } finally {
            setAnalyticsLoading(false);
        }
    };

    const fetchResellersData = async () => {
        setResellersLoading(true);
        setResellersError(null);
        try {
            const [payoutsRes, agentsRes] = await Promise.all([
                adminAPI.checkerAgentPayouts(),
                adminAPI.checkerAgentsList(),
            ]);

            setPayouts(payoutsRes.data.results || []);
            setPendingPayoutsCount(payoutsRes.data.pending_count || 0);
            setTotalCompletedPayoutsVal(payoutsRes.data.total_completed_payouts_val || '0.00');

            setAgents(agentsRes.data.results || []);
            setTotalAgentsCount(agentsRes.data.total_agents || 0);
        } catch (err: unknown) {
            console.error('Failed to load reseller payouts data:', err);
            setResellersError(err instanceof Error ? err.message : 'Failed to load reseller payouts');
        } finally {
            setResellersLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
        fetchResellersData();
    }, []);

    useEffect(() => {
        if (mainTab === 'vouchers') {
            fetchAnalytics();
        } else {
            fetchResellersData();
        }
    }, [category, period, mainTab]);

    const handleApplyCustomDates = (e: React.FormEvent) => {
        e.preventDefault();
        fetchAnalytics();
    };

    const handleCopy = (text: string, key: string) => {
        navigator.clipboard.writeText(text);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2000);
    };

    const handleConfirmPayment = async () => {
        if (!selectedPayoutToPay) return;
        setPayingInProgress(true);
        try {
            await adminAPI.checkerMarkPayoutPaid(selectedPayoutToPay.id);
            setNotificationMessage({
                type: 'success',
                text: `Payout GH₵ ${selectedPayoutToPay.amount} to ${selectedPayoutToPay.agent.store_name} marked as PAID. Trustpilot review invitation email sent!`
            });
            setSelectedPayoutToPay(null);
            await fetchResellersData();
        } catch (err: any) {
            setNotificationMessage({
                type: 'error',
                text: err.response?.data?.error || 'Failed to mark payout as completed.'
            });
        } finally {
            setPayingInProgress(false);
        }
    };

    const filteredPayouts = useMemo(() => {
        if (payoutFilter === 'ALL') return payouts;
        return payouts.filter(p => p.status === payoutFilter);
    }, [payouts, payoutFilter]);

    const pendingPayoutsTotalSum = useMemo(() => {
        return payouts
            .filter(p => p.status === 'PENDING')
            .reduce((sum, p) => sum + parseFloat(p.amount || '0'), 0);
    }, [payouts]);

    const filteredAgents = useMemo(() => {
        if (!agentSearch.trim()) return agents;
        const q = agentSearch.toLowerCase();
        return agents.filter(a => 
            a.store_name.toLowerCase().includes(q) ||
            a.email.toLowerCase().includes(q) ||
            a.momo_number.includes(q) ||
            a.slug.toLowerCase().includes(q)
        );
    }, [agents, agentSearch]);

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
            {/* Notification Toast */}
            {notificationMessage && (
                <div className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                    notificationMessage.type === 'success'
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}>
                    <div className="flex items-center gap-3">
                        {notificationMessage.type === 'success' ? (
                            <CheckCircle2 className="w-5 h-5 shrink-0" />
                        ) : (
                            <AlertCircle className="w-5 h-5 shrink-0" />
                        )}
                        <span className="text-xs font-semibold">{notificationMessage.text}</span>
                    </div>
                    <button
                        onClick={() => setNotificationMessage(null)}
                        className="text-slate-400 hover:text-white text-xs uppercase tracking-wider font-mono ml-4"
                    >
                        Dismiss
                    </button>
                </div>
            )}

            {/* Top Navigation Tabs */}
            <div className="flex items-center justify-between border-b border-[#1e293b] pb-4">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => setMainTab('vouchers')}
                        className={`pb-2 text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 ${
                            mainTab === 'vouchers'
                                ? 'border-sky-500 text-white'
                                : 'border-transparent text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        <TrendingUp className="w-4 h-4 text-sky-400" />
                        Voucher Analytics
                    </button>

                    <button
                        onClick={() => setMainTab('resellers')}
                        className={`pb-2 text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 relative ${
                            mainTab === 'resellers'
                                ? 'border-emerald-500 text-white'
                                : 'border-transparent text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        <Users className="w-4 h-4 text-emerald-400" />
                        Reseller Agents & Payouts
                        {pendingPayoutsCount > 0 && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                                {pendingPayoutsCount} PENDING
                            </span>
                        )}
                    </button>
                </div>

                <button
                    onClick={() => {
                        if (mainTab === 'vouchers') fetchAnalytics();
                        else fetchResellersData();
                    }}
                    className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400 hover:text-white transition-colors bg-[#090d16] px-3 py-1.5 rounded-lg border border-[#1e293b]"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${analyticsLoading || resellersLoading ? 'animate-spin' : ''}`} />
                    Sync
                </button>
            </div>

            {/* VIEW 1: VOUCHER ANALYTICS */}
            {mainTab === 'vouchers' && (
                <div className="space-y-8">
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
                        <RefreshCw className={`w-4 h-4 ${analyticsLoading ? 'animate-spin' : ''}`} />
                    </button>

                    <div className="bg-[#090d16] border border-[#1e293b] px-3 py-2 rounded-xl text-xs font-extrabold uppercase text-slate-400 tracking-wider">
                        Unit Cost: <span className="font-mono text-white">GHS {data?.cost_per_unit || '15.00'}</span>
                    </div>
                </div>
            </div>

            {analyticsError && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-bold uppercase tracking-wider flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                    {analyticsError}
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
            )}

            {/* ========================================================= */}
            {/* VIEW 2: RESELLER AGENTS & PAYOUTS DISBURSEMENT            */}
            {/* ========================================================= */}
            {mainTab === 'resellers' && (
                <div className="space-y-8">
                    {/* Top Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1e293b] pb-6">
                        <div>
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                                    <Users className="w-5 h-5" />
                                </div>
                                <h1 className="text-2xl font-bold text-white tracking-tight uppercase">
                                    Reseller Agent Payouts & Performance
                                </h1>
                            </div>
                            <p className="text-xs text-slate-400 mt-1 font-mono">
                                Disburse agent commission balances and trigger automated Trustpilot review invitations upon payment.
                            </p>
                        </div>

                        {/* Payout Status Filter Pills */}
                        <div className="inline-flex bg-[#090d16] p-1 rounded-xl border border-[#1e293b]">
                            <button
                                onClick={() => setPayoutFilter('PENDING')}
                                className={`px-4 py-2 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all duration-200 flex items-center gap-2 ${
                                    payoutFilter === 'PENDING'
                                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                Pending Action
                                {pendingPayoutsCount > 0 && (
                                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                                )}
                            </button>
                            <button
                                onClick={() => setPayoutFilter('COMPLETED')}
                                className={`px-4 py-2 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all duration-200 ${
                                    payoutFilter === 'COMPLETED'
                                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                Disbursed History
                            </button>
                            <button
                                onClick={() => setPayoutFilter('ALL')}
                                className={`px-4 py-2 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all duration-200 ${
                                    payoutFilter === 'ALL'
                                        ? 'bg-slate-700 text-white shadow-sm'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                All Payouts
                            </button>
                        </div>
                    </div>

                    {/* Quick Metric Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Pending Requests */}
                        <div className="bg-[#131c2e] border border-[#1e293b] rounded-2xl p-6">
                            <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                                Pending Payouts Queue
                            </div>
                            <div className={`text-3xl font-black font-mono tracking-tight ${
                                pendingPayoutsCount > 0 ? 'text-amber-400' : 'text-slate-300'
                            }`}>
                                {pendingPayoutsCount} Requests
                            </div>
                            <div className="mt-3 text-xs text-slate-400">
                                Total Awaiting: <span className="text-amber-400 font-mono font-bold">GH₵ {pendingPayoutsTotalSum.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Completed Disbursed */}
                        <div className="bg-[#131c2e] border border-[#1e293b] rounded-2xl p-6">
                            <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                                Total Disbursed to Date
                            </div>
                            <div className="text-3xl font-black font-mono tracking-tight text-emerald-400">
                                GH₵ {totalCompletedPayoutsVal}
                            </div>
                            <div className="mt-3 text-xs text-slate-400">
                                Successfully sent via MoMo
                            </div>
                        </div>

                        {/* Total Agents */}
                        <div className="bg-[#131c2e] border border-[#1e293b] rounded-2xl p-6">
                            <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                                Registered Agents
                            </div>
                            <div className="text-3xl font-black font-mono tracking-tight text-white">
                                {totalAgentsCount} Partners
                            </div>
                            <div className="mt-3 text-xs text-slate-400">
                                Minimum withdrawal: <span className="text-emerald-400 font-mono font-bold">GH₵ 1.00</span>
                            </div>
                        </div>

                        {/* Review System Status */}
                        <div className="bg-[#131c2e] border border-[#1e293b] rounded-2xl p-6">
                            <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                                Post-Payment Workflow
                            </div>
                            <div className="text-sm font-bold text-white flex items-center gap-2">
                                <Send className="w-4 h-4 text-sky-400" />
                                Automated Review Email
                            </div>
                            <div className="mt-3 text-xs text-slate-400 leading-relaxed font-mono">
                                Trustpilot invitation is dispatched upon marking paid.
                            </div>
                        </div>
                    </div>

                    {/* ===================================================== */}
                    {/* SECTION: PAYOUT REQUESTS LIST                         */}
                    {/* ===================================================== */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-extrabold uppercase tracking-wider text-white">
                                {payoutFilter === 'PENDING' ? 'Pending Payouts Awaiting Action' : 'Reseller Payout Requests'}
                            </h2>
                            <span className="text-xs font-mono text-slate-400">
                                Showing {filteredPayouts.length} record(s)
                            </span>
                        </div>

                        {filteredPayouts.length === 0 ? (
                            <div className="bg-[#131c2e] border border-[#1e293b] rounded-2xl p-12 text-center space-y-3">
                                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto opacity-70" />
                                <h3 className="text-base font-bold text-white">
                                    {payoutFilter === 'PENDING' ? 'All Payouts Settled' : 'No Payout Records Found'}
                                </h3>
                                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                                    {payoutFilter === 'PENDING' 
                                        ? 'There are currently no pending reseller withdrawal requests requiring payment.'
                                        : 'No withdrawal records match the current filter selection.'}
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {filteredPayouts.map((payout) => {
                                    const isPending = payout.status === 'PENDING';
                                    const networkBadgeColor = 
                                        payout.momo_network === 'MTN' 
                                            ? 'bg-amber-400 text-slate-950' 
                                            : payout.momo_network === 'TELECEL' 
                                            ? 'bg-red-500 text-white' 
                                            : 'bg-sky-500 text-white';

                                    return (
                                        <div
                                            key={payout.id}
                                            className="bg-[#131c2e] border border-[#1e293b] hover:border-slate-700 rounded-2xl p-6 transition-all duration-200"
                                        >
                                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                                {/* Left Details: Agent & MoMo */}
                                                <div className="space-y-3 flex-1">
                                                    <div className="flex flex-wrap items-center gap-3">
                                                        <span className="text-base font-bold text-white tracking-tight">
                                                            {payout.agent.store_name}
                                                        </span>
                                                        <span className="text-xs text-slate-400 font-mono">
                                                            ({payout.agent.email})
                                                        </span>
                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase font-mono ${
                                                            isPending 
                                                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' 
                                                                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                                        }`}>
                                                            {payout.status_display}
                                                        </span>
                                                    </div>

                                                    {/* Payment Target Strip */}
                                                    <div className="flex flex-wrap items-center gap-3 bg-[#090d16] p-3 rounded-xl border border-[#1e293b]">
                                                        <span className={`px-2.5 py-1 rounded text-[10px] font-black tracking-wider uppercase ${networkBadgeColor}`}>
                                                            {payout.momo_network}
                                                        </span>
                                                        <span className="font-mono text-base font-bold text-white tracking-wide">
                                                            {payout.momo_number}
                                                        </span>
                                                        <button
                                                            onClick={() => handleCopy(payout.momo_number, `momo-${payout.id}`)}
                                                            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-semibold bg-[#1e293b] hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                                                            title="Copy MoMo Number"
                                                        >
                                                            {copiedKey === `momo-${payout.id}` ? (
                                                                <>
                                                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                                                    <span className="text-emerald-400">Copied!</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Copy className="w-3.5 h-3.5" />
                                                                    <span>Copy Number</span>
                                                                </>
                                                            )}
                                                        </button>
                                                        <span className="text-xs text-slate-500 font-mono ml-auto">
                                                            Ref: {payout.reference}
                                                        </span>
                                                    </div>

                                                    {/* Agent Sales Stats */}
                                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs font-mono">
                                                        <div className="bg-[#090d16]/60 p-2 rounded-lg border border-[#1e293b]/60">
                                                            <span className="text-[10px] text-slate-500 uppercase block font-sans">Checkers Sold</span>
                                                            <span className="text-white font-bold">{payout.agent.total_checkers_sold} units</span>
                                                        </div>
                                                        <div className="bg-[#090d16]/60 p-2 rounded-lg border border-[#1e293b]/60">
                                                            <span className="text-[10px] text-slate-500 uppercase block font-sans">Sales Value</span>
                                                            <span className="text-white font-bold">GH₵ {payout.agent.total_sales_value}</span>
                                                        </div>
                                                        <div className="bg-[#090d16]/60 p-2 rounded-lg border border-[#1e293b]/60">
                                                            <span className="text-[10px] text-slate-500 uppercase block font-sans">Lifetime Comm.</span>
                                                            <span className="text-emerald-400 font-bold">GH₵ {payout.agent.lifetime_commission}</span>
                                                        </div>
                                                        <div className="bg-[#090d16]/60 p-2 rounded-lg border border-[#1e293b]/60">
                                                            <span className="text-[10px] text-slate-500 uppercase block font-sans">Current Balance</span>
                                                            <span className="text-sky-400 font-bold">GH₵ {payout.agent.wallet_balance}</span>
                                                        </div>
                                                    </div>

                                                    {payout.notes && (
                                                        <div className="text-[11px] text-slate-400 font-mono bg-[#090d16]/40 p-2 rounded border border-[#1e293b]/40">
                                                            {payout.notes}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Right Action: Amount & Payment Button */}
                                                <div className="flex flex-col items-start lg:items-end justify-between gap-4 border-t lg:border-t-0 lg:border-l border-[#1e293b] pt-4 lg:pt-0 lg:pl-6 shrink-0">
                                                    <div className="text-left lg:text-right">
                                                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                                                            Amount to Pay
                                                        </span>
                                                        <div className="text-2xl font-black font-mono text-emerald-400">
                                                            GH₵ {parseFloat(payout.amount).toFixed(2)}
                                                        </div>
                                                        <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                                                            Requested: {new Date(payout.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>

                                                    {isPending ? (
                                                        <button
                                                            onClick={() => setSelectedPayoutToPay(payout)}
                                                            className="w-full lg:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-widest px-5 py-3 rounded-xl transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 cursor-pointer"
                                                        >
                                                            <CheckCircle2 className="w-4 h-4" />
                                                            I Have Made Payment
                                                        </button>
                                                    ) : (
                                                        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono font-semibold bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                                                            <Check className="w-3.5 h-3.5" />
                                                            Paid & Review Email Sent
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* ===================================================== */}
                    {/* SECTION: ALL RESELLER AGENTS DIRECTORY                */}
                    {/* ===================================================== */}
                    <div className="bg-[#131c2e] border border-[#1e293b] rounded-2xl p-6 space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-sm font-extrabold uppercase tracking-wider text-white">
                                    Reseller Agent Directory & Performance
                                </h2>
                                <p className="text-xs text-slate-400 font-medium mt-0.5">
                                    All registered checker reseller stores with sales metrics and MoMo numbers.
                                </p>
                            </div>

                            {/* Search */}
                            <div className="relative w-full sm:w-64">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={agentSearch}
                                    onChange={(e) => setAgentSearch(e.target.value)}
                                    placeholder="Search by name, email, MoMo..."
                                    className="w-full bg-[#090d16] text-white border border-[#1e293b] rounded-xl pl-9 pr-4 py-2 text-xs outline-none focus:border-emerald-500 transition-colors font-mono"
                                />
                            </div>
                        </div>

                        {/* Agents Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="border-b border-[#1e293b] text-slate-400 font-mono text-[10px] uppercase tracking-wider">
                                        <th className="pb-3 font-extrabold">Store Name / Slug</th>
                                        <th className="pb-3 font-extrabold">Account Email</th>
                                        <th className="pb-3 font-extrabold">MoMo Payout Details</th>
                                        <th className="pb-3 font-extrabold text-right">Sold</th>
                                        <th className="pb-3 font-extrabold text-right">Sales Val</th>
                                        <th className="pb-3 font-extrabold text-right">Commission</th>
                                        <th className="pb-3 font-extrabold text-right">Wallet</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#1e293b]/60">
                                    {filteredAgents.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="py-8 text-center text-slate-500 font-mono">
                                                No reseller agents matched your search.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredAgents.map((agent) => (
                                            <tr key={agent.id} className="hover:bg-[#090d16]/40 transition-colors">
                                                <td className="py-3 font-bold text-white">
                                                    <div>{agent.store_name}</div>
                                                    <div className="text-[10px] text-slate-400 font-mono font-normal">
                                                        /{agent.slug}
                                                    </div>
                                                </td>
                                                <td className="py-3 font-mono text-slate-300">
                                                    {agent.email}
                                                </td>
                                                <td className="py-3 font-mono">
                                                    {agent.momo_number ? (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-bold uppercase">
                                                                {agent.momo_network || 'MoMo'}
                                                            </span>
                                                            <span className="text-white font-semibold">{agent.momo_number}</span>
                                                            <button
                                                                onClick={() => handleCopy(agent.momo_number, `agent-${agent.id}`)}
                                                                className="text-slate-400 hover:text-white p-1 cursor-pointer"
                                                                title="Copy number"
                                                            >
                                                                {copiedKey === `agent-${agent.id}` ? (
                                                                    <Check className="w-3 h-3 text-emerald-400" />
                                                                ) : (
                                                                    <Copy className="w-3 h-3" />
                                                                )}
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span className="text-slate-600 italic">Not set</span>
                                                    )}
                                                </td>
                                                <td className="py-3 text-right font-mono font-bold text-white">
                                                    {agent.total_checkers_sold}
                                                </td>
                                                <td className="py-3 text-right font-mono text-slate-300">
                                                    GH₵ {agent.total_sales_value}
                                                </td>
                                                <td className="py-3 text-right font-mono font-bold text-emerald-400">
                                                    GH₵ {agent.lifetime_commission}
                                                </td>
                                                <td className="py-3 text-right font-mono font-bold text-sky-400">
                                                    GH₵ {agent.wallet_balance}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* ========================================================= */}
            {/* MODAL: CONFIRM PAYMENT & SEND TRUSTPILOT REVIEW EMAIL      */}
            {/* ========================================================= */}
            {selectedPayoutToPay && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                    <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-6 animate-scale-in">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-[#1e293b] pb-4">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                                    <CheckCircle2 className="w-4 h-4" />
                                </div>
                                <h3 className="text-base font-bold text-white uppercase tracking-wider">
                                    Confirm Payout Payment
                                </h3>
                            </div>
                            <button
                                onClick={() => setSelectedPayoutToPay(null)}
                                className="text-slate-400 hover:text-white text-xs font-mono cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Payment Details */}
                        <div className="bg-[#090d16] p-4 rounded-xl border border-[#1e293b] space-y-3 font-mono text-xs">
                            <div className="flex justify-between items-center pb-2 border-b border-[#1e293b]/60">
                                <span className="text-slate-400 uppercase">Amount Transferred:</span>
                                <span className="text-xl font-bold text-emerald-400">
                                    GH₵ {parseFloat(selectedPayoutToPay.amount).toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">Reseller Store:</span>
                                <span className="text-white font-bold">{selectedPayoutToPay.agent.store_name}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">Recipient Email:</span>
                                <span className="text-slate-200">{selectedPayoutToPay.agent.email}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">MoMo Network:</span>
                                <span className="text-white font-bold">{selectedPayoutToPay.momo_network}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">MoMo Number:</span>
                                <span className="text-white font-bold text-sm tracking-wider">{selectedPayoutToPay.momo_number}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">Reference:</span>
                                <span className="text-slate-400">{selectedPayoutToPay.reference}</span>
                            </div>
                        </div>

                        {/* Notice on Automated Email */}
                        <div className="bg-sky-500/10 border border-sky-500/20 p-4 rounded-xl text-xs space-y-1">
                            <span className="text-sky-400 font-bold block uppercase tracking-wider font-mono">
                                Automated Trustpilot Review Invitation:
                            </span>
                            <p className="text-slate-300 leading-relaxed">
                                Confirming will mark this withdrawal as <strong className="text-white">COMPLETED</strong> and immediately send a receipt email to <span className="text-white font-mono">{selectedPayoutToPay.agent.email}</span> containing the Trustpilot review button (<span className="text-sky-300 font-mono">trustpilot.com/review/londonsimports.com</span>).
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setSelectedPayoutToPay(null)}
                                disabled={payingInProgress}
                                className="flex-1 px-4 py-3 rounded-xl border border-[#1e293b] text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-xs font-bold uppercase tracking-wider font-mono disabled:opacity-50 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmPayment}
                                disabled={payingInProgress}
                                className="flex-1 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-emerald-950/40 cursor-pointer"
                            >
                                {payingInProgress ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                        <span>Confirming...</span>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span>Confirm & Send Review Email</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
