'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('System Data Error:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-primary-surface flex items-center justify-center px-4 py-12 transition-all duration-500 font-sans">
            <div className="max-w-xl w-full text-center">
                {/* Institutional Graphic */}
                <div className="mb-12 relative flex justify-center opacity-80">
                    <div className="text-[140px] font-black text-rose-50 dark:text-rose-950/20 select-none tracking-tighter opacity-50">ERROR</div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 border border-rose-500 bg-white dark:bg-slate-950 flex items-center justify-center text-rose-500 shadow-[0_20px_50px_-12px_rgba(244,63,94,0.15)]">
                            <AlertTriangle className="w-10 h-10" strokeWidth={1} />
                        </div>
                    </div>
                </div>

                {/* Branding & Message */}
                <div className="space-y-6">
                    <h1 className="text-[10px] font-black uppercase tracking-[0.5em] text-rose-600 inline-block border-b border-rose-100 dark:border-rose-900/30 pb-2">
                        System Interruption
                    </h1>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-950 dark:text-white uppercase transition-colors">
                        Data Synchronisation Failed
                    </h2>
                    <p className="text-[11px] font-medium uppercase tracking-widest leading-relaxed text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                        A critical interruption occurred in the logistics pipeline. Our engineers have been alerted. You may attempt to re-initialize the session.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="mt-12 flex flex-col md:flex-row gap-4 justify-center">
                    <button
                        onClick={() => reset()}
                        className="flex items-center justify-center gap-3 bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-10 py-5 rounded-none text-[10px] font-black uppercase tracking-[0.3em] hover:bg-slate-800 dark:hover:bg-slate-100 transition-all active:scale-95 shadow-sm"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Reset Protocol
                    </button>
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-950 dark:text-white px-10 py-5 rounded-none text-[10px] font-black uppercase tracking-[0.3em] hover:bg-slate-50 dark:hover:bg-slate-900 transition-all active:scale-95"
                    >
                        <Home className="w-4 h-4" />
                        Emergency Home
                    </Link>
                </div>

                {/* Quick Contact */}
                <div className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-900">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                        Critical Failure? <br className="md:hidden" />
                        <Link href="https://wa.me/233541096372" className="text-slate-950 dark:text-white underline underline-offset-8 decoration-slate-200 dark:decoration-slate-800 hover:text-rose-500 transition-colors ml-2">WhatsApp Support</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
