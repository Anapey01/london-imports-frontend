'use client';

import { useEffect } from 'react';
import { Inter } from 'next/font/google';

// Default font if main layout fails
const inter = Inter({ subsets: ['latin'] });

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Global Error Boundary Caught:', error);
    }, [error]);

    return (
        <html lang="en">
            <body className={inter.className}>
                <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">500</h1>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                            Critical Error
                        </h2>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">
                            Our servers encountered a critical issue. We have logged this report.
                        </p>
                        <button
                            onClick={() => reset()}
                            className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                        >
                            Reload Application
                        </button>
                    </div>
                </div>
            </body>
        </html>
    );
}
