'use client';

import React, { useState, useEffect, useCallback } from 'react';
import NextImage from 'next/image';
import Link from 'next/link';
import { 
    ShieldCheck, 
    RefreshCw, 
    Check, 
    AlertCircle, 
    ExternalLink,
    Copy,
    CreditCard,
    Phone,
    MessageCircle,
    Send,
    Filter,
    ArrowRight,
    Sparkles
} from 'lucide-react';
import { adminAPI } from '@/lib/api';
import { useTheme } from '@/providers/ThemeProvider';

interface USSDClaim {
    id: string;
    order_number: string;
    order_total: number;
    order_balance: number;
    transaction_id: string;
    claimed_amount: number | null;
    customer_phone: string;
    status: string;
    created_at: string;
    resolved_at?: string | null;
    resolved_by?: string | null;
    notes?: string;
}

export default function AdminClaimsPage() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [claims, setClaims] = useState<USSDClaim[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'pending' | 'history' | 'sync' | 'whatsapp'>('pending');
    const [filterQuery, setFilterQuery] = useState('');
    const [copiedTxn, setCopiedTxn] = useState<string | null>(null);

    // Sync Form State
    const [syncOrderNumber, setSyncOrderNumber] = useState('');
    const [syncTxnId, setSyncTxnId] = useState('');
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncResult, setSyncResult] = useState<{ success: boolean; message: string } | null>(null);

    // WhatsApp Generator State
    const [waCustomerName, setWaCustomerName] = useState('');
    const [waCustomerPhone, setWaCustomerPhone] = useState('');
    const [waOrderNumber, setWaOrderNumber] = useState('');
    const [waBalanceDue, setWaBalanceDue] = useState('');
    const [waTemplate, setWaTemplate] = useState<'payment_received' | 'china_shipped' | 'accra_arrived'>('payment_received');

    // Fetch all claims
    const fetchClaims = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await adminAPI.getUSSDClaims();
            if (res.data?.claims) {
                setClaims(res.data.claims);
            }
        } catch (err) {
            console.error('Failed to fetch claims:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchClaims();
        const interval = setInterval(fetchClaims, 30000);
        return () => clearInterval(interval);
    }, [fetchClaims]);

    const pendingClaims = claims.filter(c => c.status === 'PENDING_AUDIT');
    const resolvedClaims = claims.filter(c => c.status !== 'PENDING_AUDIT');

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedTxn(text);
        setTimeout(() => setCopiedTxn(null), 2000);
    };

    const handleApproveClaim = async (claim: USSDClaim) => {
        const customAmount = prompt(
            `Confirm payment credit for Order #${claim.order_number}:\nEnter amount in GH₵ (claimed: GH₵ ${claim.claimed_amount || claim.order_balance || 1}):`,
            String(claim.claimed_amount || claim.order_balance || 1)
        );
        if (customAmount === null) return;
        const parsed = parseFloat(customAmount);
        if (isNaN(parsed) || parsed <= 0) {
            alert('Please enter a valid positive amount.');
            return;
        }

        try {
            await adminAPI.resolveUSSDClaim({
                claim_id: claim.id,
                action: 'approve',
                amount: parsed
            });
            await fetchClaims();
            alert(`GH₵ ${parsed.toFixed(2)} successfully credited to Order #${claim.order_number}!`);
        } catch (e: any) {
            alert(e.response?.data?.error || 'Failed to approve claim');
        }
    };

    const handleRejectClaim = async (claim: USSDClaim) => {
        const reason = prompt('Enter rejection reason (optional):');
        if (reason === null) return;
        try {
            await adminAPI.resolveUSSDClaim({
                claim_id: claim.id,
                action: 'reject',
                notes: reason || undefined
            });
            await fetchClaims();
        } catch (e: any) {
            alert(e.response?.data?.error || 'Failed to reject claim');
        }
    };

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
                setSyncResult({
                    success: true,
                    message: res.data.message || 'Payment reconciled and credited successfully.'
                });
                setSyncOrderNumber('');
                setSyncTxnId('');
                fetchClaims();
            } else {
                setSyncResult({
                    success: false,
                    message: res.data?.error || 'Could not reconcile payment.'
                });
            }
        } catch (err: any) {
            setSyncResult({
                success: false,
                message: err.response?.data?.error || err.message || 'Verification error'
            });
        } finally {
            setIsSyncing(false);
        }
    };

    const generateWhatsAppLink = () => {
        let cleanPhone = waCustomerPhone.replace(/\D/g, '');
        if (cleanPhone.startsWith('0')) cleanPhone = '233' + cleanPhone.slice(1);
        if (!cleanPhone.startsWith('233') && cleanPhone.length === 9) cleanPhone = '233' + cleanPhone;

        const name = waCustomerName.trim() || 'Customer';
        const order = waOrderNumber.trim() || 'your order';
        const balance = waBalanceDue.trim() ? `GH₵ ${waBalanceDue.trim()}` : '';

        let text = '';
        if (waTemplate === 'payment_received') {
            text = `Hello ${name}, your payment for Order #${order} has been verified and credited. ${balance ? `Your remaining balance is ${balance}.` : 'Your order is fully cleared for processing.'} Thank you for choosing London's Imports!`;
        } else if (waTemplate === 'china_shipped') {
            text = `Hello ${name}, great news! Your Order #${order} has been dispatched from our partner factory consolidation warehouse in China and is en route to our central distribution hub in Accra (estimated around 6 weeks for standard sea freight, or 2-3 weeks for express air). We will notify you the moment it lands!`;
        } else {
            text = `Hello ${name}, your package for Order #${order} has safely landed at our Accra Central sorting hub! ${balance ? `Please clear the remaining balance of ${balance} so our dispatch rider can release your package for doorstep delivery.` : 'Your package is ready for delivery!'}`;
        }

        return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    };

    // Filtered lists
    const filteredPending = pendingClaims.filter(c => 
        !filterQuery || 
        c.order_number.toLowerCase().includes(filterQuery.toLowerCase()) ||
        c.transaction_id.toLowerCase().includes(filterQuery.toLowerCase()) ||
        (c.customer_phone && c.customer_phone.includes(filterQuery))
    );

    const filteredHistory = resolvedClaims.filter(c => 
        !filterQuery || 
        c.order_number.toLowerCase().includes(filterQuery.toLowerCase()) ||
        c.transaction_id.toLowerCase().includes(filterQuery.toLowerCase()) ||
        (c.customer_phone && c.customer_phone.includes(filterQuery))
    );

    return (
        <div className="space-y-8 pb-16">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
                <div className="flex items-center gap-3">
                    <div className="relative w-11 h-11 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700">
                        <NextImage
                            src="/images/miss-london.png"
                            alt="Miss London"
                            fill
                            sizes="44px"
                            className="object-cover object-top"
                        />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                Miss London & USSD Claims
                            </h1>
                            <span className="text-[10px] font-mono uppercase bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-2 py-0.5 rounded font-bold">
                                Offline MoMo Hub
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Customer USSD payments (*713*7453#), automated audit claims & concierge reconciliation
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={fetchClaims}
                        disabled={isLoading}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                        <span>Refresh Claims</span>
                    </button>
                    <button
                        onClick={() => window.dispatchEvent(new CustomEvent('open-admin-concierge'))}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-950 text-white dark:bg-white dark:text-slate-950 text-xs font-semibold hover:opacity-90 transition-all cursor-pointer shadow-xs"
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Open Side Drawer</span>
                    </button>
                </div>
            </div>

            {/* Metric Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Pending Audits</span>
                        {pendingClaims.length > 0 && (
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                        )}
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-bold font-mono text-slate-900 dark:text-white">
                            {pendingClaims.length}
                        </span>
                        <span className="text-xs text-slate-400">claims awaiting review</span>
                    </div>
                </div>

                <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Total Reconciled</span>
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-bold font-mono text-slate-900 dark:text-white">
                            {resolvedClaims.filter(c => c.status === 'MATCHED').length}
                        </span>
                        <span className="text-xs text-slate-400">payments credited</span>
                    </div>
                </div>

                <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Offline Shortcode</span>
                        <Phone className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                            *713*7453#
                        </span>
                        <span className="text-xs text-slate-400">Hubtel USSD</span>
                    </div>
                </div>
            </div>

            {/* Tabs Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-1 overflow-x-auto pb-px">
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`px-4 py-2.5 text-xs font-semibold tracking-wide border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                            activeTab === 'pending'
                                ? 'border-slate-900 text-slate-900 dark:border-white dark:text-white'
                                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                    >
                        <span>Pending Claims</span>
                        {pendingClaims.length > 0 && (
                            <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                                {pendingClaims.length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`px-4 py-2.5 text-xs font-semibold tracking-wide border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                            activeTab === 'history'
                                ? 'border-slate-900 text-slate-900 dark:border-white dark:text-white'
                                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                    >
                        <span>All Claims History</span>
                        <span className="text-slate-400 font-normal">({resolvedClaims.length})</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('sync')}
                        className={`px-4 py-2.5 text-xs font-semibold tracking-wide border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                            activeTab === 'sync'
                                ? 'border-slate-900 text-slate-900 dark:border-white dark:text-white'
                                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                    >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Force Sync Hubtel</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('whatsapp')}
                        className={`px-4 py-2.5 text-xs font-semibold tracking-wide border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                            activeTab === 'whatsapp'
                                ? 'border-slate-900 text-slate-900 dark:border-white dark:text-white'
                                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                    >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp Dispatcher</span>
                    </button>
                </div>

                {(activeTab === 'pending' || activeTab === 'history') && (
                    <div className="pb-2 sm:pb-0">
                        <input
                            type="text"
                            value={filterQuery}
                            onChange={(e) => setFilterQuery(e.target.value)}
                            placeholder="Search order, txn ID, phone..."
                            className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none w-full sm:w-64"
                        />
                    </div>
                )}
            </div>

            {/* TAB CONTENT 1: PENDING CLAIMS */}
            {activeTab === 'pending' && (
                <div className="space-y-4">
                    {filteredPending.length === 0 ? (
                        <div className="p-12 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30">
                            <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto mb-3 opacity-90" />
                            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Pending Claims</h3>
                            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                                All customer claims submitted via Miss London concierge or Hubtel USSD have been audited and credited.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredPending.map(claim => (
                                <div
                                    key={claim.id}
                                    className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <Link 
                                                    href={`/dashboard/admin/orders/${claim.order_number}`}
                                                    className="font-mono text-sm font-bold text-slate-900 dark:text-white hover:underline flex items-center gap-1"
                                                >
                                                    #{claim.order_number}
                                                    <ExternalLink className="w-3 h-3 text-slate-400" />
                                                </Link>
                                                <span className="text-[10px] font-mono uppercase bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full font-bold">
                                                    Pending Audit
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                                                {new Date(claim.created_at).toLocaleString('en-GB')}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[10px] font-mono uppercase text-slate-400 block">Claimed</span>
                                            <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">
                                                GH₵ {claim.claimed_amount ? Number(claim.claimed_amount).toFixed(2) : '1.00'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-xs">
                                        <div>
                                            <span className="text-slate-400 text-[10px] uppercase font-mono block">Txn ID / MoMo Reference</span>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <span className="font-mono font-bold text-slate-900 dark:text-white truncate">
                                                    {claim.transaction_id}
                                                </span>
                                                <button
                                                    onClick={() => handleCopy(claim.transaction_id)}
                                                    className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                                                    title="Copy transaction ID"
                                                >
                                                    <Copy className="w-3 h-3" />
                                                </button>
                                                {copiedTxn === claim.transaction_id && (
                                                    <span className="text-[9px] text-emerald-500 font-bold">Copied!</span>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-slate-400 text-[10px] uppercase font-mono block">Order Remaining Balance</span>
                                            <span className="font-mono font-bold text-slate-900 dark:text-white mt-0.5 block">
                                                GH₵ {Number(claim.order_balance).toFixed(2)}
                                            </span>
                                        </div>
                                        {claim.customer_phone && (
                                            <div className="col-span-2 flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                                                <span className="text-slate-400 text-[10px] uppercase font-mono">Customer Phone:</span>
                                                <a 
                                                    href={`tel:${claim.customer_phone}`}
                                                    className="font-mono font-bold text-slate-800 dark:text-slate-200 hover:underline flex items-center gap-1"
                                                >
                                                    <Phone className="w-3 h-3 text-slate-400" />
                                                    {claim.customer_phone}
                                                </a>
                                            </div>
                                        )}
                                    </div>

                                    {claim.notes && (
                                        <p className="text-[11px] text-slate-500 italic bg-amber-500/5 p-2 rounded border border-amber-500/10">
                                            {claim.notes}
                                        </p>
                                    )}

                                    <div className="flex items-center gap-2 pt-1">
                                        <button
                                            onClick={() => handleApproveClaim(claim)}
                                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-slate-950 text-white dark:bg-white dark:text-slate-950 text-xs font-semibold hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-xs"
                                        >
                                            <Check className="w-3.5 h-3.5" />
                                            <span>Approve & Credit Payment</span>
                                        </button>
                                        <button
                                            onClick={() => handleRejectClaim(claim)}
                                            className="px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-semibold transition-all cursor-pointer"
                                        >
                                            <span>Reject</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* TAB CONTENT 2: ALL CLAIMS HISTORY */}
            {activeTab === 'history' && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                                <tr>
                                    <th className="py-3 px-4">Order Number</th>
                                    <th className="py-3 px-4">Transaction ID</th>
                                    <th className="py-3 px-4">Claimed</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4">Date Submitted</th>
                                    <th className="py-3 px-4">Resolution</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filteredHistory.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-8 text-center text-slate-400">
                                            No resolved claims found matching filter.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredHistory.map(claim => (
                                        <tr key={claim.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                            <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                                                <Link 
                                                    href={`/dashboard/admin/orders/${claim.order_number}`}
                                                    className="hover:underline"
                                                >
                                                    #{claim.order_number}
                                                </Link>
                                            </td>
                                            <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-300">
                                                {claim.transaction_id}
                                            </td>
                                            <td className="py-3 px-4 font-mono font-semibold text-slate-800 dark:text-slate-200">
                                                GH₵ {claim.claimed_amount ? Number(claim.claimed_amount).toFixed(2) : '-'}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                                    claim.status === 'MATCHED'
                                                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                                                        : 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20'
                                                }`}>
                                                    {claim.status === 'MATCHED' ? 'Credited' : 'Rejected'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                                                {new Date(claim.created_at).toLocaleDateString('en-GB')}
                                            </td>
                                            <td className="py-3 px-4 text-slate-500 text-[11px]">
                                                {claim.resolved_by && <span>by @{claim.resolved_by} </span>}
                                                {claim.resolved_at && <span className="text-slate-400">({new Date(claim.resolved_at).toLocaleDateString('en-GB')})</span>}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* TAB CONTENT 3: DIRECT FORCE SYNC */}
            {activeTab === 'sync' && (
                <div className="max-w-xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
                    <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                            Force-Sync Transaction with Hubtel
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            If a customer made a direct payment or offline USSD transfer and it hasn't reflected automatically, input their order number and Hubtel Transaction ID or Client Reference here to force an immediate query and credit.
                        </p>
                    </div>

                    <form onSubmit={handleForceSync} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                Order Number
                            </label>
                            <input
                                type="text"
                                value={syncOrderNumber}
                                onChange={(e) => setSyncOrderNumber(e.target.value)}
                                placeholder="e.g. LI-20260921-87841"
                                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-slate-300 font-mono"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                Hubtel Transaction ID or Reference
                            </label>
                            <input
                                type="text"
                                value={syncTxnId}
                                onChange={(e) => setSyncTxnId(e.target.value)}
                                placeholder="e.g. 90263045181"
                                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-slate-300 font-mono"
                                required
                            />
                        </div>

                        {syncResult && (
                            <div className={`p-4 rounded-xl text-xs flex items-start gap-2.5 ${
                                syncResult.success 
                                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20' 
                                    : 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20'
                            }`}>
                                {syncResult.success ? (
                                    <Check className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                                ) : (
                                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                                )}
                                <span>{syncResult.message}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSyncing}
                            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-950 text-white dark:bg-white dark:text-slate-950 text-xs font-bold hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all cursor-pointer shadow-sm"
                        >
                            {isSyncing ? (
                                <>
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                    <span>Querying Hubtel Provider Gateway...</span>
                                </>
                            ) : (
                                <>
                                    <CreditCard className="w-4 h-4" />
                                    <span>Live Reconcile & Credit Order</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            )}

            {/* TAB CONTENT 4: WHATSAPP NOTIFICATION DISPATCHER */}
            {activeTab === 'whatsapp' && (
                <div className="max-w-xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
                    <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                            WhatsApp Customer Update Dispatcher
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Generate standardized, official update notifications and open directly in WhatsApp to message the customer with a single tap.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                Notification Template
                            </label>
                            <select
                                value={waTemplate}
                                onChange={(e) => setWaTemplate(e.target.value as any)}
                                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
                            >
                                <option value="payment_received">Payment Received & Credited Confirmation</option>
                                <option value="china_shipped">Order Dispatched from China Factory Consolidation</option>
                                <option value="accra_arrived">Package Arrived at Accra Central Hub & Balance Due</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                    Customer Name
                                </label>
                                <input
                                    type="text"
                                    value={waCustomerName}
                                    onChange={(e) => setWaCustomerName(e.target.value)}
                                    placeholder="e.g. Gabriel"
                                    className="w-full text-xs px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                    Customer Phone Number
                                </label>
                                <input
                                    type="text"
                                    value={waCustomerPhone}
                                    onChange={(e) => setWaCustomerPhone(e.target.value)}
                                    placeholder="e.g. 0545247009"
                                    className="w-full text-xs px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none font-mono"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                    Order Number
                                </label>
                                <input
                                    type="text"
                                    value={waOrderNumber}
                                    onChange={(e) => setWaOrderNumber(e.target.value)}
                                    placeholder="e.g. LI-20260905-26446"
                                    className="w-full text-xs px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none font-mono"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                    Remaining Balance Due (if any)
                                </label>
                                <input
                                    type="text"
                                    value={waBalanceDue}
                                    onChange={(e) => setWaBalanceDue(e.target.value)}
                                    placeholder="e.g. 27.00"
                                    className="w-full text-xs px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none font-mono"
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <a
                                href={generateWhatsAppLink()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                            >
                                <Send className="w-4 h-4" />
                                <span>Open in WhatsApp (+233)</span>
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
