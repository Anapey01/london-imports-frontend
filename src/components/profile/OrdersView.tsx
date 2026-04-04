'use client';

import { useState } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { Order } from '@/types';
import { getImageUrl } from '@/lib/image';
import { ordersAPI } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const OrdersView = ({ orders, theme }: { orders: Order[]; theme: string }) => {
    const isDark = theme === 'dark';
    const [filter, setFilter] = useState('ALL');
    const [cancellingOrder, setCancellingOrder] = useState<string | null>(null);
    const [isCancelling, setIsCancelling] = useState(false);

    const filteredOrders = filter === 'ALL'
        ? orders
        : orders.filter((o: Order) => {
            if (filter === 'PENDING') return o.state === 'PENDING_PAYMENT' || (parseFloat(o.balance_due?.toString() || '0') > 0);
            if (filter === 'COMPLETED') return o.state === 'DELIVERED' || o.state === 'COMPLETED';
            return true;
        });

    const handleCancelOrder = async (orderNumber: string) => {
        setIsCancelling(true);
        try {
            await ordersAPI.cancelOrder(orderNumber);
            toast.success('Order cancelled successfully');
            setCancellingOrder(null);
            // Refresh would be better, but for now we'll just show the toast
            // In a real app, we'd use useQuery and invalidate the cache
            window.location.reload();
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to cancel order');
        } finally {
            setIsCancelling(false);
        }
    };

    const getStatusStyles = (state: string) => {
        switch (state) {
            case 'PAID':
            case 'DELIVERED':
            case 'COMPLETED':
                return { text: 'text-emerald-500', bg: 'bg-emerald-500', lightBg: 'bg-emerald-500/10' };
            case 'PENDING_PAYMENT':
            case 'DRAFT':
            case 'OPEN_FOR_BATCH':
                return { text: 'text-amber-500', bg: 'bg-amber-500', lightBg: 'bg-amber-500/10' };
            case 'CANCELLED':
            case 'FAILED':
                return { text: 'text-red-500', bg: 'bg-red-500', lightBg: 'bg-red-500/10' };
            case 'SHIPPED':
            case 'ARRIVED_IN_GHANA':
                return { text: 'text-blue-500', bg: 'bg-blue-500', lightBg: 'bg-blue-500/10' };
            default:
                return { text: 'nuclear-text opacity-60', bg: 'bg-slate-400', lightBg: 'bg-slate-500/10' };
        }
    };

    return (
        <div className="space-y-10 pb-20">
            <div className="border-b pb-4 border-primary-surface">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <h2 className="text-2xl font-light tracking-tight nuclear-text">
                        My Orders
                    </h2>
                    <div className="flex items-center gap-4">
                        {['ALL', 'PENDING', 'COMPLETED'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`text-xs uppercase tracking-wide transition-colors ${filter === status
                                    ? 'nuclear-text font-bold'
                                    : 'nuclear-text opacity-40 hover:opacity-100 font-light'
                                    }`}
                            >
                                {status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid gap-6">
                {filteredOrders.length === 0 ? (
                    <div className="text-center py-20">
                        <svg className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-slate-700' : 'text-gray-200'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                        <p className={`text-sm font-light ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>No orders found</p>
                    </div>
                ) : (
                    filteredOrders.map((order: Order) => {
                        const balanceDue = parseFloat(order.balance_due?.toString() || '0');
                        const isPending = order.state === 'PENDING_PAYMENT' || (order.state === 'DRAFT') || (balanceDue > 0 && order.state !== 'CANCELLED');
                        const canCancel = ['PAID', 'OPEN_FOR_BATCH', 'PENDING_PAYMENT'].includes(order.state);
                        const statusStyles = getStatusStyles(order.state);

                        return (
                            <div key={order.order_number} className="group p-5 sm:p-8 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 transition-all duration-500 hover:shadow-md">
                                <div className="flex flex-col md:flex-row justify-between gap-8">
                                    <div className="flex flex-col sm:flex-row gap-8">
                                        {/* Images Stack - Refined Editorial Flow */}
                                        <div className="flex -space-x-12 sm:-space-x-10 flex-shrink-0 justify-center sm:justify-start">
                                            {order.items?.slice(0, 3).map((item, idx) => (
                                                <div key={item.id} className={`relative w-28 h-36 sm:w-24 sm:h-32 rounded-xl overflow-hidden border border-white dark:border-slate-800 shadow-xl bg-slate-50 z-[${30 - idx}] transform transition-transform group-hover:translate-x-1`}>
                                                    {item.product.image ? (
                                                        <NextImage
                                                            src={getImageUrl(item.product.image)}
                                                            alt={item.product_name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" strokeWidth={1} /></svg>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                            {order.items && order.items.length > 3 && (
                                                <div className={`relative w-28 h-36 sm:w-24 sm:h-32 rounded-xl flex items-center justify-center border border-white dark:border-slate-800 shadow-xl ${isDark ? 'bg-slate-900 text-slate-500' : 'bg-gray-100 text-gray-400'} text-xs font-black z-10`}>
                                                    +{order.items.length - 3}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col justify-between py-1 text-center sm:text-left">
                                            <div>
                                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-3">
                                                    <span className={`px-2 py-0.5 rounded border text-[9px] font-black uppercase tracking-[0.2em] ${statusStyles.text} ${statusStyles.text.replace('text-', 'border-').replace('500', '200')}`}>
                                                        {order.state_display}
                                                    </span>
                                                    <h3 className="text-base sm:text-lg font-black font-serif text-slate-950 dark:text-white uppercase tracking-tight">
                                                        Order #{order.order_number}
                                                    </h3>
                                                </div>
                                                <p className="text-[10px] font-black font-sans uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                                                    Established {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(order.created_at))}
                                                </p>
                                            </div>

                                            <div className="mt-8 sm:mt-4 flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-10">
                                                <div>
                                                    <p className="text-[9px] uppercase tracking-[0.3em] font-black mb-1 text-slate-300 dark:text-slate-700">Total Amount</p>
                                                    <p className="text-2xl sm:text-3xl font-serif font-black text-slate-950 dark:text-white tracking-tighter tabular-nums">
                                                        GHS {parseFloat(order.total.toString()).toLocaleString()}
                                                    </p>
                                                </div>
                                                {balanceDue > 0 && order.state !== 'CANCELLED' && (
                                                    <div>
                                                        <p className="text-[9px] uppercase tracking-[0.3em] font-black mb-1 text-slate-400 dark:text-slate-600">Balance Due</p>
                                                        <p className="text-2xl sm:text-3xl font-serif font-black text-slate-950 dark:text-white tracking-tighter tabular-nums">
                                                            GHS {balanceDue.toLocaleString()}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col justify-end gap-3 min-w-[160px]">
                                        <Link
                                            href={`/track?order=${order.order_number}`}
                                            className="w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] text-center transition-all bg-slate-950 text-white dark:bg-white dark:text-slate-950 hover:opacity-90 shadow-sm"
                                        >
                                            Track Shipment
                                        </Link>
                                        
                                        {isPending && (
                                            <Link
                                                href={`/checkout?order=${order.order_number}`}
                                                className="w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] text-center bg-transparent border border-slate-950 dark:border-white text-slate-950 dark:text-white hover:bg-slate-950 hover:text-white dark:hover:bg-white dark:hover:text-slate-950 transition-all shadow-sm"
                                            >
                                                {balanceDue > 0 ? 'Pay Balance' : 'Complete Payment'}
                                            </Link>
                                        )}

                                        <div className="flex items-center justify-center gap-6 mt-2 pt-2 border-t border-slate-50 dark:border-slate-900">
                                            <Link
                                                href={`/orders/${order.order_number}`}
                                                className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors"
                                            >
                                                Invoice
                                            </Link>
                                            {canCancel && (
                                                <button
                                                    onClick={() => setCancellingOrder(order.order_number)}
                                                    className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 hover:text-red-500 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Cancellation Modal */}
            <AnimatePresence>
                {cancellingOrder && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className={`w-full max-w-md p-8 rounded-3xl shadow-2xl ${isDark ? 'bg-slate-900' : 'bg-white'}`}
                        >
                            <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Cancel Order?</h3>
                            <p className={`mb-8 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                Are you sure you want to cancel order <span className="font-bold">#{cancellingOrder}</span>? This action cannot be undone. Refunds take 3-5 business days.
                            </p>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setCancellingOrder(null)}
                                    className={`flex-1 py-4 rounded-xl font-bold ${isDark ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-900'}`}
                                >
                                    Go Back
                                </button>
                                <button
                                    disabled={isCancelling}
                                    onClick={() => handleCancelOrder(cancellingOrder)}
                                    className="flex-1 py-4 rounded-xl font-bold bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
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
};

export default OrdersView;
