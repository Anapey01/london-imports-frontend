'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import NextImage from 'next/image';
import { 
    ShieldCheck, 
    RefreshCw, 
    Search, 
    CreditCard, 
    MessageCircle, 
    Package, 
    Sparkles 
} from 'lucide-react';
import { adminAPI } from '@/lib/api';
import { 
    AdminOrderData, 
    computeDebtorMetrics, 
    consolidateSourcingList, 
    generateWhatsAppMessage, 
    formatWhatsAppUrl 
} from '@/lib/concierge-utils';

import DebtorsTab from '@/components/admin/concierge/DebtorsTab';
import SourcingTab from '@/components/admin/concierge/SourcingTab';
import ClaimsAuditTab, { USSDClaim } from '@/components/admin/concierge/ClaimsAuditTab';

export default function AdminClaimsPage() {
    const [avatarError, setAvatarError] = useState(false);
    const [claims, setClaims] = useState<USSDClaim[]>([]);
    const [orders, setOrders] = useState<AdminOrderData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingOrders, setIsLoadingOrders] = useState(false);
    const [activeTab, setActiveTab] = useState<'pending' | 'debtors' | 'sourcing' | 'sync' | 'history' | 'whatsapp'>('pending');
    const [filterQuery, setFilterQuery] = useState('');

    // Force Sync Form State
    const [syncOrderNumber, setSyncOrderNumber] = useState('');
    const [syncTxnId, setSyncTxnId] = useState('');
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncResult, setSyncResult] = useState<{ success: boolean; message: string } | null>(null);

    // WhatsApp Dispatcher State
    const [waCustomerName, setWaCustomerName] = useState('');
    const [waCustomerPhone, setWaCustomerPhone] = useState('');
    const [waOrderNumber, setWaOrderNumber] = useState('');
    const [waBalanceDue, setWaBalanceDue] = useState('');
    const [waTemplate, setWaTemplate] = useState<'balance_reminder' | 'payment_received' | 'china_shipped' | 'accra_arrived'>('balance_reminder');

    const fetchClaims = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await adminAPI.getUSSDClaims();
            if (res.data?.claims) {
                setClaims(res.data.claims);
            }
        } catch {
            // Silently fallback
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchOrders = useCallback(async () => {
        setIsLoadingOrders(true);
        try {
            const res = await adminAPI.orders();
            const orderList = Array.isArray(res.data?.results) ? res.data.results : (Array.isArray(res.data) ? res.data : []);
            setOrders(orderList);
        } catch {
            // Silently fallback
        } finally {
            setIsLoadingOrders(false);
        }
    }, []);

    useEffect(() => {
        fetchClaims();
        fetchOrders();
    }, [fetchClaims, fetchOrders]);

    // Memoized KPIs
    const { allDebtors, totalOutstanding } = useMemo(() => computeDebtorMetrics(orders), [orders]);
    const { totalUnits: totalUnitsToProcure, items: sourcingItems } = useMemo(() => consolidateSourcingList(orders), [orders]);
    const pendingClaims = useMemo(() => claims.filter(c => c.status === 'PENDING_AUDIT'), [claims]);
    const resolvedClaims = useMemo(() => claims.filter(c => c.status !== 'PENDING_AUDIT'), [claims]);

    const filteredHistory = useMemo(() => {
        if (!filterQuery) return resolvedClaims;
        const q = filterQuery.toLowerCase();
        return resolvedClaims.filter(c => 
            c.order_number.toLowerCase().includes(q) ||
            c.transaction_id.toLowerCase().includes(q) ||
            (c.customer_phone && c.customer_phone.includes(q))
        );
    }, [resolvedClaims, filterQuery]);

    const handleForceSync = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!syncOrderNumber.trim() || !syncTxnId.trim()) return;

        setIsSyncing(true);
        setSyncResult(null);

        try {
            const res = await adminAPI.forceSyncPayment({
                order_number: syncOrderNumber.trim(),
                reference: syncTxnId.trim()
            });

            if (res.data?.success) {
                setSyncResult({ success: true, message: res.data.message || 'Payment successfully synchronized.' });
                fetchOrders();
                fetchClaims();
            } else {
                setSyncResult({ success: false, message: res.data?.error || 'Verification failed.' });
            }
        } catch (err: any) {
            setSyncResult({
                success: false,
                message: err.response?.data?.error || 'Failed to reach payment gateway.'
            });
        } finally {
            setIsSyncing(false);
        }
    };

    const getCustomWhatsAppUrl = useCallback(() => {
        const text = generateWhatsAppMessage(waTemplate, {
            customerName: waCustomerName,
            orderNumber: waOrderNumber,
            balanceDue: waBalanceDue,
        });
        return formatWhatsAppUrl(waCustomerPhone, text);
    }, [waCustomerPhone, waCustomerName, waOrderNumber, waBalanceDue, waTemplate]);

    return (
        <div className="space-y-6 pb-16">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
                <div className="flex items-center gap-3">
                    <div className="relative w-11 h-11 rounded-full overflow-hidden bg-slate-900 shrink-0 border border-slate-700/60 flex items-center justify-center">
                        {!avatarError ? (
                            <NextImage
                                src="/miss-london-avatar.png"
                                alt="Miss London"
                                fill
                                sizes="44px"
                                className="object-cover object-top"
                                onError={() => setAvatarError(true)}
                            />
                        ) : (
                            <span className="text-xs font-mono font-bold text-white">ML</span>
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                Miss London Operations
                            </h1>
                            <span className="text-[10px] font-mono uppercase bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-2 py-0.5 rounded font-bold">
                                RECONCILIATION
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Offline USSD payments (*713*7453#), debt recovery, China sourcing consolidation & Hubtel verification
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => { fetchClaims(); fetchOrders(); }}
                        disabled={isLoading || isLoadingOrders}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${(isLoading || isLoadingOrders) ? 'animate-spin' : ''}`} />
                        <span>Refresh Data</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => window.dispatchEvent(new CustomEvent('open-admin-concierge'))}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-950 text-white dark:bg-white dark:text-slate-950 text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Open Concierge Drawer</span>
                    </button>
                </div>
            </div>

            {/* Metric Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">Pending USSD Audits</span>
                    <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                            {pendingClaims.length}
                        </span>
                        <span className="text-xs text-slate-400">claims</span>
                    </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">Outstanding Balance</span>
                    <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                            GH₵ {totalOutstanding.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <span className="text-xs text-slate-400">({allDebtors.length} accounts)</span>
                    </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">China Sourcing Queue</span>
                    <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                            {totalUnitsToProcure}
                        </span>
                        <span className="text-xs text-slate-400">units ({sourcingItems.length} products)</span>
                    </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">USSD Shortcode</span>
                    <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                            *713*7453#
                        </span>
                        <span className="text-xs text-slate-400">Hubtel Merchant</span>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar">
                {[
                    { id: 'pending', label: 'Pending Audits', count: pendingClaims.length },
                    { id: 'debtors', label: 'Debtors & Balances', count: allDebtors.length },
                    { id: 'sourcing', label: 'China Sourcing Consolidator', count: sourcingItems.length },
                    { id: 'sync', label: 'Force Sync Hubtel' },
                    { id: 'history', label: 'Audit History', count: resolvedClaims.length },
                    { id: 'whatsapp', label: 'WhatsApp Dispatcher' },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 py-3 px-4 border-b-2 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                            activeTab === tab.id
                                ? 'border-slate-950 text-slate-950 dark:border-white dark:text-white'
                                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                        }`}
                    >
                        <span>{tab.label}</span>
                        {tab.count !== undefined && (
                            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Tab 1: Pending Claims */}
            {activeTab === 'pending' && (
                <div className="bg-slate-950 text-white rounded-xl p-4 border border-slate-800">
                    <ClaimsAuditTab
                        claims={claims}
                        isLoading={isLoading}
                        onRefresh={fetchClaims}
                    />
                </div>
            )}

            {/* Tab 2: Debtors */}
            {activeTab === 'debtors' && (
                <div className="bg-slate-950 text-white rounded-xl p-4 border border-slate-800">
                    <DebtorsTab
                        orders={orders}
                        isLoading={isLoadingOrders}
                    />
                </div>
            )}

            {/* Tab 3: Sourcing */}
            {activeTab === 'sourcing' && (
                <div className="bg-slate-950 text-white rounded-xl p-4 border border-slate-800">
                    <SourcingTab
                        orders={orders}
                        isLoading={isLoadingOrders}
                    />
                </div>
            )}

            {/* Tab 4: Force Sync Hubtel */}
            {activeTab === 'sync' && (
                <div className="max-w-xl mx-auto p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-4">
                    <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                            Hubtel Payment Verification
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Query Hubtel API using Transaction ID or Client Reference to credit an order.
                        </p>
                    </div>

                    <form onSubmit={handleForceSync} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Order Reference Number
                            </label>
                            <input
                                type="text"
                                value={syncOrderNumber}
                                onChange={(e) => setSyncOrderNumber(e.target.value)}
                                placeholder="e.g. LI-20260921-87841"
                                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-slate-100 font-mono"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Hubtel Transaction ID or Client Reference
                            </label>
                            <input
                                type="text"
                                value={syncTxnId}
                                onChange={(e) => setSyncTxnId(e.target.value)}
                                placeholder="e.g. 90263045181"
                                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-slate-100 font-mono"
                                required
                            />
                        </div>

                        {syncResult && (
                            <div className="p-3 rounded-lg text-xs border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200">
                                {syncResult.message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSyncing}
                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-950 text-white dark:bg-white dark:text-slate-950 text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>{isSyncing ? 'Verifying Gateway...' : 'Verify & Credit Payment'}</span>
                        </button>
                    </form>
                </div>
            )}

            {/* Tab 5: Audit History */}
            {activeTab === 'history' && (
                <div className="space-y-4">
                    <div className="relative">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                        <input
                            type="text"
                            value={filterQuery}
                            onChange={(e) => setFilterQuery(e.target.value)}
                            placeholder="Filter audit history..."
                            className="w-full text-xs pl-8 pr-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none font-mono"
                        />
                    </div>

                    <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 overflow-hidden shadow-2xs">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                                    <tr>
                                        <th className="py-3 px-4">Order #</th>
                                        <th className="py-3 px-4">Transaction ID</th>
                                        <th className="py-3 px-4">Customer Phone</th>
                                        <th className="py-3 px-4 text-right">Amount Claimed</th>
                                        <th className="py-3 px-4 text-center">Status</th>
                                        <th className="py-3 px-4">Audited By</th>
                                        <th className="py-3 px-4 text-right">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                    {filteredHistory.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="py-12 text-center text-slate-400">
                                                No resolved claims in history.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredHistory.map(claim => (
                                            <tr key={claim.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                                                    #{claim.order_number}
                                                </td>
                                                <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">
                                                    {claim.transaction_id}
                                                </td>
                                                <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">
                                                    {claim.customer_phone || '-'}
                                                </td>
                                                <td className="py-3 px-4 text-right font-mono font-semibold">
                                                    GH₵ {claim.claimed_amount ? Number(claim.claimed_amount).toFixed(2) : '1.00'}
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                                        {claim.status}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-slate-500">
                                                    {claim.resolved_by || 'Admin Concierge'}
                                                </td>
                                                <td className="py-3 px-4 text-right text-slate-400 font-mono">
                                                    {claim.resolved_at ? new Date(claim.resolved_at).toLocaleDateString() : '-'}
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

            {/* Tab 6: WhatsApp Dispatcher */}
            {activeTab === 'whatsapp' && (
                <div className="max-w-xl mx-auto p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-4">
                    <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                            Customer WhatsApp Notification Dispatcher
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Generate standardized notifications with tracking links.
                        </p>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Template
                        </label>
                        <select
                            value={waTemplate}
                            onChange={(e) => setWaTemplate(e.target.value as any)}
                            className="w-full text-xs px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none"
                        >
                            <option value="balance_reminder">Outstanding Balance Reminder</option>
                            <option value="payment_received">Payment Received Confirmation</option>
                            <option value="china_shipped">Dispatched from China Factory</option>
                            <option value="accra_arrived">Arrived at Accra Central Hub</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Customer First Name
                            </label>
                            <input
                                type="text"
                                value={waCustomerName}
                                onChange={(e) => setWaCustomerName(e.target.value)}
                                placeholder="e.g. Gabriel"
                                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Customer Phone Number
                            </label>
                            <input
                                type="text"
                                value={waCustomerPhone}
                                onChange={(e) => setWaCustomerPhone(e.target.value)}
                                placeholder="024XXXXXXX"
                                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none font-mono"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Order Reference Number
                            </label>
                            <input
                                type="text"
                                value={waOrderNumber}
                                onChange={(e) => setWaOrderNumber(e.target.value)}
                                placeholder="e.g. LI-20260921-87841"
                                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none font-mono"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Outstanding Balance (GH₵)
                            </label>
                            <input
                                type="text"
                                value={waBalanceDue}
                                onChange={(e) => setWaBalanceDue(e.target.value)}
                                placeholder="e.g. 7.00"
                                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none font-mono"
                            />
                        </div>
                    </div>

                    <a
                        href={getCustomWhatsAppUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 text-xs font-semibold transition-colors"
                    >
                        <MessageCircle className="w-4 h-4" />
                        <span>Launch WhatsApp Chat</span>
                    </a>
                </div>
            )}
        </div>
    );
}
