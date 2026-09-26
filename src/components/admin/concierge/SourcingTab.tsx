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
            <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg text-white">
                    <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">Total Units to Procure</p>
                    <p className="text-xl font-bold tracking-tight text-white mt-1">
                        {totalUnits} Units
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{allItems.length} distinct products</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg text-white flex flex-col justify-between">
                    <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">Procurement Export</p>
                    <button
                        onClick={handleCopyList}
                        disabled={allItems.length === 0}
                        className="mt-1 w-full bg-white text-slate-950 hover:bg-slate-200 py-1.5 px-2 rounded text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? 'Copied to Clipboard' : 'Copy Sourcing Sheet'}
                    </button>
                </div>
            </div>

            {/* Search Input */}
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search sourcing catalog..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-900 text-white placeholder-slate-400 border border-slate-800 rounded-md focus:outline-none focus:border-white"
                />
            </div>

            {/* Sourcing Item Rows */}
            {isLoading ? (
                <div className="py-12 text-center text-xs text-slate-400">Aggregating China procurement items...</div>
            ) : filteredItems.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400 border border-slate-800 rounded-lg p-6 bg-slate-900/50">
                    No sourcing items recorded for current orders.
                </div>
            ) : (
                <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                    {filteredItems.map((item, idx) => {
                        const search1688Url = item.supplierUrl || `https://s.1688.com/youyuan/index.htm?tab=all&q=${encodeURIComponent(item.name)}`;
                        const searchGoogleUrl = `https://www.google.com/search?q=${encodeURIComponent(item.name + ' wholesale china 1688')}`;

                        return (
                            <div key={`${item.name}-${item.variant}-${idx}`} className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-white space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1">
                                        <p className="font-semibold text-xs text-white leading-snug">{item.name}</p>
                                        <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                                            <span>Variant: {item.variant}</span>
                                            <span>•</span>
                                            <span>{item.ordersCount} orders</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] tracking-wider uppercase text-slate-400 block font-semibold">Quantity</span>
                                        <span className="text-base font-bold text-white">{item.totalQuantity} pcs</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-[11px] bg-slate-950/60 px-2.5 py-1.5 rounded border border-slate-800/80">
                                    <span className="text-slate-400 truncate max-w-[200px]">
                                        Orders: {item.orderNumbers.slice(0, 3).join(', ')}{item.orderNumbers.length > 3 ? ` +${item.orderNumbers.length - 3}` : ''}
                                    </span>
                                    <span className="text-slate-300 font-medium">
                                        Ref: GH₵ {item.samplePrice.toFixed(2)}
                                    </span>
                                </div>

                                <div className="flex items-center gap-1.5 pt-1">
                                    <a
                                        href={search1688Url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 bg-white text-slate-950 hover:bg-slate-200 py-1.5 px-2 rounded text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                        Search 1688 / Taobao
                                    </a>
                                    <a
                                        href={searchGoogleUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-slate-800 hover:bg-slate-700 text-white px-2.5 py-1.5 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors"
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
