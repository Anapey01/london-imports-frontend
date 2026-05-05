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
        <div className="space-y-12 pb-20">
            {/* Manifest Header Archive */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 border-b border-slate-100 pb-10">
                <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Archive Retrieval</p>
                    <h2 className="text-4xl font-black tracking-tighter text-slate-900 uppercase leading-none">
                        Order Manifests
                    </h2>
                </div>
                <div className="flex items-center gap-6 border border-slate-100 rounded-full px-6 py-3 bg-slate-50/30">
                    {['ALL', 'PENDING', 'COMPLETED'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`text-[9px] font-black uppercase tracking-[0.2em] transition-all relative ${filter === status
                                ? 'text-slate-900'
                                : 'text-slate-300 hover:text-slate-500'
                                }`}
                        >
                            {status === 'ALL' ? 'Total' : status}
                            {filter === status && (
                                <motion.div layoutId="filter-pill" className="absolute -bottom-2 left-0 right-0 h-[2px] bg-brand-emerald rounded-full" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid gap-6">
                {filteredOrders.length === 0 ? (
                    <div className="py-32 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                        <Package size={48} className="mx-auto mb-6 text-slate-100" strokeWidth={1} />
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">No Historical Records Found</p>
                    </div>
                ) : (
                    filteredOrders.map((order: Order) => {
                        const balanceDue = parseFloat(order.balance_due?.toString() || '0');
                        const isPending = (order.state === 'PENDING_PAYMENT' || order.state === 'DRAFT' || (balanceDue > 0 && order.state !== 'CANCELLED')) && order.state !== 'PAID';
                        const statusStyles = getStatusStyles(order.state);

                        return (
                            <div key={order.order_number} className="group bg-white border border-slate-100 rounded-2xl hover:border-slate-300 transition-all duration-500 overflow-hidden shadow-sm">
                                <div className="p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center gap-10">
                                    {/* Entry ID & Date Node */}
                                    <div className="flex lg:flex-col lg:items-start items-center justify-between lg:justify-center border-b lg:border-b-0 lg:border-r border-slate-100 pb-6 lg:pb-0 lg:pr-10 min-w-[140px]">
                                        <div className="space-y-1">
                                            <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Entry Identifier</p>
                                            <p className="text-sm font-black text-slate-900">#{order.order_number}</p>
                                        </div>
                                        <div className="space-y-1 lg:mt-6">
                                            <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Logged Date</p>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                                                {new Date(order.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Asset Summary Node */}
                                    <div className="flex-1 flex items-center gap-8 min-w-0">
                                        <div className="h-20 w-16 relative rounded border border-slate-100 overflow-hidden bg-slate-50 grayscale group-hover:grayscale-0 transition-all duration-700 flex-shrink-0">
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
                                        
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className={`h-2 w-2 rounded-full ${statusStyles.bg} shadow-sm border border-black/5`} />
                                                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-900">
                                                    {order.state_display}
                                                </span>
                                            </div>
                                            <h4 className="text-base font-black text-slate-900 truncate uppercase tracking-tight mb-2">
                                                {order.items?.[0]?.product.name || 'Shipment Cargo'}
                                            </h4>
                                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                                                Consolidated Logistics • {order.items?.length || 0} Assets Included
                                            </p>
                                        </div>
                                    </div>

                                    {/* Financial Valuation Node */}
                                    <div className="lg:w-48 border-y lg:border-y-0 lg:border-x border-slate-100 py-6 lg:py-0 lg:px-10 flex flex-col justify-center lg:items-end">
                                        <div className="flex items-baseline justify-between lg:justify-end gap-2 mb-2 w-full">
                                            <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Total Value</p>
                                            <p className="text-xl font-black text-slate-900 tabular-nums leading-none">
                                                ₵{parseFloat(order.total.toString()).toLocaleString()}
                                            </p>
                                        </div>
                                        {balanceDue > 0 && order.state !== 'CANCELLED' && order.state !== 'PAID' && (
                                            <div className="flex items-center justify-between lg:justify-end gap-2 w-full">
                                                <p className="text-[8px] font-black text-amber-300 uppercase tracking-widest">Liability</p>
                                                <p className="text-[10px] font-black text-amber-500 tabular-nums">
                                                    ₵{balanceDue.toLocaleString()}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Operational Bridge Node */}
                                    <div className="lg:w-52 flex flex-col gap-3">
                                        <Link
                                            href={`/track?order=${order.order_number}`}
                                            className="w-full py-4 border border-slate-900 bg-slate-900 text-white text-[9px] font-black uppercase tracking-[0.4em] text-center rounded-xl hover:bg-slate-800 transition-all shadow-lg"
                                        >
                                            Open Protocol
                                        </Link>
                                        {isPending && (
                                            <Link
                                                href={`/checkout?order=${order.order_number}`}
                                                className="w-full py-4 border border-brand-emerald bg-brand-emerald text-white text-[9px] font-black uppercase tracking-[0.4em] text-center rounded-xl hover:bg-brand-emerald/90 transition-all"
                                            >
                                                Settle Balance
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
