import React from 'react';
import { Metadata } from 'next';
import { ShieldCheck, Truck, RotateCcw, AlertOctagon, HelpCircle, FileText, XCircle } from 'lucide-react';

export const revalidate = 604800; // Cache for 7 days

export const metadata: Metadata = {
    title: "Delivery & Returns Policy | NAA ATSWEI ENTERPRISE | London's Imports",
    description: "Official delivery zones, shipping timelines, returns to China policy, wrong items, and damaged goods conditions for London's Imports.",
};

export default function DeliveryReturnsPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-200 selection:bg-emerald-100 pb-32">
            
            {/* 1. Header & Introduction */}
            <section className="pt-40 pb-24 border-b border-slate-50 dark:border-slate-900">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-16">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-px w-12 bg-slate-900 dark:bg-white" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">Policies / 04</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-serif font-bold leading-[0.85] tracking-tighter text-slate-900 dark:text-white mb-8">
                            Delivery & <br />
                            <span className="italic font-light text-slate-200 dark:text-slate-800 uppercase tracking-widest text-[0.4em] block mt-4">Returns Policy.</span>
                        </h1>
                    </div>
                    <div className="max-w-3xl">
                        <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 font-medium leading-[1.8]">
                            We establish strict guidelines for regional logistics and returns. Below is our formal framework detailing local delivery parameters and returns processing.
                        </p>
                    </div>
                </div>
            </section>

            {/* 2. Delivery Zones Ledger */}
            <section className="py-24 border-b border-slate-50 dark:border-slate-900 bg-slate-50/20 dark:bg-slate-900/10">
                <div className="max-w-7xl mx-auto px-6">
                    <header className="mb-16">
                        <span className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-400 dark:text-slate-500 mb-4 block">Logistics Zones</span>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white leading-none tracking-tighter italic">Local Delivery Timelines</h2>
                    </header>

                    <div className="grid md:grid-cols-3 gap-12 border-t border-slate-900 dark:border-slate-800 pt-16 mb-16">
                        <div className="space-y-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 block">Zone 01: Greater Accra & Tema</span>
                            <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white italic">1 – 3 Business Days</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                Delivered to your door or available for self-pickup at our Accra operating hub.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 block">Zone 02: Regional Capitals</span>
                            <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white italic">3 – 5 Business Days</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                Forwarded to main regional transit stations for client collection or regional delivery.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 block">Zone 03: Remote Areas</span>
                            <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white italic">5 – 7 Business Days</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                Handled through secondary logistics networks. Delivery dates depend on carrier schedules.
                            </p>
                        </div>
                    </div>

                    <div className="p-8 border border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-950/50 flex gap-6">
                        <Truck className="w-6 h-6 text-slate-900 dark:text-white flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                            <strong>Standard Attempt Limits:</strong> Door deliveries will be attempted up to **3 times** over 3 consecutive business days. If undelivered, items are returned to our Accra warehouse. Items held at pickup stations must be collected within **5 days** of notification.
                        </p>
                    </div>
                </div>
            </section>

            {/* 3. Returns Policy Grid */}
            <section className="py-24 border-b border-slate-50 dark:border-slate-900">
                <div className="max-w-7xl mx-auto px-6">
                    <header className="mb-16">
                        <span className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-400 dark:text-slate-500 mb-4 block">Return Policy Rules</span>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white leading-none tracking-tighter italic">Returns & Sourcing Liabilities</h2>
                    </header>

                    <div className="grid md:grid-cols-2 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:bg-slate-800">
                        {/* Section A: Returns to China & Shipping Costs */}
                        <div className="bg-white dark:bg-slate-950 p-12 md:p-16 flex flex-col justify-between">
                            <div className="space-y-10">
                                <div>
                                    <div className="flex justify-between items-start mb-6">
                                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Section 01</span>
                                        <AlertOctagon className="w-6 h-6 text-slate-400" strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-4 italic">Returns to China</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                        Due to international shipping costs, supplier policies, and customs regulations, Londonsimports does not generally facilitate returns of goods back to China after delivery to Ghana. Sourcing risks should be considered prior to order payment.
                                    </p>
                                </div>
                                <div className="border-t border-slate-50 dark:border-slate-900 pt-8">
                                    <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-4 italic">Return Shipping Responsibility</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                        Customers may return approved items directly to the Accra warehouse at no cost. Where a customer chooses to use a courier service, the customer is responsible for local return shipping costs unless otherwise agreed by Londonsimports. Sourcing and transaction handling fees are strictly non-refundable once incurred.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Section B: Wrong Goods vs Damaged Goods */}
                        <div className="bg-white dark:bg-slate-950 p-12 md:p-16 flex flex-col justify-between border-l border-slate-200 dark:border-slate-800">
                            <div className="space-y-10">
                                <div>
                                    <div className="flex justify-between items-start mb-6">
                                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Section 02</span>
                                        <RotateCcw className="w-6 h-6 text-slate-400" strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-4 italic">Damaged & Defective Claims</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                        Claims relating to damaged, defective, missing, or incorrect items must be reported **within 72 hours of delivery or collection**. Claims submitted outside this 72-hour window will be rejected.
                                    </p>
                                </div>
                                <div className="border-t border-slate-50 dark:border-slate-900 pt-8">
                                    <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-4 italic">Wrong Goods Received</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                        If you receive an incorrect item (wrong size, color, or model different from your invoice), report it **within 72 hours**. The product must remain **completely unused, in its original packaging, and with all labels/tags intact** to qualify for local exchange or refund processing.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Evidence & Exclusions */}
            <section className="py-24 border-b border-slate-50 dark:border-slate-900 bg-slate-50/20 dark:bg-slate-900/10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Evidence Requirements */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 mb-4">
                                <FileText className="w-6 h-6 text-slate-900 dark:text-white" strokeWidth={1.5} />
                                <h3 className="text-2xl font-serif font-bold italic text-slate-900 dark:text-white">Evidence Requirements</h3>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                Customers are required to provide photographs, videos, packaging materials, waybills, or other supporting evidence when submitting a claim. Photographic evidence must clearly capture the issue alongside the shipping barcode/label on the package.
                            </p>
                        </div>

                        {/* Exclusions */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 mb-4">
                                <XCircle className="w-6 h-6 text-rose-500" strokeWidth={1.5} />
                                <h3 className="text-2xl font-serif font-bold italic text-slate-900 dark:text-white">Claim Exclusions</h3>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                Claims may be rejected where:
                            </p>
                            <ul className="list-disc pl-6 text-xs text-slate-500 dark:text-slate-400 space-y-2 font-medium">
                                <li>The item has been used.</li>
                                <li>The item has been altered, washed, or repaired.</li>
                                <li>Original supplier packaging, barcodes, or boxes are unavailable.</li>
                                <li>Damage resulted from misuse, handling, or assembly after delivery.</li>
                                <li>The 72-hour reporting window has expired.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
            {/* 5. Dispute & Complaint Resolution Process */}
            <section className="py-24 border-b border-slate-50 dark:border-slate-900">
                <div className="max-w-7xl mx-auto px-6">
                    <header className="mb-16">
                        <span className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-400 dark:text-slate-500 mb-4 block">Resolution Framework</span>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white leading-none tracking-tighter italic">Dispute Handling Process</h2>
                    </header>

                    <div className="grid md:grid-cols-4 gap-12 border-t border-slate-900 dark:border-slate-800 pt-16">
                        <div className="space-y-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 block">Step 01: Submission</span>
                            <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white italic">How & Where to File</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                Customers must file claims in writing via our official WhatsApp Concierge (+233 54 524 7009), support email (info@londonsimports.com), or the online contact form at /contact.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 block">Step 02: Verification</span>
                            <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white italic">Required Information</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                Please provide your order number (#LI-XXXXX), a detailed description of the issue, and clear photo/video evidence of the packaging, shipping label, and the product itself.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 block">Step 03: Review Timeline</span>
                            <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white italic">24 – 48 Hours Response</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                Our support audit team will review your ticket and respond within 24 to 48 hours to confirm receipt and provide an initial assessment or request additional details.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 block">Step 04: Resolution</span>
                            <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white italic">Outcome & Settlement</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                Approved claims will result in either a refund (processed within MoMo/Bank timelines) or a replacement item dispatched in the next cargo batch. Rejected claims will be detailed in writing.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. Support Callout */}
            <section className="py-24 bg-slate-900 text-white">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <HelpCircle className="w-12 h-12 text-emerald-500 mx-auto mb-8" strokeWidth={1} />
                    <h2 className="text-4xl md:text-5xl font-serif font-bold italic text-white tracking-tighter mb-6">Need Sourcing Assistance?</h2>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-md mx-auto mb-8">
                        Our support team is available to assist with order tracking, supplier clarifications, and claims audits.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="mailto:info@londonsimports.com" className="inline-block px-8 py-3 border border-white text-white uppercase tracking-widest text-[10px] font-black hover:bg-white hover:text-slate-900 transition-colors">
                            Email Support
                        </a>
                        <a href="https://wa.me/233545247009" target="_blank" rel="noopener" className="inline-block px-8 py-3 bg-emerald-500 text-slate-950 uppercase tracking-widest text-[10px] font-black hover:bg-emerald-600 transition-colors">
                            Contact WhatsApp
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
