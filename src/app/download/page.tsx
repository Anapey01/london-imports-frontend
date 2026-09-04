import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight, ShieldCheck, Bell, Zap, Smartphone, Check } from 'lucide-react';

export const revalidate = 86400;

export const metadata: Metadata = {
    title: "Download Android Application | London's Imports",
    description: "Install the official London's Imports Android Application for real-time order tracking, push notifications, and seamless international shopping in Ghana.",
};

export default function DownloadPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 relative pb-32 selection:bg-emerald-100 dark:selection:bg-slate-800">
            {/* 1. ARCHITECTURAL HEADER */}
            <header className="relative z-10 pt-24 pb-16 px-6 max-w-7xl mx-auto border-b border-slate-100 dark:border-slate-900">
                <div className="flex items-center gap-4 mb-12">
                    <span className="h-px w-12 bg-slate-900 dark:bg-white" />
                    <span className="text-[10px] font-black tracking-[0.4em] uppercase text-slate-400 dark:text-slate-500">
                        Android Application / Community Release
                    </span>
                </div>

                <h1 className="text-5xl md:text-8xl lg:text-9xl font-serif font-bold leading-[0.85] tracking-tighter text-slate-900 dark:text-white mb-16">
                    Pocket <br />
                    <span className="italic font-light text-slate-200 dark:text-slate-800">Concierge</span>.
                </h1>

                <div className="max-w-2xl">
                    <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                        The full London&apos;s Imports logistics experience on your Android device. Instant flight milestone alerts, package inspection updates, and frictionless checkout.
                    </p>
                </div>
            </header>

            {/* 2. THE DISTRIBUTION LEDGER (Split Grid Architecture) */}
            <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
                <div className="grid lg:grid-cols-12 gap-px bg-slate-100 dark:bg-slate-900 border border-slate-100 dark:border-slate-900">
                    
                    {/* Left Column: Download CTA & Technical Specs */}
                    <div className="lg:col-span-7 bg-white dark:bg-slate-950 p-8 md:p-16 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-8">
                                <span className="text-[10px] font-black tracking-[0.3em] uppercase text-emerald-700 dark:text-emerald-500 italic">
                                    Distribution / Verified Package
                                </span>
                                <span className="inline-flex items-center gap-1.5 text-[9px] font-black tracking-[0.2em] uppercase bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 px-3 py-1">
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                    Android Certified
                                </span>
                            </div>

                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white tracking-tight leading-none mb-6">
                                London&apos;s Imports for Android
                            </h2>

                            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed mb-10">
                                Built as a high-performance Trusted Web Activity with native Android notifications, offline resilience, and secure Mobile Money payment handling via Hubtel.
                            </p>

                            {/* Download Action */}
                            <a
                                href="/londons-imports.apk"
                                download="londons-imports.apk"
                                className="group flex items-center justify-between w-full p-6 sm:p-8 bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:bg-emerald-700 dark:hover:bg-emerald-500 dark:hover:text-slate-950 transition-all duration-300 shadow-xl mb-10"
                            >
                                <div>
                                    <span className="text-[10px] font-black tracking-[0.3em] uppercase block opacity-70 mb-1">
                                        Release 1.0.0 • 2.4 MB
                                    </span>
                                    <span className="text-xl sm:text-2xl font-serif font-bold tracking-tight">
                                        Download Android APK
                                    </span>
                                </div>
                                <div className="w-12 h-12 rounded-full border border-white/20 dark:border-slate-900/20 flex items-center justify-center group-hover:translate-y-1 transition-transform">
                                    <ArrowDown className="w-5 h-5" />
                                </div>
                            </a>
                        </div>

                        {/* Technical Spec Ledger */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-8 border-t border-slate-100 dark:border-slate-900">
                            <div>
                                <span className="text-[9px] font-black text-slate-400 dark:text-slate-600 tracking-[0.2em] uppercase block mb-1">
                                    Package ID
                                </span>
                                <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                                    com.londonsimports.app
                                </span>
                            </div>
                            <div>
                                <span className="text-[9px] font-black text-slate-400 dark:text-slate-600 tracking-[0.2em] uppercase block mb-1">
                                    Compatibility
                                </span>
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                    Android 5.0 and above
                                </span>
                            </div>
                            <div>
                                <span className="text-[9px] font-black text-slate-400 dark:text-slate-600 tracking-[0.2em] uppercase block mb-1">
                                    Notification Feed
                                </span>
                                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                    FCM Real-Time
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Setup Protocol */}
                    <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-900/40 p-8 md:p-16 flex flex-col justify-between">
                        <div>
                            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-400 dark:text-slate-500 mb-8 block">
                                Setup Protocol / 3 Steps
                            </span>

                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <span className="text-xs font-mono font-black text-slate-400 dark:text-slate-600 border border-slate-200 dark:border-slate-800 w-7 h-7 flex items-center justify-center flex-shrink-0">
                                        01
                                    </span>
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-1">
                                            Download the Package
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                            Tap the download button to save <code className="text-[11px] font-mono bg-white dark:bg-slate-800 px-1 py-0.5 border border-slate-200 dark:border-slate-700">londons-imports.apk</code> to your device.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <span className="text-xs font-mono font-black text-slate-400 dark:text-slate-600 border border-slate-200 dark:border-slate-800 w-7 h-7 flex items-center justify-center flex-shrink-0">
                                        02
                                    </span>
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-1">
                                            Authorize Installation
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                            If Android prompts <em>&quot;Install unknown apps&quot;</em>, select <strong>Settings</strong> &rarr; toggle <strong>Allow from this source</strong> &rarr; tap <strong>Install</strong>.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <span className="text-xs font-mono font-black text-slate-400 dark:text-slate-600 border border-slate-200 dark:border-slate-800 w-7 h-7 flex items-center justify-center flex-shrink-0">
                                        03
                                    </span>
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-1">
                                            Activate Push Updates
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                            Launch the app from your home screen and allow notifications to receive flight and arrival milestones automatically.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-10 mt-10 border-t border-slate-200 dark:border-slate-800">
                            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                <span>Signed with official SHA-256 certificate registered on Google Android Developer Console.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. APP CAPABILITY SHOWCASE */}
            <section className="relative z-10 max-w-7xl mx-auto px-6 py-16 border-t border-slate-100 dark:border-slate-900">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
                    <div>
                        <span className="text-[10px] font-black tracking-[0.4em] uppercase text-slate-400 dark:text-slate-500 block mb-4">
                            Platform Features / Native Experience
                        </span>
                        <h2 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 dark:text-white tracking-tight">
                            Engineered for Speed &amp; Clarity
                        </h2>
                    </div>
                    <Link
                        href="/track"
                        className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white hover:text-emerald-600 transition-colors"
                    >
                        Try Live Web Tracker <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="p-8 border border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-950">
                        <div className="w-10 h-10 mb-8 border border-slate-200 dark:border-slate-800 flex items-center justify-center">
                            <Bell className="w-5 h-5 text-slate-900 dark:text-white" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white mb-2">
                            Flight &amp; Vessel Alerts
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                            Never wonder where your parcel is. Receive instantaneous push notifications the moment your batch boards a flight or clears customs in Accra.
                        </p>
                    </div>

                    <div className="p-8 border border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-950">
                        <div className="w-10 h-10 mb-8 border border-slate-200 dark:border-slate-800 flex items-center justify-center">
                            <Zap className="w-5 h-5 text-emerald-600" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white mb-2">
                            One-Tap Mobile Checkout
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                            Pay securely with MTN MoMo, Telecel Cash, or Card via Hubtel with zero redirection lag and instant receipt confirmation.
                        </p>
                    </div>

                    <div className="p-8 border border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-950">
                        <div className="w-10 h-10 mb-8 border border-slate-200 dark:border-slate-800 flex items-center justify-center">
                            <Smartphone className="w-5 h-5 text-slate-900 dark:text-white" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white mb-2">
                            Full-Screen Immersion
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                            Clean interface without browser address bars, native gesture navigation integration, and buttery-smooth page transitions.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
