'use client';

import React, { useState, useMemo } from 'react';
import { 
    Users, 
    Copy, 
    Check, 
    Search, 
    CheckCircle, 
    CheckCircle2, 
    CreditCard 
} from 'lucide-react';
import type { 
    AgentListItem, 
    AgentPayoutItem, 
    ResellerSubTabType 
} from './types';
import { getNetworkBadgeStyle } from './utils';

interface ResellersTabProps {
    agents: AgentListItem[];
    payouts: AgentPayoutItem[];
    pendingPayoutsCount: number;
    totalCompletedPayoutsVal: string;
    resellerSubTab: ResellerSubTabType;
    setResellerSubTab: (tab: ResellerSubTabType) => void;
    agentSearch: string;
    setAgentSearch: (search: string) => void;
    onOpenDirectPay: (agent: AgentListItem) => void;
    onOpenPendingPayout: (payout: AgentPayoutItem) => void;
}

export default function ResellersTab({
    agents,
    payouts,
    pendingPayoutsCount,
    totalCompletedPayoutsVal,
    resellerSubTab,
    setResellerSubTab,
    agentSearch,
    setAgentSearch,
    onOpenDirectPay,
    onOpenPendingPayout,
}: ResellersTabProps) {
    const [copiedKey, setCopiedKey] = useState<string | null>(null);

    const handleCopy = (text: string, key: string) => {
        navigator.clipboard.writeText(text);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2000);
    };

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

    return (
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
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-[#8B5E3C]/10 text-[#8B5E3C]">
                                ACTION NEEDED
                            </span>
                        )}
                    </div>
                    <p className="text-3xl font-serif font-bold text-[#8B5E3C] tracking-tight">
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
                                                onClick={() => onOpenDirectPay(agent)}
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
                                                onClick={() => onOpenPendingPayout(payout)}
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
    );
}
