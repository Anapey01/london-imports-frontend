'use client';

import { Suspense, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import SuccessManifest from '@/components/checkout/SuccessManifest';
import { useAuthStore } from '@/stores/authStore';

function SuccessPageContent() {
    const searchParams = useSearchParams();
    const orderNumber = searchParams.get('order_number');
    const method = searchParams.get('method');
    const { user } = useAuthStore();
    const hasNotified = useRef(false);

    useEffect(() => {
        // Trigger Email Notification only once
        if (orderNumber && !hasNotified.current) {
            hasNotified.current = true;
            
            // Call our local API route to send the email via Resend
            fetch('/api/notify-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderNumber,
                    customerEmail: user?.email,
                    method
                })
            }).catch(err => console.error('Failed to trigger notification:', err));
        }
    }, [orderNumber, user?.email, method]);

    if (!orderNumber) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-secondary-surface">
                <div className="text-center space-y-4">
                    <h1 className="text-2xl font-black tracking-tighter">Order Complete</h1>
                    <p className="text-sm text-slate-500">Redirecting you to your order summary...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-secondary-surface pt-20 pb-12">
            <SuccessManifest orderNumber={orderNumber} method={method || undefined} />
        </div>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-secondary-surface">
                <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-950 rounded-full animate-spin" />
            </div>
        }>
            <SuccessPageContent />
        </Suspense>
    );
}
