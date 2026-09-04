import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight, ShieldCheck, Smartphone, CheckCircle2, QrCode } from 'lucide-react';

export const revalidate = 0; // Dynamic/instant reload - no stale cache

export const metadata: Metadata = {
    title: "Android Testing Portal | London's Imports",
    description: "Official London's Imports Android Application early-access installation portal for community testers.",
};

const GOOGLE_DEVICE_INVITE_URL = "https://android.google.com/developerconsole/device-invite/CroBChDv3LDvZkNL76MQyG9qGE0-EngIuPy3vQ0ScApkCjR0eXBlLmdvb2dsZWFwaXMuY29tL2dvb2dsZS5jcnlwdG8udGluay5IcGtlUHVibGljS2V5EioSBggBEAEYAhogLN5rWZWiz9vfy1ktAJf0T9cGPHVs7zxZZ3eM2DtmfzwYAxABGLj8t70NIAEaDAiTxI7VBhColNX8AiIeCN6MsrS5xpCqHxISTG9uZG9u4oCZcyBJbXBvcnRzEkcwRQIhAK2uU0KRna3nv6GOZ5-KkBlktg61JBNSVHvs4tu6X1YIAiBXjt8Ve6vxN2tx46xWms7vj908-5j_6iUn0WO01cjsvQ==";

