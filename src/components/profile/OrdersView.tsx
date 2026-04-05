'use client';

import { useState } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { Order } from '@/types';
import { getImageUrl } from '@/lib/image';
import { ordersAPI } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const OrdersView = ({ orders }: { orders: Order[] }) => {
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
                return { text: 'text-white', bg: 'bg-red-600' };
            case 'SHIPPED':
            case 'ARRIVED_IN_GHANA':
                return { text: 'text-white', bg: 'bg-blue-600' };
            default:
                return { text: 'text-content-primary', bg: 'bg-surface-card' };
        }
    };

    return (
        <div className="space-y-10 pb-20">
            <div className="border-b pb-4 border-border-standard">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <h2 className="text-2xl font-black tracking-tight text-content-primary uppercase">
                        My Orders
                    </h2>
                    <div className="flex items-center gap-4">
                        {['ALL', 'PENDING', 'COMPLETED'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`text-[10px] uppercase tracking-widest transition-colors ${filter === status
                                    ? 'text-content-primary font-black'
                                    : 'text-content-secondary hover:text-content-primary font-black'
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
                        <svg className="w-12 h-12 mx-auto mb-4 text-content-secondary opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                        <p className="text-sm font-black uppercase tracking-widest text-content-secondary">No orders found</p>
                    </div>
                ) : (
                    filteredOrders.map((order: Order) => {
                        const balanceDue = parseFloat(order.balance_due?.toString() || '0');
                        const isPending = order.state === 'PENDING_PAYMENT' || (order.state === 'DRAFT') || (balanceDue > 0 && order.state !== 'CANCELLED');
                        const canCancel = ['PAID', 'OPEN_FOR_BATCH', 'PENDING_PAYMENT'].includes(order.state);
                        const statusStyles = getStatusStyles(order.state);

                        return (
                            <div key={order.order_number} className="group p-5 sm:p-8 rounded-2xl border border-border-standard bg-surface-card transition-all duration-500 hover:shadow-md">
                                <div className="flex flex-col md:flex-row justify-between gap-8">
                                    <div className="flex flex-col sm:flex-row gap-8">
                                        <div className="flex -space-x-12 sm:-space-x-10 flex-shrink-0 justify-center sm:justify-start">
                                            {order.items?.slice(0, 3).map((item, idx) => (
                                                <div key={item.id} className={`relative w-28 h-36 sm:w-24 sm:h-32 rounded-xl overflow-hidden border border-border-standard shadow-xl bg-surface z-[${30 - idx}] transform transition-transform group-hover:translate-x-1`}>
                                                    {item.product.image ? (
                                                        <NextImage
                                                            src={getImageUrl(item.product.image)}
                                                            alt={item.product_name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-content-secondary">
                                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" strokeWidth={1} /></svg>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                            {order.items && order.items.length > 3 && (
                                                <div className="relative w-28 h-36 sm:w-24 sm:h-32 rounded-xl flex items-center justify-center border border-border-standard shadow-xl bg-surface-card text-content-secondary text-[10px] font-black z-10 uppercase tracking-widest">
                                                    +{order.items.length - 3}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col justify-between py-1 text-center sm:text-left">
                                            <div>
                                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-3">
                                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] ${statusStyles.bg} ${statusStyles.text}`}>
                                                        {order.state_display}
                                                    </span>
                                                    <h3 className="text-base sm:text-lg font-black text-content-primary uppercase tracking-tight">
                                                        Order #{order.order_number}
                                                    </h3>
                                                </div>
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-content-secondary">
                                                    Established {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(order.created_at))}
                                                </p>
                                            </div>

                                            <div className="mt-8 sm:mt-4 flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-10">
                                                <div>
                                                    <p className="text-[9px] uppercase tracking-[0.3em] font-black mb-1 text-content-secondary">Total Amount</p>
                                                    <p className="text-2xl sm:text-3xl font-black text-content-primary tracking-tighter tabular-nums uppercase">
                                                        GHS {parseFloat(order.total.toString()).toLocaleString()}
                                                    </p>
                                                </div>
                                                {balanceDue > 0 && order.state !== 'CANCELLED' && (
                                                    <div>
                                                        <p className="text-[9px] uppercase tracking-[0.3em] font-black mb-1 text-content-secondary">Balance Due</p>
                                                        <p className="text-2xl sm:text-3xl font-black text-content-primary tracking-tighter tabular-nums uppercase">
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
                                            className="w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] text-center transition-all bg-content-primary text-surface hover:opacity-90 shadow-sm"
                                        >
                                            Track Shipment
                                        </Link>
                                        
                                        {isPending && (
                                            <Link
                                                href={`/checkout?order=${order.order_number}`}
                                                className="w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] text-center bg-transparent border border-content-primary text-content-primary hover:bg-content-primary hover:text-surface transition-all shadow-sm"
                                            >
                                                {balanceDue > 0 ? 'Pay Balance' : 'Complete Payment'}
                                            </Link>
                                        )}

                                        <div className="flex items-center justify-center gap-6 mt-2 pt-2 border-t border-border-standard">
                                            <Link
                                                href={`/orders/${order.order_number}`}
                                                className="text-[10px] font-black uppercase tracking-[0.2em] text-content-secondary hover:text-content-primary transition-colors"
                                            >
                                                Invoice
                                            </Link>
                                            {canCancel && (
                                                <button
                                                    onClick={() => setCancellingOrder(order.order_number)}
                                                    className="text-[10px] font-black uppercase tracking-[0.2em] text-content-secondary hover:text-red-600 transition-colors"
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
                            className="w-full max-w-md p-8 rounded-3xl shadow-2xl bg-surface border border-border-standard"
                        >
                            <h3 className="text-2xl font-black text-content-primary uppercase tracking-tight mb-4">Cancel Order?</h3>
                            <p className="mb-8 text-sm text-content-secondary uppercase tracking-widest font-black leading-relaxed">
                                Are you sure you want to cancel order <span className="text-content-primary">#{cancellingOrder}</span>? This action cannot be undone. Refunds take 3-5 business days.
                            </p>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setCancellingOrder(null)}
                                    className="flex-1 py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] bg-surface-card text-content-primary border border-border-standard"
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
