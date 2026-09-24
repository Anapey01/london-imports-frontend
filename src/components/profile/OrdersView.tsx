'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { Order } from '@/types';
import { getImageUrl } from '@/lib/image';
import { ordersAPI } from '@/lib/api';
import { cleanProductName } from '@/lib/format';
import { useToast } from '@/components/Toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Package } from 'lucide-react';

const OrdersView = ({ orders }: { orders: Order[] }) => {
    const { showToast } = useToast();
    const [filter, setFilter] = useState('ALL');
    const [cancellingOrder, setCancellingOrder] = useState<string | null>(null);
    const [isCancelling, setIsCancelling] = useState(false);
    const [, startTransition] = useTransition();

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
            showToast('Order cancelled successfully', 'success');
            setCancellingOrder(null);
            // Refresh would be better, but for now we'll just show the toast
            // In a real app, we'd use useQuery and invalidate the cache
            window.location.reload();
        } catch (error: unknown) {
            const err = error as { response?: { data?: { error?: string } } };
            showToast(err.response?.data?.error || 'Failed to cancel order', 'error');
        } finally {
            setIsCancelling(false);
        }
    };

    const renderStatusBadge = (state: string, display: string) => {
        let dotColor = 'bg-slate-700 dark:bg-slate-300';
        let badgeClasses = 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300';

        if (['PAID', 'DELIVERED', 'COMPLETED'].includes(state)) {
            dotColor = 'bg-slate-900 dark:bg-white';
            badgeClasses = 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300';
        } else if (['PENDING_PAYMENT', 'DRAFT', 'OPEN_FOR_BATCH'].includes(state)) {
            dotColor = 'bg-amber-500';
            badgeClasses = 'border-amber-200/80 dark:border-amber-900/40 bg-amber-50/60 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300';
        } else if (['CANCELLED', 'FAILED'].includes(state)) {
            dotColor = 'bg-slate-400';
            badgeClasses = 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-500';
        } else if (['SHIPPED', 'ARRIVED_IN_GHANA', 'IN_TRANSIT'].includes(state)) {
            dotColor = 'bg-slate-600 dark:bg-slate-400';
            badgeClasses = 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300';
        }

        return (
            <div className={`px-2.5 py-1 rounded-full border ${badgeClasses} inline-flex items-center gap-1.5`}>
                <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
                <span className="text-[8px] font-mono uppercase tracking-wider">
                    {display}
                </span>
            </div>
        );
    };

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-slate-100 dark:border-slate-800 pb-8">
                <div className="space-y-1">
                    <p className="text-[9px] font-mono uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">Order Management</p>
                    <h2 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                        Order <span className="italic font-normal text-slate-500 dark:text-slate-400">History.</span>
                    </h2>
                </div>
                <div className="flex items-center gap-1 border border-slate-200/80 dark:border-slate-800 rounded-xl p-1 bg-slate-50/60 dark:bg-slate-900/40">
                    {['ALL', 'PENDING', 'COMPLETED'].map(status => (
                        <button
                            key={status}
                            onClick={() => {
                                startTransition(() => {
                                    setFilter(status);
                                });
                            }}
                            className={`px-3.5 py-1.5 rounded-lg text-[9px] font-mono uppercase tracking-wider transition-all ${filter === status
                                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-bold'
                                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
                                }`}
                        >
                            {status === 'ALL' ? 'All Orders' : status === 'PENDING' ? 'Unpaid' : 'Delivered'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid gap-6">
                {filteredOrders.length === 0 ? (
                    <div className="py-24 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                        <Package size={40} className="mx-auto mb-4 text-slate-200 dark:text-slate-700" strokeWidth={1} />
                        <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-slate-400">No orders found</p>
                    </div>
                ) : (
                    filteredOrders.map((order: Order) => {
                        const balanceDue = parseFloat(order.balance_due?.toString() || '0');
                        const totalAmount = parseFloat(order.total.toString());
                        const amountPaid = parseFloat(order.amount_paid?.toString() || '0');
                        const isPending = (balanceDue > 0 && order.state !== 'CANCELLED' && order.state !== 'FAILED');
                        
                        // Calculate payment progress percentage
                        const paymentProgress = Math.min(100, Math.round((amountPaid / totalAmount) * 100));

                        return (
                            <div key={order.order_number} className="group bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 overflow-hidden shadow-sm">
                                <div className="p-6 sm:p-8 flex flex-col lg:flex-row gap-8">
                                    {/* Entry ID & Date Node */}
                                    <div className="lg:w-44 flex lg:flex-col lg:items-start items-center justify-between lg:justify-start lg:border-r border-slate-100 dark:border-slate-800 lg:pr-8">
                                        <div className="space-y-0.5">
                                            <p className="text-[8px] font-mono text-slate-400 uppercase tracking-wider">Order No.</p>
                                            <p className="text-xs font-mono font-bold text-slate-900 dark:text-white tracking-tight">#{order.order_number}</p>
                                        </div>
                                        <div className="space-y-0.5 lg:mt-8 text-right lg:text-left">
                                            <p className="text-[8px] font-mono text-slate-400 uppercase tracking-wider">Date</p>
                                            <p className="text-[10px] font-mono text-slate-600 dark:text-slate-400">
                                                {new Date(order.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                        <div className="hidden lg:block lg:mt-8">
                                            {renderStatusBadge(order.state, order.state_display)}
                                        </div>
                                    </div>

                                    {/* Asset Summary Node - The Content Area */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start gap-5 mb-6">
                                            <div className="h-16 w-16 relative rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-800/50 shrink-0">
                                                {order.items?.[0]?.product.image ? (
                                                    <NextImage
                                                        src={getImageUrl(order.items[0].product.image)}
                                                        alt={order.order_number}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600">
                                                        <Package size={18} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1 lg:hidden">
                                                    {renderStatusBadge(order.state, order.state_display)}
                                                </div>
                                                <p className="text-[8px] font-mono uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-1">Items in Package</p>
                                                <div className="space-y-1">
                                                    {order.items?.slice(0, 2).map((item, idx) => (
                                                        <div key={idx} className="flex items-baseline justify-between gap-4">
                                                            <p className="text-xs font-serif font-bold text-slate-900 dark:text-white truncate max-w-[220px]">
                                                                {cleanProductName(item.product)}
                                                                {item.selected_size && <span className="ml-1.5 text-slate-400 font-sans font-normal text-[10px]">[{item.selected_size}]</span>}
                                                            </p>
                                                            <p className="text-[9px] font-mono text-slate-400">×{item.quantity}</p>
                                                        </div>
                                                    ))}
                                                    {order.items && order.items.length > 2 && (
                                                        <p className="text-[8px] font-mono text-slate-400 tracking-wider pt-0.5">
                                                            + {order.items.length - 2} more item(s)
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Installment Progress */}
                                        <div className="bg-slate-50/70 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-100 dark:border-slate-800/60">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-[8px] font-mono uppercase tracking-wider text-slate-400">Payment Status</p>
                                                <p className="text-[9px] font-mono font-bold text-slate-700 dark:text-slate-300">{paymentProgress}% Paid</p>
                                            </div>
                                            <div className="h-1 w-full bg-slate-200/80 dark:bg-slate-700/60 rounded-full overflow-hidden">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${paymentProgress}%` }}
                                                    className="h-full bg-slate-900 dark:bg-white"
                                                />
                                            </div>
                                            <div className="flex items-center justify-between mt-3">
                                                <div className="flex gap-4">
                                                    <div>
                                                        <span className="text-[7px] font-mono text-slate-400 uppercase block">Paid</span>
                                                        <span className="text-[10px] font-mono font-bold text-slate-900 dark:text-white tracking-tight">₵{amountPaid.toLocaleString()}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-[7px] font-mono text-slate-400 uppercase block">Balance</span>
                                                        <span className="text-[10px] font-mono font-bold tracking-tight text-slate-900 dark:text-white">
                                                            ₵{balanceDue.toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-[7px] font-mono text-slate-400 uppercase block">Total</span>
                                                    <span className="text-[10px] font-mono font-bold text-slate-900 dark:text-white tracking-tight">₵{totalAmount.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="lg:w-44 flex flex-col gap-2.5 justify-center pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 lg:pl-8">
                                        <Link
                                            href={`/track?order=${order.order_number}`}
                                            className="w-full py-2.5 border border-slate-900 bg-slate-950 text-white dark:bg-white dark:text-slate-950 dark:border-white text-[9px] font-mono uppercase tracking-[0.2em] text-center rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-sm"
                                        >
                                            Track Order
                                        </Link>
                                        {isPending && (
                                            <Link
                                                href={`/checkout?order=${order.order_number}`}
                                                className="w-full py-2.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-[9px] font-mono uppercase tracking-[0.2em] text-center rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
                                            >
                                                Pay Balance
                                            </Link>
                                        )}
                                        {order.state === 'PENDING_PAYMENT' && amountPaid === 0 && (
                                            <button 
                                                onClick={() => setCancellingOrder(order.order_number)}
                                                className="w-full py-1.5 text-[8px] font-mono uppercase tracking-wider text-slate-400 hover:text-rose-500 transition-colors"
                                            >
                                                Cancel Order
                                            </button>
                                        )}
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
                    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-md p-6 sm:p-8 rounded-2xl shadow-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                        >
                            <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white tracking-tight mb-3">Cancel Order?</h3>
                            <p className="mb-6 text-xs text-slate-500 dark:text-slate-400 font-normal leading-relaxed">
                                Are you sure you want to cancel order <span className="font-mono font-bold text-slate-900 dark:text-white">#{cancellingOrder}</span>? This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setCancellingOrder(null)}
                                    className="flex-1 py-3 rounded-xl font-mono uppercase tracking-wider text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-all"
                                >
                                    Keep Order
                                </button>
                                <button
                                    disabled={isCancelling}
                                    onClick={() => handleCancelOrder(cancellingOrder)}
                                    className="flex-1 py-3 rounded-xl font-mono uppercase tracking-wider text-[9px] bg-rose-600 text-white hover:bg-rose-700 transition-all disabled:opacity-50"
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
