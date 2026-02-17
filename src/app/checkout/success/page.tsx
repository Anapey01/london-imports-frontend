'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ordersAPI } from '@/lib/api';
import { Check, Clock, RefreshCw } from 'lucide-react';

function CheckoutSuccessPageContent() {
    const searchParams = useSearchParams();
    const orderNumber = searchParams.get('order');

    const [status, setStatus] = useState<'verifying' | 'success' | 'manual_check'>(
        orderNumber ? 'verifying' : 'success'
    );
    const [attempts, setAttempts] = useState(0);

    useEffect(() => {
        if (!orderNumber) return;

        // Poll every 3 seconds, max 10 attempts (30 seconds)
        const interval = setInterval(async () => {
            if (attempts >= 10) {
                setStatus('manual_check');
                clearInterval(interval);
                return;
            }

            try {
                const res = await ordersAPI.detail(orderNumber);
                const orderState = res.data.state;

                // Check for successful payment states
                if (['PAID', 'OPEN_FOR_BATCH', 'CUTOFF_REACHED', 'IN_FULFILLMENT', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(orderState)) {
                    setStatus('success');
                    clearInterval(interval);
                } else if (orderState === 'PENDING_PAYMENT') {
                    // Still waiting, keep polling
                    setAttempts(prev => prev + 1);
                } else {
                    // Other states (e.g. CANCELLED, FAILED) might warrant a manual check
                    setStatus('manual_check');
                    clearInterval(interval);
                }
            } catch (err) {
                console.error("Error polling order status:", err);
                // Keep polling on transient errors, or stop? Let's keep polling for now.
                setAttempts(prev => prev + 1);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [orderNumber, attempts]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center transition-all duration-300">

                {status === 'verifying' && (
                    <>
                        <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                            <RefreshCw className="w-10 h-10 animate-spin" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying Payment...</h1>
                        <p className="text-gray-600 mb-8">
                            Please wait while we confirm your transaction with the provider.
                        </p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Check className="w-10 h-10" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
                        <p className="text-gray-600 mb-8">
                            Thank you for your order{orderNumber ? ` #${orderNumber}` : ''}. We have received your payment and will begin processing your items immediately.
                        </p>
                    </>
                )}

                {status === 'manual_check' && (
                    <>
                        <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Clock className="w-10 h-10" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Processing</h1>
                        <p className="text-gray-600 mb-8">
                            We are still waiting for final confirmation from the payment provider. Your order will be updated automatically once confirmed.
                        </p>
                    </>
                )}

                <div className="space-y-3">
                    <Link
                        href="/profile"
                        className="block w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-colors"
                    >
                        View Order Status
                    </Link>
                    <Link
                        href="/"
                        className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 rounded-xl transition-colors"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
            <CheckoutSuccessPageContent />
        </Suspense>
    );
}
