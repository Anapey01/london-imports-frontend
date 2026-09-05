'use client';

import { useState, useEffect } from 'react';
import { X, ShieldCheck, ExternalLink, Lock } from 'lucide-react';
import { formatPrice } from '@/lib/format';
import { paymentsAPI } from '@/lib/api';

interface HubtelOnsiteModalProps {
    isOpen: boolean;
    checkoutUrl: string;
    orderNumber: string;
    clientReference: string;
    amount: number;
    onClose: () => void;
    onSuccess: () => void;
}

export default function HubtelOnsiteModal({
    isOpen,
    checkoutUrl,
    orderNumber,
    clientReference,
    amount,
    onClose,
    onSuccess,
}: HubtelOnsiteModalProps) {
    const [iframeLoading, setIframeLoading] = useState(true);
    const [confirmClose, setConfirmClose] = useState(false);

    // Reset loading state when checkoutUrl changes
    useEffect(() => {
        if (isOpen) {
            setIframeLoading(true);
            setConfirmClose(false);
        }
    }, [isOpen, checkoutUrl]);

    // Background Status Poller: checks every 3.5s if payment succeeded
    useEffect(() => {
        if (!isOpen || !clientReference) return;
        let isMounted = true;

        const interval = setInterval(async () => {
            try {
                const res = await paymentsAPI.hubtelVerify(clientReference);
                if (!isMounted) return;
                if (res.data && res.data.success) {
                    clearInterval(interval);
                    onSuccess();
                }
            } catch {
                // Ignore transient network errors during polling
            }
        }, 3500);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [isOpen, clientReference, onSuccess]);

    // Cross-origin / iframe message listener in case Hubtel posts a message
    useEffect(() => {
        if (!isOpen) return;

        const handleMessage = (event: MessageEvent) => {
            if (typeof event.data === 'string') {
                const lower = event.data.toLowerCase();
                if (lower.includes('success') || lower.includes('paid') || lower.includes('approved')) {
                    onSuccess();
                }
            } else if (typeof event.data === 'object' && event.data !== null) {
                const status = (event.data.status || event.data.event || '').toLowerCase();
                if (status === 'success' || status === 'paid' || status === 'completed') {
                    onSuccess();
                }
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [isOpen, onSuccess]);

    if (!isOpen) return null;

    const handleCloseClick = () => {
        if (confirmClose) {
            onClose();
        } else {
            setConfirmClose(true);
        }
    };

    return (
        <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4 md:p-6 animate-in fade-in duration-200"
            role="dialog"
            aria-modal="true"
            aria-label="Hubtel Onsite Payment"
        >
            <div className="relative w-full h-full sm:h-[88vh] sm:max-h-[780px] sm:max-w-xl bg-surface border border-border-standard sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
                {/* Modal Header */}
                <header className="flex items-center justify-between px-5 py-4 border-b border-border-standard bg-surface-card shrink-0">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-brand-emerald/10 flex items-center justify-center shrink-0">
                            <ShieldCheck className="w-4 h-4 text-brand-emerald" />
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-content-primary truncate">
                                    Hubtel Checkout
                                </span>
                                <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-brand-emerald bg-brand-emerald/10 px-2 py-0.5 rounded-full">
                                    <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald animate-pulse" />
                                    Live
                                </span>
                            </div>
                            <p className="text-[10px] text-content-secondary truncate">
                                {formatPrice(amount)} • Order #{orderNumber}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        {/* Fallback open in external browser if needed */}
                        <a
                            href={checkoutUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-content-secondary hover:text-content-primary rounded-xl hover:bg-surface transition-colors"
                            title="Open in new window"
                        >
                            <ExternalLink className="w-4 h-4" />
                        </a>

                        {confirmClose ? (
                            <div className="flex items-center gap-1 animate-in fade-in duration-150">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-3 py-1.5 text-[10px] font-medium text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl transition-colors"
                                >
                                    Cancel Payment
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setConfirmClose(false)}
                                    className="px-2 py-1.5 text-[10px] font-medium text-content-secondary hover:text-content-primary rounded-xl transition-colors"
                                >
                                    Stay
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={handleCloseClick}
                                className="p-2 text-content-secondary hover:text-content-primary rounded-xl hover:bg-surface transition-colors"
                                aria-label="Close payment modal"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </header>

                {/* Body / Iframe Area */}
                <div className="relative flex-1 w-full bg-white overflow-hidden">
                    {iframeLoading && (
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-white px-6 text-center">
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full border-3 border-emerald-100 border-t-emerald-600 animate-spin" />
                                <Lock className="w-4 h-4 text-emerald-600 absolute inset-0 m-auto" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-semibold text-slate-800">
                                    Loading Hubtel Secure Channel
                                </p>
                                <p className="text-[11px] text-slate-400">
                                    MTN MoMo • Telecel Cash • AT Money • Cards
                                </p>
                            </div>
                        </div>
                    )}

                    <iframe
                        src={checkoutUrl}
                        className="w-full h-full border-0"
                        title="Hubtel Onsite Payment"
                        onLoad={() => setIframeLoading(false)}
                        allow="payment *; camera *; microphone *"
                    />
                </div>

                {/* Footer Security Note */}
                <footer className="px-4 py-2.5 border-t border-border-standard bg-surface-card shrink-0 flex items-center justify-between text-[10px] text-content-secondary">
                    <span className="flex items-center gap-1.5">
                        <Lock className="w-3 h-3 text-brand-emerald" />
                        256-bit Bank-Grade Encryption
                    </span>
                    <span>Do not close while processing</span>
                </footer>
            </div>
        </div>
    );
}
