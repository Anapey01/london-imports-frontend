'use client';

import Link from 'next/link';
import { Home, MoveLeft, Search } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full text-center">
                {/* Error Code / Graphic */}
                <div className="mb-8 relative">
                    <div className="text-[120px] font-black text-gray-50 select-none">404</div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center text-white shadow-2xl">
                            <Search className="w-10 h-10" />
                        </div>
                    </div>
                </div>

                {/* Branding & Message */}
                <h1 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">
                    Oops! Lost in Import?
                </h1>
                <p className="text-gray-500 mb-10 leading-relaxed">
                    We couldn&apos;t find the page you&apos;re looking for. It might have been moved, deleted, or never existed in the first place.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 bg-black text-white px-8 py-4 rounded-2xl font-semibold hover:bg-gray-800 transition-all active:scale-95 shadow-lg"
                    >
                        <Home className="w-5 h-5" />
                        Back to Homepage
                    </Link>
                    <Link
                        href="/products"
                        className="flex items-center justify-center gap-2 bg-gray-100 text-gray-900 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-200 transition-all active:scale-95"
                    >
                        <MoveLeft className="w-5 h-5" />
                        Browse Products
                    </Link>
                </div>

                {/* Quick Contact */}
                <p className="mt-12 text-sm text-gray-400">
                    Need help? <Link href="/contact" className="text-black font-medium underline underline-offset-4">Contact Support</Link>
                </p>
            </div>
        </div>
    );
}
