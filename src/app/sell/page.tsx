'use client';

import Link from 'next/link';
import { useTheme } from '@/providers/ThemeProvider';
import { ArrowRight, Store, Briefcase, LogIn, CheckCircle2 } from 'lucide-react';

export default function SellPage() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className={`min-h-screen transition-colors ${isDark ? 'bg-slate-950 text-white' : 'bg-gray-50 text-gray-900'}`}>

            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 ${isDark ? 'bg-purple-900' : 'bg-pink-300'}`} />
                <div className={`absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 ${isDark ? 'bg-pink-900' : 'bg-purple-300'}`} />
            </div>

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 text-center z-10">
                <div className="max-w-4xl mx-auto space-y-6">
                    <span className={`inline-block py-1 px-3 rounded-full text-xs font-semibold tracking-wider uppercase ${isDark ? 'bg-slate-800 text-slate-300 border border-slate-700' : 'bg-white text-gray-500 border border-gray-200'}`}>
                        Partnership Programs
                    </span>
                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-light tracking-tight">
                        Grow with <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">London&apos;s Imports</span>
                    </h1>
                    <p className={`text-xl sm:text-2xl font-light max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                        Two powerful ways to sell. One world-class platform.
                        Choose the model that fits your business ambition.
                    </p>
                </div>
            </div>

            {/* Options Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 relative z-10">
                <div className="grid md:grid-cols-2 gap-8 lg:gap-16">

                    {/* Option 1: Marketplace Seller */}
                    <div className={`group relative p-8 sm:p-10 rounded-[2.5rem] border transition-all duration-500 hover:scale-[1.01] ${isDark
                        ? 'bg-slate-900/50 border-slate-800 hover:border-pink-500/30 backdrop-blur-xl'
                        : 'bg-white/80 border-gray-100 hover:border-pink-200 shadow-xl shadow-gray-200/50 backdrop-blur-xl'
                        }`}>
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-lg transition-transform group-hover:rotate-3 ${isDark ? 'bg-slate-800 text-pink-400' : 'bg-pink-50 text-pink-600'}`}>
                            <Store className="w-8 h-8" strokeWidth={1.5} />
                        </div>

                        <h3 className="text-3xl font-medium mb-4">Marketplace Seller</h3>
                        <p className={`text-lg mb-8 leading-relaxed ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                            Perfect for individual sellers. List your unique items on our high-traffic feed and reach thousands of customers instantly.
                        </p>

                        <ul className="space-y-4 mb-10">
                            {[
                                'Instant access to our customer base',
                                'Simple product listing flow',
                                'Secure payments & logistics handled'
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${isDark ? 'text-pink-500' : 'text-pink-600'}`} strokeWidth={2} />
                                    <span className={`text-base ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>{item}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="space-y-4">
                            <Link
                                href="/register/seller"
                                className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-white font-medium bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 transition-all shadow-lg shadow-pink-600/20 active:scale-[0.98]"
                            >
                                Join Marketplace
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link
                                href="/login?role=vendor&redirect=/dashboard/vendor"
                                className={`flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-medium border transition-all active:scale-[0.98] ${isDark
                                    ? 'border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                                    : 'border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <LogIn className="w-5 h-5" />
                                Login as Seller
                            </Link>
                        </div>
                    </div>

                    {/* Option 2: Strategic Partner */}
                    <div className={`group relative p-8 sm:p-10 rounded-[2.5rem] border transition-all duration-500 hover:scale-[1.01] overflow-hidden ${isDark
                        ? 'bg-slate-900/50 border-slate-700 hover:border-purple-500/50 backdrop-blur-xl'
                        : 'bg-white/80 border-gray-100 hover:border-purple-200 shadow-xl shadow-purple-500/5 backdrop-blur-xl'
                        }`}>
                        {/* Premium Badge */}
                        <div className="absolute top-0 right-0 bg-gradient-to-bl from-purple-600 to-indigo-600 text-white text-xs font-bold px-6 py-3 rounded-bl-3xl shadow-lg">
                            RECOMMENDED
                        </div>

                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-lg transition-transform group-hover:rotate-3 ${isDark ? 'bg-slate-800 text-purple-400' : 'bg-purple-50 text-purple-600'}`}>
                            <Briefcase className="w-8 h-8" strokeWidth={1.5} />
                        </div>

                        <h3 className="text-3xl font-medium mb-4">Strategic Partner</h3>
                        <p className={`text-lg mb-8 leading-relaxed ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                            For established businesses. Get your own branded storefront, 100% payment control via Paystack, and "Auto-Verified" status.
                        </p>

                        <ul className="space-y-4 mb-10">
                            {[
                                'Dedicated Branded Storefront',
                                'Direct Payments (Your Paystack)',
                                'Verified Partner Badge',
                                'Zero listing fees'
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${isDark ? 'text-purple-500' : 'text-purple-600'}`} strokeWidth={2} />
                                    <span className={`text-base ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>{item}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="space-y-4">
                            <Link
                                href="/register/partner"
                                className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-white font-medium bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all shadow-lg shadow-purple-600/20 active:scale-[0.98]"
                            >
                                Become a Partner
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link
                                href="/login?role=partner&redirect=/dashboard/vendor"
                                className={`flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-medium border transition-all active:scale-[0.98] ${isDark
                                    ? 'border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                                    : 'border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <LogIn className="w-5 h-5" />
                                Login as Partner
                            </Link>
                        </div>
                    </div>

                </div>

                <div className={`mt-20 text-center ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                    <p className="text-sm font-light">
                        Need help choosing? <Link href="/contact" className="underline hover:text-pink-500 transition-colors">Contact our support team</Link>.
                    </p>
                </div>
            </div>
        </div>
    );
}
