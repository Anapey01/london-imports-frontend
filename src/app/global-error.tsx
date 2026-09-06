'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect, useState } from 'react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const [isUpdating, setIsUpdating] = useState(false);

    const isChunkError =
        error?.name === 'ChunkLoadError' ||
        /loading chunk .* failed/i.test(error?.message || '') ||
        /failed to fetch dynamically imported module/i.test(error?.message || '');

    const handleHardReload = async () => {
        setIsUpdating(true);
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
                window.location.href = window.location.pathname + '?v=' + Date.now();
                return;
            }
        } catch {
            // Fallback
        }
        reset();
    };

    useEffect(() => {
        try {
            Sentry.captureException(error);
        } catch {}
        console.error('[GlobalError]', error);

        // Auto-recover from chunk load errors caused by new deployments
        if (isChunkError && typeof window !== 'undefined') {
            const reloadKey = 'chunk_reload_lock';
            const lastReload = sessionStorage.getItem(reloadKey);
            const now = Date.now();
            // Allow auto-reload once every 10 seconds to prevent infinite loops if offline
            if (!lastReload || now - parseInt(lastReload, 10) > 10000) {
                sessionStorage.setItem(reloadKey, now.toString());
                handleHardReload();
            }
        }
    }, [error, isChunkError]);

    return (
        <html lang="en">
            <body className="bg-white min-h-screen flex items-center justify-center font-sans p-6 selection:bg-emerald-100">
                <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-sm max-w-md w-full text-center">
                    {isChunkError ? (
                        <>
                            <div className="w-12 h-12 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                            <h2 className="text-2xl font-bold text-gray-900 mb-2 font-serif">
                                {isUpdating ? "Updating Store..." : "New Update Available"}
                            </h2>
                            <p className="text-gray-600 mb-6 text-sm">
                                A newer version of London&apos;s Imports is ready. Refreshing your application to load the latest catalog...
                            </p>
                            <button
                                onClick={handleHardReload}
                                className="bg-slate-900 text-white px-6 py-3.5 rounded-xl font-medium hover:bg-slate-800 transition-colors w-full cursor-pointer text-sm font-semibold tracking-wide"
                            >
                                Update Now
                            </button>
                        </>
                    ) : (
                        <>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2 font-serif">Application Interrupted</h2>
                            <p className="text-gray-600 mb-6 text-sm">
                                A temporary issue occurred while loading this page. Tap below to reload.
                            </p>
                            {error?.message && (
                                <div className="mb-6 p-3 bg-red-50 text-red-700 text-xs text-left rounded-lg overflow-x-auto font-mono max-h-24">
                                    {error.message}
                                </div>
                            )}
                            <button
                                onClick={handleHardReload}
                                className="bg-slate-900 text-white px-6 py-3.5 rounded-xl font-medium hover:bg-slate-800 transition-colors w-full cursor-pointer text-sm font-semibold tracking-wide"
                            >
                                Reload Application
                            </button>
                        </>
                    )}
                </div>
            </body>
        </html>
    );
}
