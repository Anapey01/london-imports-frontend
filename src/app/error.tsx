'use client'; // Error boundaries must be Client Components

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error using your preferred logging service
        console.error('Safe Error Boundary Caught:', error);
    }, [error]);

    return (
        <div className="min-h-[50vh] flex items-center justify-center p-4">
            <div className="text-center max-w-md w-full bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
                <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>

                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Something went wrong!
                </h2>

                <p className="text-gray-500 dark:text-slate-400 mb-6 font-medium">
                    We encountered an unexpected error.
                </p>

                <button
                    onClick={
                        // Attempt to recover by trying to re-render the segment
                        () => reset()
                    }
                    className="flex items-center justify-center gap-2 w-full py-3 bg-gray-900 hover:bg-black dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-xl transition-colors font-medium"
                >
                    <RefreshCw className="w-4 h-4" />
                    Try Again
                </button>
            </div>
        </div>
    );
}
