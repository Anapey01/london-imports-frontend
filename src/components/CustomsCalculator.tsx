'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, Zap } from 'lucide-react';

export default function CustomsCalculator() {
    const router = useRouter();
    const [fobValue, setFobValue] = useState<number | ''>('');
    const [shippingCost, setShippingCost] = useState<number | ''>('');
    const [category, setCategory] = useState('general');

    // Tax Rates (Estimates)
    const RATES = {
        general: { duty: 0.20, name: 'General Goods (Clothing, Home)' },
        electronics: { duty: 0.10, name: 'Electronics (Phones, Laptops)' },
        cars: { duty: 0.35, name: 'Vehicles' },
        books: { duty: 0.00, name: 'Books & Educational' },
    };

    const calculate = () => {
        const fob = Number(fobValue) || 0;
        const freight = Number(shippingCost) || 0;
        const cif = fob + freight;

        const selectedRate = RATES[category as keyof typeof RATES].duty;
        const duty = cif * selectedRate;

        // Duty Inclusive Value for other taxes
        const dutyInclusive = cif + duty;

        // VAT & Levies (Standard Ghana Rates)
        const vat = dutyInclusive * 0.150; // 15% VAT
        const nhil = dutyInclusive * 0.025; // 2.5% NHIL
        const getfund = dutyInclusive * 0.025; // 2.5% GetFund
        const covid = dutyInclusive * 0.010; // 1% COVID
        const ecowas = cif * 0.005; // 0.5% ECOWAS
        const exim = cif * 0.0075; // 0.75% EXIM

        const totalTaxes = duty + vat + nhil + getfund + covid + ecowas + exim;
        const totalCost = cif + totalTaxes;

        return {
            cif,
            duty,
            vat,
            levies: nhil + getfund + covid + ecowas + exim,
            totalTaxes,
            totalCost
        };
    };

    const results = calculate();

    return (
        <div className="bg-white max-w-5xl mx-auto py-12 px-6 md:px-12 border border-slate-50">
            {/* 1. EDITORIAL HEADER (Minimalist & Serif) */}
            <header className="border-b border-slate-900 pb-12 mb-16">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10">
                    <div className="max-w-2xl">
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-600 block mb-6 italic">Fiscal Audit CP-2026</span>
                        <h2 className="text-4xl md:text-7xl font-serif font-bold tracking-tight text-slate-900 leading-[0.85]">
                            Projected Tax <br />
                            Assessment.
                        </h2>
                    </div>
                    <div className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300 space-y-1 text-right tabular-nums">
                        <div>Ref: LI-ACCRA-EST</div>
                        <div>Protocol: GH-CET-2026/27</div>
                    </div>
                </div>
            </header>

            <div className="grid lg:grid-cols-12 gap-16 md:gap-24">
                {/* 2. PARAMETERS (Minimalist Underline Inputs) */}
                <div className="lg:col-span-7 space-y-16">
                    <div className="space-y-16">
                        {/* 01. FOB */}
                        <div className="group border-b border-slate-200 focus-within:border-slate-900 transition-colors pb-6">
                            <label className="block text-[9px] font-black tracking-[0.4em] uppercase text-slate-400 mb-8">01. Original Invoice Value (FOB GHS)</label>
                            <input
                                type="number"
                                value={fobValue}
                                onChange={(e) => setFobValue(e.target.value === '' ? '' : Number(e.target.value))}
                                placeholder="0.00"
                                className="w-full bg-transparent text-4xl font-serif text-slate-900 outline-none placeholder:text-slate-100 tabular-nums"
                            />
                        </div>

                        {/* 02. Freight */}
                        <div className="group border-b border-slate-200 focus-within:border-slate-900 transition-colors pb-6">
                            <label className="block text-[9px] font-black tracking-[0.4em] uppercase text-slate-400 mb-8">02. Combined Logistics & Insurance (GHS)</label>
                            <input
                                type="number"
                                value={shippingCost}
                                onChange={(e) => setShippingCost(e.target.value === '' ? '' : Number(e.target.value))}
                                placeholder="0.00"
                                className="w-full bg-transparent text-4xl font-serif text-slate-900 outline-none placeholder:text-slate-100 tabular-nums"
                            />
                        </div>

                        {/* 03. Category */}
                        <div className="group border-b border-slate-200 focus-within:border-slate-900 transition-colors pb-6">
                             <label className="block text-[9px] font-black tracking-[0.4em] uppercase text-slate-400 mb-8">03. Tariff Band Classification</label>
                             <div className="relative">
                                <select
                                    value={category}
                                    title="Classification"
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full bg-transparent text-[11px] font-black tracking-[0.3em] uppercase text-slate-900 outline-none appearance-none cursor-pointer pr-10"
                                >
                                    {Object.entries(RATES).map(([key, val]) => (
                                        <option key={key} value={key}>{val.name}</option>
                                    ))}
                                </select>
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none opacity-20">
                                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                                        <path d="M6 9l6 6 6-6" />
                                    </svg>
                                </div>
                             </div>
                        </div>
                    </div>

                    <p className="text-[10px] leading-relaxed text-slate-300 max-w-sm italic">
                        Calculations derived from the prevailing WTO valuation principles used by the Ghana Revenue Authority (GRA). Projections are indicative.
                    </p>
                </div>

                {/* 3. ASSESSMENT (High-Contrast Clean Vertical Summary) */}
                <div className="lg:col-span-5 flex flex-col">
                    <div className="bg-slate-50 p-10 md:p-12 h-full flex flex-col">
                        <span className="text-[10px] font-black tracking-[0.4em] uppercase text-slate-300 mb-12 block">Assessment Summary</span>
                        
                        <div className="flex-1 space-y-8">
                            <div className="flex justify-between items-baseline border-b border-white pb-6">
                                <span className="text-[10px] font-black tracking-widest uppercase text-slate-400">CIF Base</span>
                                <span className="text-xl font-bold text-slate-900 font-mono tracking-tight tabular-nums">
                                    {results.cif.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                            <div className="flex justify-between items-baseline border-b border-white pb-6">
                                <span className="text-[10px] font-black tracking-widest uppercase text-slate-400">Import Duty</span>
                                <span className="text-xl font-bold text-slate-900 font-mono tracking-tight tabular-nums">
                                    {results.duty.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                            <div className="flex justify-between items-baseline border-b border-white pb-6">
                                <span className="text-[10px] font-black tracking-widest uppercase text-slate-400">VAT Component</span>
                                <span className="text-xl font-bold text-slate-900 font-mono tracking-tight tabular-nums">
                                    {results.vat.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                            <div className="flex justify-between items-baseline border-b border-white pb-6">
                                <span className="text-[10px] font-black tracking-widest uppercase text-slate-400">Total Levies</span>
                                <span className="text-xl font-bold text-slate-900 font-mono tracking-tight tabular-nums">
                                    {results.levies.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>

                        <div className="mt-16 pt-12 border-t border-slate-200">
                            <div className="flex flex-col gap-4 mb-16 px-2">
                                <span className="text-[10px] font-black tracking-widest uppercase text-emerald-600 block italic leading-none">Total Expenditure Liability (EST)</span>
                                <div className="text-6xl md:text-8xl font-serif font-bold tracking-tighter text-slate-900 leading-[0.8]">
                                    {results.totalTaxes.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                    <span className="text-2xl ml-1 font-mono opacity-20">.{(results.totalTaxes % 1).toFixed(2).substring(2)}</span>
                                </div>
                            </div>

                            {/* SAVINGS CALLOUT */}
                            <div className="pt-10 border-t border-slate-100 group/cta">
                                <h5 className="text-3xl font-serif font-bold italic mb-6 text-slate-900 leading-tight">
                                    Why pay individual <br /> 
                                    <span className="text-slate-300">obstacles?</span>
                                </h5>
                                <p className="text-[12px] text-slate-400 font-medium leading-relaxed mb-10">
                                    Our consolidation service slashes total liability by grouping high-value items within commercial shipments.
                                </p>
                                <button
                                    onClick={() => router.push('/products')}
                                    className="group/link inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 border-b border-black pb-2 hover:opacity-60 transition-all"
                                >
                                    <Zap className="w-4 h-4 fill-emerald-500 text-emerald-500" />
                                    Optimize Now
                                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
