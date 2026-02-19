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
        Sentry.captureException(error);
        console.error(error);
    }, [error]);

    return (
        <html>
            <body className="bg-gray-50 min-h-screen flex items-center justify-center font-sans">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center m-4">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Critical Error</h2>
                    <p className="text-gray-600 mb-8">
                        A critical error occurred preventing the application from loading.
                    </p>
                    <button
                        onClick={() => reset()}
                        className="bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors w-full"
                    >
                        Reload Application
                    </button>
                </div>
            </body>
        </html>
    );
}
