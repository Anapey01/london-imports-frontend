'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { paymentsAPI } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function PaymentCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const params = useParams();
    const orderNumber = params.orderNumber as string;

    // Get reference from URL (Paystack sends ?reference=...)
    // Sometimes they send ?trxref=... as well
    const reference = searchParams.get('reference') || searchParams.get('trxref');

    const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
    const [message, setMessage] = useState('Verifying your payment with Paystack...');

    useEffect(() => {
        if (!reference) {
            setStatus('failed');
            setMessage('No payment reference found in URL.');
            return;
        }

        verifyPayment(reference);
    }, [reference]);

    const verifyPayment = async (ref: string) => {
        try {
            console.log('Verifying payment reference:', ref);
            const response = await paymentsAPI.verify(ref);

            if (response.data.success) {
                setStatus('success');
                setMessage('Payment verified successfully!');
                toast.success('Payment confirmed!');

                // Redirect to success page after a short delay
                setTimeout(() => {
                    router.push(`/checkout/success?order=${orderNumber}`);
                }, 2000);
            } else {
                setStatus('failed');
                setMessage(response.data.message || 'Payment verification failed.');
            }
        } catch (error: unknown) {
            console.error('Verification error:', error);
            setStatus('failed');

            // Handle specific error messages
            const err = error as { response?: { data?: { message?: string; error?: string } } };
            const errorMsg = err.response?.data?.message ||
                err.response?.data?.error ||
                'An error occurred while verifying payment.';

            setMessage(errorMsg);
        }
    };

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto">

            {status === 'verifying' && (
                <>
                    <Loader2 className="w-16 h-16 text-pink-500 animate-spin mb-6" />
                    <h1 className="text-2xl font-bold mb-2">Verifying Payment</h1>
                    <p className="text-gray-500">{message}</p>
                </>
            )}

            {status === 'success' && (
                <>
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2 text-green-600">Success!</h1>
                    <p className="text-gray-500 mb-8">{message}</p>
                    <p className="text-sm text-gray-400">Redirecting you to order confirmation...</p>
                </>
            )}

            {status === 'failed' && (
                <>
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                        <XCircle className="w-10 h-10 text-red-600" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2 text-red-600">Verification Failed</h1>
                    <p className="text-gray-500 mb-8">{message}</p>

                    <div className="flex gap-4">
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-2 bg-gray-100 rounded-xl font-medium hover:bg-gray-200"
                        >
                            Retry
                        </button>
                        <Link
                            href={`/checkout`}
                            className="px-6 py-2 bg-pink-600 text-white rounded-xl font-medium hover:bg-pink-700"
                        >
                            Back to Checkout
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}
