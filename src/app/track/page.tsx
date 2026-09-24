'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import NextImage from 'next/image';
import axios, { AxiosError } from 'axios';
import { useAuthStore } from '@/stores/authStore';
import { ordersAPI } from '@/lib/api';
import { useToast } from '@/components/Toast';
import { getImageUrl } from '@/lib/image';
import { cleanProductName } from '@/lib/format';
import { siteConfig } from '@/config/site';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package,
    Search,
    MapPin,
    CheckCircle2,
    Loader2,
    AlertCircle,
    Copy,
    Check,
    ArrowRight,
    MessageCircle,
    Calendar,
    Clock,
    DollarSign,
    Sparkles,
} from 'lucide-react';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

interface TimelineEvent {
    id: string;
    title: string;
    description?: string;
    location?: string;
    timestamp: string;
}

interface StateLog {
    id: string;
    from_state_display?: string;
    to_state_display?: string;
    reason?: string;
    created_at: string;
}

interface OrderItemData {
    id: string;
    product?: {
        id: string;
        name: string;
        display_name?: string;
        short_name?: string;
        image?: string | null;
        images?: Array<{ image: string }>;
        price?: string | number;
    } | null;
    product_name?: string;
    quantity: number;
    unit_price?: string | number;
    total_price?: string | number;
    selected_size?: string;
    selected_color?: string;
}

interface OrderTracking {
    id: string;
    order_number: string;
    state: string;
    state_display: string;
    delivery_window?: string;
    estimated_delivery_start?: string | null;
    estimated_delivery_end?: string | null;
    items?: OrderItemData[];
    total?: string | number;
    amount_paid?: string | number;
    balance_due?: string | number;
    timeline_events?: TimelineEvent[];
    state_logs?: StateLog[];
}

interface StatusStep {
    key: string;
    title: string;
    subtitle: string;
    states: string[];
}

const LIFECYCLE_STEPS: StatusStep[] = [
    {
        key: 'ORDER_PLACED',
        title: 'Order Placed',
        subtitle: 'Payment verified and order confirmed.',
        states: ['DRAFT', 'PENDING_PAYMENT', 'PAID', 'FRAUD_REVIEW'],
    },
    {
        key: 'BATCH_PROCUREMENT',
        title: 'Procurement',
        subtitle: 'Assigned to procurement batch with global suppliers.',
        states: ['OPEN_FOR_BATCH', 'CUTOFF_REACHED'],
    },
    {
        key: 'FULFILLMENT',
        title: 'Inspection & Packing',
        subtitle: 'Quality inspected and packaged for freight.',
        states: ['IN_FULFILLMENT'],
    },
    {
        key: 'TRANSIT',
        title: 'International Freight',
        subtitle: 'Air cargo in transit from overseas hub to Accra.',
        states: ['IN_TRANSIT'],
    },
    {
        key: 'LOCAL_DISPATCH',
        title: 'Ghana Hub & Dispatch',
        subtitle: 'Arrived at Ghana sorting facility and assigned to courier.',
        states: ['ARRIVED', 'OUT_FOR_DELIVERY'],
    },
    {
        key: 'DELIVERED',
        title: 'Delivered',
        subtitle: 'Package successfully handed over to customer.',
        states: ['DELIVERED'],
    },
];

const getCurrentStepIndex = (state: string): number => {
    const uppercaseState = (state || '').toUpperCase();
    for (let i = LIFECYCLE_STEPS.length - 1; i >= 0; i--) {
        if (LIFECYCLE_STEPS[i].states.includes(uppercaseState)) {
            return i;
        }
    }
    return 0;
};

