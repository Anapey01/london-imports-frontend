'use client';

import Link from 'next/link';
import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to Sentry
        Sentry.captureException(error);
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full flex flex-col items-center">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
                    <AlertTriangle className="w-8 h-8" />
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong!</h2>

                <p className="text-gray-600 mb-8 text-sm leading-relaxed">
                    We apologize for the inconvenience. An unexpected error has occurred. Our team has been notified.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <button
                        onClick={() => reset()}
                        className="flex-1 bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-sm active:scale-95 transform duration-200"
                    >
                        Try again
                    </button>
                    <Link
                        href="/"
                        className="flex-1 bg-gray-100 text-gray-900 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors text-center"
                    >
                        Go Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
