'use client';

import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { useAuthStore } from '@/stores/authStore';
import { ordersAPI } from '@/lib/api';
import { useToast } from '@/components/Toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Search, MapPin, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

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

interface OrderTracking {
    order_number: string;
    state: string;
    state_display: string;
    delivery_window?: string;
    timeline_events: TimelineEvent[];
}

export default function TrackOrderPage() {
    const { showToast } = useToast();
    const [orderNumber, setOrderNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [trackingData, setTrackingData] = useState<OrderTracking | null>(null);

    // Auto-dismiss error state
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(''), 4000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const { isAuthenticated } = useAuthStore();
    const [isCancelling, setIsCancelling] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderNumber.trim()) return;

        const cleanNumber = orderNumber.trim().replace('#', '');
        setLoading(true);
        setError('');
        setTrackingData(null);

        try {
            const response = await api.get(`/orders/track/public/${cleanNumber}/`);
            setTrackingData(response.data);
        } catch (err: unknown) {
            const axiosError = err as AxiosError<{ detail?: string }>;
            setError(axiosError.response?.data?.detail || 'Order not found. Please check your order number.');
        } finally {
            setLoading(false);
        }
    };

    const statusSteps = [
        { key: 'PAID', label: 'Paid' },
        { key: 'OPEN_FOR_BATCH', label: 'In Batch' },
        { key: 'CUTOFF_REACHED', label: 'Processing' },
        { key: 'IN_FULFILLMENT', label: 'Preparing' },
        { key: 'IN_TRANSIT', label: 'In Transit' },
        { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
        { key: 'DELIVERED', label: 'Delivered' },
    ];

    const getCurrentStep = (state: string) => {
        return statusSteps.findIndex(s => s.key === state);
    };

    const handleCancelOrder = async () => {
        if (!trackingData) return;
        setIsCancelling(true);
        try {
            await ordersAPI.cancelOrder(trackingData.order_number);
            showToast('Order cancelled successfully', 'success');
            setShowCancelModal(false);
            window.location.reload();
        } catch (error: unknown) {
            const err = error as { response?: { data?: { error?: string } } };
            showToast(err.response?.data?.error || 'Failed to cancel order', 'error');
        } finally {
            setIsCancelling(false);
        }
    };

    const canCancel = trackingData && ['PAID', 'OPEN_FOR_BATCH', 'PENDING_PAYMENT'].includes(trackingData.state);

    return (
        <div className="min-h-screen bg-surface dark:bg-slate-950 flex flex-col items-center justify-start px-4 sm:px-6 py-12 md:py-20 transition-colors">
            {/* Header & Search Card */}
            <div className="w-full max-w-2xl bg-surface dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm p-6 sm:p-10 mb-8 animate-fade-in-up transition-colors">
                <div className="text-center mb-8">
                    <div className="w-14 h-14 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
                        <Package size={26} strokeWidth={1.75} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 block mb-2">
                        Logistics & Tracking
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 dark:text-white tracking-tight">
                        Track Your Shipment
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">
                        Enter your order number to check real-time cargo and delivery milestones.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-bold text-base">#</span>
                            <input
                                type="text"
                                value={orderNumber}
                                onChange={(e) => setOrderNumber(e.target.value)}
                                className="w-full pl-9 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:border-brand-emerald focus:ring-4 focus:ring-emerald-500/10 transition-all text-base tracking-wider placeholder:tracking-normal placeholder:text-slate-400 dark:placeholder:text-slate-600 font-medium"
                                placeholder="e.g. ORD-2026-0812"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-3.5 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black text-xs uppercase tracking-[0.2em] hover:bg-brand-emerald dark:hover:bg-brand-emerald dark:hover:text-white transition-all flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50 shadow-sm active:scale-[0.99]"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={14} className="animate-spin" />
                                    <span>Searching...</span>
                                </>
                            ) : (
                                <>
                                    <Search size={14} />
                                    <span>Track</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-4 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/60 rounded-xl text-xs font-medium flex items-center gap-2.5"
                    >
                        <AlertCircle size={15} className="shrink-0" />
                        <span>{error}</span>
                    </motion.div>
                )}
            </div>

            {/* Results Section */}
            {trackingData && (
                <div className="w-full max-w-2xl space-y-6 animate-fade-in">
                    {/* Status Highlights */}
                    <div className="bg-surface dark:bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-wrap gap-6 items-center justify-between transition-colors">
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold mb-1.5">Current Status</p>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald animate-pulse" />
                                {trackingData.state_display}
                            </span>
                        </div>
                        {trackingData.delivery_window && (
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold mb-1.5">Expected Delivery</p>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">{trackingData.delivery_window}</p>
                            </div>
                        )}
                        {canCancel && (
                            <div>
                                {isAuthenticated ? (
                                    <button 
                                        onClick={() => setShowCancelModal(true)}
                                        className="px-5 py-2 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/50 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 dark:hover:text-white transition-all"
                                    >
                                        Cancel Order
                                    </button>
                                ) : (
                                    <p className="text-[10px] text-slate-400 dark:text-slate-500 italic max-w-[150px]">
                                        Log in to cancel this order.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Progress Bar */}
                    <div className="bg-surface dark:bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-slate-800 transition-colors">
                        <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-8">
                            Order Lifecycle
                        </h2>
                        <div className="overflow-x-auto pb-4 scrollbar-hide">
                            <div className="flex justify-between relative min-w-[580px] pt-2 mb-2">
                                <div className="absolute top-6 left-4 right-4 h-0.5 bg-slate-100 dark:bg-slate-800">
                                    <motion.div
                                        className="h-full bg-brand-emerald"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(getCurrentStep(trackingData.state) / (statusSteps.length - 1)) * 100}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                    />
                                </div>
                                {statusSteps.map((step, index) => {
                                    const currentStep = getCurrentStep(trackingData.state);
                                    const isPassed = index < currentStep;
                                    const isCurrent = index === currentStep;
                                    return (
                                        <div key={step.key} className="relative z-10 flex flex-col items-center flex-1">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-500 mb-3 ${
                                                isPassed || isCurrent
                                                    ? 'bg-slate-900 dark:bg-brand-emerald text-white shadow-sm'
                                                    : 'bg-surface dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600'
                                            }`}>
                                                {isPassed ? (
                                                    <CheckCircle2 size={14} className="text-emerald-400 dark:text-white" />
                                                ) : (
                                                    <span className="text-[11px] font-bold">{index + 1}</span>
                                                )}
                                            </div>
                                            <span className={`text-[10px] uppercase tracking-wider px-1 font-bold text-center ${
                                                isCurrent 
                                                    ? 'text-brand-emerald dark:text-emerald-400 font-black' 
                                                    : isPassed 
                                                        ? 'text-slate-900 dark:text-white' 
                                                        : 'text-slate-400 dark:text-slate-600'
                                            }`}>
                                                {step.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Transit Milestones */}
                        {trackingData.state === 'IN_TRANSIT' && (
                            <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-2.5 mb-6">
                                    <div className="w-2 h-2 rounded-full bg-brand-emerald animate-pulse" />
                                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">
                                        Transit Milestones
                                    </h3>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {[
                                        { label: 'Origin Facility', loc: 'China Sorting Hub', done: true },
                                        { label: 'International Freight', loc: 'In Transit', done: false },
                                        { label: 'Destination Customs', loc: 'Ghana Hub', done: false },
                                    ].map((milestone, idx) => (
                                        <div 
                                            key={idx} 
                                            className={`p-4 rounded-xl border transition-all ${
                                                milestone.done 
                                                    ? 'bg-slate-50 dark:bg-slate-950/60 border-slate-200/80 dark:border-slate-800' 
                                                    : 'bg-transparent border-dashed border-slate-200 dark:border-slate-800 opacity-60'
                                            }`}
                                        >
                                            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">{milestone.loc}</p>
                                            <p className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">{milestone.label}</p>
                                            <div className="mt-3 flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${milestone.done ? 'bg-brand-emerald' : 'bg-slate-300 dark:bg-slate-700'}`} />
                                                <div className="flex-1 h-[1px] bg-slate-100 dark:bg-slate-800" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Timeline Events */}
                    {trackingData.timeline_events.length > 0 && (
                        <div className="bg-surface dark:bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-slate-800 transition-colors">
                            <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-6">
                                Tracking History
                            </h2>
                            <div className="space-y-6">
                                {trackingData.timeline_events.map((event, index) => (
                                    <div key={event.id} className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className={`w-3 h-3 rounded-full mt-1 ${index === 0 ? 'bg-brand-emerald ring-4 ring-emerald-50 dark:ring-emerald-950/40' : 'bg-slate-300 dark:bg-slate-700'}`} />
                                            {index !== (trackingData?.timeline_events?.length ?? 0) - 1 && (
                                                <div className="w-px h-full bg-slate-200 dark:bg-slate-800 my-1" />
                                            )}
                                        </div>
                                        <div className="flex-1 pb-4">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className={`text-xs sm:text-sm font-bold ${index === 0 ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                                                    {event.title}
                                                </h3>
                                                <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                                                    {new Date(event.timestamp).toLocaleDateString()}
                                                </span>
                                            </div>
                                            {event.description && (
                                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{event.description}</p>
                                            )}
                                            {event.location && (
                                                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 inline-flex items-center gap-1">
                                                    <MapPin size={11} className="text-brand-emerald" />
                                                    {event.location}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Cancellation Modal */}
            <AnimatePresence>
                {showCancelModal && trackingData && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-md p-6 sm:p-8 bg-surface dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl transition-colors"
                        >
                            <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-white mb-3">
                                Cancel Order?
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                                Are you sure you want to cancel order <span className="font-bold text-slate-900 dark:text-white">#{trackingData.order_number}</span>? This action cannot be reversed.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowCancelModal(false)}
                                    className="flex-1 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                                >
                                    Keep Order
                                </button>
                                <button
                                    disabled={isCancelling}
                                    onClick={handleCancelOrder}
                                    className="flex-1 py-3.5 bg-rose-600 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-rose-700 disabled:opacity-50 transition-all"
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