export default function DownloadPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 relative pb-32 selection:bg-emerald-100 dark:selection:bg-slate-800">
            {/* 1. ARCHITECTURAL HEADER */}
            <header className="relative z-10 pt-24 pb-16 px-6 max-w-7xl mx-auto border-b border-slate-100 dark:border-slate-900">
                <div className="flex items-center gap-4 mb-8">
                    <span className="h-px w-12 bg-slate-900 dark:bg-white" />
                    <span className="text-[10px] font-black tracking-[0.4em] uppercase text-slate-400 dark:text-slate-500">
                        Android Testing Portal / Early Access
                    </span>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                    <div className="max-w-3xl">
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tight text-slate-900 dark:text-white leading-[0.95] mb-6">
                            London&apos;s <br />
                            <span className="italic font-light text-slate-300 dark:text-slate-700">On Android.</span>
                        </h1>
                        <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-2xl">
                            Install the official London&apos;s Imports Android build. Follow the two-step verification below to authorize your device and download the verified release package.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 border border-slate-200 dark:border-slate-800 px-4 py-3 bg-slate-50 dark:bg-slate-900">
                        <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <div>
                            <span className="text-[10px] font-black tracking-wider uppercase text-slate-900 dark:text-white block leading-none">
                                Android Certified
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                                SHA-256 Verified
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* 2. THE TWO-STEP INSTALLATION MATRIX */}
            <section className="relative z-10 max-w-7xl mx-auto px-6 py-16">
                <div className="grid md:grid-cols-2 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">

                    {/* STEP 1: GOOGLE DEVICE AUTHORIZATION */}
                    <div className="bg-white dark:bg-slate-950 p-8 sm:p-12 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-8">
                                <span className="text-[10px] font-black tracking-[0.3em] uppercase text-emerald-700 dark:text-emerald-400">
                                    Step 01 / Mandatory
                                </span>
                                <span className="text-xs font-mono font-bold text-slate-400">
                                    Google Android Console
                                </span>
                            </div>

                            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white mb-4">
                                Authorize Your Device
                            </h2>

                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
                                Android requires test devices to be authorized before installing registered packages. Tap the button below on your Android phone to authorize it in one tap via Google.
                            </p>

                            <a
                                href={GOOGLE_DEVICE_INVITE_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center justify-between w-full p-5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:bg-emerald-700 dark:hover:bg-emerald-500 dark:hover:text-slate-950 transition-colors duration-200 mb-6"
                            >
                                <div className="text-left">
                                    <span className="text-[9px] font-black tracking-[0.2em] uppercase opacity-70 block mb-0.5">
                                        Tap on your phone
                                    </span>
                                    <span className="text-sm sm:text-base font-serif font-bold">
                                        Authorize Device with Google
                                    </span>
                                </div>
                                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </a>

                            {/* QR Code Alternative for Desktop viewers */}
                            <div className="pt-6 border-t border-slate-100 dark:border-slate-900 flex items-center gap-4">
                                <div className="w-20 h-20 bg-white p-1 border border-slate-200 dark:border-slate-800 flex-shrink-0">
                                    <Image
                                        src="/device-auth-qr.png"
                                        alt="Scan to authorize test device"
                                        width={80}
                                        height={80}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">
                                    <span className="font-semibold text-slate-900 dark:text-white block mb-0.5">
                                        Viewing on computer?
                                    </span>
                                    Scan this QR code with your phone camera to authorize your test device directly.
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* STEP 2: DOWNLOAD VERIFIED APK */}
                    <div className="bg-white dark:bg-slate-950 p-8 sm:p-12 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-8">
                                <span className="text-[10px] font-black tracking-[0.3em] uppercase text-emerald-700 dark:text-emerald-400">
                                    Step 02 / Installation
                                </span>
                                <span className="text-xs font-mono font-bold text-slate-400">
                                    Binary Package
                                </span>
                            </div>

                            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white mb-4">
                                Download Signed APK
                            </h2>

                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
                                Signed with full APK Signature Schemes v1, v2, and v3. Compatible with all Android versions without package parsing issues.
                            </p>

                            <a
                                href="/londons-imports.apk"
                                download="londons-imports.apk"
                                className="group flex items-center justify-between w-full p-5 bg-emerald-700 text-white hover:bg-emerald-800 transition-colors duration-200 mb-6"
                            >
                                <div className="text-left">
                                    <span className="text-[9px] font-black tracking-[0.2em] uppercase opacity-80 block mb-0.5">
                                        Version 1.0.0 • 2.4 MB
                                    </span>
                                    <span className="text-sm sm:text-base font-serif font-bold">
                                        Download Android APK
                                    </span>
                                </div>
                                <ArrowDown className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                            </a>

                            {/* Technical Specs */}
                            <div className="pt-6 border-t border-slate-100 dark:border-slate-900 space-y-2 text-xs">
                                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                                    <span>Package ID:</span>
                                    <span className="font-mono text-slate-900 dark:text-white font-bold">com.londonsimports.app</span>
                                </div>
                                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                                    <span>Signature Scheme:</span>
                                    <span className="text-emerald-600 font-medium">v1 + v2 + v3 Signed</span>
                                </div>
                                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                                    <span>Compatibility:</span>
                                    <span className="text-slate-900 dark:text-white">Android 5.0 to 15+</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. INSTALLATION ASSISTANCE PROTOCOL */}
            <section className="relative z-10 max-w-7xl mx-auto px-6 py-12">
                <div className="border border-slate-200 dark:border-slate-800 p-8 bg-slate-50 dark:bg-slate-900/40">
                    <span className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-400 dark:text-slate-500 block mb-4">
                        Troubleshooting &amp; Support
                    </span>
                    <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white mb-6">
                        Installation Instructions for Testers
                    </h3>

                    <div className="grid md:grid-cols-3 gap-6 text-xs text-slate-600 dark:text-slate-400">
                        <div className="space-y-2">
                            <span className="font-bold text-slate-900 dark:text-white block text-sm">
                                1. Authorize First
                            </span>
                            <p className="leading-relaxed">
                                Always tap <strong>Step 1</strong> to authorize your device with Google. This registers your phone with Google Android to permit installation.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <span className="font-bold text-slate-900 dark:text-white block text-sm">
                                2. Allow Unknown Apps
                            </span>
                            <p className="leading-relaxed">
                                When prompted <em>&quot;Install unknown apps&quot;</em>, tap <strong>Settings</strong> &rarr; enable <strong>Allow from this source</strong> &rarr; return and tap <strong>Install</strong>.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <span className="font-bold text-slate-900 dark:text-white block text-sm">
                                3. Enable Notifications
                            </span>
                            <p className="leading-relaxed">
                                Upon first launch, grant notification permissions so you can receive flight departures, arrivals, and delivery tracking updates in real time.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
