'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
    const [mounted, setMounted] = useState(false);
    const [iframeLoading, setIframeLoading] = useState(true);
    const [confirmClose, setConfirmClose] = useState(false);

    // Client-side mount check for React portal
    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent background page scrolling when modal is active
    useEffect(() => {
        if (!isOpen) return;

        const originalOverflow = document.body.style.overflow;
        const originalHtmlOverflow = document.documentElement.style.overflow;
        const originalTouchAction = document.body.style.touchAction;

        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        document.body.style.touchAction = 'none';

        return () => {
            document.body.style.overflow = originalOverflow;
            document.documentElement.style.overflow = originalHtmlOverflow;
            document.body.style.touchAction = originalTouchAction;
        };
    }, [isOpen]);

    // Fast loading fallback: Hubtel checkout pages can delay iframe `load` event for up to 2 minutes
    // due to heavy third-party tracking scripts. Dismiss spinner after 2s so user can pay immediately.
    useEffect(() => {
        if (!isOpen) return;
        setIframeLoading(true);
        setConfirmClose(false);

        const safetyTimer = setTimeout(() => {
            setIframeLoading(false);
        }, 2000);

        return () => clearTimeout(safetyTimer);
    }, [isOpen, checkoutUrl]);

    // Sequential Status Poller: avoids overwhelming the backend or Hubtel with overlapping requests
    useEffect(() => {
        if (!isOpen || !clientReference) return;
        let isMounted = true;
        let timeoutId: NodeJS.Timeout;

        const checkPaymentStatus = async () => {
            if (!isMounted) return;
            try {
                const res = await paymentsAPI.hubtelVerify(clientReference);
                if (!isMounted) return;
                if (res.data && res.data.success) {
                    onSuccess();
                    return;
                }
            } catch {
                // Ignore transient network errors during polling
            }

            if (isMounted) {
                // Poll every 4 seconds after previous request finishes
                timeoutId = setTimeout(checkPaymentStatus, 4000);
            }
        };

        timeoutId = setTimeout(checkPaymentStatus, 3500);

        return () => {
            isMounted = false;
            clearTimeout(timeoutId);
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

    if (!isOpen || !mounted) return null;

    const handleCloseClick = () => {
        if (confirmClose) {
            onClose();
        } else {
            setConfirmClose(true);
        }
    };

    const modalContent = (
        <div 
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 md:p-6 w-screen h-[100dvh] overflow-hidden overscroll-none animate-in fade-in duration-200"
            role="dialog"
            aria-modal="true"
            aria-label="Hubtel Onsite Payment"
        >
            <div className="relative w-full h-full sm:h-[90vh] sm:max-h-[820px] sm:max-w-xl bg-surface border-0 sm:border border-border-standard sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
                {/* Modal Header */}
                <header className="flex items-center justify-between px-3.5 py-2.5 sm:px-5 sm:py-3.5 border-b border-border-standard bg-surface-card shrink-0">
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-brand-emerald/10 flex items-center justify-center shrink-0">
                            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-emerald" />
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-1.5 sm:gap-2">
                                <span className="text-xs font-semibold text-content-primary truncate">
                                    Hubtel Checkout
                                </span>
                                <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-brand-emerald bg-brand-emerald/10 px-1.5 py-0.5 rounded-full">
                                    <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald animate-pulse" />
                                    Live
                                </span>
                            </div>
                            <p className="text-[10px] text-content-secondary truncate">
                                {formatPrice(amount)} • Order #{orderNumber}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                        {/* Fallback link to open in external browser */}
                        <a
                            href={checkoutUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 sm:p-2 text-content-secondary hover:text-content-primary rounded-xl hover:bg-surface transition-colors"
                            title="Open in new window"
                        >
                            <ExternalLink className="w-4 h-4" />
                        </a>

                        {confirmClose ? (
                            <div className="flex items-center gap-1 animate-in fade-in duration-150">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-2.5 py-1 sm:px-3 sm:py-1.5 text-[10px] font-medium text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl transition-colors"
                                >
                                    Cancel Payment
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setConfirmClose(false)}
                                    className="px-2 py-1 sm:px-2 sm:py-1.5 text-[10px] font-medium text-content-secondary hover:text-content-primary rounded-xl transition-colors"
                                >
                                    Stay
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={handleCloseClick}
                                className="p-1.5 sm:p-2 text-content-secondary hover:text-content-primary rounded-xl hover:bg-surface transition-colors"
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
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-white px-6 text-center">
                            <div className="relative">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-3 border-emerald-100 border-t-emerald-600 animate-spin" />
                                <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 absolute inset-0 m-auto" />
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-xs font-semibold text-slate-800">
                                    Loading Hubtel Secure Channel
                                </p>
                                <p className="text-[10px] sm:text-[11px] text-slate-400">
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

                {/* Footer Security Note (desktop/tablet only to maximize mobile iframe viewport) */}
                <footer className="hidden sm:flex px-4 py-2 border-t border-border-standard bg-surface-card shrink-0 items-center justify-between text-[10px] text-content-secondary">
                    <span className="flex items-center gap-1.5">
                        <Lock className="w-3 h-3 text-brand-emerald" />
                        256-bit Bank-Grade Encryption
                    </span>
                    <span>Do not close while processing</span>
                </footer>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
