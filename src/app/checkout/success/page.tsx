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
                        <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Check className="w-10 h-10" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
                        <p className="text-gray-600 mb-6">
                            Thank you for your order{orderNumber ? ` #${orderNumber}` : ''}. We've sent a confirmation email to your inbox.
                        </p>

                        <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5 mb-8 text-left">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-700 mb-3 flex items-center gap-2">
                                <Clock className="w-3.5 h-3.5" />
                                What Happens Next?
                            </h3>
                            <ul className="space-y-3 text-sm text-emerald-800/80">
                                <li className="flex gap-2">
                                    <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
                                    <span>We'll verify your payment and prepare your pre-order batch.</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
                                    <span>You'll get a WhatsApp/Email update once your items are ready.</span>
                                </li>
                            </ul>
                        </div>
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
                    {orderNumber && (
                        <a
                            href={`https://wa.me/233200000000?text=Hello%2C%20I%20just%20placed%20order%20%23${orderNumber}.%20Please%20confirm%20my%20pre-order%20status.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                            Confirm via WhatsApp
                        </a>
                    )}
                    <Link
                        href="/profile"
                        className="block w-full bg-slate-900 hover:bg-black text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.98]"
                    >
                        View Order Details
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
