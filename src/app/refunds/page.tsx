import React from 'react';
import { Metadata } from 'next';
import { CheckCircle2, XCircle, Clock, Info, HelpCircle } from 'lucide-react';

export const revalidate = 604800; // Cache for 7 days

export const metadata: Metadata = {
    title: "Refund Policy | NAA ATSWEI ENTERPRISE | London's Imports",
    description: "Official policies on order cancellations, refund eligibility criteria, non-refundable scenarios, and transaction processing timelines for London's Imports.",
};

export default function RefundsPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-200 selection:bg-emerald-100 pb-32">
            {/* 1. Header & Introduction */}
            <section className="pt-40 pb-24 border-b border-slate-50 dark:border-slate-900">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-16">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-px w-12 bg-slate-900 dark:bg-white" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">Policies / 03</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-serif font-bold leading-[0.85] tracking-tighter text-slate-900 dark:text-white mb-8">
                            Refund & <br />
                            <span className="italic font-light text-slate-200 dark:text-slate-800 uppercase tracking-widest text-[0.4em] block mt-4">Cancellation Policy.</span>
                        </h1>
                    </div>
                    <div className="max-w-3xl">
                        <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 font-medium leading-[1.8]">
                            We maintain full transaction clarity. Below are the conditions governing order cancellations, refund eligibility, and clearing cycles for bank and mobile money networks.
                        </p>
                    </div>
                </div>
            </section>

            {/* 2. Eligibility Split Ledger (Allowed vs Excluded) */}
            <section className="py-24 border-b border-slate-50 dark:border-slate-900 bg-slate-50/20 dark:bg-slate-900/10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
                        
                        {/* Section A: When Refunds are Allowed */}
                        <div className="bg-white dark:bg-slate-950 p-12 md:p-16 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-10">
                                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-emerald-500">Section 01</span>
                                    <CheckCircle2 className="w-6 h-6 text-emerald-500" strokeWidth={1.5} />
                                </div>
                                <h3 className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-8 italic">Eligible Refunds</h3>
                                <div className="space-y-6 text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">
                                    <div className="pb-6 border-b border-slate-50 dark:border-slate-900">
                                        <strong className="text-slate-900 dark:text-white block mb-1">Supplier Unable to Fulfill</strong>
                                        <p>If the designated manufacturer or supplier in China is out of stock or unable to fulfill your ordered items.</p>
                                    </div>
                                    <div className="pb-6 border-b border-slate-50 dark:border-slate-900">
                                        <strong className="text-slate-900 dark:text-white block mb-1">Duplicate Payment</strong>
                                        <p>Any double billing, payment gateway system errors, or transaction glitches will be fully reversed.</p>
                                    </div>
                                    <div className="pb-6 border-b border-slate-50 dark:border-slate-900">
                                        <strong className="text-slate-900 dark:text-white block mb-1">Payment Made, Order Not Placed</strong>
                                        <p>If your procurement order is not successfully processed or submitted to the supplier within the batch cycle after payment.</p>
                                    </div>
                                    <div>
                                        <strong className="text-slate-900 dark:text-white block mb-1">Item Unavailable After Payment</strong>
                                        <p>In cases where items sell out or become completely unavailable between checkout completion and sourcing execution.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section B: When Refunds are NOT Allowed */}
                        <div className="bg-white dark:bg-slate-950 p-12 md:p-16 flex flex-col justify-between border-l border-slate-200 dark:border-slate-800">
                            <div>
                                <div className="flex justify-between items-start mb-10">
                                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-rose-500">Section 02</span>
                                    <XCircle className="w-6 h-6 text-rose-500" strokeWidth={1.5} />
                                </div>
                                <h3 className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-8 italic">Non-Refundable Situations</h3>
                                <div className="space-y-6 text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">
                                    <div className="pb-6 border-b border-slate-50 dark:border-slate-900">
                                        <strong className="text-slate-900 dark:text-white block mb-1">Sourcing Started</strong>
                                        <p>Once payment is finalized and the procurement cycle initiates, order cancellations due to change of mind are strictly excluded.</p>
                                    </div>
                                    <div className="pb-6 border-b border-slate-50 dark:border-slate-900">
                                        <strong className="text-slate-900 dark:text-white block mb-1">Shipment Dispatched</strong>
                                        <p>We cannot reverse or cancel any orders once goods have left the supplier's warehouse or been consolidated into our shipping containers.</p>
                                    </div>
                                    <div className="pb-6 border-b border-slate-50 dark:border-slate-900">
                                        <strong className="text-slate-900 dark:text-white block mb-1">Customs Delays</strong>
                                        <p>We are not responsible for delays caused by airline schedules, customs inspections, or port clearing backlogs, and no refunds are granted for such delays.</p>
                                    </div>
                                    <div className="pb-6 border-b border-slate-50 dark:border-slate-900">
                                        <strong className="text-slate-900 dark:text-white block mb-1">Incorrect Customer Selections</strong>
                                        <p>Refunds are not granted for sizing, color, or quantity errors made by the customer during product selection.</p>
                                    </div>
                                    <div>
                                        <strong className="text-slate-900 dark:text-white block mb-1">Incorrect Delivery Information</strong>
                                        <p>London&apos;s Imports is not liable for lost or delayed packages due to incorrect delivery addresses or contact numbers provided by the buyer.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Partial Refunds Clause */}
            <section className="py-24 border-b border-slate-50 dark:border-slate-900">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="p-8 border border-slate-100 dark:border-slate-900 bg-slate-50/20 dark:bg-slate-900/10 flex gap-6">
                        <Info className="w-8 h-8 text-slate-900 dark:text-white flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                        <div>
                            <h4 className="text-xl font-serif font-bold text-slate-900 dark:text-white mb-2 italic">Partial Refunds Clause</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                In specific cases where partial order cancellation is approved, only the direct <strong>product procurement cost</strong> will be refunded. Sourcing fees, transaction processing rates, handling costs, or shipping fees already incurred during the procurement phase are strictly non-refundable.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Refund Timelines & Settlement */}
            <section className="py-24 border-b border-slate-50 dark:border-slate-900">
                <div className="max-w-7xl mx-auto px-6">
                    <header className="mb-16">
                        <span className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-400 dark:text-slate-500 mb-4 block">Settlement Ledger</span>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white leading-none tracking-tighter italic">Refund Processing Timelines</h2>
                    </header>

                    <div className="grid md:grid-cols-3 gap-12 border-t border-slate-900 dark:border-slate-800 pt-16">
                        <div className="space-y-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 block">General Cycle</span>
                            <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white italic">5 – 10 Business Days</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                Once a refund request is officially approved by our procurement audit team, the reversed funds are released to the original funding account.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 block">Mobile Money (MoMo)</span>
                            <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white italic">24 – 72 Hours</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                Reversed amounts sent to MTN MoMo, Telecel Cash, or AT Money accounts reflect within 1-3 business days, subject to network provider processing.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 block">Card & Bank Accounts</span>
                            <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white italic">5 – 10 Business Days</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                Transactions funded via local or international credit cards are reversed through our payment gateways, subject to gateway and issuing bank clearing times.
                            </p>
                        </div>
                    </div>
                    
                    {/* General disclaimer banner */}
                    <div className="mt-12 p-8 border border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-950 flex gap-6">
                        <Clock className="w-6 h-6 text-slate-900 dark:text-white flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                            <strong>Important Note:</strong> Refund processing times begin strictly <strong>after</strong> the refund request has been officially approved by London&apos;s Imports, not from the time of submission.
                        </p>
                    </div>
                </div>
            </section>
            {/* Dispute & Complaint Resolution Process */}
            <section className="py-20 border-t border-slate-50 dark:border-slate-900 bg-slate-50/10 dark:bg-slate-900/5">
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
                        <a href="https://wa.me/233545247009" target="_blank" rel="noopener" className="inline-block px-8 py-3 bg-emerald-500 text-slate-950 uppercase tracking-widest text-[10px] font-black hover:bg-emerald-700 transition-colors">
                            Contact WhatsApp
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
