'use client';

import React from 'react';
import type { CheckerAnalyticsData, CheckerCategoryType } from './types';

interface VoucherAnalyticsTabProps {
    category: CheckerCategoryType;
    setCategory: (cat: CheckerCategoryType) => void;
    period: string;
    setPeriod: (period: string) => void;
    data: CheckerAnalyticsData | null;
}

export default function VoucherAnalyticsTab({
    category,
    setCategory,
    period,
    setPeriod,
    data,
}: VoucherAnalyticsTabProps) {
    return (
        <div className="space-y-12">
            {/* Controls & Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                {/* Category Toggle */}
                <div className="flex gap-2">
                    {(['ALL', 'WASSCE', 'BECE'] as const).map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${
                                category === cat
                                    ? 'bg-slate-950 text-white border-slate-950'
                                    : 'bg-white text-slate-400 border-slate-100 hover:border-slate-900 hover:text-slate-900'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Period Select */}
                <div className="flex items-center gap-3">
                    <select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        className="bg-slate-50 border border-slate-100 text-slate-900 text-[10px] font-black uppercase tracking-widest px-4 py-3 outline-none focus:border-slate-900"
                    >
                        <option value="all">All Time</option>
                        <option value="7d">Last 7 Days</option>
                        <option value="30d">Last 30 Days</option>
                        <option value="since_last_upload">Since Last Upload</option>
                    </select>
                </div>
            </div>

            {/* Financial Performance Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white border border-slate-100 p-8 space-y-2">
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Total Revenue</p>
                    <p className="text-3xl font-serif font-bold text-slate-950 tracking-tight">
                        GH₵ {data?.active_revenue || '0.00'}
                    </p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        Gross Voucher Sales
                    </p>
                </div>

                <div className="bg-white border border-slate-100 p-8 space-y-2">
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Net Profit</p>
                    <p className="text-3xl font-serif font-bold text-emerald-700 tracking-tight">
                        GH₵ {data?.active_profit || '0.00'}
                    </p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        Margin: {data?.active_margin || '0.0'}%
                    </p>
                </div>

                <div className="bg-white border border-slate-100 p-8 space-y-2">
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Vouchers Sold</p>
                    <p className="text-3xl font-serif font-bold text-slate-950 tracking-tight">
                        {data?.active_sold || 0}
                    </p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        Out of {data?.active_total || 0} Total Cards
                    </p>
                </div>

                <div className="bg-white border border-slate-100 p-8 space-y-2">
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Stock Remaining</p>
                    <p className="text-3xl font-serif font-bold text-blue-700 tracking-tight">
                        {data?.active_available || 0}
                    </p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        Value: GH₵ {data?.active_unsold_val || '0.00'}
                    </p>
                </div>
            </div>

            {/* Inventory Table Breakdown */}
            <div className="bg-white border border-slate-100 overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-900">
                        Inventory Breakdown by Exam Type
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-6 text-left text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Exam Category</th>
                                <th className="px-8 py-6 text-left text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Total Uploaded</th>
                                <th className="px-8 py-6 text-left text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Cards Sold</th>
                                <th className="px-8 py-6 text-left text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Available Stock</th>
                                <th className="px-8 py-6 text-right text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Revenue Generated</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 font-mono text-xs">
                            <tr className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-8 py-6 font-sans font-bold text-slate-900">WASSCE Checker</td>
                                <td className="px-8 py-6 text-slate-600">{data?.total_wassce || 0}</td>
                                <td className="px-8 py-6 text-emerald-700 font-bold">{data?.sold_wassce || 0}</td>
                                <td className="px-8 py-6 text-blue-700 font-bold">{data?.available_wassce || 0}</td>
                                <td className="px-8 py-6 text-right font-bold text-slate-900">GH₵ {data?.revenue_wassce || '0.00'}</td>
                            </tr>
                            <tr className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-8 py-6 font-sans font-bold text-slate-900">BECE Checker</td>
                                <td className="px-8 py-6 text-slate-600">{data?.total_bece || 0}</td>
                                <td className="px-8 py-6 text-emerald-700 font-bold">{data?.sold_bece || 0}</td>
                                <td className="px-8 py-6 text-blue-700 font-bold">{data?.available_bece || 0}</td>
                                <td className="px-8 py-6 text-right font-bold text-slate-900">GH₵ {data?.revenue_bece || '0.00'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
