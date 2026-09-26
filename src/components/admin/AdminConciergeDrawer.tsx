'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { 
    X, 
    ShieldCheck, 
    RefreshCw, 
    Check, 
    AlertCircle, 
    MessageCircle, 
    ArrowRight, 
    FileText, 
    Send,
    Phone,
    CreditCard
} from 'lucide-react';
import { adminAPI } from '@/lib/api';

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

export default function AdminConciergeDrawer() {
    const [isOpen, setIsOpen] = useState(false);
    const [claims, setClaims] = useState<USSDClaim[]>([]);
    const [isLoadingClaims, setIsLoadingClaims] = useState(false);
    const [activeTab, setActiveTab] = useState<'claims' | 'sync' | 'whatsapp'>('claims');

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

    // Fetch pending claims
    const fetchClaims = useCallback(async () => {
        setIsLoadingClaims(true);
        try {
            const res = await adminAPI.getUSSDClaims();
            if (res.data?.claims) {
                setClaims(res.data.claims);
            }
        } catch {
            // Graceful fallback
        } finally {
            setIsLoadingClaims(false);
        }
    }, []);

    useEffect(() => {
        fetchClaims();
        const interval = setInterval(fetchClaims, 30000); // 30s auto poll for admin
        return () => clearInterval(interval);
    }, [fetchClaims]);

    const pendingClaims = claims.filter(c => c.status === 'PENDING_AUDIT');

    const handleApproveClaim = async (claim: USSDClaim) => {
        try {
            await adminAPI.resolveUSSDClaim({
                claim_id: claim.id,
                action: 'approve',
                amount: claim.claimed_amount || undefined
            });
            await fetchClaims();
        } catch (e: any) {
            alert(e.response?.data?.error || 'Failed to approve claim');
        }
    };

    const handleRejectClaim = async (claim: USSDClaim) => {
        const reason = prompt('Enter rejection reason (optional):');
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
            text = `Hello ${name}, great news! Your Order #${order} has been dispatched express from our partner factory consolidation warehouse in China and is en route to our central distribution hub in Accra (estimated 2-3 weeks). We will notify you the moment it lands!`;
        } else {
            text = `Hello ${name}, your package for Order #${order} has safely landed at our Accra Central sorting hub! ${balance ? `Please clear the remaining balance of ${balance} so our dispatch rider can release your package for doorstep delivery.` : 'Your package is ready for delivery!'}`;
        }

        return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    };

    return (
        <>
            {/* Floating Admin Miss London Button */}
            <div className="fixed bottom-6 right-6 z-[60] print:hidden">
                <button
                    onClick={() => setIsOpen(true)}
                    className="relative group flex items-center gap-2.5 px-3.5 py-2.5 rounded-full bg-slate-950 text-white dark:bg-white dark:text-slate-950 border border-slate-800 dark:border-slate-200 shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    aria-label="Open Miss London Admin Concierge"
                    title="Miss London Admin Concierge"
                >
                    <div className="relative w-7 h-7 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                        <Image
                            src="/images/miss-london.png"
                            alt="Miss London"
                            fill
                            sizes="28px"
                            className="object-cover object-top"
                        />
                    </div>
                    <span className="text-xs font-semibold tracking-wide hidden sm:inline">
                        Miss London
                    </span>
                    <span className="text-[10px] font-mono uppercase bg-slate-800 dark:bg-slate-200 px-1.5 py-0.5 rounded text-slate-300 dark:text-slate-700">
                        Admin
                    </span>

                    {/* Pending Claims Notification Badge */}
                    {pendingClaims.length > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-md animate-pulse">
                            {pendingClaims.length}
                        </span>
                    )}
                </button>
            </div>

            {/* Slide-over Drawer Backdrop */}
            {isOpen && (
                <div className="fixed inset-0 z-[70] flex justify-end bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
                    <div 
                        className="fixed inset-0" 
                        onClick={() => setIsOpen(false)} 
                    />

                    {/* Drawer Content */}
                    <div className="relative w-full max-w-md bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col h-full z-10 animate-in slide-in-from-right duration-300">
                        {/* Header */}
                        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="relative w-9 h-9 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700">
                                    <Image
                                        src="/images/miss-london.png"
                                        alt="Miss London"
                                        fill
                                        sizes="36px"
                                        className="object-cover object-top"
                                    />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Miss London</h3>
                                        <span className="text-[9px] font-bold tracking-widest uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded">
                                            Admin Concierge
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                        Operations & Payment Reconciliation
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Navigation Tabs */}
                        <div className="flex items-center border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-xs font-medium">
                            <button
                                onClick={() => setActiveTab('claims')}
                                className={`flex-1 py-2.5 px-3 text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
                                    activeTab === 'claims'
                                        ? 'border-slate-900 text-slate-900 dark:border-white dark:text-white font-semibold'
                                        : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                            >
                                <span>Pending Claims</span>
                                {pendingClaims.length > 0 && (
                                    <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] flex items-center justify-center font-bold">
                                        {pendingClaims.length}
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab('sync')}
                                className={`flex-1 py-2.5 px-3 text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
                                    activeTab === 'sync'
                                        ? 'border-slate-900 text-slate-900 dark:border-white dark:text-white font-semibold'
                                        : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                            >
                                <span>Manual Reconcile</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('whatsapp')}
                                className={`flex-1 py-2.5 px-3 text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
                                    activeTab === 'whatsapp'
                                        ? 'border-slate-900 text-slate-900 dark:border-white dark:text-white font-semibold'
                                        : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                            >
                                <span>WhatsApp Generator</span>
                            </button>
                        </div>

                        {/* Body Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {/* TAB 1: PENDING USSD CLAIMS */}
                            {activeTab === 'claims' && (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-xs text-slate-500">
                                        <span>Customer claims from USSD *713*7453#</span>
                                        <button 
                                            onClick={fetchClaims} 
                                            disabled={isLoadingClaims}
                                            className="hover:underline flex items-center gap-1 text-[11px]"
                                        >
                                            <RefreshCw className={`w-3 h-3 ${isLoadingClaims ? 'animate-spin' : ''}`} />
                                            <span>Refresh</span>
                                        </button>
                                    </div>

                                    {pendingClaims.length === 0 ? (
                                        <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                                            <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                                            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">All clear</p>
                                            <p className="text-[11px] text-slate-400 mt-0.5">No pending customer claims requiring review.</p>
                                        </div>
                                    ) : (
                                        pendingClaims.map(claim => (
                                            <div 
                                                key={claim.id} 
                                                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 space-y-2.5 shadow-2xs"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                                                        #{claim.order_number}
                                                    </span>
                                                    <span className="text-[10px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full">
                                                        Claim: GH₵ {claim.claimed_amount ? Number(claim.claimed_amount).toFixed(2) : '1.00'}
                                                    </span>
                                                </div>

                                                <div className="text-[11px] space-y-1 text-slate-600 dark:text-slate-300">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-slate-400">Hubtel Txn ID:</span>
                                                        <span className="font-mono font-semibold">{claim.transaction_id}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-slate-400">Order Balance:</span>
                                                        <span>GH₵ {Number(claim.order_balance).toFixed(2)}</span>
                                                    </div>
                                                    {claim.customer_phone && (
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-slate-400">Customer Phone:</span>
                                                            <a href={`tel:${claim.customer_phone}`} className="hover:underline font-mono">
                                                                {claim.customer_phone}
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleApproveClaim(claim)}
                                                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 text-white dark:bg-white dark:text-slate-950 text-xs font-medium hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                                                    >
                                                        <Check className="w-3.5 h-3.5" />
                                                        <span>Approve & Credit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleRejectClaim(claim)}
                                                        className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-medium transition-all cursor-pointer"
                                                    >
                                                        <span>Reject</span>
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                            {/* TAB 2: MANUAL FORCE SYNC */}
                            {activeTab === 'sync' && (
                                <form onSubmit={handleForceSync} className="space-y-3.5">
                                    <div className="text-xs text-slate-500">
                                        Paste any Hubtel transaction ID to live-verify and credit to an order.
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                            Order Number
                                        </label>
                                        <input
                                            type="text"
                                            value={syncOrderNumber}
                                            onChange={(e) => setSyncOrderNumber(e.target.value)}
                                            placeholder="e.g. LI-20260921-87841"
                                            className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-slate-200 font-mono"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                            Hubtel Transaction ID or Client Reference
                                        </label>
                                        <input
                                            type="text"
                                            value={syncTxnId}
                                            onChange={(e) => setSyncTxnId(e.target.value)}
                                            placeholder="e.g. 90263045181"
                                            className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-slate-200 font-mono"
                                            required
                                        />
                                    </div>

                                    {syncResult && (
                                        <div className={`p-3 rounded-lg text-xs flex items-start gap-2 ${
                                            syncResult.success 
                                                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20' 
                                                : 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20'
                                        }`}>
                                            {syncResult.success ? <Check className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
                                            <span>{syncResult.message}</span>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isSyncing}
                                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-950 text-white dark:bg-white dark:text-slate-950 text-xs font-semibold hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
                                    >
                                        {isSyncing ? (
                                            <>
                                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                                <span>Verifying with Hubtel...</span>
                                            </>
                                        ) : (
                                            <>
                                                <CreditCard className="w-3.5 h-3.5" />
                                                <span>Verify & Reconcile Payment</span>
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}

                            {/* TAB 3: WHATSAPP CUSTOMER COMMUNICATOR */}
                            {activeTab === 'whatsapp' && (
                                <div className="space-y-3.5">
                                    <div className="text-xs text-slate-500">
                                        Generate pre-formatted professional customer WhatsApp notifications.
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                            Notification Type
                                        </label>
                                        <select
                                            value={waTemplate}
                                            onChange={(e) => setWaTemplate(e.target.value as any)}
                                            className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none"
                                        >
                                            <option value="payment_received">Payment Received Confirmation</option>
                                            <option value="china_shipped">Dispatched from China Factory</option>
                                            <option value="accra_arrived">Arrived at Accra Hub & Balance Due</option>
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                                Customer Name
                                            </label>
                                            <input
                                                type="text"
                                                value={waCustomerName}
                                                onChange={(e) => setWaCustomerName(e.target.value)}
                                                placeholder="e.g. Gabriel"
                                                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                                Phone Number
                                            </label>
                                            <input
                                                type="text"
                                                value={waCustomerPhone}
                                                onChange={(e) => setWaCustomerPhone(e.target.value)}
                                                placeholder="024XXXXXXX"
                                                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none font-mono"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                                Order Number
                                            </label>
                                            <input
                                                type="text"
                                                value={waOrderNumber}
                                                onChange={(e) => setWaOrderNumber(e.target.value)}
                                                placeholder="LI-2026..."
                                                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none font-mono"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                                Balance (GH₵)
                                            </label>
                                            <input
                                                type="text"
                                                value={waBalanceDue}
                                                onChange={(e) => setWaBalanceDue(e.target.value)}
                                                placeholder="e.g. 7.00"
                                                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none font-mono"
                                            />
                                        </div>
                                    </div>

                                    <a
                                        href={generateWhatsAppLink()}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold active:scale-95 transition-all shadow-xs"
                                    >
                                        <MessageCircle className="w-3.5 h-3.5" />
                                        <span>Open WhatsApp Chat with Message</span>
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-3 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 text-center">
                            <span>Miss London Admin Concierge • London&apos;s Imports Ghana</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
