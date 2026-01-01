'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            {/* Header */}
            <div className="bg-[#006B5A] p-6 text-white text-center">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-white">
                    Import Duty Calculator
                </h2>
                <p className="text-sm opacity-80 mt-1 uppercase tracking-wide">Unofficial Estimate</p>
            </div>

            <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8">
                {/* Inputs */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Product Value (GHS)</label>
                        <input
                            type="number"
                            value={fobValue}
                            onChange={(e) => setFobValue(Number(e.target.value))}
                            placeholder="e.g. 1000"
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#006B5A] outline-none transition font-mono text-lg"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Shipping Cost (GHS)</label>
                        <input
                            type="number"
                            value={shippingCost}
                            onChange={(e) => setShippingCost(Number(e.target.value))}
                            placeholder="e.g. 200"
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#006B5A] outline-none transition font-mono text-lg"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#006B5A] outline-none transition"
                        >
                            {Object.entries(RATES).map(([key, val]) => (
                                <option key={key} value={key}>{val.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Results */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 flex flex-col justify-between">
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between text-gray-600">
                            <span>CIF Value:</span>
                            <span className="font-mono">GHS {results.cif.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="h-px bg-gray-200 my-2"></div>

                        <div className="flex justify-between text-gray-800">
                            <span>Import Duty ({(RATES[category as keyof typeof RATES].duty * 100).toFixed(0)}%):</span>
                            <span className="font-mono font-bold">GHS {results.duty.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between text-gray-800">
                            <span>VAT (15%):</span>
                            <span className="font-mono font-bold">GHS {results.vat.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between text-gray-800">
                            <span>Other Levies (~6%):</span>
                            <span className="font-mono font-bold">GHS {results.levies.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t-2 border-[#006B5A]/20">
                        <div className="flex justify-between items-end mb-1">
                            <span className="text-gray-900 font-bold">Total Taxes to Pay:</span>
                            <span className="text-2xl font-black text-red-600">
                                GHS {results.totalTaxes.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            </span>
                        </div>
                        <p className="text-xs text-right text-gray-500 mb-4">
                            *Excludes clearance agent fees & handling charges
                        </p>

                        <div className="bg-[#006B5A]/5 border border-[#006B5A]/20 p-4 rounded-lg">
                            <h4 className="font-bold text-[#006B5A] flex items-center gap-2 mb-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Save with London's Imports
                            </h4>
                            <p className="text-sm text-gray-700 mb-3">
                                Don't pay these high individual taxes. We consolidate shipping so you pay one low flat rate!
                            </p>
                            <button
                                onClick={() => router.push('/products')}
                                className="w-full bg-[#006B5A] text-white font-bold py-2 rounded-lg hover:bg-[#005a4b] transition shadow-md"
                            >
                                Shop Duty-Free Items
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
