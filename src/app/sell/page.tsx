'use client';

import Link from 'next/link';
import { useTheme } from '@/providers/ThemeProvider';
import { ArrowRight, Store, Briefcase, LogIn } from 'lucide-react';

export default function SellPage() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className={`min-h-screen transition-colors ${isDark ? 'bg-slate-950' : 'bg-gray-50'}`}>
            {/* Hero Section */}
            <div className={`relative overflow-hidden pt-24 pb-16 px-4 sm:px-6 lg:px-8 text-center`}>
                <div className="relative z-10 max-w-3xl mx-auto">
                    <h1 className={`text-4xl sm:text-5xl font-extrabold tracking-tight mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Grow Your Business with <span className="text-pink-600">London&apos;s Imports</span>
                    </h1>
                    <p className={`text-lg sm:text-xl font-light mb-10 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                        Choose the partnership model that fits your goals. Whether you want to join our marketplace or manage your own exclusive branded store.
                    </p>
                </div>
            </div>

            {/* Options Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                <div className="grid md:grid-cols-2 gap-8 lg:gap-12">

                    {/* Option 1: Marketplace Seller */}
                    <div className={`relative group rounded-3xl p-8 sm:p-10 border transition-all duration-300 hover:shadow-2xl ${isDark ? 'bg-slate-900 border-slate-800 hover:border-pink-900/50' : 'bg-white border-gray-200 hover:border-pink-100'}`}>
                        <div className={`inline-flex items-center justify-center p-4 rounded-2xl mb-6 ${isDark ? 'bg-slate-800 text-pink-400' : 'bg-pink-50 text-pink-600'}`}>
                            <Store className="w-8 h-8" strokeWidth={1.5} />
                        </div>
                        <h3 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Marketplace Seller
                        </h3>
                        <p className={`text-base mb-8 min-h-[50px] ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                            List your products on our main high-traffic feed. Ideal for individual sellers and small businesses looking for exposure.
                        </p>

                        <div className="flex flex-col gap-4">
                            <Link
                                href="/register/seller"
                                className="flex items-center justify-center gap-2 w-full py-4 rounded-xl text-white font-semibold bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 transition-all shadow-lg shadow-pink-600/20"
                            >
                                Join Marketplace
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link
                                href="/login"
                                className={`flex items-center justify-center gap-2 w-full py-4 rounded-xl font-medium border transition-all ${isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                            >
                                <LogIn className="w-5 h-5" />
                                Login as Seller
                            </Link>
                        </div>
                    </div>

                    {/* Option 2: Strategic Partner */}
                    <div className={`relative group rounded-3xl p-8 sm:p-10 border transition-all duration-300 hover:shadow-2xl ${isDark ? 'bg-slate-900 border-slate-800 hover:border-purple-900/50' : 'bg-white border-gray-200 hover:border-purple-100'}`}>
                        <div className="absolute top-6 right-8">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isDark ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>
                                Recommended
                            </span>
                        </div>
                        <div className={`inline-flex items-center justify-center p-4 rounded-2xl mb-6 ${isDark ? 'bg-slate-800 text-purple-400' : 'bg-purple-50 text-purple-600'}`}>
                            <Briefcase className="w-8 h-8" strokeWidth={1.5} />
                        </div>
                        <h3 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Strategic Partner
                        </h3>
                        <p className={`text-base mb-8 min-h-[50px] ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                            Get your own branded storefront, full control over payments (Paystack), and &quot;Auto-Verified&quot; status.
                        </p>

                        <div className="flex flex-col gap-4">
                            <Link
                                href="/register/partner"
                                className="flex items-center justify-center gap-2 w-full py-4 rounded-xl text-white font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all shadow-lg shadow-purple-600/20"
                            >
                                Become a Partner
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link
                                href="/login"
                                className={`flex items-center justify-center gap-2 w-full py-4 rounded-xl font-medium border transition-all ${isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                            >
                                <LogIn className="w-5 h-5" />
                                Login as Partner
                            </Link>
                        </div>
                    </div>

                </div>

                <div className={`mt-16 text-center ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
                    <p>Not sure yet? <Link href="/contact" className="underline hover:text-pink-500">Contact our support team</Link> for guidance.</p>
                </div>
            </div>
        </div>
    );
}