function TrackOrderContent() {
    const { showToast } = useToast();
    const searchParams = useSearchParams();
    const initialQuery = searchParams?.get('order') || searchParams?.get('order_number') || searchParams?.get('number') || '';

    const [orderNumber, setOrderNumber] = useState(initialQuery);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [trackingData, setTrackingData] = useState<OrderTracking | null>(null);
    const [copied, setCopied] = useState(false);

    const { isAuthenticated } = useAuthStore();
    const [isCancelling, setIsCancelling] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);

    // Auto-dismiss errors after 5s
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const performTrack = useCallback(async (query: string) => {
        if (!query.trim()) return;
        const cleanNumber = query.trim().replace(/^#+/, '');
        setLoading(true);
        setError('');
        setTrackingData(null);

        try {
            const response = await api.get(`/orders/track/public/${encodeURIComponent(cleanNumber)}/`);
            setTrackingData(response.data);
        } catch (err: unknown) {
            const axiosError = err as AxiosError<{ detail?: string; error?: string }>;
            setError(
                axiosError.response?.data?.detail ||
                axiosError.response?.data?.error ||
                'Order not found. Please verify the order number and try again.'
            );
        } finally {
            setLoading(false);
        }
    }, []);

    // Auto-search if URL query has order number
    useEffect(() => {
        if (initialQuery) {
            setOrderNumber(initialQuery);
            performTrack(initialQuery);
        }
    }, [initialQuery, performTrack]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        performTrack(orderNumber);
    };

    const handleCopy = () => {
        if (!trackingData?.order_number) return;
        navigator.clipboard.writeText(trackingData.order_number);
        setCopied(true);
        showToast('Order number copied to clipboard', 'info');
        setTimeout(() => setCopied(false), 2000);
    };

    const handleCancelOrder = async () => {
        if (!trackingData) return;
        setIsCancelling(true);
        try {
            await ordersAPI.cancelOrder(trackingData.order_number);
            showToast('Order cancelled successfully', 'success');
            setShowCancelModal(false);
            performTrack(trackingData.order_number);
        } catch (error: unknown) {
            const err = error as { response?: { data?: { error?: string } } };
            showToast(err.response?.data?.error || 'Failed to cancel order', 'error');
        } finally {
            setIsCancelling(false);
        }
    };

    const currentStepIndex = trackingData ? getCurrentStepIndex(trackingData.state) : 0;
    const isCancelled = trackingData ? ['CANCELLED', 'REFUNDED', 'FAILED', 'ABANDONED'].includes(trackingData.state.toUpperCase()) : false;
    const canCancel = trackingData && ['PAID', 'OPEN_FOR_BATCH', 'PENDING_PAYMENT'].includes(trackingData.state.toUpperCase());

    const totalAmount = trackingData ? parseFloat(trackingData.total?.toString() || '0') : 0;
    const amountPaid = trackingData ? parseFloat(trackingData.amount_paid?.toString() || '0') : 0;
    const balanceDue = trackingData ? parseFloat(trackingData.balance_due?.toString() || '0') : 0;

    const renderStatusBadge = (state: string, display: string) => {
        const s = (state || '').toUpperCase();
        if (['DELIVERED', 'COMPLETED'].includes(s)) {
            return (
                <div className="px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 inline-flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-900 dark:bg-white" />
                    {display || 'Delivered'}
                </div>
            );
        }
        if (['IN_TRANSIT', 'OUT_FOR_DELIVERY', 'ARRIVED'].includes(s)) {
            return (
                <div className="px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 inline-flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-900 dark:bg-white" />
                    {display || 'In Transit'}
                </div>
            );
        }
        if (['CANCELLED', 'REFUNDED', 'FAILED', 'ABANDONED'].includes(s)) {
            return (
                <div className="px-3 py-1 rounded-full border border-rose-200/80 dark:border-rose-900/50 bg-rose-50/60 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 inline-flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    {display || 'Cancelled'}
                </div>
            );
        }
        if (['PENDING_PAYMENT', 'DRAFT'].includes(s)) {
            return (
                <div className="px-3 py-1 rounded-full border border-amber-200/80 dark:border-amber-900/50 bg-amber-50/60 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 inline-flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    {display || 'Pending Payment'}
                </div>
            );
        }
        return (
            <div className="px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 inline-flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600 dark:bg-slate-400" />
                {display || 'Processing'}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white px-4 sm:px-6 py-10 sm:py-16 transition-colors">
            <div className="max-w-3xl mx-auto space-y-8 sm:space-y-10">

                {/* Hero / Search Section */}
                <div className="text-center space-y-3">
                    <span className="text-[9px] font-mono uppercase tracking-[0.35em] text-slate-400 dark:text-slate-500 block">
                        Global Logistics & Tracking
                    </span>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight text-slate-900 dark:text-white">
                        Track Your Shipment<span className="text-slate-400 font-light">.</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                        Enter your order number to track verified milestones from international suppliers to your doorstep in Ghana.
                    </p>

                    {/* Search Form Card */}
                    <div className="pt-4 max-w-xl mx-auto">
                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5">
                            <div className="relative flex-1">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-slate-400 dark:text-slate-500 text-sm">#</span>
                                <input
                                    type="text"
                                    value={orderNumber}
                                    onChange={(e) => setOrderNumber(e.target.value)}
                                    placeholder="Order number (e.g. LI-20260905-26446)"
                                    className="w-full pl-9 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm font-mono tracking-wider outline-none focus:border-slate-900 dark:focus:border-white transition-all placeholder:tracking-normal placeholder:font-sans placeholder:text-slate-400"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-3.5 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-xl font-mono text-xs uppercase tracking-wider hover:bg-slate-800 dark:hover:bg-slate-100 transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 shadow-sm"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={14} className="animate-spin" />
                                        <span>Searching...</span>
                                    </>
                                ) : (
                                    <>
                                        <Search size={14} />
                                        <span>Track Order</span>
                                    </>
                                )}
                            </button>
                        </form>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 p-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/80 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2.5 text-left"
                            >
                                <AlertCircle size={15} className="shrink-0" />
                                <span>{error}</span>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Tracking Results Area */}
                {trackingData && (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="space-y-6 sm:space-y-8"
                    >
                        {/* 1. Primary Status Header Card */}
                        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 sm:p-8 shadow-sm space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2.5">
                                        <p className="text-lg sm:text-xl font-mono font-bold text-slate-900 dark:text-white tracking-tight">
                                            #{trackingData.order_number}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={handleCopy}
                                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                                            title="Copy order number"
                                        >
                                            {copied ? <Check size={12} className="text-slate-900 dark:text-white" /> : <Copy size={12} />}
                                        </button>
                                    </div>
                                    <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                                        Live Shipment Dossier
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    {renderStatusBadge(trackingData.state, trackingData.state_display)}
                                </div>
                            </div>

                            {/* Summary Metrics Row */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/40">
                                    <span className="text-[8px] font-mono uppercase tracking-wider text-slate-400 block mb-1">Status</span>
                                    <p className="text-xs sm:text-sm font-serif font-bold text-slate-900 dark:text-white truncate">
                                        {trackingData.state_display}
                                    </p>
                                </div>
                                <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/40">
                                    <span className="text-[8px] font-mono uppercase tracking-wider text-slate-400 block mb-1">Expected Delivery</span>
                                    <p className="text-xs sm:text-sm font-mono font-bold text-slate-900 dark:text-white">
                                        {trackingData.delivery_window || 'To be confirmed'}
                                    </p>
                                </div>
                                <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/40">
                                    <span className="text-[8px] font-mono uppercase tracking-wider text-slate-400 block mb-1">Total Value</span>
                                    <p className="text-xs sm:text-sm font-mono font-bold text-slate-900 dark:text-white">
                                        ₵{totalAmount.toLocaleString()}
                                    </p>
                                </div>
                                <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/40">
                                    <span className="text-[8px] font-mono uppercase tracking-wider text-slate-400 block mb-1">Balance Due</span>
                                    <p className={`text-xs sm:text-sm font-mono font-bold ${balanceDue > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'}`}>
                                        ₵{balanceDue.toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            {/* Unpaid Balance Action */}
                            {balanceDue > 0 && !isCancelled && (
                                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-amber-200/80 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20">
                                    <div className="flex items-center gap-3">
                                        <Clock size={16} className="text-amber-600 dark:text-amber-400 shrink-0" />
                                        <p className="text-xs text-amber-900 dark:text-amber-200">
                                            There is an outstanding balance of <span className="font-mono font-bold">₵{balanceDue.toLocaleString()}</span> for this shipment.
                                        </p>
                                    </div>
                                    <Link
                                        href={`/checkout?order=${encodeURIComponent(trackingData.order_number)}`}
                                        className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-mono text-[9px] uppercase tracking-wider hover:bg-slate-800 dark:hover:bg-slate-100 transition-all text-center shrink-0 shadow-sm"
                                    >
                                        Complete Payment
                                    </Link>
                                </div>
                            )}

                            {/* Order Cancellation Trigger */}
                            {canCancel && isAuthenticated && (
                                <div className="pt-2 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setShowCancelModal(true)}
                                        className="text-[9px] font-mono uppercase tracking-wider text-slate-400 hover:text-rose-500 transition-colors"
                                    >
                                        Request Order Cancellation
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* 2. Order Lifecycle Progress (Mobile-First & Fully Responsive) */}
                        {!isCancelled && (
                            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 sm:p-8 shadow-sm space-y-6">
                                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                                    <div className="flex items-center gap-2.5">
                                        <Sparkles className="w-4 h-4 text-slate-400" />
                                        <h3 className="text-xs font-mono uppercase tracking-[0.3em] text-slate-700 dark:text-slate-200">
                                            Delivery Milestones
                                        </h3>
                                    </div>
                                    <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400">
                                        Stage {currentStepIndex + 1} of {LIFECYCLE_STEPS.length}
                                    </span>
                                </div>

                                {/* Desktop Horizontal Stepper (>= 640px) */}
                                <div className="hidden sm:block pt-4 pb-2">
                                    <div className="relative flex justify-between items-start">
                                        {/* Background connecting track */}
                                        <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-100 dark:bg-slate-800 -z-0">
                                            <div
                                                className="h-full bg-slate-900 dark:bg-white transition-all duration-700"
                                                style={{ width: `${(currentStepIndex / (LIFECYCLE_STEPS.length - 1)) * 100}%` }}
                                            />
                                        </div>

                                        {LIFECYCLE_STEPS.map((step, idx) => {
                                            const isPassed = idx < currentStepIndex;
                                            const isCurrent = idx === currentStepIndex;

                                            return (
                                                <div key={step.key} className="flex flex-col items-center text-center relative z-10 flex-1 px-1">
                                                    <div
                                                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 mb-2.5 ${
                                                            isPassed
                                                                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-sm'
                                                                : isCurrent
                                                                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 ring-4 ring-slate-100 dark:ring-slate-800 shadow-md'
                                                                : 'bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600'
                                                        }`}
                                                    >
                                                        {isPassed ? (
                                                            <Check size={14} strokeWidth={2.5} />
                                                        ) : (
                                                            <span className="text-[11px] font-mono font-bold">{idx + 1}</span>
                                                        )}
                                                    </div>
                                                    <p
                                                        className={`text-[10px] font-mono uppercase tracking-wider leading-tight max-w-[90px] ${
                                                            isCurrent
                                                                ? 'font-bold text-slate-900 dark:text-white'
                                                                : isPassed
                                                                ? 'text-slate-700 dark:text-slate-300'
                                                                : 'text-slate-400 dark:text-slate-600'
                                                        }`}
                                                    >
                                                        {step.title}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Mobile Vertical Stepper (< 640px) */}
                                <div className="sm:hidden space-y-5 relative before:absolute before:left-[15px] before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800">
                                    {LIFECYCLE_STEPS.map((step, idx) => {
                                        const isPassed = idx < currentStepIndex;
                                        const isCurrent = idx === currentStepIndex;

                                        return (
                                            <div key={step.key} className="relative flex items-start gap-4 pl-1">
                                                <div
                                                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors ${
                                                        isPassed
                                                            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-sm'
                                                            : isCurrent
                                                            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 ring-4 ring-slate-100 dark:ring-slate-800 shadow-sm'
                                                            : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600'
                                                    }`}
                                                >
                                                    {isPassed ? (
                                                        <Check size={12} strokeWidth={2.5} />
                                                    ) : (
                                                        <span className="text-[10px] font-mono font-bold">{idx + 1}</span>
                                                    )}
                                                </div>

                                                <div className="flex-1 pb-1">
                                                    <div className="flex items-center gap-2 mb-0.5">
                                                        <h4
                                                            className={`text-xs font-mono uppercase tracking-wider ${
                                                                isCurrent
                                                                    ? 'font-bold text-slate-900 dark:text-white'
                                                                    : isPassed
                                                                    ? 'text-slate-800 dark:text-slate-200'
                                                                    : 'text-slate-400 dark:text-slate-500'
                                                            }`}
                                                        >
                                                            {step.title}
                                                        </h4>
                                                        {isCurrent && (
                                                            <span className="text-[7px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-950">
                                                                Current
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                                                        {step.subtitle}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* 3. Package Items Section */}
                        {trackingData.items && trackingData.items.length > 0 && (
                            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 sm:p-8 shadow-sm space-y-6">
                                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                                    <div className="flex items-center gap-2.5">
                                        <Package className="w-4 h-4 text-slate-400" />
                                        <h3 className="text-xs font-mono uppercase tracking-[0.3em] text-slate-700 dark:text-slate-200">
                                            Items in Shipment
                                        </h3>
                                    </div>
                                    <span className="text-[9px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-500">
                                        {trackingData.items.length} {trackingData.items.length === 1 ? 'Product' : 'Products'}
                                    </span>
                                </div>

                                <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                    {trackingData.items.map((item, idx) => {
                                        const img = item.product?.image || item.product?.images?.[0]?.image;
                                        const title = item.product ? cleanProductName(item.product) : (item.product_name || 'Imported Goods');

                                        return (
                                            <div key={item.id || idx} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4 sm:gap-5">
                                                <div className="w-16 h-16 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 overflow-hidden relative shrink-0">
                                                    {img ? (
                                                        <NextImage
                                                            src={getImageUrl(img)}
                                                            alt={title}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600">
                                                            <Package size={20} />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-xs sm:text-sm font-serif font-bold text-slate-900 dark:text-white truncate">
                                                        {title}
                                                    </h4>
                                                    <div className="flex flex-wrap items-center gap-2 mt-1">
                                                        {item.selected_size && (
                                                            <span className="text-[8px] font-mono uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                                                Size: {item.selected_size}
                                                            </span>
                                                        )}
                                                        {item.selected_color && (
                                                            <span className="text-[8px] font-mono uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                                                Color: {item.selected_color}
                                                            </span>
                                                        )}
                                                        <span className="text-[9px] font-mono text-slate-400">
                                                            Qty: {item.quantity}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="text-right shrink-0">
                                                    <p className="text-xs sm:text-sm font-mono font-bold text-slate-900 dark:text-white">
                                                        ₵{parseFloat((item.total_price || item.unit_price || 0).toString()).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* 4. Live Tracking Events & Historical Logs */}
                        {((trackingData.timeline_events && trackingData.timeline_events.length > 0) ||
                          (trackingData.state_logs && trackingData.state_logs.length > 0)) && (
                            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 sm:p-8 shadow-sm space-y-6">
                                <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-4">
                                    <Clock className="w-4 h-4 text-slate-400" />
                                    <h3 className="text-xs font-mono uppercase tracking-[0.3em] text-slate-700 dark:text-slate-200">
                                        Tracking History & Logs
                                    </h3>
                                </div>

                                <div className="space-y-6 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-slate-200 dark:before:bg-slate-800">
                                    {trackingData.timeline_events && trackingData.timeline_events.length > 0 ? (
                                        trackingData.timeline_events.map((event, idx) => (
                                            <div key={event.id || idx} className="relative pl-7">
                                                <div className={`absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 ${
                                                    idx === 0
                                                        ? 'bg-slate-900 border-white dark:bg-white dark:border-slate-950 ring-2 ring-slate-200 dark:ring-slate-800'
                                                        : 'bg-slate-300 dark:bg-slate-700 border-white dark:border-slate-950'
                                                }`} />
                                                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-1">
                                                    <h4 className="text-xs font-serif font-bold text-slate-900 dark:text-white">
                                                        {event.title}
                                                    </h4>
                                                    <span className="text-[9px] font-mono text-slate-400">
                                                        {new Date(event.timestamp).toLocaleString('en-GB', {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </span>
                                                </div>
                                                {event.description && (
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-1.5">
                                                        {event.description}
                                                    </p>
                                                )}
                                                {event.location && (
                                                    <p className="text-[9px] font-mono text-slate-400 inline-flex items-center gap-1">
                                                        <MapPin size={10} className="text-slate-500" />
                                                        {event.location}
                                                    </p>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        trackingData.state_logs?.map((log, idx) => (
                                            <div key={log.id || idx} className="relative pl-7">
                                                <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 bg-slate-800 border-white dark:bg-slate-200 dark:border-slate-950" />
                                                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-0.5">
                                                    <h4 className="text-xs font-serif font-bold text-slate-900 dark:text-white">
                                                        {log.to_state_display || 'Milestone Reached'}
                                                    </h4>
                                                    <span className="text-[9px] font-mono text-slate-400">
                                                        {new Date(log.created_at).toLocaleString('en-GB', {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </span>
                                                </div>
                                                {log.reason && (
                                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                                                        {log.reason}
                                                    </p>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        {/* 5. Concierge & Support Footer */}
                        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3 text-center sm:text-left">
                                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 flex items-center justify-center shrink-0">
                                    <MessageCircle size={18} />
                                </div>
                                <div>
                                    <h4 className="text-xs font-serif font-bold text-slate-900 dark:text-white">
                                        Need Assistance with this Package?
                                    </h4>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                        Our Miss London Concierge team is on standby to assist you directly on WhatsApp.
                                    </p>
                                </div>
                            </div>
                            <a
                                href={`https://wa.me/${siteConfig.concierge || '233541096372'}?text=${encodeURIComponent(
                                    `Hello London's Imports, I'm checking up on my order #${trackingData.order_number}. Could you please provide an update?`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-mono text-[9px] uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shrink-0 shadow-sm"
                            >
                                <span>Message Concierge</span>
                                <ArrowRight size={13} />
                            </a>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Cancellation Modal */}
            <AnimatePresence>
                {showCancelModal && trackingData && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-md p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl"
                        >
                            <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white mb-2">
                                Cancel Order?
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                                Are you sure you want to cancel order <span className="font-mono font-bold text-slate-900 dark:text-white">#{trackingData.order_number}</span>? This action cannot be reversed.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowCancelModal(false)}
                                    className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-mono uppercase tracking-wider hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                                >
                                    Keep Order
                                </button>
                                <button
                                    type="button"
                                    disabled={isCancelling}
                                    onClick={handleCancelOrder}
                                    className="flex-1 py-3 bg-rose-600 text-white rounded-xl text-xs font-mono uppercase tracking-wider hover:bg-rose-700 disabled:opacity-50 transition-all"
                                >
                                    {isCancelling ? 'Cancelling...' : 'Yes, Cancel'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function TrackOrderPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center p-6">
                <div className="flex flex-col items-center gap-3 text-slate-400">
                    <Loader2 size={24} className="animate-spin" />
                    <p className="text-xs font-mono uppercase tracking-widest">Loading Logistics Terminal...</p>
                </div>
            </div>
        }>
            <TrackOrderContent />
        </Suspense>
    );
}
