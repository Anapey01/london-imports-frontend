import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowDown, ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
    title: "Download Android App | London's Imports",
    description: "Download the official London's Imports Android Application for real-time order tracking and global shopping.",
};

export default function DownloadPage() {
    return (
        <div className="min-h-[85vh] bg-surface flex items-center justify-center py-20 px-6 selection:bg-emerald-100/30">
            <div className="w-full max-w-md">
                {/* Minimal Header */}
                <header className="mb-10">
                    <div className="flex items-center gap-3 mb-6 opacity-60">
                        <div className="h-px w-8 bg-content-primary" />
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-content-primary">
                            Official Mobile Application
                        </span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-serif font-bold text-content-primary tracking-tight leading-tight mb-4">
                        London&apos;s Imports
                    </h1>

                    <p className="text-xs sm:text-sm font-medium text-content-secondary leading-relaxed">
                        Download the official Android application for real-time flight milestone alerts, instant package tracking, and seamless checkout in Ghana.
                    </p>
                </header>

                {/* Primary Download Action */}
                <div className="mb-10">
                    <a
                        href="/londons-imports.apk"
                        download="londons-imports.apk"
                        className="flex items-center justify-between w-full p-5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:opacity-90 transition-opacity rounded-none shadow-sm"
                    >
                        <div className="text-left">
                            <span className="text-[9px] font-black uppercase tracking-widest block opacity-70 mb-0.5">
                                Android Package (APK)
                            </span>
                            <span className="text-base font-semibold tracking-wide">
                                Download Application (2.4 MB)
                            </span>
                        </div>
                        <ArrowDown className="w-5 h-5" />
                    </a>

                    <p className="text-[11px] text-content-secondary mt-3">
                        After downloading, tap the file in your notifications or Downloads folder to install.
                    </p>
                </div>

                {/* Minimalist Specs */}
                <div className="border-t border-border-standard pt-6 space-y-2.5 text-[11px] text-content-secondary font-mono">
                    <div className="flex justify-between">
                        <span>Package:</span>
                        <span className="text-content-primary font-bold">com.londonsimports.app</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Version:</span>
                        <span className="text-content-primary">1.0.0 (Release 2)</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Compatibility:</span>
                        <span className="text-content-primary">Android 5.0 to 15+</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Verification:</span>
                        <span className="text-brand-emerald font-semibold inline-flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 inline" /> Verified Release
                        </span>
                    </div>
                </div>

                {/* Return link */}
                <div className="mt-10 pt-6 border-t border-border-standard">
                    <Link
                        href="/"
                        className="text-[11px] font-semibold text-content-secondary hover:text-content-primary transition-colors"
                    >
                        &larr; Back to londonsimports.com
                    </Link>
                </div>
            </div>
        </div>
    );
}
