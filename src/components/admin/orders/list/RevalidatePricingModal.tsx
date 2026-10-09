'use client';

import React, { useState } from 'react';
import { adminAPI } from '@/lib/api';
import { RefreshCw, AlertTriangle, CheckCircle2, X } from 'lucide-react';

interface RevalidatePricingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

interface RevalidationResult {
    mode: 'apply' | 'preview';
    scanned_orders: number;
    orders_requiring_adjustment: number;
    total_old_revenue: number;
    total_new_revenue: number;
    total_balance_generated: number;
    orders: Array<{
        order_number: string;
        customer: string;
        state: string;
        old_total: number;
        new_total: number;
        amount_paid: number;
        balance_due: number;
        items: Array<{
            product_name: string;
            qty: number;
            old_unit: number;
            new_unit: number;
            old_total: number;
            new_total: number;
        }>;
    }>;
    message: string;
}

export default function RevalidatePricingModal({ isOpen, onClose, onSuccess }: RevalidatePricingModalProps) {
    const [fromDate, setFromDate] = useState('2026-08-01');
    const [toDate, setToDate] = useState('2026-10-31');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<RevalidationResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleRun = async (apply: boolean) => {
        setLoading(true);
        setError(null);
        try {
            const res = await adminAPI.revalidateOrdersPricing({
                apply,
                from_date: fromDate,
                to_date: toDate
            });
            setResult(res.data);
            if (apply) {
                onSuccess();
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to revalidate order prices.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                            <RefreshCw className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-base font-serif font-bold text-slate-950 dark:text-white tracking-tight">
                                Revalidate Order Prices
                            </h2>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                                Match August - October orders against current catalog prices
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Controls */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-4 bg-slate-50/50 dark:bg-slate-800/20">
                    <div>
                        <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">
                            From Date
                        </label>
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-slate-900 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">
                            To Date
                        </label>
                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-slate-900 dark:text-white"
                        />
                    </div>
                </div>

                {/* Body Content */}
                <div className="p-6 overflow-y-auto flex-1 space-y-4">
                    {error && (
                        <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-red-600 text-xs font-mono">
                            {error}
                        </div>
                    )}

                    {!result && (
                        <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-amber-800 dark:text-amber-300 text-xs space-y-2">
                            <div className="flex items-center gap-2 font-bold uppercase text-[10px] tracking-wider">
                                <AlertTriangle className="w-4 h-4 text-amber-600" />
                                <span>Zero-Loss Historical Audit Trail</span>
                            </div>
                            <p className="text-[11px] leading-relaxed">
                                Original prices are kept intact under <code>original_total</code> and <code>original_unit_price</code>.
                                Each customer will see their actual amount paid untouched, with any price difference updated into <strong>Amount Left to Pay (balance due)</strong>.
                            </p>
                        </div>
                    )}

                    {result && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-3">
                                <div className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                    <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-mono">Orders Modified</span>
                                    <span className="text-lg font-bold text-slate-900 dark:text-white font-mono">{result.orders_requiring_adjustment}</span>
                                </div>
                                <div className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                    <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-mono">New Revenue</span>
                                    <span className="text-lg font-bold text-emerald-600 font-mono">₵{result.total_new_revenue.toLocaleString()}</span>
                                </div>
                                <div className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                    <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-mono">Balance to Collect</span>
                                    <span className="text-lg font-bold text-amber-600 font-mono">₵{result.total_balance_generated.toLocaleString()}</span>
                                </div>
                            </div>

                            {result.orders.length > 0 ? (
                                <div className="border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 max-h-60 overflow-y-auto">
                                    {result.orders.map((o) => (
                                        <div key={o.order_number} className="p-3 text-xs space-y-1">
                                            <div className="flex justify-between items-center font-bold">
                                                <span className="text-slate-900 dark:text-white">#{o.order_number} ({o.customer})</span>
                                                <span className="text-amber-600 font-mono">Due: ₵{o.balance_due.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                                                <span>Total: ₵{o.old_total.toLocaleString()} → ₵{o.new_total.toLocaleString()}</span>
                                                <span>Paid: ₵{o.amount_paid.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-6 text-center text-xs text-slate-400 font-mono">
                                    All scanned orders in this date range already match current catalog prices!
                                </div>
                            )}

                            {result.mode === 'apply' && (
                                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                                    <span>Successfully applied! Database and frontend caches are updated.</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 bg-slate-50/50 dark:bg-slate-800/20">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                    >
                        Close
                    </button>
                    <button
                        onClick={() => handleRun(false)}
                        disabled={loading}
                        className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-900 dark:border-slate-600 text-slate-900 dark:text-white text-xs font-bold uppercase tracking-wider hover:bg-slate-100 transition-all disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : 'Run Simulation Preview'}
                    </button>
                    <button
                        onClick={() => handleRun(true)}
                        disabled={loading || Boolean(result && result.orders_requiring_adjustment === 0)}
                        className="px-6 py-2.5 bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-emerald-700 transition-all disabled:opacity-50 shadow-sm"
                    >
                        {loading ? 'Applying...' : 'Apply Price Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}
