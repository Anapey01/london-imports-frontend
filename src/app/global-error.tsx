'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        try {
            Sentry.captureException(error);
        } catch {}
        console.error('[GlobalError]', error);
    }, [error]);

    const handleHardReload = async () => {
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
                window.location.href = window.location.pathname + '?refresh=' + Date.now();
                return;
            }
        } catch {
            // Fallback
        }
        reset();
    };

    return (
        <html>
            <body className="bg-gray-50 min-h-screen flex items-center justify-center font-sans">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center m-4">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Critical Error</h2>
                    <p className="text-gray-600 mb-6 text-sm">
                        A critical error occurred preventing the application from loading.
                    </p>
                    {error?.message && (
                        <div className="mb-6 p-3 bg-red-50 text-red-700 text-xs text-left rounded-lg overflow-x-auto font-mono max-h-24">
                            {error.message}
                        </div>
                    )}
                    <button
                        onClick={handleHardReload}
                        className="bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors w-full cursor-pointer"
                    >
                        Reload Application
                    </button>
                </div>
            </body>
        </html>
    );
}
