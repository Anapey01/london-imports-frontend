'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TrackOrderPage() {
    const [orderNumber, setOrderNumber] = useState('');
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (orderNumber.trim()) {
            // Check if it's a guest tracking or authenticated
            // For now, redirect to login or order details if known
            // Ideally, we'd have a public tracking API
            router.push(`/orders/${orderNumber}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 py-12">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 animate-fade-in-up">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Track Your Order</h1>
                    <p className="text-gray-500 mt-2">Enter your order ID to check its current status.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-2">
                            Order ID
                        </label>
                        <input
                            type="text"
                            id="orderId"
                            value={orderNumber}
                            onChange={(e) => setOrderNumber(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-lg tracking-wide placeholder:tracking-normal"
                            placeholder="e.g. #12345"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3.5 px-6 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 focus:ring-4 focus:ring-slate-900/20 transition-all flex items-center justify-center gap-2"
                    >
                        Track Order
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                    <p className="text-sm text-gray-400">
                        Need help? <a href="/contact" className="text-blue-500 hover:text-blue-600 font-medium">Contact Support</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
