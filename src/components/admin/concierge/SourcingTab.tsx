'use client';

import React, { useState, useMemo } from 'react';
import { 
    Package, 
    Copy, 
    Check, 
    ExternalLink, 
    Search 
} from 'lucide-react';
import { 
    AdminOrderData, 
    consolidateSourcingList, 
    SourcingItem 
} from '@/lib/concierge-utils';

interface SourcingTabProps {
    orders: AdminOrderData[];
    isLoading: boolean;
}

export default function SourcingTab({ orders, isLoading }: SourcingTabProps) {
    const [copied, setCopied] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const { items: allItems, totalUnits } = useMemo(
        () => consolidateSourcingList(orders),
        [orders]
    );

    const filteredItems = useMemo(() => {
        if (!searchQuery.trim()) return allItems;
        const q = searchQuery.toLowerCase();
        return allItems.filter(
            item => item.name.toLowerCase().includes(q) || item.variant.toLowerCase().includes(q)
        );
    }, [allItems, searchQuery]);

    const handleCopyList = () => {
        const text = allItems
            .map((item, idx) => `${idx + 1}. ${item.name} (${item.variant}) - Qty: ${item.totalQuantity} units [Orders: ${item.orderNumbers.join(', ')}]`)
            .join('\n');
        
        navigator.clipboard.writeText(`LONDON'S IMPORTS - CHINA PROCUREMENT LIST\nTotal Items: ${allItems.length} | Total Units: ${totalUnits}\n\n${text}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-4">
            {/* KPI Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
                        Total Units to Procure
                    </span>
                    <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                            {totalUnits}
                        </span>
                        <span className="text-xs text-slate-400">
                            units across {allItems.length} products
                        </span>
                    </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs flex items-center justify-between">
                    <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
                            Procurement Manifest
                        </span>
                        <p className="text-xs text-slate-400 mt-1">
                            Export factory batch list for 1688 / freight agents
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleCopyList}
                        disabled={allItems.length === 0}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium transition-colors shadow-2xs disabled:opacity-50"
                    >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'Copied' : 'Copy Sheet'}</span>
                    </button>
                </div>
            </div>

            {/* Search Input */}
            <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search sourcing product or variant..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-xs pl-8 pr-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-slate-900 dark:focus:border-slate-100 font-mono shadow-2xs"
                />
            </div>

            {/* Sourcing Item Rows */}
            {isLoading ? (
                <div className="py-16 text-center text-xs text-slate-400">Aggregating China procurement items...</div>
            ) : filteredItems.length === 0 ? (
                <div className="py-16 text-center text-xs text-slate-400 border border-slate-200 dark:border-slate-800 rounded-xl p-8 bg-white dark:bg-slate-900 shadow-2xs">
                    No sourcing items recorded for current orders.
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredItems.map((item, idx) => {
                        const search1688Url = item.supplierUrl || `https://s.1688.com/youyuan/index.htm?tab=all&q=${encodeURIComponent(item.name)}`;
                        const searchGoogleUrl = `https://www.google.com/search?q=${encodeURIComponent(item.name + ' wholesale china 1688')}`;

                        return (
                            <div 
                                key={`${item.name}-${item.variant}-${idx}`} 
                                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors space-y-3"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                                    <div className="flex-1">
                                        <p className="font-semibold text-sm text-slate-900 dark:text-white leading-snug">
                                            {item.name}
                                        </p>
                                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                                            <span>Variant: <strong className="text-slate-700 dark:text-slate-300">{item.variant}</strong></span>
                                            <span>•</span>
                                            <span className="font-mono">{item.ordersCount} customer order{item.ordersCount === 1 ? '' : 's'}</span>
                                        </div>
                                    </div>

                                    <div className="text-left sm:text-right">
                                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
                                            Required Batch
                                        </span>
                                        <span className="text-base font-bold font-mono text-slate-900 dark:text-white">
                                            {item.totalQuantity} pcs
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-xs px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80">
                                    <span className="text-slate-500 dark:text-slate-400 truncate max-w-[260px] font-mono">
                                        Orders: {item.orderNumbers.slice(0, 4).join(', ')}{item.orderNumbers.length > 4 ? ` +${item.orderNumbers.length - 4}` : ''}
                                    </span>
                                    <span className="text-slate-700 dark:text-slate-300 font-mono font-medium">
                                        Ref: GH₵ {item.samplePrice.toFixed(2)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-end gap-2 pt-1">
                                    <a
                                        href={search1688Url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium transition-colors shadow-2xs"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                        <span>Search 1688 / Taobao</span>
                                    </a>

                                    <a
                                        href={searchGoogleUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs transition-colors shadow-2xs"
                                        title="Google Wholesale Search"
                                    >
                                        <Search className="w-3.5 h-3.5" />
                                    </a>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
