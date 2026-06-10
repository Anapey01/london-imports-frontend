import React from 'react';
import { Metadata } from 'next';
import { ShieldCheck, Coins, Info, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 604800; // Cache for 7 days

export const metadata: Metadata = {
    title: "Pricing Transparency | NAA ATSWEI ENTERPRISE | London's Imports",
    description: "Learn about our clear, consolidated pricing model. Get breakdowns of product costs, sourcing fees, shipping rates, and customs clearance.",
};

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-200 selection:bg-emerald-100 pb-32">
            
            {/* 1. Header & Introduction */}
            <section className="pt-40 pb-24 border-b border-slate-50 dark:border-slate-900">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-16">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-px w-12 bg-slate-900 dark:bg-white" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">Policies / 05</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-serif font-bold leading-[0.85] tracking-tighter text-slate-900 dark:text-white mb-8">
                            Pricing <br />
                            <span className="italic font-light text-slate-200 dark:text-slate-800 uppercase tracking-widest text-[0.4em] block mt-4">Transparency Ledger.</span>
                        </h1>
                    </div>
                    <div className="max-w-3xl">
                        <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 font-medium leading-[1.8]">
                            We establish complete cost visibility. Our consolidated billing model ensures you know exactly what you pay for—from China factory floors to final doorstep delivery in Ghana.
                        </p>
                    </div>
                </div>
            </section>

            {/* 2. Pricing Breakdown Grid */}
            <section className="py-24 border-b border-slate-50 dark:border-slate-900 bg-slate-50/20 dark:bg-slate-900/10">
                <div className="max-w-7xl mx-auto px-6">
                    <header className="mb-16">
                        <span className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-400 dark:text-slate-500 mb-4 block">Cost Breakdown</span>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white leading-none tracking-tighter italic">What You Pay For</h2>
                    </header>

                    <div className="grid md:grid-cols-2 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:bg-slate-800">
                        {/* Cost Item 1: Product Cost */}
                        <div className="bg-white dark:bg-slate-950 p-12 md:p-16 flex flex-col justify-between">
                            <div>
                                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 block mb-6">Component 01</span>
                                <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-4 italic">Product Cost</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                    This represents the direct cost charged by the supplier or manufacturer in China. It includes the product price only, unless explicitly stated otherwise on your invoice.
                                </p>
                            </div>
                        </div>

                        {/* Cost Item 2: Service & Sourcing Fee */}
                        <div className="bg-white dark:bg-slate-950 p-12 md:p-16 flex flex-col justify-between border-l border-slate-200 dark:border-slate-800">
                            <div>
                                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 block mb-6">Component 02</span>
                                <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-4 italic">Service & Sourcing Fee</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                    Covers professional services including supplier verification, order placement, secure payment processing, customer support, and local order coordination across Guangzhou and Accra.
                                </p>
                            </div>
                        </div>

                        {/* Cost Item 3: Shipping & Freight Fee */}
                        <div className="bg-white dark:bg-slate-950 p-12 md:p-16 flex flex-col justify-between border-t border-slate-200 dark:border-slate-800">
                            <div>
                                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 block mb-6">Component 03</span>
                                <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-4 italic">International Shipping Fee</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                    Covers transportation charges from China to Ghana. This cost is calculated strictly based on the actual physical shipment characteristics (weight, dimensions, and cargo type).
                                </p>
                            </div>
                        </div>

                        {/* Cost Item 4: Customs & Port Clearance */}
                        <div className="bg-white dark:bg-slate-950 p-12 md:p-16 flex flex-col justify-between border-l border-t border-slate-200 dark:border-slate-800">
                            <div>
                                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 block mb-6">Component 04</span>
                                <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-4 italic">Customs & Port Clearance</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                    Covers import-related charges, customs processing, port handling, and clearing agent brokerage expenses where applicable. Flat rates are utilized to prevent extra clearing fees at collection.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Explanation of Guangzhou Warehouse Calculation */}
            <section className="py-24 border-b border-slate-50 dark:border-slate-900">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="p-8 border border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-950/50 flex gap-6">
                        <Info className="w-8 h-8 text-slate-900 dark:text-white flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                        <div>
                            <h4 className="text-xl font-serif font-bold text-slate-900 dark:text-white mb-2 italic">How Sourcing Costs are Finalized</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                Shipping and clearance charges are estimated before purchase and finalized after the goods arrive at our Guangzhou warehouse, where the actual weight, dimensions, packaging requirements, and shipment method can be confirmed.
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium mt-2">
                                <strong>Guaranteed Notification:</strong> Customers will be informed of the final shipping and clearance charges before shipment from China to Ghana.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Pricing FAQs / Guidelines */}
            <section className="py-24 border-b border-slate-50 dark:border-slate-900 bg-slate-50/20 dark:bg-slate-900/10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Payment Verification */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 mb-4">
                                <ShieldCheck className="w-6 h-6 text-slate-900 dark:text-white" strokeWidth={1.5} />
                                <h3 className="text-2xl font-serif font-bold italic text-slate-900 dark:text-white">Transaction Security</h3>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                All online transactions are securely routed through Paystack, utilizing bank-grade encryption and supporting MTN MoMo, Telecel Cash, AT Money, and Visa/Mastercard payments. London&apos;s Imports does not store your card details.
                            </p>
                        </div>

                        {/* Flat Rate Billing */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 mb-4">
                                <Coins className="w-6 h-6 text-slate-900 dark:text-white" strokeWidth={1.5} />
                                <h3 className="text-2xl font-serif font-bold italic text-slate-900 dark:text-white">Flat-Rate Guarantee</h3>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                Once your final invoice (which includes the product cost, sourcing fee, shipping, and port clearance) is generated and paid, **no additional charges will be added at pickup**. You will never be asked to pay unexpected port levies or local handling markups.
                            </p>
                        </div>
                    </div>
                    
                    {/* Legal illustration disclaimer */}
                    <div className="mt-12 text-[10px] text-slate-400 dark:text-slate-600 font-medium italic border-t border-slate-200 dark:border-slate-800 pt-8">
                        * Pricing examples are provided for illustration purposes only and may vary depending on supplier pricing, product specifications, shipment size, customs requirements, and exchange rate fluctuations.
                    </div>
                </div>
            </section>

            {/* 5. Support Callout */}
            <section className="py-24 bg-slate-900 text-white">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <HelpCircle className="w-12 h-12 text-emerald-500 mx-auto mb-8" strokeWidth={1} />
                    <h2 className="text-4xl md:text-5xl font-serif font-bold italic text-white tracking-tighter mb-6">Have Pricing Questions?</h2>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-md mx-auto mb-8">
                        Our procurement desk is ready to provide custom bulk shipping quotes, item cost conversions, or tariff estimates.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/customs-estimator" className="inline-block px-8 py-3 border border-white text-white uppercase tracking-widest text-[10px] font-black hover:bg-white hover:text-slate-900 transition-colors">
                            Use Duty Estimator
                        </Link>
                        <a href="https://wa.me/233541096372" target="_blank" rel="noopener" className="inline-block px-8 py-3 bg-emerald-500 text-slate-950 uppercase tracking-widest text-[10px] font-black hover:bg-emerald-600 transition-colors">
                            Sourcing Concierge
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
