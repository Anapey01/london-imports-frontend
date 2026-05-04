'use client';

import { useState } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { Order } from '@/types';
import { getImageUrl } from '@/lib/image';
import { ordersAPI } from '@/lib/api';
import { useToast } from '@/components/Toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Calendar, Clock, ChevronRight } from 'lucide-react';

const OrdersView = ({ orders }: { orders: Order[] }) => {
    const { showToast } = useToast();
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
            showToast('Order cancelled successfully', 'success');
            setCancellingOrder(null);
            // Refresh would be better, but for now we'll just show the toast
            // In a real app, we'd use useQuery and invalidate the cache
            window.location.reload();
        } catch (error: any) {
            showToast(error.response?.data?.error || 'Failed to cancel order', 'error');
        } finally {
            setIsCancelling(false);
        }
    };

    const getStatusStyles = (state: string) => {
        switch (state) {
            case 'PAID':
            case 'DELIVERED':
            case 'COMPLETED':
                return { text: 'text-white', bg: 'bg-emerald-500', lightBg: 'bg-emerald-500/10' };
            case 'PENDING_PAYMENT':
            case 'DRAFT':
            case 'OPEN_FOR_BATCH':
                return { text: 'text-white', bg: 'bg-amber-500', lightBg: 'bg-amber-500/10' };
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
                        const isPending = (order.state === 'PENDING_PAYMENT' || order.state === 'DRAFT' || (balanceDue > 0 && order.state !== 'CANCELLED')) && order.state !== 'PAID';
                        const canCancel = ['PAID', 'OPEN_FOR_BATCH', 'PENDING_PAYMENT'].includes(order.state);
                        const statusStyles = getStatusStyles(order.state);

                        return (
                            <div key={order.order_number} className="group relative bg-white border border-border-standard rounded-xl hover:border-brand-emerald/40 transition-all duration-300 shadow-sm overflow-hidden mb-3">
                                <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-center gap-6 sm:gap-10">
                                    {/* Compact Thumbnail Node */}
                                    <div className="flex-shrink-0 w-20 h-24 sm:w-16 sm:h-20 relative rounded-lg border border-border-standard overflow-hidden bg-slate-50 flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                                        {order.items?.[0]?.product.image ? (
                                            <NextImage
                                                src={getImageUrl(order.items[0].product.image)}
                                                alt={order.order_number}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-200">
                                                <Package size={20} />
                                            </div>
                                        )}
                                        {order.items && order.items.length > 1 && (
                                            <div className="absolute bottom-1 right-1 bg-slate-950/80 text-white text-[7px] font-black px-1.5 py-0.5 rounded backdrop-blur-sm">
                                                +{order.items.length - 1} MORE
                                            </div>
                                        )}
                                    </div>

                                    {/* High-Authority Meta Data */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-center text-center sm:text-left">
                                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-2">
                                            <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                                                #{order.order_number}
                                            </h3>
                                            <span className={`px-2 py-0.5 rounded-[4px] text-[8px] font-black uppercase tracking-widest ${statusStyles.bg} ${statusStyles.text} shadow-sm border border-black/5`}>
                                                {order.state_display}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-center sm:justify-start gap-4 text-slate-400">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar size={10} className="text-slate-300" />
                                                <p className="text-[9px] font-bold uppercase tracking-widest">
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <span className="w-1 h-1 rounded-full bg-slate-100" />
                                            <div className="flex items-center gap-1.5">
                                                <Package size={10} className="text-slate-300" />
                                                <p className="text-[9px] font-bold uppercase tracking-widest">
                                                    {order.items?.length || 0} ITEM(S)
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Financial Ledger Block */}
                                    <div className="flex flex-col items-center sm:items-end justify-center gap-1 text-center sm:text-right min-w-[120px]">
                                        <p className="text-[8px] uppercase tracking-[0.2em] font-black text-slate-300">Liability</p>
                                        <p className="text-base sm:text-lg font-black text-slate-900 dark:text-white tabular-nums tracking-tighter">
                                            GHS {parseFloat(order.total.toString()).toLocaleString()}
                                        </p>
                                        {balanceDue > 0 && order.state !== 'CANCELLED' && order.state !== 'PAID' && (
                                            <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest">
                                                DUE: GHS {balanceDue.toLocaleString()}
                                            </p>
                                        )}
                                    </div>

                                    {/* Core Operational Actions */}
                                    <div className="flex flex-row sm:flex-col items-center justify-center gap-2 w-full sm:w-40 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-50">
                                        <Link
                                            href={`/orders/${order.order_number}`}
                                            className="flex-1 sm:w-full py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest text-center transition-all bg-slate-950 text-white hover:bg-slate-800 shadow-sm"
                                        >
                                            View Order Details
                                        </Link>
                                        {isPending ? (
                                            <Link
                                                href={`/checkout?order=${order.order_number}`}
                                                className="flex-1 sm:w-full py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest text-center bg-brand-emerald text-white hover:bg-brand-emerald/90 transition-all shadow-sm"
                                            >
                                                Settle Balance
                                            </Link>
                                        ) : (
                                            <Link
                                                href={`/track?order=${order.order_number}`}
                                                className="flex-1 sm:w-full py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest text-center border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all"
                                            >
                                                Track Shipment
                                            </Link>
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
