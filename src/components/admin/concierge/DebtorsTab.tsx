'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
    Search, 
    MessageSquare, 
    ExternalLink, 
    Copy, 
    Check, 
    CreditCard 
} from 'lucide-react';
import { 
    AdminOrderData, 
    computeDebtorMetrics, 
    generateWhatsAppMessage, 
    formatWhatsAppUrl 
} from '@/lib/concierge-utils';

interface DebtorsTabProps {
    orders: AdminOrderData[];
    isLoading: boolean;
    onSelectForWhatsApp?: (customer: { name: string; phone: string; orderNumber: string; balanceDue: number }) => void;
}

export default function DebtorsTab({ orders, isLoading, onSelectForWhatsApp }: DebtorsTabProps) {
    const [debtorFilter, setDebtorFilter] = useState<'all' | 'partial' | 'pending'>('all');
    const [debtorSearch, setDebtorSearch] = useState('');
    const [copiedLabel, setCopiedLabel] = useState<string | null>(null);

    const { allDebtors, partiallyPaid, completelyUnpaid, totalOutstanding } = useMemo(
        () => computeDebtorMetrics(orders),
        [orders]
    );

    const filteredDebtors = useMemo(() => {
        let base = allDebtors;
        if (debtorFilter === 'partial') base = partiallyPaid;
        if (debtorFilter === 'pending') base = completelyUnpaid;

        if (!debtorSearch.trim()) return base;
        const q = debtorSearch.toLowerCase();
        return base.filter(
            d => d.customerName.toLowerCase().includes(q) ||
                 d.customerPhone.includes(q) ||
                 d.orderNumber.toLowerCase().includes(q)
        );
    }, [allDebtors, partiallyPaid, completelyUnpaid, debtorFilter, debtorSearch]);

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedLabel(id);
        setTimeout(() => setCopiedLabel(null), 2000);
    };

    return (
        <div className="space-y-4">
            {/* Header KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
                        Total Outstanding Debt
                    </span>
                    <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                            GH₵ {totalOutstanding.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <span className="text-xs text-slate-400">
                            ({allDebtors.length} orders pending)
                        </span>
                    </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
                        Partially Paid Accounts
                    </span>
                    <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                            {partiallyPaid.length}
                        </span>
                        <span className="text-xs text-slate-400">
                            clients ({completelyUnpaid.length} totally unpaid)
                        </span>
                    </div>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search debtor name, phone, or order number..."
                        value={debtorSearch}
                        onChange={(e) => setDebtorSearch(e.target.value)}
                        className="w-full text-xs pl-8 pr-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-slate-900 dark:focus:border-slate-100 font-mono shadow-2xs"
                    />
                </div>

                <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg shrink-0">
                    <button
                        type="button"
                        onClick={() => setDebtorFilter('all')}
                        className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                            debtorFilter === 'all' 
                                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold' 
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'
                        }`}
                    >
                        All ({allDebtors.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setDebtorFilter('partial')}
                        className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                            debtorFilter === 'partial' 
                                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold' 
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'
                        }`}
                    >
                        Partials ({partiallyPaid.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setDebtorFilter('pending')}
                        className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                            debtorFilter === 'pending' 
                                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold' 
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'
                        }`}
                    >
                        Unpaid ({completelyUnpaid.length})
                    </button>
                </div>
            </div>

            {/* Debtor Records List */}
            {isLoading ? (
                <div className="py-16 text-center text-xs text-slate-400">Loading debtors list...</div>
            ) : filteredDebtors.length === 0 ? (
                <div className="py-16 text-center text-xs text-slate-400 border border-slate-200 dark:border-slate-800 rounded-xl p-8 bg-white dark:bg-slate-900 shadow-2xs">
                    No debtors found matching your criteria.
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredDebtors.map((debtor) => {
                        const waMsg = generateWhatsAppMessage('balance_reminder', {
                            customerName: debtor.customerName,
                            orderNumber: debtor.orderNumber,
                            balanceDue: debtor.balanceDue,
                            amountPaid: debtor.amountPaid,
                            total: debtor.total,
                        });
                        const waUrl = formatWhatsAppUrl(debtor.customerPhone, waMsg);

                        return (
                            <div 
                                key={debtor.orderNumber} 
                                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors space-y-3"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-sm text-slate-900 dark:text-white">
                                                {debtor.customerName}
                                            </span>
                                            <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                                                #{debtor.orderNumber}
                                            </span>
                                        </div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                                            <span className="font-mono">{debtor.customerPhone || 'No phone on file'}</span>
                                            <span>•</span>
                                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                                {debtor.state}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="text-left sm:text-right">
                                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
                                            Remaining Balance
                                        </span>
                                        <span className="text-base font-bold font-mono text-slate-900 dark:text-white">
                                            GH₵ {debtor.balanceDue.toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-xs px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80">
                                    <span className="text-slate-600 dark:text-slate-400">
                                        Total: <strong className="font-mono text-slate-900 dark:text-white">GH₵ {debtor.total.toFixed(2)}</strong>
                                    </span>
                                    <span className="text-slate-600 dark:text-slate-400">
                                        Paid: <strong className="font-mono text-slate-900 dark:text-white">GH₵ {debtor.amountPaid.toFixed(2)}</strong>
                                    </span>
                                </div>

                                <div className="flex items-center justify-end gap-2 pt-1">
                                    {debtor.customerPhone ? (
                                        <a
                                            href={waUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium transition-colors shadow-2xs"
                                        >
                                            <MessageSquare className="w-3.5 h-3.5" />
                                            <span>WhatsApp Reminder</span>
                                        </a>
                                    ) : null}

                                    <button
                                        type="button"
                                        onClick={() => handleCopy(waMsg, debtor.orderNumber)}
                                        className="inline-flex items-center justify-center p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs transition-colors shadow-2xs"
                                        title="Copy Reminder Notice"
                                    >
                                        {copiedLabel === debtor.orderNumber ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                    </button>

                                    <Link
                                        href={`/dashboard/admin/orders?search=${debtor.orderNumber}`}
                                        className="inline-flex items-center justify-center p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs transition-colors shadow-2xs"
                                        title="View in Admin Orders"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
