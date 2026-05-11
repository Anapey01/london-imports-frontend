import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms & Conditions | London\'s Imports',
    description: 'Terms and conditions for using London\'s Imports services.',
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 relative pb-32 selection:bg-emerald-100 dark:selection:bg-slate-800">
            {/* 1. Terms Hero (Support Header) */}
            <header className="relative pt-32 pb-20 bg-white dark:bg-slate-950 border-b border-slate-50 dark:border-slate-900">
                <div className="max-w-[1400px] mx-auto px-10">
                    <div className="w-12 h-px bg-slate-900 dark:bg-white mb-10" />
                    <div className="flex flex-col md:flex-row justify-between items-end gap-10">
                        <div className="max-w-2xl">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 dark:text-slate-500 block mb-4">Legal Information / Terms</span>
                            <h1 className="text-5xl md:text-7xl font-serif font-bold text-slate-900 dark:text-white tracking-tighter leading-none">
                                Terms <span className="italic font-normal">& Conditions.</span>
                            </h1>
                        </div>
                        <p className="text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-[0.3em] max-w-sm leading-relaxed text-right font-black">
                            London&apos;s Imports: How we work. <br /> Transparency and security guaranteed.
                        </p>
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-10 py-24">
                <div className="space-y-12 text-slate-900 dark:text-white">
                    <div className="border-l-[3px] border-emerald-500/20 dark:border-emerald-500/40 pl-8">
                        <p className="text-xl font-serif italic text-slate-500 dark:text-slate-400 font-medium">Welcome to London&apos;s Imports. By using our website and services, you agree to our terms.</p>
                    </div>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-serif font-bold tracking-tight">1. Pre-Ordering</h2>
                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">All items are subject to availability. Pre-order delivery times are estimated delivery times (typically 8-9 weeks from China to Ghana).</p>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-serif font-bold tracking-tight">2. Payments</h2>
                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">We accept Mobile Money and Cards via Paystack. Full payment is required for immediate purchases. Pre-orders may require a deposit.</p>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-serif font-bold tracking-tight">3. Returns & <span className="italic font-normal">Refunds</span></h2>
                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">Returns are accepted for defective items within 7 days of delivery. Change of mind returns are subject to a restocking fee.</p>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-serif font-bold tracking-tight">4. Support <span className="italic font-normal">Channels</span></h2>
                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">For any inquiries, please contact our support team via our verified WhatsApp or business email.</p>
                    </section>

                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 dark:text-slate-600 mt-20 border-t border-slate-50 dark:border-slate-900 pt-10">Last updated: January 2026</p>
                </div>
            </div>
        </div>
    );
}
