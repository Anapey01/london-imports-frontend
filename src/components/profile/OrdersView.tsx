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
                return { text: 'text-green-600 dark:text-green-400', bg: 'bg-green-500', lightBg: 'bg-green-50 dark:bg-green-900/20' };
            case 'PENDING_PAYMENT':
            case 'DRAFT':
            case 'OPEN_FOR_BATCH':
                return { text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500', lightBg: 'bg-amber-50 dark:bg-amber-900/20' };
            case 'CANCELLED':
            case 'FAILED':
                return { text: 'text-red-600 dark:text-red-400', bg: 'bg-red-500', lightBg: 'bg-red-50 dark:bg-red-900/20' };
            case 'SHIPPED':
            case 'ARRIVED_IN_GHANA':
                return { text: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500', lightBg: 'bg-blue-50 dark:bg-blue-900/20' };
            default:
                return { text: 'text-gray-500', bg: 'bg-gray-400', lightBg: 'bg-gray-50 dark:bg-gray-900/20' };
        }
    };

    return (
        <div className="space-y-10 pb-20">
            <div className={`border-b pb-4 ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <h2 className={`text-2xl font-light tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        My Orders
                    </h2>
                    <div className="flex items-center gap-4">
                        {['ALL', 'PENDING', 'COMPLETED'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`text-xs uppercase tracking-wide transition-colors ${filter === status
                                    ? `${isDark ? 'text-white' : 'text-gray-900'} font-medium`
                                    : `${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-gray-400 hover:text-gray-600'} font-light`
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
                            <div key={order.order_number} className={`group p-6 rounded-3xl border transition-all duration-300 hover:shadow-xl ${isDark ? 'bg-slate-900/40 border-slate-800 hover:border-slate-700' : 'bg-white border-gray-100 hover:border-gray-200'}`}>
                                <div className="flex flex-col md:flex-row justify-between gap-6">
                                    <div className="flex flex-col sm:flex-row gap-6">
                                        {/* Images Stack */}
                                        <div className="flex -space-x-10 flex-shrink-0">
                                            {order.items?.slice(0, 3).map((item, idx) => (
                                                <div key={item.id} className={`relative w-24 h-32 rounded-2xl overflow-hidden border-4 ${isDark ? 'border-slate-900' : 'border-white'} shadow-lg bg-gray-100 z-[${30 - idx}] transform transition-transform group-hover:translate-x-${idx * 2}`}>
                                                    {item.product.image ? (
                                                        <NextImage
                                                            src={getImageUrl(item.product.image)}
                                                            alt={item.product_name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" strokeWidth={1.5} /></svg>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                            {order.items && order.items.length > 3 && (
                                                <div className={`relative w-24 h-32 rounded-2xl flex items-center justify-center border-4 ${isDark ? 'border-slate-900' : 'border-white'} shadow-lg ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-gray-100 text-gray-500'} text-sm font-bold z-10`}>
                                                    +{order.items.length - 3}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col justify-between py-1">
                                            <div>
                                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                                    <p className={`text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                        Order #{order.order_number}
                                                    </p>
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusStyles.lightBg} ${statusStyles.text}`}>
                                                        {order.state_display}
                                                    </span>
                                                </div>
                                                <p className={`text-sm font-medium ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                                                    Placed on {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(order.created_at))}
                                                </p>
                                            </div>

                                            <div className="mt-4 flex items-center gap-6">
                                                <div>
                                                    <p className={`text-[10px] uppercase tracking-widest font-bold mb-1 ${isDark ? 'text-slate-600' : 'text-gray-400'}`}>Total Amount</p>
                                                    <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                        GHS {parseFloat(order.total.toString()).toLocaleString()}
                                                    </p>
                                                </div>
                                                {balanceDue > 0 && order.state !== 'CANCELLED' && (
                                                    <div>
                                                        <p className="text-[10px] uppercase tracking-widest font-bold mb-1 text-red-400">Balance Due</p>
                                                        <p className="text-xl font-bold text-red-500">
                                                            GHS {balanceDue.toLocaleString()}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col justify-center gap-3 min-w-[140px]">
                                        <Link
                                            href={`/track?order=${order.order_number}`}
                                            className={`w-full py-3 rounded-xl text-xs font-bold text-center transition-all ${isDark ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'} active:scale-95`}
                                        >
                                            Track Shipment
                                        </Link>
                                        
                                        {isPending && (
                                            <Link
                                                href={`/checkout?order=${order.order_number}`}
                                                className="w-full py-3 rounded-xl text-xs font-bold text-center bg-black text-white hover:bg-gray-800 transition-all shadow-lg active:scale-95"
                                            >
                                                {balanceDue > 0 ? 'Pay Balance' : 'Complete Payment'}
                                            </Link>
                                        )}

                                        {canCancel && (
                                            <button
                                                onClick={() => setCancellingOrder(order.order_number)}
                                                className={`w-full py-3 rounded-xl text-xs font-bold text-center transition-all border ${isDark ? 'border-red-900/30 text-red-400 hover:bg-red-950/20' : 'border-red-100 text-red-500 hover:bg-red-50'} active:scale-95`}
                                            >
                                                Cancel Order
                                            </button>
                                        )}

                                        <Link
                                            href={`/orders/${order.order_number}`}
                                            className={`w-full py-2 text-xs font-bold text-center transition-colors ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-gray-400 hover:text-gray-600'}`}
                                        >
                                            View Invoice
                                        </Link>
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
