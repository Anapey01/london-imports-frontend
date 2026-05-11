'use client';

import { useState } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { Order } from '@/types';
import { getImageUrl } from '@/lib/image';
import { ordersAPI } from '@/lib/api';
import { useToast } from '@/components/Toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Package } from 'lucide-react';

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
        } catch (error: unknown) {
            const err = error as { response?: { data?: { error?: string } } };
            showToast(err.response?.data?.error || 'Failed to cancel order', 'error');
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
        <div className="space-y-12 pb-20">
            {/* Manifest Header Archive */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-slate-100 pb-8">
                <div className="space-y-1">
                    <p className="text-[9px] font-mono font-bold uppercase tracking-[0.4em] text-slate-400">Past Orders & History</p>
                    <h2 className="text-3xl sm:text-4xl font-serif font-bold tracking-tighter text-slate-900 dark:text-white leading-none">
                        Order <span className="italic text-brand-emerald">History.</span>
                    </h2>
                </div>
                <div className="flex items-center gap-5 border border-slate-100 rounded-sm px-6 py-3 bg-slate-50/30">
                    {['ALL', 'PENDING', 'COMPLETED'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`text-[9px] font-mono font-bold uppercase tracking-[0.3em] transition-all relative ${filter === status
                                ? 'text-slate-900'
                                : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            {status === 'ALL' ? 'All Orders' : status}
                            {filter === status && (
                                <motion.div layoutId="filter-pill" className="absolute -bottom-1.5 left-0 right-0 h-[1px] bg-slate-900 rounded-full" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid gap-6">
                {filteredOrders.length === 0 ? (
                    <div className="py-32 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                        <Package size={48} className="mx-auto mb-6 text-slate-200" strokeWidth={1} />
                        <p className="text-xs font-black uppercase tracking-[0.4em] text-slate-400">No orders found</p>
                    </div>
                ) : (
                    filteredOrders.map((order: Order) => {
                        const balanceDue = parseFloat(order.balance_due?.toString() || '0');
                        const totalAmount = parseFloat(order.total.toString());
                        const amountPaid = parseFloat(order.amount_paid?.toString() || '0');
                        const isPending = (balanceDue > 0 && order.state !== 'CANCELLED' && order.state !== 'FAILED');
                        const statusStyles = getStatusStyles(order.state);
                        
                        // Calculate payment progress percentage
                        const paymentProgress = Math.min(100, Math.round((amountPaid / totalAmount) * 100));

                        return (
                            <div key={order.order_number} className="group bg-white border border-slate-100 rounded-sm hover:border-slate-300 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md">
                                <div className="p-6 sm:p-8 flex flex-col lg:flex-row gap-8">
                                    {/* Entry ID & Date Node */}
                                    <div className="lg:w-48 flex lg:flex-col lg:items-start items-center justify-between lg:justify-start lg:border-r border-slate-100 lg:pr-8">
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">Protocol ID</p>
                                            <p className="text-sm font-mono font-bold text-slate-900 tracking-tight">#{order.order_number}</p>
                                        </div>
                                        <div className="space-y-1 lg:mt-10 text-right lg:text-left">
                                            <p className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">Registered</p>
                                            <p className="text-[10px] font-mono font-bold text-slate-600 uppercase tracking-widest">
                                                {new Date(order.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                        <div className="hidden lg:block lg:mt-10">
                                            <div className={`px-3 py-1.5 rounded-full ${statusStyles.lightBg} inline-flex items-center gap-2`}>
                                                <span className={`h-1 w-1 rounded-full ${statusStyles.bg} animate-pulse`} />
                                                <span className={`text-[8px] font-black uppercase tracking-widest ${statusStyles.text.replace('text-white', statusStyles.bg.replace('bg-', 'text-'))}`}>
                                                    {order.state_display}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Asset Summary Node - The Content Area */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start gap-6 mb-8">
                                            <div className="h-20 w-16 relative rounded-sm border border-slate-100 overflow-hidden bg-slate-50 flex-shrink-0">
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
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[8px] font-mono font-bold text-brand-emerald uppercase tracking-[0.3em] mb-1">Package Contents</p>
                                                <div className="space-y-1.5">
                                                    {order.items?.map((item, idx) => (
                                                        <div key={idx} className="flex items-baseline justify-between gap-4">
                                                            <p className="text-[11px] font-bold text-slate-900 uppercase tracking-tight truncate max-w-[200px]">
                                                                {item.product.name}
                                                                {item.selected_size && <span className="ml-2 text-slate-400 font-normal">[{item.selected_size}]</span>}
                                                            </p>
                                                            <p className="text-[10px] font-mono text-slate-400">x{item.quantity}</p>
                                                        </div>
                                                    ))}
                                                    {order.items && order.items.length > 2 && (
                                                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest pt-1">
                                                            + {order.items.length - 2} more items
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Installment Progress Archive */}
                                        <div className="bg-slate-50/50 p-4 rounded-sm border border-slate-100/50">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest">Payment Integrity</p>
                                                <p className="text-[9px] font-mono font-bold text-slate-900 uppercase tracking-widest">{paymentProgress}% Secured</p>
                                            </div>
                                            <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${paymentProgress}%` }}
                                                    className={`h-full ${paymentProgress === 100 ? 'bg-emerald-500' : 'bg-brand-emerald'}`}
                                                />
                                            </div>
                                            <div className="flex items-center justify-between mt-3">
                                                <div className="flex gap-4">
                                                    <div>
                                                        <span className="text-[7px] text-slate-400 uppercase font-black block">Paid</span>
                                                        <span className="text-[10px] font-mono font-bold text-slate-900 tracking-tighter">₵{amountPaid.toLocaleString()}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-[7px] text-slate-400 uppercase font-black block">Balance</span>
                                                        <span className={`text-[10px] font-mono font-bold tracking-tighter ${balanceDue > 0 ? 'text-amber-600' : 'text-slate-400'}`}>
                                                            ₵{balanceDue.toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-[7px] text-slate-400 uppercase font-black block">Total Valuation</span>
                                                    <span className="text-[10px] font-mono font-bold text-slate-900 tracking-tighter">₵{totalAmount.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Operational Bridge Node */}
                                    <div className="lg:w-48 flex flex-col gap-2 justify-center pt-6 lg:pt-0 border-t lg:border-t-0 lg:border-l border-slate-100 lg:pl-8">
                                        <Link
                                            href={`/track?order=${order.order_number}`}
                                            className="w-full py-3.5 border border-slate-900 bg-slate-900 text-white text-[9px] font-black uppercase tracking-[0.4em] text-center rounded-sm hover:bg-slate-800 transition-all shadow-md group-hover:-translate-y-0.5"
                                        >
                                            Track Order
                                        </Link>
                                        {isPending && (
                                            <Link
                                                href={`/checkout?order=${order.order_number}`}
                                                className="w-full py-3.5 border border-brand-emerald bg-brand-emerald text-white text-[9px] font-black uppercase tracking-[0.4em] text-center rounded-sm hover:brightness-110 transition-all shadow-sm group-hover:-translate-y-0.5"
                                            >
                                                Complete Payment
                                            </Link>
                                        )}
                                        {order.state === 'PENDING_PAYMENT' && amountPaid === 0 && (
                                            <button 
                                                onClick={() => setCancellingOrder(order.order_number)}
                                                className="w-full py-2 text-[8px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors"
                                            >
                                                Void Order
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
