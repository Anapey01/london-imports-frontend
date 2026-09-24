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
                            Sell With Us
                        </span>
                    </div>

                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif font-bold text-slate-900 dark:text-white leading-[0.95] tracking-tight mb-6">
                        Grow with <br />
                        <span className="italic font-light text-slate-400 dark:text-slate-600">London&apos;s Imports.</span>
                    </h1>

                    <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl font-normal leading-relaxed">
                        Two simple ways to sell. Reach thousands of buyers across Ghana with safe payments, reliable doorstep delivery, and 24/7 customer support.
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
                                    Option 01 · Individual Sellers
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white mb-4">
                                    Marketplace Seller
                                </h2>
                                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                                    Great if you have products to sell. Put your items on our marketplace, start getting orders from customers across Ghana, and let us handle the delivery.
                                </p>

                                <ul className="space-y-3.5 mb-10 border-t border-slate-100 dark:border-slate-800/80 pt-6">
                                    {[
                                        'Show your items to thousands of active shoppers on web & mobile',
                                        'Simple and quick way to add products and manage your stock',
                                        'Safe payments: money goes straight to your MoMo or bank after delivery',
                                        'Miss London assists your customers 24/7 so you never miss an order',
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
                                    Start Selling
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                                <Link
                                    href="/login?role=vendor&redirect=/dashboard/vendor"
                                    className="flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl text-xs font-semibold uppercase tracking-widest border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all active:scale-[0.99]"
                                >
                                    <LogIn className="w-4 h-4" />
                                    Seller Login
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
                                        Your Own Store
                                    </span>
                                </div>

                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 block mb-2">
                                    Option 02 · For Registered Brands
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white mb-4">
                                    Branded Partner
                                </h2>
                                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                                    For registered businesses and brands. Get your own custom store link, verified badge, and priority shipping from China to Ghana.
                                </p>

                                <ul className="space-y-3.5 mb-10 border-t border-slate-100 dark:border-slate-800/80 pt-6">
                                    {[
                                        'Your own custom store link to share (londonsimports.com/store/your-name)',
                                        'Add your business logo, custom banners, and collections',
                                        'Official Verified Badge on all items so buyers trust your store',
                                        'Automatic payouts sent directly to your MoMo or bank account',
                                        'Fast priority air and sea shipping directly from China',
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
                                    Open a Branded Store
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                                <Link
                                    href="/login?role=vendor&redirect=/dashboard/vendor"
                                    className="flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl text-xs font-semibold uppercase tracking-widest border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all active:scale-[0.99]"
                                >
                                    <LogIn className="w-4 h-4" />
                                    Partner Login
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
                            Why Sell With Us
                        </span>
                        <h3 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 dark:text-white">
                            Built for everyday business in Ghana
                        </h3>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 rounded-xl p-8 shadow-sm">
                            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-white mb-6">
                                <ShieldCheck className="w-5 h-5" strokeWidth={1.5} />
                            </div>
                            <h4 className="text-lg font-serif font-bold text-slate-900 dark:text-white mb-2">
                                Safe &amp; Guaranteed Payouts
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                                Buyers pay upfront. We hold the money safely and send it straight to you as soon as the item is delivered. No fake orders, no lost money.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 rounded-xl p-8 shadow-sm">
                            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-white mb-6">
                                <Truck className="w-5 h-5" strokeWidth={1.5} />
                            </div>
                            <h4 className="text-lg font-serif font-bold text-slate-900 dark:text-white mb-2">
                                We Handle Delivery
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                                From shipping items from China to sending delivery riders to your customer&apos;s doorstep in Accra, Kumasi, or anywhere in Ghana, we do the heavy lifting.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 rounded-xl p-8 shadow-sm">
                            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-white mb-6">
                                <Sparkles className="w-5 h-5" strokeWidth={1.5} />
                            </div>
                            <h4 className="text-lg font-serif font-bold text-slate-900 dark:text-white mb-2">
                                Miss London Helps You Sell
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                                Miss London answers customer questions, helps people find your products, and tracks their orders day and night so you can focus on your business.
                            </p>
                        </div>
                    </div>

                    {/* Support Contact */}
                    <div className="mt-16 text-center">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Have questions or need help setting up your store?{' '}
                            <Link href="/contact" className="text-slate-900 dark:text-white font-medium underline underline-offset-4 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                                Chat with our support team
                            </Link>
                            .
                        </p>
                    </div>
                </div>
            </section>

        </div>
    );
}
