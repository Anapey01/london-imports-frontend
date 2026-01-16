'use client';

import { useState } from 'react';
import { ordersAPI } from '@/lib/api';
import { motion } from 'framer-motion';

const statusSteps = [
    { key: 'PAID', label: 'Paid' },
    { key: 'OPEN_FOR_BATCH', label: 'Order Confirmed' },
    { key: 'CUTOFF_REACHED', label: 'Processing' },
    { key: 'IN_FULFILLMENT', label: 'In Fulfillment' },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
    { key: 'DELIVERED', label: 'Delivered' },
];

interface Order {
    state: string;
    delivery_window?: string;
    order_number: string;
    created_at: string;
    total: number;
    delivery_city: string;
    delivery_region: string;
}

export default function TrackOrderPage() {
    const [orderNumber, setOrderNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [order, setOrder] = useState<Order | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderNumber.trim()) return;

        setIsLoading(true);
        setError('');
        setOrder(null);

        try {
            const response = await ordersAPI.track(orderNumber);
            setOrder(response.data);
        } catch (err: unknown) {
            const errorResponse = err as { response?: { data?: { message?: string } } };
            setError(errorResponse.response?.data?.message || 'Order not found. Please check the ID and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const getCurrentStep = () => {
        if (!order) return 0;
        const stateIndex = statusSteps.findIndex(s => s.key === order.state);
        return stateIndex >= 0 ? stateIndex : 0;
    };

    const currentStep = getCurrentStep();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center px-6 py-20 pt-32">
            <div className="w-full max-w-xl">
                {/* Search Card */}
                <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Track Your Order</h1>
                        <p className="text-gray-500 mt-2">Enter your order ID to check its current status.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <input
                                type="text"
                                value={orderNumber}
                                onChange={(e) => setOrderNumber(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-lg text-center font-mono placeholder:font-sans uppercase"
                                placeholder="e.g. ORD-12345"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 px-6 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 focus:ring-4 focus:ring-slate-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {isLoading ? 'Tracking...' : 'Track Order'}
                            {!isLoading && (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            )}
                        </button>
                    </form>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl text-center text-sm font-medium"
                        >
                            {error}
                        </motion.div>
                    )}
                </div>

                {/* Result Card */}
                {order && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl shadow-xl p-8 overflow-hidden relative"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
                            <div>
                                <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Order Status</p>
                                <h2 className="text-3xl font-bold text-gray-900 mt-1">{order.state.replace(/_/g, ' ')}</h2>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Est. Delivery</p>
                                <p className="font-semibold text-purple-600">{order.delivery_window || 'TBA'}</p>
                            </div>
                        </div>

                        {/* Progress Tracker */}
                        <div className="relative mb-8">
                            <div className="absolute top-4 left-0 right-0 h-1 bg-gray-100 rounded-full overflow-hidden">
                                className={`h-full bg-purple-600 transition-all duration-1000 ease-out ${{
                                        0: 'w-0',
                                        1: 'w-1/5',
                                        2: 'w-2/5',
                                        3: 'w-3/5',
                                        4: 'w-4/5',
                                        5: 'w-full'
                                    }[currentStep] || 'w-0'
                                    }`}
                            </div>
                            <div className="flex justify-between relative">
                                {statusSteps.map((step, index) => (
                                    <div key={step.key} className="flex flex-col items-center w-1/6">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 transition-colors duration-500 ${index <= currentStep ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' : 'bg-gray-100 text-gray-400'
                                            }`}>
                                            {index < currentStep ? (
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : (
                                                <span className="text-xs font-semibold">{index + 1}</span>
                                            )}
                                        </div>
                                        <span className={`text-[10px] md:text-xs mt-3 text-center transition-colors duration-500 ${index <= currentStep ? 'text-purple-600 font-bold' : 'text-gray-400'
                                            }`}>
                                            {step.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Details Preview */}
                        <div className="bg-gray-50 rounded-2xl p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Order Details</h3>
                            <div className="space-y-3 text-sm text-gray-600">
                                <div className="flex justify-between">
                                    <span>Order Number:</span>
                                    <span className="font-medium text-gray-900 font-mono">{order.order_number}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Date Placed:</span>
                                    <span className="font-medium text-gray-900">{new Date(order.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Total Amount:</span>
                                    <span className="font-medium text-gray-900">GHS {order.total.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Delivery To:</span>
                                    <span className="font-medium text-gray-900">{order.delivery_city}, {order.delivery_region}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 text-center">
                            <p className="text-sm text-gray-400">
                                Need help? <a href="/contact" className="text-blue-500 hover:text-blue-600 font-medium">Contact Support</a>
                            </p>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
