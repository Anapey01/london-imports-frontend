/**
 * London's Imports - High-Precision Exam Voucher & Reseller Terminal
 * Designed with London's Imports 'Atelier' architectural system (clean, monochrome, luxury typography)
 */
'use client';

import React, { useState, useEffect } from 'react';
import { adminAPI } from '@/lib/api';
import { RefreshCw, CheckCircle2, AlertCircle, X } from 'lucide-react';

// Extracted Modular Subcomponents
import type { 
    AgentPayoutItem, 
    AgentListItem, 
    CheckerAnalyticsData, 
    MainTabType, 
    ResellerSubTabType, 
    CheckerCategoryType 
} from '@/components/admin/checkers/types';
import VoucherAnalyticsTab from '@/components/admin/checkers/VoucherAnalyticsTab';
import ResellersTab from '@/components/admin/checkers/ResellersTab';
import DirectPayModal from '@/components/admin/checkers/DirectPayModal';
import PendingPayoutModal from '@/components/admin/checkers/PendingPayoutModal';

export default function AdminCheckersAnalyticsPage() {
    // Primary Tab: Default to 'resellers'
    const [mainTab, setMainTab] = useState<MainTabType>('resellers');

    // === Reseller Agents & Payouts State ===
    const [payouts, setPayouts] = useState<AgentPayoutItem[]>([]);
    const [agents, setAgents] = useState<AgentListItem[]>([]);
    const [pendingPayoutsCount, setPendingPayoutsCount] = useState<number>(0);
    const [totalCompletedPayoutsVal, setTotalCompletedPayoutsVal] = useState<string>('0.00');
    const [resellersLoading, setResellersLoading] = useState<boolean>(false);
    const [, setResellersError] = useState<string | null>(null);

    // Filters & Subtabs
    const [resellerSubTab, setResellerSubTab] = useState<ResellerSubTabType>('agents');
    const [agentSearch, setAgentSearch] = useState<string>('');

    // Direct Payment Modal State (Pay any agent even without a withdrawal request)
    const [selectedAgentForDirectPay, setSelectedAgentForDirectPay] = useState<AgentListItem | null>(null);
    const [directPayingInProgress, setDirectPayingInProgress] = useState<boolean>(false);

    // Pending Payout Modal State (When clicking on an existing withdrawal request)
    const [selectedPayoutToPay, setSelectedPayoutToPay] = useState<AgentPayoutItem | null>(null);
    const [payingInProgress, setPayingInProgress] = useState<boolean>(false);

    // Notifications
    const [notificationMessage, setNotificationMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Body Scroll Lock for Modals
    useEffect(() => {
        if (selectedAgentForDirectPay || selectedPayoutToPay) {
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = originalOverflow;
            };
        }
    }, [selectedAgentForDirectPay, selectedPayoutToPay]);

    // === Voucher Analytics State ===
    const [category, setCategory] = useState<CheckerCategoryType>('ALL');
    const [period, setPeriod] = useState<string>('all');
    const [startDate] = useState<string>('');
    const [endDate] = useState<string>('');
    const [analyticsLoading, setAnalyticsLoading] = useState<boolean>(false);
    const [, setAnalyticsError] = useState<string | null>(null);
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

    // Re-fetch analytics when category or period changes
    useEffect(() => {
        if (mainTab === 'vouchers') {
            fetchAnalytics();
        }
    }, [category, period, mainTab]);

    // Confirm Direct Payment to Agent
    const handleConfirmDirectPay = async (amountNum: number, notes: string) => {
        if (!selectedAgentForDirectPay) return;
        setDirectPayingInProgress(true);
        try {
            await adminAPI.checkerDirectPayout({
                agent_id: selectedAgentForDirectPay.id,
                amount: amountNum,
                notes: notes,
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
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#8B5E3C] animate-pulse">
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

            {/* VIEW 1: RESELLER AGENTS & PAYOUTS TERMINAL */}
            {mainTab === 'resellers' && (
                <ResellersTab
                    agents={agents}
                    payouts={payouts}
                    pendingPayoutsCount={pendingPayoutsCount}
                    totalCompletedPayoutsVal={totalCompletedPayoutsVal}
                    resellerSubTab={resellerSubTab}
                    setResellerSubTab={setResellerSubTab}
                    agentSearch={agentSearch}
                    setAgentSearch={setAgentSearch}
                    onOpenDirectPay={(agent) => setSelectedAgentForDirectPay(agent)}
                    onOpenPendingPayout={(payout) => setSelectedPayoutToPay(payout)}
                />
            )}

            {/* VIEW 2: VOUCHER SALES & INVENTORY TERMINAL */}
            {mainTab === 'vouchers' && (
                <VoucherAnalyticsTab
                    category={category}
                    setCategory={setCategory}
                    period={period}
                    setPeriod={setPeriod}
                    data={data}
                />
            )}

            {/* MODAL 1: DIRECT PAYMENT TO AGENT */}
            <DirectPayModal
                isOpen={!!selectedAgentForDirectPay}
                agent={selectedAgentForDirectPay}
                onClose={() => setSelectedAgentForDirectPay(null)}
                onConfirm={handleConfirmDirectPay}
                loading={directPayingInProgress}
            />

            {/* MODAL 2: CONFIRM PENDING WITHDRAWAL PAYOUT */}
            <PendingPayoutModal
                isOpen={!!selectedPayoutToPay}
                payout={selectedPayoutToPay}
                onClose={() => setSelectedPayoutToPay(null)}
                onConfirm={handleConfirmPendingPayout}
                loading={payingInProgress}
            />
        </div>
    );
}
