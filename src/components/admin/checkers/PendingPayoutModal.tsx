'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle, RefreshCw } from 'lucide-react';
import type { AgentPayoutItem } from './types';
import { getNetworkBadgeStyle } from './utils';

interface PendingPayoutModalProps {
    isOpen: boolean;
    payout: AgentPayoutItem | null;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    loading: boolean;
}

export default function PendingPayoutModal({
    isOpen,
    payout,
    onClose,
    onConfirm,
    loading,
}: PendingPayoutModalProps) {
    if (!isOpen || !payout || typeof document === 'undefined') {
        return null;
    }

    return createPortal(
        <div 
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-[99999] p-4"
            onClick={onClose}
        >
            <div 
                className="w-full max-w-lg bg-white p-8 md:p-10 space-y-6 border border-slate-100 shadow-2xl max-h-[90vh] overflow-y-auto"
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
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-900 p-1"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="bg-slate-50 border border-slate-100 p-6 space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Agent:</span>
                        <span className="font-bold text-slate-950 text-sm">{payout.agent.store_name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email:</span>
                        <span className="font-mono text-xs text-slate-700">{payout.agent.email}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">MoMo Number:</span>
                        <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-wider border ${getNetworkBadgeStyle(payout.momo_network)}`}>
                                {payout.momo_network}
                            </span>
                            <span className="font-mono text-xs font-bold text-slate-900">{payout.momo_number}</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Amount To Send:</span>
                        <span className="font-mono font-bold text-lg text-emerald-700">
                            GH₵ {parseFloat(payout.amount || '0').toFixed(2)}
                        </span>
                    </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-100 p-4">
                    <p className="text-[10px] text-emerald-900 leading-relaxed font-bold uppercase tracking-wider">
                        &bull; Confirm that you have transferred GH₵ {parseFloat(payout.amount || '0').toFixed(2)} to {payout.momo_number} ({payout.momo_network}). This will mark the withdrawal as COMPLETED and send the agent an email with your Trustpilot review link.
                    </p>
                </div>

                <div className="flex flex-col gap-3 pt-2">
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-md flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {loading ? (
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
                        onClick={onClose}
                        disabled={loading}
                        className="w-full py-3 bg-white border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
