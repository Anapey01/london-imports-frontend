'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
    ShieldCheck, 
    Check, 
    AlertCircle, 
    RefreshCw, 
    Copy, 
    Phone, 
    ExternalLink 
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
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">USSD & Mobile Money Claims</h3>
                    <p className="text-[11px] text-slate-400">Claims submitted via *713*7453# or chat concierge</p>
                </div>
                <button
                    onClick={onRefresh}
                    disabled={isLoading}
                    className="p-1.5 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-md transition-colors disabled:opacity-50"
                    title="Refresh Claims"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {isLoading ? (
                <div className="py-12 text-center text-xs text-slate-400">Loading audit records...</div>
            ) : pendingClaims.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400 border border-slate-800 rounded-lg p-6 bg-slate-900/50">
                    <ShieldCheck className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                    No pending payment claims awaiting audit. All records verified.
                </div>
            ) : (
                <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
                    {pendingClaims.map((claim) => {
                        const isLoadingThis = actionLoadingId === claim.id;
                        const feedback = actionFeedback?.id === claim.id ? actionFeedback : null;

                        return (
                            <div key={claim.id} className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-white space-y-2.5">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-xs text-white">Order #{claim.order_number}</span>
                                            <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white text-slate-950">
                                                PENDING AUDIT
                                            </span>
                                        </div>
                                        <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                                            <span>Txn: <code className="text-slate-200">{claim.transaction_id}</code></span>
                                            <button
                                                onClick={() => handleCopy(claim.transaction_id, claim.id)}
                                                className="text-slate-400 hover:text-white"
                                                title="Copy Txn ID"
                                            >
                                                {copiedId === claim.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] tracking-wider uppercase text-slate-400 block font-semibold">Claimed</span>
                                        <span className="text-sm font-bold text-white">
                                            GH₵ {(claim.claimed_amount || claim.order_balance).toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-950/60 p-2 rounded border border-slate-800/80">
                                    <div>
                                        <span className="text-slate-500 block text-[9px] uppercase font-semibold">Balance Due</span>
                                        <span className="text-slate-200 font-medium">GH₵ {claim.order_balance.toFixed(2)}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 block text-[9px] uppercase font-semibold">Phone</span>
                                        <span className="text-slate-200 font-medium">{claim.customer_phone || 'None provided'}</span>
                                    </div>
                                </div>

                                {feedback && (
                                    <div className={`p-2 rounded text-[11px] ${feedback.isError ? 'bg-red-950/50 text-red-200 border border-red-800' : 'bg-slate-800 text-white'}`}>
                                        {feedback.msg}
                                    </div>
                                )}

                                <div className="flex items-center gap-2 pt-1">
                                    <input
                                        type="number"
                                        placeholder={`₵ ${(claim.claimed_amount || claim.order_balance).toFixed(2)}`}
                                        value={customAmounts[claim.id] || ''}
                                        onChange={(e) => setCustomAmounts({ ...customAmounts, [claim.id]: e.target.value })}
                                        className="w-24 px-2 py-1.5 text-xs bg-slate-950 text-white border border-slate-800 rounded focus:outline-none focus:border-white"
                                    />
                                    <button
                                        onClick={() => handleResolve(claim.id, 'approve')}
                                        disabled={isLoadingThis}
                                        className="flex-1 bg-white text-slate-950 hover:bg-slate-200 py-1.5 px-3 rounded text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                                    >
                                        <Check className="w-3.5 h-3.5" />
                                        {isLoadingThis ? 'Processing...' : 'Approve & Credit'}
                                    </button>
                                    <button
                                        onClick={() => handleResolve(claim.id, 'reject')}
                                        disabled={isLoadingThis}
                                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 py-1.5 px-3 rounded text-[11px] font-semibold transition-colors disabled:opacity-50"
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
