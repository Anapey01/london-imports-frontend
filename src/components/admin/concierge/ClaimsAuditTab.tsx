'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
    ShieldCheck, 
    Check, 
    RefreshCw, 
    Copy 
} from 'lucide-react';
import { adminAPI } from '@/lib/api';

export interface USSDClaim {
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

interface ClaimsAuditTabProps {
    claims: USSDClaim[];
    isLoading: boolean;
    onRefresh: () => void;
}

export default function ClaimsAuditTab({ claims, isLoading, onRefresh }: ClaimsAuditTabProps) {
    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
    const [actionFeedback, setActionFeedback] = useState<{ id: string; msg: string; isError?: boolean } | null>(null);
    const [customAmounts, setCustomAmounts] = useState<Record<string, string>>({});
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const pendingClaims = claims.filter(c => c.status === 'PENDING_AUDIT');

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleResolve = async (claimId: string, action: 'approve' | 'reject') => {
        setActionLoadingId(claimId);
        setActionFeedback(null);
        try {
            const customAmt = customAmounts[claimId] ? parseFloat(customAmounts[claimId]) : undefined;
            const res = await adminAPI.resolveUSSDClaim({ claim_id: claimId, action, amount: customAmt });
            if (res.data?.success) {
                setActionFeedback({ id: claimId, msg: res.data.message || 'Updated' });
                onRefresh();
            } else {
                setActionFeedback({ id: claimId, msg: res.data?.error || 'Failed', isError: true });
            }
        } catch (err: any) {
            setActionFeedback({ id: claimId, msg: err.response?.data?.error || 'Failed to resolve claim', isError: true });
        } finally {
            setActionLoadingId(null);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                        USSD & Mobile Money Payment Claims
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Claims submitted via Hubtel *713*7453# or concierge customer attendant
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onRefresh}
                    disabled={isLoading}
                    className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg transition-colors shadow-2xs disabled:opacity-50"
                    title="Refresh Claims"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {isLoading ? (
                <div className="py-16 text-center text-xs text-slate-400">Loading audit records...</div>
            ) : pendingClaims.length === 0 ? (
                <div className="py-16 text-center text-xs text-slate-400 border border-slate-200 dark:border-slate-800 rounded-xl p-8 bg-white dark:bg-slate-900 shadow-2xs">
                    <ShieldCheck className="w-8 h-8 text-slate-400 dark:text-slate-600 mx-auto mb-2" />
                    No pending payment claims awaiting audit. All records verified.
                </div>
            ) : (
                <div className="space-y-3">
                    {pendingClaims.map((claim) => {
                        const isLoadingThis = actionLoadingId === claim.id;
                        const feedback = actionFeedback?.id === claim.id ? actionFeedback : null;

                        return (
                            <div 
                                key={claim.id} 
                                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors space-y-3"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-sm text-slate-900 dark:text-white">
                                                Order #{claim.order_number}
                                            </span>
                                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                                PENDING AUDIT
                                            </span>
                                        </div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                                            <span>Txn ID: <code className="font-mono text-slate-800 dark:text-slate-200">{claim.transaction_id}</code></span>
                                            <button
                                                type="button"
                                                onClick={() => handleCopy(claim.transaction_id, claim.id)}
                                                className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-0.5"
                                                title="Copy Transaction ID"
                                            >
                                                {copiedId === claim.id ? <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="text-left sm:text-right">
                                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
                                            Claimed Amount
                                        </span>
                                        <span className="text-base font-bold font-mono text-slate-900 dark:text-white">
                                            GH₵ {(claim.claimed_amount || claim.order_balance).toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-slate-950/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800/80">
                                    <div>
                                        <span className="text-slate-500 block text-[10px] uppercase font-mono tracking-wider">
                                            Balance Due
                                        </span>
                                        <span className="font-mono font-semibold text-slate-900 dark:text-white">
                                            GH₵ {claim.order_balance.toFixed(2)}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 block text-[10px] uppercase font-mono tracking-wider">
                                            Customer Phone
                                        </span>
                                        <span className="font-mono font-semibold text-slate-900 dark:text-white">
                                            {claim.customer_phone || 'None provided'}
                                        </span>
                                    </div>
                                </div>

                                {feedback && (
                                    <div className={`p-3 rounded-lg text-xs border ${
                                        feedback.isError 
                                            ? 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-900' 
                                            : 'bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                                    }`}>
                                        {feedback.msg}
                                    </div>
                                )}

                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                                    <input
                                        type="number"
                                        placeholder={`₵ ${(claim.claimed_amount || claim.order_balance).toFixed(2)}`}
                                        value={customAmounts[claim.id] || ''}
                                        onChange={(e) => setCustomAmounts({ ...customAmounts, [claim.id]: e.target.value })}
                                        className="w-full sm:w-32 px-3 py-1.5 text-xs bg-white dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-lg font-mono focus:outline-none focus:border-slate-900 dark:focus:border-slate-100"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleResolve(claim.id, 'approve')}
                                        disabled={isLoadingThis}
                                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-950 text-white dark:bg-white dark:text-slate-950 text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-2xs disabled:opacity-50"
                                    >
                                        <Check className="w-3.5 h-3.5" />
                                        <span>{isLoadingThis ? 'Verifying...' : 'Approve & Credit'}</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleResolve(claim.id, 'reject')}
                                        disabled={isLoadingThis}
                                        className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs font-medium transition-colors shadow-2xs disabled:opacity-50"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
