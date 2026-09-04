import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight, ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
    title: "Android Application | London's Imports",
    description: "Community preview and installation portal for the London's Imports Android Application.",
};

const GOOGLE_DEVICE_INVITE_URL = "https://android.google.com/developerconsole/device-invite/CroBChDv3LDvZkNL76MQyG9qGE0-EngIuPy3vQ0ScApkCjR0eXBlLmdvb2dsZWFwaXMuY29tL2dvb2dsZS5jcnlwdG8udGluay5IcGtlUHVibGljS2V5EioSBggBEAEYAhogLN5rWZWiz9vfy1ktAJf0T9cGPHVs7zxZZ3eM2DtmfzwYAxABGLj8t70NIAEaDAiTxI7VBhColNX8AiIeCN6MsrS5xpCqHxISTG9uZG9u4oCZcyBJbXBvcnRzEkcwRQIhAK2uU0KRna3nv6GOZ5-KkBlktg61JBNSVHvs4tu6X1YIAiBXjt8Ve6vxN2tx46xWms7vj908-5j_6iUn0WO01cjsvQ==";

export default function DownloadPage() {
    return (
        <div className="min-h-[85vh] bg-surface flex items-center justify-center py-20 px-6 selection:bg-emerald-100/30">
            <div className="w-full max-w-md">
                {/* Minimal Header */}
                <header className="mb-12">
                    <div className="flex items-center gap-3 mb-6 opacity-60">
                        <div className="h-px w-8 bg-content-primary" />
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-content-primary">
                            Android Release / Preview
                        </span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-serif font-bold text-content-primary tracking-tight leading-tight mb-4">
                        London&apos;s Imports
                    </h1>

                    <p className="text-xs sm:text-sm font-medium text-content-secondary leading-relaxed">
                        To install the application on your Android phone, complete device authorization with Google, then download the release package.
                    </p>
                </header>

                {/* Actions */}
                <div className="space-y-4 mb-12">
                    {/* Step 1: Device Authorization */}
                    <a
                        href={GOOGLE_DEVICE_INVITE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between w-full p-4 bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:opacity-90 transition-opacity rounded-none"
                    >
                        <div className="text-left">
                            <span className="text-[9px] font-black uppercase tracking-widest block opacity-70 mb-0.5">
                                Step 01
                            </span>
                            <span className="text-sm font-semibold tracking-wide">
                                Authorize Device with Google
                            </span>
                        </div>
                        <ArrowUpRight className="w-4 h-4" />
                    </a>

                    {/* Step 2: Download APK */}
                    <a
                        href="/londons-imports.apk"
                        download="londons-imports.apk"
                        className="flex items-center justify-between w-full p-4 border border-border-standard bg-surface-card text-content-primary hover:bg-surface transition-colors rounded-none"
                    >
                        <div className="text-left">
                            <span className="text-[9px] font-black uppercase tracking-widest block opacity-70 mb-0.5">
                                Step 02
                            </span>
                            <span className="text-sm font-semibold tracking-wide">
                                Download APK (2.4 MB)
                            </span>
                        </div>
                        <ArrowDown className="w-4 h-4" />
                    </a>
                </div>

                {/* Minimalist Specs */}
                <div className="border-t border-border-standard pt-6 space-y-2 text-[11px] text-content-secondary font-mono">
                    <div className="flex justify-between">
                        <span>Package:</span>
                        <span className="text-content-primary font-bold">com.londonsimports.app</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Target SDK:</span>
                        <span className="text-content-primary">Android 14 (API 34)</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Security:</span>
                        <span className="text-brand-emerald font-semibold">v1 + v2 Signed</span>
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
