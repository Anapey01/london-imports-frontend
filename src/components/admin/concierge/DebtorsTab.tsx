'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
    Search, 
    MessageCircle, 
    Phone, 
    ExternalLink, 
    Copy, 
    Check, 
    AlertCircle 
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
            <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg text-white">
                    <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">Total Outstanding Debt</p>
                    <p className="text-xl font-bold tracking-tight text-white mt-1">
                        GH₵ {totalOutstanding.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{allDebtors.length} orders pending balance</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg text-white">
                    <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">Partially Paid</p>
                    <p className="text-xl font-bold tracking-tight text-white mt-1">
                        {partiallyPaid.length} Clients
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{completelyUnpaid.length} totally unpaid</p>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search name, phone, or order #..."
                        value={debtorSearch}
                        onChange={(e) => setDebtorSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-900 text-white placeholder-slate-400 border border-slate-800 rounded-md focus:outline-none focus:border-white"
                    />
                </div>
                <div className="flex gap-1 bg-slate-900 border border-slate-800 p-0.5 rounded-md self-start">
                    <button
                        onClick={() => setDebtorFilter('all')}
                        className={`px-2.5 py-1 text-[11px] font-semibold rounded ${debtorFilter === 'all' ? 'bg-white text-slate-950' : 'text-slate-400 hover:text-white'}`}
                    >
                        All ({allDebtors.length})
                    </button>
                    <button
                        onClick={() => setDebtorFilter('partial')}
                        className={`px-2.5 py-1 text-[11px] font-semibold rounded ${debtorFilter === 'partial' ? 'bg-white text-slate-950' : 'text-slate-400 hover:text-white'}`}
                    >
                        Partials ({partiallyPaid.length})
                    </button>
                    <button
                        onClick={() => setDebtorFilter('pending')}
                        className={`px-2.5 py-1 text-[11px] font-semibold rounded ${debtorFilter === 'pending' ? 'bg-white text-slate-950' : 'text-slate-400 hover:text-white'}`}
                    >
                        Unpaid ({completelyUnpaid.length})
                    </button>
                </div>
            </div>

            {/* Debtor List */}
            {isLoading ? (
                <div className="py-12 text-center text-xs text-slate-400">Loading debtors list...</div>
            ) : filteredDebtors.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400 border border-slate-800 rounded-lg p-6 bg-slate-900/50">
                    No debtors found matching your criteria.
                </div>
            ) : (
                <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
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
                            <div key={debtor.orderNumber} className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-white space-y-2">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-xs text-white">{debtor.customerName}</span>
                                            <span className="text-[10px] text-slate-400">#{debtor.orderNumber}</span>
                                        </div>
                                        <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                                            <span>{debtor.customerPhone || 'No phone'}</span>
                                            <span>•</span>
                                            <span className="uppercase text-[9px] tracking-wider text-slate-300 font-semibold">{debtor.state}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] tracking-wider uppercase text-slate-400 block font-semibold">Remaining</span>
                                        <span className="text-sm font-bold text-white">GH₵ {debtor.balanceDue.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-[11px] bg-slate-950/60 px-2.5 py-1.5 rounded border border-slate-800/80">
                                    <span className="text-slate-400">Total: GH₵ {debtor.total.toFixed(2)}</span>
                                    <span className="text-slate-400">Paid: GH₵ {debtor.amountPaid.toFixed(2)}</span>
                                </div>

                                <div className="flex items-center gap-1.5 pt-1">
                                    <a
                                        href={waUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 bg-white text-slate-950 hover:bg-slate-200 py-1.5 px-2 rounded text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
                                    >
                                        <MessageCircle className="w-3.5 h-3.5" />
                                        WhatsApp Reminder
                                    </a>
                                    <button
                                        onClick={() => handleCopy(waMsg, debtor.orderNumber)}
                                        className="bg-slate-800 hover:bg-slate-700 text-white px-2.5 py-1.5 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors"
                                        title="Copy Reminder Template"
                                    >
                                        {copiedLabel === debtor.orderNumber ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                    </button>
                                    <Link
                                        href={`/dashboard/admin/orders?search=${debtor.orderNumber}`}
                                        className="bg-slate-800 hover:bg-slate-700 text-white px-2.5 py-1.5 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors"
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
