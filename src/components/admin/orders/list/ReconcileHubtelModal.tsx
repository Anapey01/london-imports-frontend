'use client';

import React, { useState } from 'react';
import { X, RefreshCw, CheckCircle2, AlertCircle, ShieldCheck, FileText, ArrowRight } from 'lucide-react';
import { paymentsAPI } from '@/lib/api';

interface ReconcileHubtelModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

interface ReconciledOrder {
    order_number: string;
    customer: string;
    amount: number;
    source: string;
    new_state?: string;
}

interface UnpaidOrder {
    order_number: string;
    customer: string;
    total: number;
    created_at: string;
}

interface ScanResult {
    period: string;
    orders_scanned: number;
    already_paid_count: number;
    reconciled_count: number;
    still_unpaid_count: number;
    reconciled_orders: ReconciledOrder[];
    still_unpaid_orders: UnpaidOrder[];
    errors: Array<{ order_number: string; error: string }>;
}

export default function ReconcileHubtelModal({ isOpen, onClose, onSuccess }: ReconcileHubtelModalProps) {
    const [activeTab, setActiveTab] = useState<'auto' | 'manual'>('auto');
    const [startDate, setStartDate] = useState('2026-08-01');
    const [endDate, setEndDate] = useState('2026-09-30');
    const [pastedReferences, setPastedReferences] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [result, setResult] = useState<ScanResult | null>(null);
    const [errorMessage, setErrorMessage] = useState('');

    if (!isOpen) return null;

    const handleRunScan = async (dryRun = false) => {
        setIsScanning(true);
        setErrorMessage('');
        setResult(null);

        try {
            const res = await paymentsAPI.reconcileHubtelScan({
                start_date: startDate,
                end_date: endDate,
                references: activeTab === 'manual' ? pastedReferences : undefined,
                dry_run: dryRun
            });

            if (res.data?.success && res.data?.data) {
                setResult(res.data.data);
                if (res.data.data.reconciled_count > 0 && !dryRun) {
                    onSuccess();
                }
            } else {
                setErrorMessage(res.data?.message || 'Could not complete scan.');
            }
        } catch (err: unknown) {
            const e = err as { response?: { data?: { error?: string; message?: string } } };
            setErrorMessage(e.response?.data?.error || e.response?.data?.message || 'Network error occurred while connecting to server.');
        } finally {
            setIsScanning(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl bg-white border border-slate-100 shadow-2xl rounded-none flex flex-col max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-slate-900">
                                Check Uncredited Payments
                            </h2>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            Find orders from August to September paid on Hubtel and mark them as Paid
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-900 transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-100 px-8 bg-white">
                    <button
                        onClick={() => { setActiveTab('auto'); setResult(null); setErrorMessage(''); }}
                        className={`py-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all mr-6 ${
                            activeTab === 'auto'
                                ? 'border-slate-950 text-slate-950'
                                : 'border-transparent text-slate-400 hover:text-slate-600'
                        }`}
                    >
                        1. Automatic Scan (Aug - Sept)
                    </button>
                    <button
                        onClick={() => { setActiveTab('manual'); setResult(null); setErrorMessage(''); }}
                        className={`py-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all ${
                            activeTab === 'manual'
                                ? 'border-slate-950 text-slate-950'
                                : 'border-transparent text-slate-400 hover:text-slate-600'
                        }`}
                    >
                        2. Paste Hubtel Codes / Statement
                    </button>
                </div>

                {/* Body Content */}
                <div className="p-8 overflow-y-auto space-y-6 flex-1">
                    {errorMessage && (
                        <div className="p-4 bg-red-50 border border-red-100 text-red-700 text-xs flex items-center gap-3">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    {activeTab === 'auto' ? (
                        <div className="space-y-4">
                            <div className="p-4 bg-slate-50 border border-slate-100 text-xs text-slate-600 leading-relaxed">
                                <strong>How this works:</strong> The system will scan all unpaid orders created between <strong>August 1, 2026</strong> and <strong>September 30, 2026</strong>. Any order that has a matching Hubtel payment record or webhook notification will automatically be moved to <strong>Paid</strong> and added to the current shipping batch.
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full p-3 bg-white border border-slate-200 text-xs font-mono outline-none focus:border-slate-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full p-3 bg-white border border-slate-200 text-xs font-mono outline-none focus:border-slate-900"
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="p-4 bg-slate-50 border border-slate-100 text-xs text-slate-600 leading-relaxed">
                                <strong>Paste payment references:</strong> Copy transaction IDs, client references, or order numbers from your Hubtel Merchant Portal or Hubtel SMS notifications and paste them below (separated by commas or new lines).
                            </div>

                            <textarea
                                value={pastedReferences}
                                onChange={(e) => setPastedReferences(e.target.value)}
                                placeholder="Paste Hubtel references or order numbers here...&#10;e.g.&#10;LI-20260815-12345&#10;HUBTEL-TXN-98765432&#10;20260901-1725..."
                                rows={5}
                                className="w-full p-3 bg-white border border-slate-200 text-xs font-mono outline-none focus:border-slate-900 resize-none"
                            />
                        </div>
                    )}

                    {/* Results Box */}
                    {result && (
                        <div className="p-6 bg-slate-50 border border-slate-100 space-y-4 animate-in fade-in duration-300">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                                        Scan Finished
                                    </span>
                                </div>
                                <span className="text-[10px] font-mono text-slate-400">
                                    {result.orders_scanned} orders checked
                                </span>
                            </div>

                            <div className="grid grid-cols-3 gap-3 text-center">
                                <div className="p-3 bg-white border border-slate-100">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Already Paid</p>
                                    <p className="text-xl font-bold text-slate-700 mt-1">{result.already_paid_count}</p>
                                </div>
                                <div className="p-3 bg-emerald-50 border border-emerald-100">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Fixed & Paid</p>
                                    <p className="text-xl font-bold text-emerald-600 mt-1">{result.reconciled_count}</p>
                                </div>
                                <div className="p-3 bg-white border border-slate-100">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Still Unpaid</p>
                                    <p className="text-xl font-bold text-slate-500 mt-1">{result.still_unpaid_count}</p>
                                </div>
                            </div>

                            {result.reconciled_orders.length > 0 && (
                                <div className="space-y-2 pt-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-800">
                                        Orders Successfully Credited:
                                    </p>
                                    <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
                                        {result.reconciled_orders.map((o) => (
                                            <div key={o.order_number} className="p-2 bg-white border border-emerald-100 text-xs flex items-center justify-between">
                                                <div>
                                                    <span className="font-mono font-bold text-slate-900">{o.order_number}</span>
                                                    <span className="text-slate-500 ml-2">({o.customer})</span>
                                                </div>
                                                <span className="font-bold text-emerald-600">₵{o.amount.toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {result.reconciled_count === 0 && result.still_unpaid_count > 0 && (
                                <p className="text-xs text-slate-500 italic">
                                    No new matching paid orders were found in this timeframe. If you have specific Hubtel transaction IDs, switch to tab 2 to paste and credit them directly.
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer Buttons */}
                <div className="px-8 py-5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 text-xs font-black uppercase tracking-wider text-slate-500 hover:text-slate-800 transition-colors"
                    >
                        Close
                    </button>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => handleRunScan(false)}
                            disabled={isScanning}
                            className="px-8 py-3.5 bg-slate-950 text-white hover:bg-slate-800 text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            {isScanning ? (
                                <>
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                    <span>Scanning Orders...</span>
                                </>
                            ) : (
                                <>
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>Run Payment Scan Now</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
