'use client';

import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useAuthStore } from '@/stores/authStore';
import { ordersAPI } from '@/lib/api';
import { useToast } from '@/components/Toast';
import { motion, AnimatePresence } from 'framer-motion';

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

        // Auto-dismiss error
        const timer = setTimeout(() => setError(''), 4000);
        const clearTimer = () => clearTimeout(timer);

        try {
            const response = await api.get(`/orders/track/public/${cleanNumber}/`);
            setTrackingData(response.data);
        } catch (err: unknown) {
            const axiosError = err as AxiosError<{ detail?: string }>;
            setError(axiosError.response?.data?.detail || 'Order not found. Please check your ID.');
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
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start px-6 py-12">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 mb-8 animate-fade-in-up">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Track Your Order</h1>
                    <p className="text-gray-500 mt-2">Check the real-time status of your premium imports.</p>
                </div>

                <form onSubmit={handleSubmit} className="relative mb-4">
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">#</span>
                            <input
                                type="text"
                                value={orderNumber}
                                onChange={(e) => setOrderNumber(e.target.value)}
                                className="w-full pl-8 pr-4 py-3.5 rounded-xl border border-gray-200 outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 transition-all text-lg tracking-wide placeholder:tracking-normal"
                                placeholder="Order Number"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 rounded-xl bg-gray-900 text-white font-semibold hover:bg-black focus:ring-4 focus:ring-gray-900/20 transition-all flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50"
                        >
                            {loading ? 'Searching...' : 'Track'}
                        </button>
                    </div>
                </form>

                {error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium animate-shake">
                        {error}
                    </div>
                )}
            </div>

            {/* Results Section */}
            {trackingData && (
                <div className="w-full max-w-2xl space-y-8 animate-fade-in">
                    {/* Status Highlights */}
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-wrap gap-12 items-center justify-between">
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Current Status</p>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-pink-100 text-pink-700">
                                {trackingData.state_display}
                            </span>
                        </div>
                        {canCancel && (
                            <div className="flex flex-col gap-2">
                                {isAuthenticated ? (
                                    <button 
                                        onClick={() => setShowCancelModal(true)}
                                        className="px-6 py-2 bg-red-50 text-red-600 border border-red-100 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors"
                                    >
                                        Cancel Order
                                    </button>
                                ) : (
                                    <p className="text-[10px] text-gray-400 italic font-medium max-w-[150px]">
                                        Log in to your account if you need to cancel this order.
                                    </p>
                                )}
                            </div>
                        )}
                        {trackingData.delivery_window && (
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Expected Delivery</p>
                                <p className="text-sm font-bold text-gray-900">{trackingData.delivery_window}</p>
                            </div>
                        )}
                    </div>

                    {/* Progress Bar */}
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                        <h2 className="text-sm font-medium uppercase tracking-wider text-gray-400 mb-8">Order Lifecycle</h2>
                        <div className="overflow-x-auto pb-4 scrollbar-hide">
                            <div className="flex justify-between relative min-w-[600px] pt-2 mb-2">
                                <div className="absolute top-6 left-4 right-4 h-0.5 bg-gray-100">
                                    <motion.div
                                        className="h-full bg-gray-900"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(getCurrentStep(trackingData.state) / (statusSteps.length - 1)) * 100}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                    />
                                </div>
                                {statusSteps.map((step, index) => {
                                    const currentStep = getCurrentStep(trackingData.state);
                                    return (
                                        <div key={step.key} className="relative z-10 flex flex-col items-center flex-1">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-500 mb-4 ${index <= currentStep
                                                ? 'bg-gray-900 text-white shadow-md'
                                                : 'bg-white border-2 border-gray-100 text-gray-300'
                                                }`}>
                                                {index < currentStep ? (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                ) : (
                                                    <span className="text-xs font-semibold">{index + 1}</span>
                                                )}
                                            </div>
                                            <span className={`text-[10px] uppercase tracking-wider px-2 font-bold text-center ${index <= currentStep ? 'text-gray-900' : 'text-gray-400'}`}>
                                                {step.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Timeline Events */}
                    {trackingData.timeline_events.length > 0 && (
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                            <h2 className="text-sm font-medium uppercase tracking-wider text-gray-400 mb-6">Tracking Updates</h2>
                            <div className="space-y-6">
                                {trackingData.timeline_events.map((event, index) => (
                                    <div key={event.id} className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className={`w-3 h-3 rounded-full mt-1.5 ${index === 0 ? 'bg-pink-600 ring-4 ring-pink-50' : 'bg-gray-200'}`}></div>
                                            {index !== (trackingData?.timeline_events?.length ?? 0) - 1 && <div className="w-px h-full bg-gray-100 my-1"></div>}
                                        </div>
                                        <div className="flex-1 pb-4">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className={`text-sm font-semibold ${index === 0 ? 'text-gray-900' : 'text-gray-600'}`}>{event.title}</h3>
                                                <span className="text-[10px] font-medium text-gray-400">
                                                    {new Date(event.timestamp).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 font-light leading-relaxed">{event.description}</p>
                                            {event.location && (
                                                <p className="text-[10px] text-gray-400 mt-1 inline-flex items-center gap-1">
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
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
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="w-full max-w-md p-8 bg-white rounded-3xl shadow-2xl"
                        >
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Cancel Order?</h3>
                            <p className="text-gray-500 mb-8 leading-relaxed">
                                Are you sure you want to cancel order <span className="font-bold text-gray-900">#{trackingData.order_number}</span>? This action is permanent. Refund processing takes 3-5 business days.
                            </p>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowCancelModal(false)}
                                    className="flex-1 py-4 bg-gray-100 text-gray-900 rounded-xl font-bold hover:bg-gray-200 transition-all"
                                >
                                    Go Back
                                </button>
                                <button
                                    disabled={isCancelling}
                                    onClick={handleCancelOrder}
                                    className="flex-1 py-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 disabled:opacity-50 transition-all"
                                >
                                    {isCancelling ? 'Processing...' : 'Yes, Cancel'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
