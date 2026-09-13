'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { RotateCw, Home, AlertTriangle } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const [showDetails, setShowDetails] = useState(false);

    const isChunkError =
        error?.name === 'ChunkLoadError' ||
        /loading chunk .* failed/i.test(error?.message || '') ||
        /failed to fetch dynamically imported module/i.test(error?.message || '');

    const handleReload = async () => {
        try {
            if (typeof window !== 'undefined') {
                if ('serviceWorker' in navigator) {
                    const registrations = await navigator.serviceWorker.getRegistrations();
                    for (const registration of registrations) {
                        await registration.unregister();
                    }
                }
                if ('caches' in window) {
                    const keys = await caches.keys();
                    for (const key of keys) {
                        await caches.delete(key);
                    }
                }
                sessionStorage.clear();
                window.location.reload();
                return;
            }
        } catch {
            // Fallback to reset
        }
        reset();
    };

    useEffect(() => {
        console.error('[Application Error]:', error);

        // If this is a chunk load error from a new deployment, auto-reload cleanly
        if (isChunkError && typeof window !== 'undefined') {
            const reloadKey = 'chunk_reload_lock';
            const lastReload = sessionStorage.getItem(reloadKey);
            const now = Date.now();
            if (!lastReload || now - parseInt(lastReload, 10) > 10000) {
                sessionStorage.setItem(reloadKey, now.toString());
                handleReload();
            }
        }
    }, [error, isChunkError]);

    return (
        <div className="min-h-[75vh] flex items-center justify-center p-6 bg-slate-50 text-slate-900 font-sans">
            <div className="bg-white border border-slate-200 p-8 sm:p-10 rounded-2xl shadow-sm max-w-md w-full text-center space-y-6">
                
                {/* Icon */}
                <div className="w-14 h-14 bg-amber-50 border border-amber-200 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
                    <AlertTriangle className="w-7 h-7" />
                </div>

                {/* Heading & Message */}
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Something went wrong
                    </h1>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        We ran into a temporary issue loading this page. Please try refreshing or return to the homepage.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                    <button
                        onClick={handleReload}
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-950 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer w-full sm:w-auto"
                    >
                        <RotateCw className="w-4 h-4" />
                        Try Again
                    </button>

                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-all w-full sm:w-auto"
                    >
                        <Home className="w-4 h-4" />
                        Homepage
                    </Link>
                </div>

                {/* Diagnostics Toggle */}
                <div className="pt-4 border-t border-slate-100">
                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        {showDetails ? 'Hide details' : 'Show details'}
                    </button>

                    {showDetails && (
                        <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-lg text-left text-xs font-mono text-slate-600 overflow-x-auto max-h-40">
                            {error?.digest && <p className="font-semibold text-slate-800">Digest: {error.digest}</p>}
                            <p className="mt-1">{error?.message || 'Unknown error'}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
