'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
    X, 
    RefreshCw, 
    CheckCircle2, 
    AlertCircle, 
    ShieldCheck, 
    FileText, 
    ArrowRight,
    HelpCircle,
    Copy,
    ExternalLink
} from 'lucide-react';
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
    const [mounted, setMounted] = useState(false);
    const [activeTab, setActiveTab] = useState<'auto' | 'manual'>('auto');
    const [startDate, setStartDate] = useState('2026-08-01');
    const [endDate, setEndDate] = useState('2026-09-30');
    const [isDryRun, setIsDryRun] = useState(false);
    const [pastedReferences, setPastedReferences] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [result, setResult] = useState<ScanResult | null>(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent background scrolling while modal is active
    useEffect(() => {
        if (!isOpen) return;
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [isOpen]);

    if (!isOpen || !mounted) return null;

    const handleRunScan = async (overrideDryRun?: boolean) => {
        setIsScanning(true);
        setErrorMessage('');
        setResult(null);

        const dryRunToUse = overrideDryRun !== undefined ? overrideDryRun : isDryRun;

        try {
            const res = await paymentsAPI.reconcileHubtelScan({
                start_date: startDate,
                end_date: endDate,
                references: activeTab === 'manual' ? pastedReferences : undefined,
                dry_run: dryRunToUse
            });

            if (res.data?.success && res.data?.data) {
                setResult(res.data.data);
                if (res.data.data.reconciled_count > 0 && !dryRunToUse) {
                    onSuccess();
                }
            } else {
                setErrorMessage(res.data?.message || 'Could not complete scan. Please try again.');
            }
        } catch (err: unknown) {
            const e = err as { response?: { data?: { error?: string; message?: string } } };
            const msg = e.response?.data?.error || e.response?.data?.message || 'Network error: Could not reach the payment server. Please check your internet connection and verify you are logged in.';
            setErrorMessage(msg);
        } finally {
            setIsScanning(false);
        }
    };

    const modalContent = (
        <div 
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto"
            onClick={(e) => {
                if (e.target === e.currentTarget && !isScanning) onClose();
            }}
        >
            <div 
                className="relative w-full max-w-xl bg-white border border-slate-200 shadow-2xl rounded-2xl flex flex-col max-h-[90vh] my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
                                Check &amp; Credit Hubtel Payments
                            </h2>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            Scan August &ndash; September orders to match and mark paid orders
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isScanning}
                        className="p-2 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-30"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-200 px-6 bg-white gap-4">
                    <button
                        onClick={() => { setActiveTab('auto'); setResult(null); setErrorMessage(''); }}
                        disabled={isScanning}
                        className={`py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                            activeTab === 'auto'
                                ? 'border-slate-950 text-slate-950 font-black'
                                : 'border-transparent text-slate-400 hover:text-slate-600'
                        }`}
                    >
                        1. Auto-Scan (Aug &ndash; Sept)
                    </button>
                    <button
                        onClick={() => { setActiveTab('manual'); setResult(null); setErrorMessage(''); }}
                        disabled={isScanning}
                        className={`py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                            activeTab === 'manual'
                                ? 'border-slate-950 text-slate-950 font-black'
                                : 'border-transparent text-slate-400 hover:text-slate-600'
                        }`}
                    >
                        2. Paste Hubtel Codes
                    </button>
                </div>

                {/* Body Content */}
                <div className="p-6 overflow-y-auto space-y-5 flex-1 text-slate-800">
                    {/* Error Banner */}
                    {errorMessage && (
                        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start gap-3 animate-in fade-in">
                            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <p className="font-bold">Error during reconciliation:</p>
                                <p className="text-rose-700">{errorMessage}</p>
                            </div>
                        </div>
                    )}

                    {/* Progress / Scanning State */}
                    {isScanning && (
                        <div className="p-6 bg-blue-50/70 border border-blue-100 rounded-xl text-center space-y-3 animate-pulse">
                            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
                            <div className="space-y-1">
                                <p className="text-xs font-black uppercase tracking-wider text-blue-900">
                                    Scanning Orders in Progress...
                                </p>
                                <p className="text-xs text-blue-700">
                                    Checking Hubtel payment webhooks and cross-referencing orders. Please hold on.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Scan Results View */}
                    {result && (
                        <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4 animate-in fade-in duration-300">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                    <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                                        Scan Finished ({result.period})
                                    </span>
                                </div>
                                <span className="text-xs font-mono font-bold text-slate-600">
                                    {result.orders_scanned} orders checked
                                </span>
                            </div>

                            {/* Stat Boxes */}
                            <div className="grid grid-cols-3 gap-3 text-center">
                                <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Already Paid</p>
                                    <p className="text-xl font-black text-slate-700 mt-1">{result.already_paid_count}</p>
                                </div>
                                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg shadow-sm">
                                    <p className="text-[10px] font-black uppercase tracking-wider text-emerald-700">Fixed &amp; Paid</p>
                                    <p className="text-xl font-black text-emerald-600 mt-1">{result.reconciled_count}</p>
                                </div>
                                <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Still Unpaid</p>
                                    <p className="text-xl font-black text-slate-500 mt-1">{result.still_unpaid_count}</p>
                                </div>
                            </div>

                            {/* Reconciled list */}
                            {result.reconciled_orders.length > 0 && (
                                <div className="space-y-2 pt-2">
                                    <p className="text-xs font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                        {result.reconciled_orders.length} Orders Successfully Credited:
                                    </p>
                                    <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                                        {result.reconciled_orders.map((o) => (
                                            <div key={o.order_number} className="p-2.5 bg-white border border-emerald-200 rounded-lg text-xs flex items-center justify-between shadow-xs">
                                                <div>
                                                    <span className="font-mono font-bold text-slate-900">#{o.order_number}</span>
                                                    <span className="text-slate-500 ml-2 font-medium">({o.customer})</span>
                                                </div>
                                                <span className="font-bold text-emerald-600">₵{o.amount.toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Unpaid explanation */}
                            {result.reconciled_count === 0 && (
                                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-lg text-xs text-amber-900 space-y-2">
                                    <p className="font-bold">
                                        No automatic webhook matches found for remaining unpaid orders.
                                    </p>
                                    <p className="text-amber-800 leading-relaxed">
                                        If the customer paid on Hubtel but the webhook didn&apos;t arrive, you can paste their <strong>Hubtel Transaction ID</strong>, <strong>order number</strong>, or <strong>MoMo reference</strong> into Tab 2 to mark it as Paid right away.
                                    </p>
                                    <button
                                        onClick={() => {
                                            setActiveTab('manual');
                                            setResult(null);
                                        }}
                                        className="inline-flex items-center gap-1.5 font-bold text-amber-900 underline hover:text-amber-950 cursor-pointer pt-1"
                                    >
                                        Go to Tab 2 (Paste Hubtel Codes) &rarr;
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab 1: Automatic Date Range Scan */}
                    {activeTab === 'auto' && !isScanning && (
                        <div className="space-y-4">
                            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-600 leading-relaxed">
                                <p className="font-bold text-slate-800 mb-1">How this works:</p>
                                The system scans all unpaid orders created between <strong>August 1, 2026</strong> and <strong>September 30, 2026</strong>. Any order with a matching Hubtel payment or webhook notification will automatically be marked as <strong>Paid</strong> and assigned to the active shipping batch.
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full p-3 bg-white border border-slate-200 rounded-lg text-xs font-mono outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full p-3 bg-white border border-slate-200 rounded-lg text-xs font-mono outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-1">
                                <input
                                    type="checkbox"
                                    id="dryRunCheckbox"
                                    checked={isDryRun}
                                    onChange={(e) => setIsDryRun(e.target.checked)}
                                    className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                                />
                                <label htmlFor="dryRunCheckbox" className="text-xs text-slate-600 cursor-pointer select-none">
                                    Test first without changing order statuses (Dry Run)
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Tab 2: Manual Reference Paste */}
                    {activeTab === 'manual' && !isScanning && (
                        <div className="space-y-4">
                            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-600 leading-relaxed">
                                <p className="font-bold text-slate-800 mb-1">Paste Hubtel Statements / Codes:</p>
                                Copy any Transaction IDs, Client References, or Order Numbers from your Hubtel Merchant portal, MoMo statement, or SMS, and paste them here (separated by spaces, commas, or new lines).
                            </div>

                            <textarea
                                value={pastedReferences}
                                onChange={(e) => setPastedReferences(e.target.value)}
                                placeholder="Paste Hubtel transaction IDs or order numbers here...&#10;e.g.&#10;LI-20260904-26300&#10;hubtel-txn-998877&#10;LI-20260815-12345"
                                rows={6}
                                className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-xs font-mono outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 resize-none"
                            />

                            <div className="flex items-center gap-2 pt-1">
                                <input
                                    type="checkbox"
                                    id="manualDryRunCheckbox"
                                    checked={isDryRun}
                                    onChange={(e) => setIsDryRun(e.target.checked)}
                                    className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                                />
                                <label htmlFor="manualDryRunCheckbox" className="text-xs text-slate-600 cursor-pointer select-none">
                                    Test first without changing order statuses (Dry Run)
                                </label>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Buttons */}
                <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                    <button
                        onClick={onClose}
                        disabled={isScanning}
                        className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                    >
                        Close
                    </button>

                    <button
                        onClick={() => handleRunScan()}
                        disabled={isScanning || (activeTab === 'manual' && !pastedReferences.trim())}
                        className="px-6 py-3 bg-slate-950 text-white hover:bg-emerald-600 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {isScanning ? (
                            <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                <span>Scanning...</span>
                            </>
                        ) : (
                            <>
                                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                <span>
                                    {activeTab === 'auto' 
                                        ? (isDryRun ? 'Test Scan (Dry Run)' : 'Run Payment Scan Now')
                                        : (isDryRun ? 'Test Reconcile (Dry Run)' : 'Reconcile & Mark as Paid')
                                    }
                                </span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
