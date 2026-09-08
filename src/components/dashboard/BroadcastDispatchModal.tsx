'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, ShieldCheck, CheckCircle2 } from 'lucide-react';

export interface SampleRecipient {
    name: string;
    phone?: string;
    email?: string;
    order_number?: string;
    items?: string;
    amount_due?: string;
    pay_url?: string;
}

interface BroadcastDispatchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    channel: 'sms' | 'email';
    target: string;
    audienceLabel: string;
    rawMessage: string;
    subject?: string;
    smsCharCount?: number;
    smsSegments?: number;
    recipientCount: number | null;
    sampleRecipient: SampleRecipient | null;
    loadingCount?: boolean;
    sending?: boolean;
}

export function BroadcastDispatchModal({
    isOpen,
    onClose,
    onConfirm,
    channel,
    target,
    audienceLabel,
    rawMessage,
    subject = '',
    smsCharCount = 0,
    smsSegments = 1,
    recipientCount,
    sampleRecipient,
    loadingCount = false,
    sending = false
}: BroadcastDispatchModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent background scrolling while modal is open
    useEffect(() => {
        if (isOpen) {
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = originalOverflow;
            };
        }
    }, [isOpen]);

    if (!mounted) return null;

    const isPendingPaymentTarget = target === 'state:PENDING_PAYMENT' || target === 'pending_payment';

    // Generate personalized sample preview text
    const sampleName = sampleRecipient?.name || 'Kofi Mensah';
    const sampleOrder = sampleRecipient?.order_number || 'ORD-2026-0849';
    const sampleItems = sampleRecipient?.items || '1x Pleated Elastic Skirt, 2x Loafers';
    const sampleAmount = sampleRecipient?.amount_due || '145.00';
    const samplePayUrl = sampleRecipient?.pay_url || `https://londonsimports.com/orders/${sampleOrder}`;

    const previewMessage = rawMessage
        .replace(/\{\{FIRST_NAME\}\}/g, sampleName)
        .replace(/\{\{ORDER_ID\}\}/g, sampleOrder)
        .replace(/\{\{ITEMS\}\}/g, sampleItems)
        .replace(/\{\{AMOUNT_DUE\}\}/g, sampleAmount)
        .replace(/\{\{PENDING_AMOUNT\}\}/g, sampleAmount)
        .replace(/\{\{PAY_URL\}\}/g, samplePayUrl);

    const previewSubject = subject
        .replace(/\{\{FIRST_NAME\}\}/g, sampleName)
        .replace(/\{\{ORDER_ID\}\}/g, sampleOrder)
        .replace(/\{\{ITEMS\}\}/g, sampleItems)
        .replace(/\{\{AMOUNT_DUE\}\}/g, sampleAmount)
        .replace(/\{\{PENDING_AMOUNT\}\}/g, sampleAmount);

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                    {/* Minimalist Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => !sending && onClose()}
                        className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs"
                    />

                    {/* Architectural Modal Window */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: 12 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        className="relative z-10 w-full max-w-xl bg-white dark:bg-slate-950 border border-slate-900 dark:border-slate-800 shadow-2xl p-6 sm:p-10 my-auto text-left"
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-900 pb-5 mb-6">
                            <div>
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                                    <span className="text-[9px] font-black uppercase tracking-[0.35em] text-slate-400 dark:text-slate-500">
                                        OUTBOUND {channel.toUpperCase()} DISPATCH
                                    </span>
                                </div>
                                <h3 className="text-2xl font-serif font-bold text-slate-950 dark:text-white tracking-tight">
                                    Confirm {channel === 'sms' ? 'SMS Broadcast' : 'Email Broadcast'}
                                </h3>
                            </div>

                            <button
                                onClick={onClose}
                                disabled={sending}
                                className="p-2 border border-slate-200 dark:border-slate-800 hover:border-slate-900 dark:hover:border-white transition-colors cursor-pointer disabled:opacity-50"
                                aria-label="Close modal"
                            >
                                <X className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                            </button>
                        </div>

                        {/* Cohort & Delivery Metrics */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                            <div className="p-3.5 border border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/30">
                                <p className="text-[8px] font-black uppercase tracking-[0.25em] text-slate-400 mb-1">
                                    Audience
                                </p>
                                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                    {audienceLabel}
                                </p>
                                {isPendingPaymentTarget && (
                                    <span className="inline-block mt-1 text-[8px] font-black uppercase tracking-wider text-[#8B5E3C] dark:text-[#c49a78]">
                                        Unpaid Orders Only
                                    </span>
                                )}
                            </div>

                            <div className="p-3.5 border border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/30">
                                <p className="text-[8px] font-black uppercase tracking-[0.25em] text-slate-400 mb-1">
                                    Total Recipients
                                </p>
                                <p className="text-xs font-bold font-mono text-slate-900 dark:text-white">
                                    {loadingCount ? (
                                        <span className="text-slate-400 animate-pulse">Calculating...</span>
                                    ) : recipientCount !== null ? (
                                        `${recipientCount} Recipient${recipientCount === 1 ? '' : 's'}`
                                    ) : (
                                        'Pending query'
                                    )}
                                </p>
                                <span className="inline-block mt-1 text-[8px] font-mono text-slate-400 uppercase">
                                    De-duplicated
                                </span>
                            </div>

                            <div className="p-3.5 border border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/30 col-span-2 sm:col-span-1">
                                <p className="text-[8px] font-black uppercase tracking-[0.25em] text-slate-400 mb-1">
                                    {channel === 'sms' ? 'Length & Segments' : 'Gateway'}
                                </p>
                                <p className="text-xs font-bold font-mono text-slate-900 dark:text-white">
                                    {channel === 'sms' ? `${smsCharCount}c · ${smsSegments} seg` : 'Resend API'}
                                </p>
                                <span className="inline-block mt-1 text-[8px] font-mono text-slate-400 uppercase">
                                    {channel === 'sms' ? 'Sender: LondonsImp' : 'TLS Encrypted'}
                                </span>
                            </div>
                        </div>

                        {/* Live Personalized Sample Preview */}
                        <div className="space-y-2 mb-6">
                            <div className="flex items-center justify-between">
                                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                                    Live Sample Delivery Preview
                                </p>
                                {sampleRecipient && (
                                    <span className="text-[9px] font-mono text-slate-400 truncate max-w-[200px]">
                                        Sample: {sampleRecipient.name} ({sampleRecipient.order_number || 'Cohort'})
                                    </span>
                                )}
                            </div>

                            <div className="p-4 border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 space-y-2">
                                {channel === 'email' && subject && (
                                    <div className="pb-2 mb-2 border-b border-slate-200 dark:border-slate-800">
                                        <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Subject: </span>
                                        <span className="text-xs font-bold text-slate-900 dark:text-white">{previewSubject}</span>
                                    </div>
                                )}
                                <div className="text-xs font-mono text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap max-h-44 overflow-y-auto pr-1">
                                    {previewMessage}
                                </div>
                            </div>
                        </div>

                        {/* Smart Targeting Safeguard Banner */}
                        {isPendingPaymentTarget ? (
                            <div className="p-3.5 mb-8 border border-[#8B5E3C]/30 bg-[#8B5E3C]/5 flex items-start gap-3">
                                <ShieldCheck className="w-4 h-4 text-[#8B5E3C] shrink-0 mt-0.5" />
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-black uppercase tracking-wider text-[#8B5E3C]">
                                        Smart Unpaid Order Filter Active
                                    </p>
                                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                                        This broadcast is strictly restricted to customers who currently have an outstanding unpaid balance. Customers with completed payments will not be messaged.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="p-3 mb-8 border border-slate-100 dark:border-slate-900 bg-slate-50 dark:bg-slate-900/30 flex items-center gap-2.5 text-slate-500 text-[11px]">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>Broadcast is throttled with carrier gateway failover (Hubtel & Sailup).</span>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-900">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={sending}
                                className="px-6 py-3 border border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={onConfirm}
                                disabled={sending || (recipientCount !== null && recipientCount === 0)}
                                className="px-8 py-3 bg-slate-950 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-950 text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {sending ? (
                                    <>
                                        <div className="w-3 h-3 border-2 border-t-transparent rounded-full animate-spin border-white dark:border-slate-950" />
                                        <span>Dispatching...</span>
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-3.5 h-3.5" />
                                        <span>Confirm & Dispatch</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}
