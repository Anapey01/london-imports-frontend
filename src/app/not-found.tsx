'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Home, Search, ShieldAlert } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

export default function NotFound() {
    useEffect(() => {
        trackEvent('page_not_found', {
            page_path: window.location.pathname,
            referrer: document.referrer
        });
    }, []);

    return (
        <div className="min-h-screen bg-primary-surface flex items-center justify-center px-4 py-12 transition-all duration-500 font-sans">
            <div className="max-w-xl w-full text-center">
                {/* Institutional Graphic */}
                <div className="mb-12 relative flex justify-center">
                    <div className="text-[140px] font-black text-slate-100 dark:text-slate-900 select-none tracking-tighter opacity-50">404</div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 border border-slate-950 dark:border-white bg-white dark:bg-slate-950 flex items-center justify-center text-slate-950 dark:text-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)]">
                            <ShieldAlert className="w-10 h-10" strokeWidth={1} />
                        </div>
                    </div>
                </div>

                {/* Branding & Message */}
                <div className="space-y-6">
                    <h1 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-950 dark:text-white inline-block border-b border-slate-200 dark:border-slate-800 pb-2">
                        Page Not Found
                    </h1>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-950 dark:text-white uppercase transition-colors">
                        Where did you go?
                    </h2>
                    <p className="text-[11px] font-medium uppercase tracking-widest leading-relaxed text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                        The requested shopping path is unavailable. It may have been removed or moved to a new shipping center.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="mt-12 flex flex-col md:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-3 bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-10 py-5 rounded-none text-[10px] font-black uppercase tracking-[0.3em] hover:bg-slate-800 dark:hover:bg-slate-100 transition-all active:scale-95 shadow-sm"
                    >
                        <Home className="w-4 h-4" />
                        Homepage
                    </Link>
                    <Link
                        href="/products"
                        className="flex items-center justify-center gap-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-950 dark:text-white px-10 py-5 rounded-none text-[10px] font-black uppercase tracking-[0.3em] hover:bg-slate-50 dark:hover:bg-slate-900 transition-all active:scale-95"
                    >
                        <Search className="w-4 h-4" />
                        Search Products
                    </Link>
                </div>

                {/* Quick Contact */}
                <div className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-900">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                        Need Help? <br className="md:hidden" />
                        <Link href="/contact" className="text-slate-950 dark:text-white underline underline-offset-8 decoration-slate-200 dark:decoration-slate-800 hover:text-emerald-500 transition-colors ml-2">Contact Support</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
