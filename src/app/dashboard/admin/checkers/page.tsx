/**
 * London's Imports - High-Precision Exam Voucher & Reseller Terminal
 * Designed with London's Imports 'Atelier' architectural system (clean, monochrome, luxury typography)
 */
'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
    Users, 
    Copy, 
    Check, 
    ExternalLink, 
    Search, 
    ShieldCheck, 
    AlertCircle,
    X,
    Ticket,
    CheckCircle,
    CreditCard
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
    lifetime_earnings: string;
    is_approved: boolean;
    created_at: string;
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
    // Primary Tab: Default to 'resellers'
    const [mainTab, setMainTab] = useState<'resellers' | 'vouchers'>('resellers');

    // === Reseller Agents & Payouts State ===
    const [payouts, setPayouts] = useState<AgentPayoutItem[]>([]);
    const [agents, setAgents] = useState<AgentListItem[]>([]);
    const [pendingPayoutsCount, setPendingPayoutsCount] = useState<number>(0);
    const [totalCompletedPayoutsVal, setTotalCompletedPayoutsVal] = useState<string>('0.00');
    const [resellersLoading, setResellersLoading] = useState<boolean>(false);
    const [resellersError, setResellersError] = useState<string | null>(null);

    // Filters & Subtabs
    const [resellerSubTab, setResellerSubTab] = useState<'agents' | 'pending' | 'history'>('agents');
    const [agentSearch, setAgentSearch] = useState<string>('');
    const [copiedKey, setCopiedKey] = useState<string | null>(null);

    // Direct Payment Modal State (Pay any agent even without a withdrawal request)
    const [selectedAgentForDirectPay, setSelectedAgentForDirectPay] = useState<AgentListItem | null>(null);
    const [directPayAmount, setDirectPayAmount] = useState<string>('');
    const [directPayNotes, setDirectPayNotes] = useState<string>('');
    const [directPayingInProgress, setDirectPayingInProgress] = useState<boolean>(false);

    // Pending Payout Modal State (When clicking on an existing withdrawal request)
    const [selectedPayoutToPay, setSelectedPayoutToPay] = useState<AgentPayoutItem | null>(null);
    const [payingInProgress, setPayingInProgress] = useState<boolean>(false);

    // Notifications
    const [notificationMessage, setNotificationMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // === Voucher Analytics State ===
    const [category, setCategory] = useState<'ALL' | 'WASSCE' | 'BECE'>('ALL');
    const [period, setPeriod] = useState<string>('all');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [analyticsLoading, setAnalyticsLoading] = useState<boolean>(false);
    const [analyticsError, setAnalyticsError] = useState<string | null>(null);
    const [data, setData] = useState<CheckerAnalyticsData | null>(null);
    const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

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
            setLastRefreshed(new Date());
        } catch (err: unknown) {
            console.error('Failed to load reseller payouts data:', err);
            setResellersError(err instanceof Error ? err.message : 'Failed to load reseller payouts');
        } finally {
            setResellersLoading(false);
        }
    };

    const fetchAnalytics = async () => {
        setAnalyticsLoading(true);
        setAnalyticsError(null);
        try {
            const params: Record<string, unknown> = { category, period };
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

    useEffect(() => {
        fetchResellersData();
        fetchAnalytics();
    }, []);

    const handleCopy = (text: string, key: string) => {
        navigator.clipboard.writeText(text);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2000);
    };

    // Open Direct Payment Modal for an Agent
    const handleOpenDirectPay = (agent: AgentListItem) => {
        setSelectedAgentForDirectPay(agent);
        const bal = parseFloat(agent.wallet_balance || '0');
        setDirectPayAmount(bal > 0 ? bal.toFixed(2) : '1.00');
        setDirectPayNotes(`Direct payout to ${agent.store_name} via ${agent.momo_network} (${agent.momo_number})`);
    };

    // Confirm Direct Payment to Agent
    const handleConfirmDirectPay = async () => {
        if (!selectedAgentForDirectPay) return;
        const amountNum = parseFloat(directPayAmount);
        if (isNaN(amountNum) || amountNum <= 0) {
            setNotificationMessage({
                type: 'error',
                text: 'Please enter a valid payment amount greater than GH₵ 0.00.'
            });
            return;
        }

        setDirectPayingInProgress(true);
        try {
            await adminAPI.checkerDirectPayout({
                agent_id: selectedAgentForDirectPay.id,
                amount: amountNum,
                notes: directPayNotes,
            });
            setNotificationMessage({
                type: 'success',
                text: `Payment of GH₵ ${amountNum.toFixed(2)} recorded for ${selectedAgentForDirectPay.store_name}. Trustpilot review email sent to ${selectedAgentForDirectPay.email}!`
            });
            setSelectedAgentForDirectPay(null);
            fetchResellersData();
        } catch (err: any) {
            setNotificationMessage({
                type: 'error',
                text: err.response?.data?.error || 'Failed to record direct payment.'
            });
        } finally {
            setDirectPayingInProgress(false);
        }
    };

    // Confirm Pending Payout (from withdrawal request)
    const handleConfirmPendingPayout = async () => {
        if (!selectedPayoutToPay) return;
        setPayingInProgress(true);
        try {
            await adminAPI.checkerMarkPayoutPaid(selectedPayoutToPay.id);
            setNotificationMessage({
                type: 'success',
                text: `Payout GH₵ ${selectedPayoutToPay.amount} to ${selectedPayoutToPay.agent.store_name} marked as PAID. Trustpilot review invitation email sent!`
            });
            setSelectedPayoutToPay(null);
            fetchResellersData();
        } catch (err: any) {
            setNotificationMessage({
                type: 'error',
                text: err.response?.data?.error || 'Failed to mark payout as completed.'
            });
        } finally {
            setPayingInProgress(false);
        }
    };

    // Calculated Statistics
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

    const pendingPayoutsList = useMemo(() => {
        return payouts.filter(p => p.status === 'PENDING');
    }, [payouts]);

    const completedPayoutsList = useMemo(() => {
        return payouts.filter(p => p.status === 'COMPLETED');
    }, [payouts]);

    const pendingPayoutsTotalSum = useMemo(() => {
        return pendingPayoutsList.reduce((sum, p) => sum + parseFloat(p.amount || '0'), 0);
    }, [pendingPayoutsList]);

    const totalSalesVolumeSum = useMemo(() => {
        return agents.reduce((sum, a) => sum + parseFloat(a.total_sales_value || '0'), 0);
    }, [agents]);

    const totalUnitsSoldSum = useMemo(() => {
        return agents.reduce((sum, a) => sum + (a.total_checkers_sold || 0), 0);
    }, [agents]);

    const getNetworkBadgeStyle = (network: string) => {
        const net = network.toUpperCase();
        if (net === 'MTN') return 'bg-amber-100 text-amber-900 border-amber-200';
        if (net === 'TELECEL') return 'bg-red-100 text-red-900 border-red-200';
        if (net === 'AT') return 'bg-blue-100 text-blue-900 border-blue-200';
        return 'bg-slate-100 text-slate-900 border-slate-200';
    };

    return (
        <div className="space-y-12 pb-32">
            {/* 1. COMMAND HEADER */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-50 pb-12">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-slate-950 tracking-tighter">Results Checkers & Resellers</h1>
                    <div className="flex items-center gap-4 mt-4 flex-wrap">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900">
                                {agents.length} RESELLER AGENTS
                            </span>
                        </div>
                        {pendingPayoutsCount > 0 && (
                            <>
                                <span className="h-4 w-px bg-slate-200" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-600 animate-pulse">
                                    {pendingPayoutsCount} WITHDRAWALS PENDING
                                </span>
                            </>
                        )}
                        <span className="h-4 w-px bg-slate-200" />
                        <span className="text-[10px] font-bold text-slate-400 font-mono">
                            SYNCED: {lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => {
                            if (mainTab === 'resellers') fetchResellersData();
                            else fetchAnalytics();
                        }}
                        className="flex items-center gap-2 px-6 py-3.5 bg-slate-50 border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-900 hover:bg-slate-100 transition-colors"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${analyticsLoading || resellersLoading ? 'animate-spin' : ''}`} />
                        Sync Data
                    </button>
                </div>
            </div>

            {/* Notification Toast */}
            {notificationMessage && (
                <div className={`p-6 border flex items-center justify-between transition-all animate-in fade-in ${
                    notificationMessage.type === 'success'
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-900'
                        : 'bg-red-50 border-red-100 text-red-900'
                }`}>
                    <div className="flex items-center gap-4">
                        {notificationMessage.type === 'success' ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        ) : (
                            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                        )}
                        <p className="text-[10px] font-black uppercase tracking-widest">{notificationMessage.text}</p>
                    </div>
                    <button onClick={() => setNotificationMessage(null)} className="text-slate-400 hover:text-slate-900">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* 2. PRIMARY PROTOCOL TABS */}
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide border-b border-slate-100">
                <button
                    onClick={() => setMainTab('resellers')}
                    className={`px-8 py-3 text-[10px] font-black uppercase tracking-[0.3em] transition-all border ${
                        mainTab === 'resellers'
                            ? 'bg-slate-950 text-white border-slate-950 shadow-lg'
                            : 'bg-white text-slate-400 border-slate-100 hover:border-slate-900 hover:text-slate-900'
                    }`}
                >
                    Reseller Agents & Payouts {pendingPayoutsCount > 0 && `(${pendingPayoutsCount})`}
                </button>
                <button
                    onClick={() => setMainTab('vouchers')}
                    className={`px-8 py-3 text-[10px] font-black uppercase tracking-[0.3em] transition-all border ${
                        mainTab === 'vouchers'
                            ? 'bg-slate-950 text-white border-slate-950 shadow-lg'
                            : 'bg-white text-slate-400 border-slate-100 hover:border-slate-900 hover:text-slate-900'
                    }`}
                >
                    Voucher Sales & Inventory
                </button>
            </div>

            {/* ========================================================= */}
            {/* VIEW 1: RESELLER AGENTS & PAYOUTS TERMINAL               */}
            {/* ========================================================= */}
            {mainTab === 'resellers' && (
                <div className="space-y-12">
                    {/* Telemetry Stat Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white border border-slate-100 p-8 space-y-2">
                            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Total Agents</p>
                            <p className="text-3xl font-serif font-bold text-slate-950 tracking-tight">{agents.length}</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Reseller Partners</p>
                        </div>

                        <div className="bg-white border border-slate-100 p-8 space-y-2">
                            <div className="flex items-center justify-between">
                                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Pending Withdrawals</p>
                                {pendingPayoutsCount > 0 && (
                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-100 text-amber-800">
                                        ACTION NEEDED
                                    </span>
                                )}
                            </div>
                            <p className="text-3xl font-serif font-bold text-amber-600 tracking-tight">
                                GH₵ {pendingPayoutsTotalSum.toFixed(2)}
                            </p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                {pendingPayoutsCount} {pendingPayoutsCount === 1 ? 'Request' : 'Requests'} Waiting
                            </p>
                        </div>

                        <div className="bg-white border border-slate-100 p-8 space-y-2">
                            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Completed Payouts</p>
                            <p className="text-3xl font-serif font-bold text-emerald-700 tracking-tight">
                                GH₵ {parseFloat(totalCompletedPayoutsVal || '0').toFixed(2)}
                            </p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                {completedPayoutsList.length} Disbursed to Date
                            </p>
                        </div>

                        <div className="bg-white border border-slate-100 p-8 space-y-2">
                            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Total Agent Sales</p>
                            <p className="text-3xl font-serif font-bold text-slate-950 tracking-tight">
                                GH₵ {totalSalesVolumeSum.toFixed(2)}
                            </p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                {totalUnitsSoldSum} Units Sold Overall
                            </p>
                        </div>
                    </div>

                    {/* Sub-Tabs & Agent Search Controls */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            <button
                                onClick={() => setResellerSubTab('agents')}
                                className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${
                                    resellerSubTab === 'agents'
                                        ? 'bg-slate-950 text-white border-slate-950'
                                        : 'bg-white text-slate-400 border-slate-100 hover:border-slate-900 hover:text-slate-900'
                                }`}
                            >
                                All Reseller Agents ({agents.length})
                            </button>

                            <button
                                onClick={() => setResellerSubTab('pending')}
                                className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${
                                    resellerSubTab === 'pending'
                                        ? 'bg-slate-950 text-white border-slate-950'
                                        : 'bg-white text-slate-400 border-slate-100 hover:border-slate-900 hover:text-slate-900'
                                }`}
                            >
                                Pending Withdrawals ({pendingPayoutsCount})
                            </button>

                            <button
                                onClick={() => setResellerSubTab('history')}
                                className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${
                                    resellerSubTab === 'history'
                                        ? 'bg-slate-950 text-white border-slate-950'
                                        : 'bg-white text-slate-400 border-slate-100 hover:border-slate-900 hover:text-slate-900'
                                }`}
                            >
                                Payout History ({completedPayoutsList.length})
                            </button>
                        </div>

                        {resellerSubTab === 'agents' && (
                            <div className="relative w-full md:w-80 group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="SEARCH AGENTS BY NAME, NUMBER..."
                                    value={agentSearch}
                                    onChange={(e) => setAgentSearch(e.target.value)}
                                    className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border border-slate-100 text-[10px] font-black uppercase tracking-widest outline-none focus:bg-white focus:border-slate-900 transition-all"
                                />
                            </div>
                        )}
                    </div>

                    {/* SUBVIEW 1: ALL AGENTS TABLE */}
                    {resellerSubTab === 'agents' && (
                        <div className="bg-white border border-slate-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/50 border-b border-slate-100">
                                            <th className="px-8 py-6 text-left text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Reseller Agent</th>
                                            <th className="px-8 py-6 text-left text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">MoMo Account</th>
                                            <th className="px-8 py-6 text-left text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Sales Volume</th>
                                            <th className="px-8 py-6 text-left text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Wallet Balance</th>
                                            <th className="px-8 py-6 text-right text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {filteredAgents.map((agent) => (
                                            <tr key={agent.id} className="hover:bg-slate-50/50 transition-colors">
                                                {/* Agent Details */}
                                                <td className="px-8 py-6">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-slate-950 text-sm">{agent.store_name}</span>
                                                            <span className="text-[9px] font-mono text-slate-400">/{agent.slug}</span>
                                                        </div>
                                                        <p className="text-[11px] text-slate-500 font-mono">{agent.email}</p>
                                                    </div>
                                                </td>

                                                {/* MoMo Info */}
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <span className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-wider border rounded-none ${getNetworkBadgeStyle(agent.momo_network)}`}>
                                                            {agent.momo_network}
                                                        </span>
                                                        <span className="font-mono text-xs font-bold text-slate-900 tracking-wider">
                                                            {agent.momo_number}
                                                        </span>
                                                        <button
                                                            onClick={() => handleCopy(agent.momo_number, `agent-${agent.id}`)}
                                                            className="p-1.5 text-slate-300 hover:text-slate-900 transition-colors"
                                                            title="Copy phone number"
                                                        >
                                                            {copiedKey === `agent-${agent.id}` ? (
                                                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                                            ) : (
                                                                <Copy className="w-3.5 h-3.5" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </td>

                                                {/* Total Sales */}
                                                <td className="px-8 py-6">
                                                    <div className="space-y-0.5">
                                                        <p className="font-bold text-slate-950 text-sm">
                                                            {agent.total_checkers_sold} units sold
                                                        </p>
                                                        <p className="text-[11px] font-mono font-bold text-slate-500">
                                                            GH₵ {parseFloat(agent.total_sales_value || '0').toFixed(2)} sales
                                                        </p>
                                                    </div>
                                                </td>

                                                {/* Wallet Balance */}
                                                <td className="px-8 py-6">
                                                    <span className="text-base font-bold text-emerald-700 font-mono">
                                                        GH₵ {parseFloat(agent.wallet_balance || '0').toFixed(2)}
                                                    </span>
                                                </td>

                                                {/* Payment Made Button */}
                                                <td className="px-8 py-6 text-right">
                                                    <button
                                                        onClick={() => handleOpenDirectPay(agent)}
                                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-sm active:scale-95"
                                                    >
                                                        <CheckCircle className="w-3.5 h-3.5" />
                                                        Payment Made
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {filteredAgents.length === 0 && (
                                <div className="py-24 text-center">
                                    <Users className="w-10 h-10 mx-auto mb-4 text-slate-200" strokeWidth={1} />
                                    <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">No Reseller Agents Found</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* SUBVIEW 2: PENDING WITHDRAWALS TABLE */}
                    {resellerSubTab === 'pending' && (
                        <div className="bg-white border border-slate-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/50 border-b border-slate-100">
                                            <th className="px-8 py-6 text-left text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Reference</th>
                                            <th className="px-8 py-6 text-left text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Agent</th>
                                            <th className="px-8 py-6 text-left text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Send To (MoMo)</th>
                                            <th className="px-8 py-6 text-left text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Requested Amount</th>
                                            <th className="px-8 py-6 text-left text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Total Sales</th>
                                            <th className="px-8 py-6 text-right text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {pendingPayoutsList.map((payout) => (
                                            <tr key={payout.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-8 py-6">
                                                    <span className="font-mono text-xs font-bold text-slate-900">{payout.reference}</span>
                                                    <p className="text-[10px] text-slate-400 mt-0.5">
                                                        {new Date(payout.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </p>
                                                </td>

                                                <td className="px-8 py-6">
                                                    <p className="font-bold text-slate-950 text-sm">{payout.agent.store_name}</p>
                                                    <p className="text-[11px] text-slate-500 font-mono">{payout.agent.email}</p>
                                                </td>

                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <span className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-wider border ${getNetworkBadgeStyle(payout.momo_network)}`}>
                                                            {payout.momo_network}
                                                        </span>
                                                        <span className="font-mono text-xs font-bold text-slate-900">
                                                            {payout.momo_number}
                                                        </span>
                                                        <button
                                                            onClick={() => handleCopy(payout.momo_number, `payout-${payout.id}`)}
                                                            className="p-1 text-slate-300 hover:text-slate-900"
                                                        >
                                                            {copiedKey === `payout-${payout.id}` ? (
                                                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                                            ) : (
                                                                <Copy className="w-3.5 h-3.5" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </td>

                                                <td className="px-8 py-6">
                                                    <span className="text-lg font-bold text-emerald-700 font-mono">
                                                        GH₵ {parseFloat(payout.amount || '0').toFixed(2)}
                                                    </span>
                                                </td>

                                                <td className="px-8 py-6">
                                                    <span className="text-xs font-bold text-slate-700">
                                                        {payout.agent.total_checkers_sold} units sold
                                                    </span>
                                                    <p className="text-[11px] font-mono text-slate-500">
                                                        GH₵ {parseFloat(payout.agent.total_sales_value || '0').toFixed(2)}
                                                    </p>
                                                </td>

                                                <td className="px-8 py-6 text-right">
                                                    <button
                                                        onClick={() => setSelectedPayoutToPay(payout)}
                                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-sm"
                                                    >
                                                        <CheckCircle className="w-3.5 h-3.5" />
                                                        I Have Paid
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {pendingPayoutsList.length === 0 && (
                                <div className="py-24 text-center">
                                    <CheckCircle2 className="w-10 h-10 mx-auto mb-4 text-emerald-500" strokeWidth={1} />
                                    <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">All Payout Requests Cleared</p>
                                    <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest">No pending withdrawals at this moment</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* SUBVIEW 3: PAYOUT HISTORY */}
                    {resellerSubTab === 'history' && (
                        <div className="bg-white border border-slate-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/50 border-b border-slate-100">
                                            <th className="px-8 py-6 text-left text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Reference</th>
                                            <th className="px-8 py-6 text-left text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Agent</th>
                                            <th className="px-8 py-6 text-left text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Paid To</th>
                                            <th className="px-8 py-6 text-left text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Amount</th>
                                            <th className="px-8 py-6 text-left text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Status</th>
                                            <th className="px-8 py-6 text-right text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Date Paid</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {completedPayoutsList.map((payout) => (
                                            <tr key={payout.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-8 py-6 font-mono text-xs font-bold text-slate-900">
                                                    {payout.reference}
                                                </td>
                                                <td className="px-8 py-6">
                                                    <p className="font-bold text-slate-950 text-sm">{payout.agent.store_name}</p>
                                                    <p className="text-[11px] text-slate-500 font-mono">{payout.agent.email}</p>
                                                </td>
                                                <td className="px-8 py-6 font-mono text-xs text-slate-700">
                                                    {payout.momo_network} • {payout.momo_number}
                                                </td>
                                                <td className="px-8 py-6 font-mono font-bold text-emerald-700 text-sm">
                                                    GH₵ {parseFloat(payout.amount || '0').toFixed(2)}
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="px-2.5 py-1 text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
                                                        PAID & EMAILED
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-right font-mono text-xs text-slate-500">
                                                    {new Date(payout.updated_at || payout.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {completedPayoutsList.length === 0 && (
                                <div className="py-24 text-center">
                                    <CreditCard className="w-10 h-10 mx-auto mb-4 text-slate-200" strokeWidth={1} />
                                    <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">No Payout History Yet</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* ========================================================= */}
            {/* VIEW 2: VOUCHER SALES & INVENTORY TERMINAL               */}
            {/* ========================================================= */}
            {mainTab === 'vouchers' && (
                <div className="space-y-12">
                    {/* Controls & Filters */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        {/* Category Toggle */}
                        <div className="flex gap-2">
                            {(['ALL', 'WASSCE', 'BECE'] as const).map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setCategory(cat)}
                                    className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${
                                        category === cat
                                            ? 'bg-slate-950 text-white border-slate-950'
                                            : 'bg-white text-slate-400 border-slate-100 hover:border-slate-900 hover:text-slate-900'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Period Select */}
                        <div className="flex items-center gap-3">
                            <select
                                value={period}
                                onChange={(e) => setPeriod(e.target.value)}
                                className="bg-slate-50 border border-slate-100 text-slate-900 text-[10px] font-black uppercase tracking-widest px-4 py-3 outline-none focus:border-slate-900"
                            >
                                <option value="all">All Time</option>
                                <option value="7d">Last 7 Days</option>
                                <option value="30d">Last 30 Days</option>
                                <option value="since_last_upload">Since Last Upload</option>
                            </select>
                        </div>
                    </div>

                    {/* Financial Performance Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white border border-slate-100 p-8 space-y-2">
                            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Total Revenue</p>
                            <p className="text-3xl font-serif font-bold text-slate-950 tracking-tight">
                                GH₵ {data?.active_revenue || '0.00'}
                            </p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                Gross Voucher Sales
                            </p>
                        </div>

                        <div className="bg-white border border-slate-100 p-8 space-y-2">
                            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Net Profit</p>
                            <p className="text-3xl font-serif font-bold text-emerald-700 tracking-tight">
                                GH₵ {data?.active_profit || '0.00'}
                            </p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                Margin: {data?.active_margin || '0.0'}%
                            </p>
                        </div>

                        <div className="bg-white border border-slate-100 p-8 space-y-2">
                            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Vouchers Sold</p>
                            <p className="text-3xl font-serif font-bold text-slate-950 tracking-tight">
                                {data?.active_sold || 0}
                            </p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                Out of {data?.active_total || 0} Total Cards
                            </p>
                        </div>

                        <div className="bg-white border border-slate-100 p-8 space-y-2">
                            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Stock Remaining</p>
                            <p className="text-3xl font-serif font-bold text-blue-700 tracking-tight">
                                {data?.active_available || 0}
                            </p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                Value: GH₵ {data?.active_unsold_val || '0.00'}
                            </p>
                        </div>
                    </div>

                    {/* Inventory Table Breakdown */}
                    <div className="bg-white border border-slate-100 overflow-hidden">
                        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-900">
                                Inventory Breakdown by Exam Type
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-100">
                                        <th className="px-8 py-6 text-left text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Exam Category</th>
                                        <th className="px-8 py-6 text-left text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Total Uploaded</th>
                                        <th className="px-8 py-6 text-left text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Cards Sold</th>
                                        <th className="px-8 py-6 text-left text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Available Stock</th>
                                        <th className="px-8 py-6 text-right text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Revenue Generated</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 font-mono text-xs">
                                    <tr className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-6 font-sans font-bold text-slate-900">WASSCE Checker</td>
                                        <td className="px-8 py-6 text-slate-600">{data?.total_wassce || 0}</td>
                                        <td className="px-8 py-6 text-emerald-700 font-bold">{data?.sold_wassce || 0}</td>
                                        <td className="px-8 py-6 text-blue-700 font-bold">{data?.available_wassce || 0}</td>
                                        <td className="px-8 py-6 text-right font-bold text-slate-900">GH₵ {data?.revenue_wassce || '0.00'}</td>
                                    </tr>
                                    <tr className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-6 font-sans font-bold text-slate-900">BECE Checker</td>
                                        <td className="px-8 py-6 text-slate-600">{data?.total_bece || 0}</td>
                                        <td className="px-8 py-6 text-emerald-700 font-bold">{data?.sold_bece || 0}</td>
                                        <td className="px-8 py-6 text-blue-700 font-bold">{data?.available_bece || 0}</td>
                                        <td className="px-8 py-6 text-right font-bold text-slate-900">GH₵ {data?.revenue_bece || '0.00'}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* ========================================================= */}
            {/* MODAL 1: DIRECT PAYMENT MADE TO AGENT                    */}
            {/* (Triggered even if agent has NOT requested payment)      */}
            {/* ========================================================= */}
            {selectedAgentForDirectPay && (
                <div 
                    className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in"
                    onClick={() => setSelectedAgentForDirectPay(null)}
                >
                    <div 
                        className="w-full max-w-lg bg-white p-10 space-y-6 border border-slate-100 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between border-b border-slate-100 pb-6">
                            <div>
                                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-emerald-700">
                                    RECORD DISBURSED PAYOUT
                                </span>
                                <h3 className="text-2xl font-serif font-bold text-slate-950 tracking-tight mt-1">
                                    Payment Made Confirmation
                                </h3>
                            </div>
                            <button 
                                onClick={() => setSelectedAgentForDirectPay(null)}
                                className="text-slate-400 hover:text-slate-900 p-1"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Agent Summary Card */}
                        <div className="bg-slate-50 border border-slate-100 p-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Agent:</span>
                                <span className="font-bold text-slate-950 text-sm">{selectedAgentForDirectPay.store_name}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email:</span>
                                <span className="font-mono text-xs text-slate-700">{selectedAgentForDirectPay.email}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">MoMo Account:</span>
                                <div className="flex items-center gap-2">
                                    <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-wider border ${getNetworkBadgeStyle(selectedAgentForDirectPay.momo_network)}`}>
                                        {selectedAgentForDirectPay.momo_network}
                                    </span>
                                    <span className="font-mono text-xs font-bold text-slate-900">{selectedAgentForDirectPay.momo_number}</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Current Wallet Balance:</span>
                                <span className="font-mono font-bold text-sm text-emerald-700">
                                    GH₵ {parseFloat(selectedAgentForDirectPay.wallet_balance || '0').toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Units Sold:</span>
                                <span className="font-bold text-xs text-slate-900">{selectedAgentForDirectPay.total_checkers_sold} units (GH₵ {parseFloat(selectedAgentForDirectPay.total_sales_value || '0').toFixed(2)})</span>
                            </div>
                        </div>

                        {/* Form Inputs */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-900 mb-2">
                                    Amount Disbursed (GH₵)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    value={directPayAmount}
                                    onChange={(e) => setDirectPayAmount(e.target.value)}
                                    className="w-full px-4 py-3 border border-slate-200 text-lg font-mono font-bold text-slate-900 outline-none focus:border-slate-900"
                                    placeholder="Enter amount sent"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-900 mb-2">
                                    Payment Note / Transaction Ref (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={directPayNotes}
                                    onChange={(e) => setDirectPayNotes(e.target.value)}
                                    className="w-full px-4 py-3 border border-slate-200 text-xs font-mono text-slate-900 outline-none focus:border-slate-900"
                                    placeholder="e.g. Sent via MTN MoMo ref: 123456"
                                />
                            </div>
                        </div>

                        {/* Email Dispatch Notice */}
                        <div className="bg-emerald-50 border border-emerald-100 p-4">
                            <p className="text-[10px] text-emerald-900 leading-relaxed font-bold uppercase tracking-wider">
                                &bull; Clicking below records this payment as completed, debits the wallet balance, and immediately emails the agent with payment confirmation and your Trustpilot review link.
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3 pt-2">
                            <button
                                onClick={handleConfirmDirectPay}
                                disabled={directPayingInProgress}
                                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-md flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {directPayingInProgress ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                        RECORDING & SENDING EMAIL...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-4 h-4" />
                                        CONFIRM PAYMENT & SEND TRUSTPILOT EMAIL
                                    </>
                                )}
                            </button>

                            <button
                                onClick={() => setSelectedAgentForDirectPay(null)}
                                disabled={directPayingInProgress}
                                className="w-full py-3 bg-white border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ========================================================= */}
            {/* MODAL 2: CONFIRM PENDING WITHDRAWAL PAYOUT               */}
            {/* ========================================================= */}
            {selectedPayoutToPay && (
                <div 
                    className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in"
                    onClick={() => setSelectedPayoutToPay(null)}
                >
                    <div 
                        className="w-full max-w-lg bg-white p-10 space-y-6 border border-slate-100 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between border-b border-slate-100 pb-6">
                            <div>
                                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-emerald-700">
                                    PENDING WITHDRAWAL SETTLEMENT
                                </span>
                                <h3 className="text-2xl font-serif font-bold text-slate-950 tracking-tight mt-1">
                                    Confirm Mobile Money Transfer
                                </h3>
                            </div>
                            <button 
                                onClick={() => setSelectedPayoutToPay(null)}
                                className="text-slate-400 hover:text-slate-900 p-1"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="bg-slate-50 border border-slate-100 p-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Agent:</span>
                                <span className="font-bold text-slate-950 text-sm">{selectedPayoutToPay.agent.store_name}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email:</span>
                                <span className="font-mono text-xs text-slate-700">{selectedPayoutToPay.agent.email}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">MoMo Number:</span>
                                <div className="flex items-center gap-2">
                                    <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-wider border ${getNetworkBadgeStyle(selectedPayoutToPay.momo_network)}`}>
                                        {selectedPayoutToPay.momo_network}
                                    </span>
                                    <span className="font-mono text-xs font-bold text-slate-900">{selectedPayoutToPay.momo_number}</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Amount To Send:</span>
                                <span className="font-mono font-bold text-lg text-emerald-700">
                                    GH₵ {parseFloat(selectedPayoutToPay.amount || '0').toFixed(2)}
                                </span>
                            </div>
                        </div>

                        <div className="bg-emerald-50 border border-emerald-100 p-4">
                            <p className="text-[10px] text-emerald-900 leading-relaxed font-bold uppercase tracking-wider">
                                &bull; Confirm that you have transferred GH₵ {parseFloat(selectedPayoutToPay.amount || '0').toFixed(2)} to {selectedPayoutToPay.momo_number} ({selectedPayoutToPay.momo_network}). This will mark the withdrawal as COMPLETED and send the agent an email with your Trustpilot review link.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 pt-2">
                            <button
                                onClick={handleConfirmPendingPayout}
                                disabled={payingInProgress}
                                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-md flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {payingInProgress ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                        PROCESSING & SENDING EMAIL...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-4 h-4" />
                                        CONFIRM I HAVE PAID & SEND EMAIL
                                    </>
                                )}
                            </button>

                            <button
                                onClick={() => setSelectedPayoutToPay(null)}
                                disabled={payingInProgress}
                                className="w-full py-3 bg-white border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
