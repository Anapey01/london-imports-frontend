'use client';

import Link from 'next/link';
import { WifiOff } from 'lucide-react';

export default function OfflinePage() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-50 rounded-full mb-6">
                    <WifiOff className="w-10 h-10 text-amber-500" />
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">You&apos;re Offline</h1>
                <p className="text-gray-600 mb-8 font-light">
                    It looks like you&apos;ve lost your connection. We&apos;ve cached some pages for you, but this one isn&apos;t available yet.
                </p>

                <div className="space-y-4">
                    <Link
                        href="/"
                        className="block w-full py-4 bg-gray-900 text-white rounded-full font-medium hover:bg-pink-600 transition-colors shadow-sm"
                    >
                        Return Home
                    </Link>

                    <button
                        onClick={() => window.location.reload()}
                        className="block w-full py-4 bg-white text-gray-900 border border-gray-200 rounded-full font-medium hover:bg-gray-50 transition-colors"
                    >
                        Try Again
                    </button>
                </div>

                <p className="mt-8 text-xs text-gray-400 font-light">
                    Pages you&apos;ve visited while online will be available here automatically.
                </p>
            </div>
        </div>
    );
}
