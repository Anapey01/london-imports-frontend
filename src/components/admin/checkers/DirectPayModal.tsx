'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle, RefreshCw } from 'lucide-react';
import type { AgentListItem } from './types';
import { getNetworkBadgeStyle } from './utils';

interface DirectPayModalProps {
    isOpen: boolean;
    agent: AgentListItem | null;
    onClose: () => void;
    onConfirm: (amount: number, notes: string) => Promise<void>;
    loading: boolean;
}

export default function DirectPayModal({
    isOpen,
    agent,
    onClose,
    onConfirm,
    loading,
}: DirectPayModalProps) {
    const [amount, setAmount] = useState<string>('');
    const [notes, setNotes] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (agent) {
            const bal = parseFloat(agent.wallet_balance || '0');
            setAmount(bal > 0 ? bal.toFixed(2) : '1.00');
            setNotes(`Direct payout to ${agent.store_name} via ${agent.momo_network} (${agent.momo_number})`);
            setError(null);
        }
    }, [agent]);

    if (!isOpen || !agent || typeof document === 'undefined') {
        return null;
    }

    const handleConfirm = () => {
        const amountNum = parseFloat(amount);
        if (isNaN(amountNum) || amountNum <= 0) {
            setError('Please enter a valid payment amount greater than GH₵ 0.00.');
            return;
        }
        setError(null);
        onConfirm(amountNum, notes);
    };

    return createPortal(
        <div 
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-[99999] p-4"
            onClick={onClose}
        >
            <div 
                className="w-full max-w-lg bg-white p-8 md:p-10 space-y-6 border border-slate-100 shadow-2xl max-h-[90vh] overflow-y-auto"
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
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-900 p-1"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Agent Summary Card */}
                <div className="bg-slate-50 border border-slate-100 p-6 space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Agent:</span>
                        <span className="font-bold text-slate-950 text-sm">{agent.store_name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email:</span>
                        <span className="font-mono text-xs text-slate-700">{agent.email}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">MoMo Account:</span>
                        <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-wider border ${getNetworkBadgeStyle(agent.momo_network)}`}>
                                {agent.momo_network}
                            </span>
                            <span className="font-mono text-xs font-bold text-slate-900">{agent.momo_number}</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Current Wallet Balance:</span>
                        <span className="font-mono font-bold text-sm text-emerald-700">
                            GH₵ {parseFloat(agent.wallet_balance || '0').toFixed(2)}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Units Sold:</span>
                        <span className="font-bold text-xs text-slate-900">
                            {agent.total_checkers_sold} units (GH₵ {parseFloat(agent.total_sales_value || '0').toFixed(2)})
                        </span>
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
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
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
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full px-4 py-3 border border-slate-200 text-xs font-mono text-slate-900 outline-none focus:border-slate-900"
                            placeholder="e.g. Sent via MTN MoMo ref: 123456"
                        />
                    </div>

                    {error && (
                        <p className="text-[10px] font-bold uppercase tracking-wider text-red-600">{error}</p>
                    )}
                </div>

                {/* Notice */}
                <div className="bg-emerald-50 border border-emerald-100 p-4">
                    <p className="text-[10px] text-emerald-900 leading-relaxed font-bold uppercase tracking-wider">
                        &bull; Clicking below records this payment as completed, debits the wallet balance, and immediately emails the agent with payment confirmation and your Trustpilot review link.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 pt-2">
                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-md flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {loading ? (
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
