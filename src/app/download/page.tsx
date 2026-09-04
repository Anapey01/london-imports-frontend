import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
    title: "Download Android App | London's Imports",
    description: "Download the official London's Imports Android App for seamless order tracking and exclusive shopping.",
};

export default function DownloadPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-white relative flex flex-col justify-between selection:bg-amber-500 selection:text-black">
            {/* Ambient background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-amber-500/10 to-transparent blur-3xl pointer-events-none" />

            <div className="max-w-2xl mx-auto px-6 pt-24 pb-16 w-full text-center relative z-10">
                {/* App Icon */}
                <div className="inline-block relative mb-6">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl mx-auto flex items-center justify-center p-3">
                        <Image
                            src="/icon-512.png"
                            alt="London's Imports App Icon"
                            width={112}
                            height={112}
                            priority
                            className="rounded-2xl object-cover"
                        />
                    </div>
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow">
                        Community Beta
                    </span>
                </div>

                {/* Title & Subtitle */}
                <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight mb-2">
                    London&apos;s Imports
                </h1>
                <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto mb-8">
                    Shop authentic UK & global goods, get real-time flight notifications, and track deliveries right from your home screen.
                </p>

                {/* Primary Download Button */}
                <div className="max-w-sm mx-auto mb-10">
                    <a
                        href="/londons-imports.apk"
                        download="londons-imports.apk"
                        className="group flex items-center justify-center gap-3 w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-4 px-6 rounded-2xl shadow-xl shadow-amber-500/10 hover:shadow-amber-500/25 transition-all transform active:scale-95"
                    >
                        <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <div className="text-left">
                            <div className="text-sm font-black uppercase tracking-wider leading-none">Download for Android</div>
                            <div className="text-[11px] font-semibold opacity-80 mt-1">Version 1.0.0 • APK (2.4 MB)</div>
                        </div>
                    </a>
                    <p className="text-[11px] text-slate-500 mt-2">
                        Registered & Verified with Android Certified Developer Console
                    </p>
                </div>

                {/* How to Install Card */}
                <div className="bg-slate-900/80 backdrop-blur border border-slate-800/80 rounded-2xl p-6 text-left max-w-md mx-auto mb-8 shadow-lg">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4 text-center">
                        Quick Installation Guide
                    </h3>

                    <ol className="space-y-4 text-xs sm:text-sm text-slate-300">
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/10 text-amber-400 font-bold flex items-center justify-center text-xs">1</span>
                            <div>
                                <span className="font-semibold text-white">Download APK:</span> Tap the button above to download the file directly to your phone.
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/10 text-amber-400 font-bold flex items-center justify-center text-xs">2</span>
                            <div>
                                <span className="font-semibold text-white">Allow Installation:</span> If your phone shows <em>&quot;Install unknown apps&quot;</em>, tap <strong>Settings</strong> &rarr; enable <strong>Allow from this source</strong> &rarr; tap <strong>Install</strong>.
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/10 text-amber-400 font-bold flex items-center justify-center text-xs">3</span>
                            <div>
                                <span className="font-semibold text-white">Open &amp; Explore:</span> Launch London&apos;s Imports and allow notifications for flight and delivery updates!
                            </div>
                        </li>
                    </ol>
                </div>

                {/* Return Home Link */}
                <div>
                    <Link
                        href="/"
                        className="text-xs font-semibold text-slate-400 hover:text-white transition-colors underline underline-offset-4"
                    >
                        &larr; Or continue to londonsimports.com website
                    </Link>
                </div>
            </div>

            {/* Simple Footer */}
            <footer className="py-6 border-t border-slate-900 text-center text-slate-600 text-xs">
                &copy; {new Date().getFullYear()} London&apos;s Imports. All rights reserved.
            </footer>
        </div>
    );
}
