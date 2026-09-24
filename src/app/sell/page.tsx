'use client';

import Link from 'next/link';
import { useTheme } from '@/providers/ThemeProvider';
import { ArrowRight, Store, Briefcase, LogIn, Check, ShieldCheck, Truck, Sparkles } from 'lucide-react';

export default function SellPage() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className={`min-h-screen transition-colors ${isDark ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'} selection:bg-slate-200 dark:selection:bg-slate-800 pb-32`}>

            {/* Hero Section */}
            <section className="pt-36 sm:pt-44 pb-20 border-b border-slate-100 dark:border-slate-900">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-px w-10 bg-slate-900 dark:bg-white" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">
                            Merchant Network · 01
                        </span>
                    </div>

                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif font-bold text-slate-900 dark:text-white leading-[0.95] tracking-tight mb-6">
                        Grow with <br />
                        <span className="italic font-light text-slate-400 dark:text-slate-600">London&apos;s Imports.</span>
                    </h1>

                    <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl font-normal leading-relaxed">
                        Two distinct partnership models engineered for scale. Reach thousands of verified buyers across Ghana with consolidated escrow, international freight, and intelligent commerce tooling.
                    </p>
                </div>
            </section>

            {/* Partnership Options */}
            <section className="py-20">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-8 lg:gap-10">

                        {/* Option 1: Marketplace Seller */}
                        <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 rounded-2xl p-8 sm:p-10 flex flex-col justify-between hover:border-slate-400 dark:hover:border-slate-700 transition-all shadow-sm">
                            <div>
                                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-white mb-6">
                                    <Store className="w-6 h-6" strokeWidth={1.5} />
                                </div>

                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 block mb-2">
                                    Tier 01 · Individual Sellers
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white mb-4">
                                    Marketplace Seller
                                </h2>
                                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                                    Ideal for independent vendors and emerging retailers. List your catalog directly onto our marketplace feed and sell to customers across Ghana without storefront overhead.
                                </p>

                                <ul className="space-y-3.5 mb-10 border-t border-slate-100 dark:border-slate-800/80 pt-6">
                                    {[
                                        'Instant distribution to active web and mobile shoppers',
                                        'Streamlined catalog and inventory management',
                                        'Protected escrow payouts released upon verified delivery',
                                        '24/7 buyer support powered by Miss London Concierge',
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <div className="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5 text-slate-900 dark:text-white">
                                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                                            </div>
                                            <span className="text-sm text-slate-600 dark:text-slate-300 font-normal">
                                                {item}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                                <Link
                                    href="/register/seller"
                                    className="flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl text-xs font-semibold uppercase tracking-widest bg-slate-950 text-white dark:bg-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all active:scale-[0.99] shadow-sm"
                                >
                                    Join Marketplace
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                                <Link
                                    href="/login?role=vendor&redirect=/dashboard/vendor"
                                    className="flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl text-xs font-semibold uppercase tracking-widest border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all active:scale-[0.99]"
                                >
                                    <LogIn className="w-4 h-4" />
                                    Seller Portal Login
                                </Link>
                            </div>
                        </div>

                        {/* Option 2: Branded Partner */}
                        <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 rounded-2xl p-8 sm:p-10 flex flex-col justify-between hover:border-slate-400 dark:hover:border-slate-700 transition-all shadow-sm relative">
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-slate-950 text-white dark:bg-white dark:text-slate-950 flex items-center justify-center">
                                        <Briefcase className="w-6 h-6" strokeWidth={1.5} />
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-[0.25em] px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700">
                                        Curated Storefront
                                    </span>
                                </div>

                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 block mb-2">
                                    Tier 02 · Verified Brands
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white mb-4">
                                    Branded Partner
                                </h2>
                                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                                    For established labels, authorized distributors, and premium importers. Obtain a dedicated storefront URL, verified badge, and priority freight clearing channels.
                                </p>

                                <ul className="space-y-3.5 mb-10 border-t border-slate-100 dark:border-slate-800/80 pt-6">
                                    {[
                                        'Dedicated storefront URL (/store/your-brand)',
                                        'Custom brand banners, color schemes & curated collections',
                                        'Official Verified Partner trust badge on all listings',
                                        'Direct automated Mobile Money & corporate bank settlements',
                                        'Priority international air & sea freight from China',
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <div className="w-4 h-4 rounded-full bg-slate-900 dark:bg-white flex items-center justify-center shrink-0 mt-0.5 text-white dark:text-slate-900">
                                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                                            </div>
                                            <span className="text-sm text-slate-600 dark:text-slate-300 font-normal">
                                                {item}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                                <Link
                                    href="/register/seller"
                                    className="flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl text-xs font-semibold uppercase tracking-widest bg-slate-950 text-white dark:bg-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all active:scale-[0.99] shadow-sm"
                                >
                                    Apply for Branded Store
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                                <Link
                                    href="/login?role=vendor&redirect=/dashboard/vendor"
                                    className="flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl text-xs font-semibold uppercase tracking-widest border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all active:scale-[0.99]"
                                >
                                    <LogIn className="w-4 h-4" />
                                    Partner Portal Login
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Value Proposition Grid */}
            <section className="py-20 border-t border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/20">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="mb-12">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500 block mb-3">
                            Platform Infrastructure
                        </span>
                        <h3 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 dark:text-white">
                            Engineered for Ghanaian Commerce
                        </h3>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 rounded-xl p-8 shadow-sm">
                            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-white mb-6">
                                <ShieldCheck className="w-5 h-5" strokeWidth={1.5} />
                            </div>
                            <h4 className="text-lg font-serif font-bold text-slate-900 dark:text-white mb-2">
                                Escrow Protection
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                                Buyer payments are secured at checkout and released automatically upon delivery confirmation, eliminating fraudulent chargebacks.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 rounded-xl p-8 shadow-sm">
                            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-white mb-6">
                                <Truck className="w-5 h-5" strokeWidth={1.5} />
                            </div>
                            <h4 className="text-lg font-serif font-bold text-slate-900 dark:text-white mb-2">
                                End-to-End Logistics
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                                Direct integration with China-to-Ghana freight consolidators and local dispatch riders ensures reliable last-mile delivery to buyers.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 rounded-xl p-8 shadow-sm">
                            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-white mb-6">
                                <Sparkles className="w-5 h-5" strokeWidth={1.5} />
                            </div>
                            <h4 className="text-lg font-serif font-bold text-slate-900 dark:text-white mb-2">
                                24/7 AI Concierge
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                                Miss London handles catalog inquiries, tracks parcels, and drives conversions for your store around the clock.
                            </p>
                        </div>
                    </div>

                    {/* Support Contact */}
                    <div className="mt-16 text-center">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Have specific partnership or enterprise supply requirements?{' '}
                            <Link href="/contact" className="text-slate-900 dark:text-white font-medium underline underline-offset-4 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                                Speak with our Merchant Relations team
                            </Link>
                            .
                        </p>
                    </div>
                </div>
            </section>

        </div>
    );
}
