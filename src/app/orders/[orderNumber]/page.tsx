/**
 * London's Imports - Order Detail Page
 * Per website_specification.md: order dashboard, not just receipt
 */
'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import NextImage from 'next/image';
import toast from 'react-hot-toast';
import { ordersAPI } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { getImageUrl } from '@/lib/image';
import { Order, OrderItem } from '@/types';
import ShipmentTracker from '@/components/order/ShipmentTracker';
import { siteConfig } from '@/config/site';

export default function OrderDetailPage() {
    const params = useParams();
    const orderNumber = params.orderNumber as string;
    const { isAuthenticated } = useAuthStore();
    const queryClient = useQueryClient();
    const [isVerifying, setIsVerifying] = useState(false);

    const { data, isLoading, error } = useQuery({
        queryKey: ['order', orderNumber],
        queryFn: () => ordersAPI.detail(orderNumber),
        enabled: isAuthenticated && !!orderNumber,
    });

    const order: Order | undefined = data?.data;

    const handleVerifyPayment = async () => {
        if (!orderNumber) return;
        
        setIsVerifying(true);
        const loadingToast = toast.loading('Verifying your payment with Paystack...');
        
        try {
            const response = await ordersAPI.verifyPayment(orderNumber);
            toast.success(response.data.message || 'Payment verified successfully!', { id: loadingToast });
            // Invalidate query to refresh order details
            queryClient.invalidateQueries({ queryKey: ['order', orderNumber] });
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || 'Verification failed. Please try again later.';
            toast.error(errorMessage, { id: loadingToast });
        } finally {
            setIsVerifying(false);
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8 pt-24">
                <div className="h-8 skeleton rounded w-1/3 mb-8"></div>
                <div className="bg-white rounded-xl p-6 space-y-4">
                    <div className="h-6 skeleton rounded w-1/4"></div>
                    <div className="h-4 skeleton rounded w-2/3"></div>
                    <div className="h-32 skeleton rounded"></div>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-16 text-center pt-32">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
                <Link href="/orders" className="text-purple-600 hover:underline">Back to Orders</Link>
            </div>
        );
    }

    const balanceDue = parseFloat(order.balance_due?.toString() || '0');
    const isPendingPayment = order.state === 'PENDING_PAYMENT' || balanceDue > 0;

    return (
        <div className="min-h-screen bg-primary-surface pt-24 pb-20 font-sans transition-all duration-500">
            <div className="max-w-4xl mx-auto px-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-slate-50 dark:border-slate-900 pb-8 gap-6">
                    <div>
                        <Link href="/orders" className="text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4 inline-flex items-center gap-2 transition-colors group">
                            <svg className="w-3 h-3 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            Back to Sourcing Portfolio
                        </Link>
                        <h1 className="text-4xl md:text-6xl font-serif font-black nuclear-text tracking-tighter">Order #{order.order_number}</h1>
                        <p className="text-[10px] font-black nuclear-text opacity-40 uppercase tracking-[0.2em] mt-3">
                            Established on {new Date(order.created_at).toLocaleDateString(undefined, {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}
                        </p>
                    </div>
                    {order.delivery_window && (
                        <div className="text-right">
                            <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">Est. Delivery</p>
                            <p className="font-medium text-gray-900">{order.delivery_window}</p>
                        </div>
                    )}
                </div>

                {/* Status Alert */}
                {isPendingPayment && order.state !== 'CANCELLED' && (
                    <div className="bg-slate-900 dark:bg-white rounded-2xl p-8 mb-12 flex flex-col sm:flex-row items-center justify-between gap-8 shadow-diffusion-xl">
                        <div className="flex items-center gap-6">
                            <div className="p-4 bg-white/10 dark:bg-slate-950/5 rounded-full text-white dark:text-slate-900">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-sm font-black text-white dark:text-slate-900 uppercase tracking-widest mb-1">Payment Action Required</h2>
                                <p className="text-xs text-white/60 dark:text-slate-900/40 font-bold tracking-tight">
                                    {balanceDue > 0
                                        ? `A lingering balance of GHS ${balanceDue.toLocaleString()} remains.`
                                        : 'Finalize your transaction to secure this shipment.'}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <button
                                onClick={handleVerifyPayment}
                                disabled={isVerifying}
                                className="px-8 py-3 bg-white/10 dark:bg-slate-950/5 text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-white/20 transition-all disabled:opacity-50"
                            >
                                {isVerifying ? 'Verifying...' : 'Verify Transfer'}
                            </button>
                            <Link
                                href={`/checkout?order=${order.order_number}`}
                                className="px-10 py-3 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-emerald-600 transition-all shadow-diffusion"
                            >
                                {balanceDue > 0 ? 'Clear Balance' : 'Finalize Now'}
                            </Link>
                        </div>
                    </div>
                )}

                {/* High-Fidelity Logistics Tracker */}
                {!['CANCELLED', 'REFUNDED', 'PENDING_PAYMENT'].includes(order.state) && (
                    <div className="mb-8">
                        <ShipmentTracker 
                            currentState={order.state} 
                            timelineEvents={order.timeline_events}
                        />
                    </div>
                )}

                {/* Granular Timeline Events */}
                {order.timeline_events && order.timeline_events.length > 0 && (
                    <div className="bg-primary-surface/40 rounded-3xl p-8 mb-12 shadow-diffusion-lg border border-primary-surface backdrop-blur-xl">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] nuclear-text opacity-40 mb-8 border-b border-primary-surface/20 pb-4">Logistics Timeline</h2>
                        <div className="space-y-6">
                            {order.timeline_events?.map((event, index) => (
                                <div key={event.id} className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-3 h-3 rounded-full mt-1.5 ${index === 0 ? 'bg-pink-600 ring-4 ring-pink-50' : 'bg-gray-200'}`}></div>
                                        {index !== (order?.timeline_events?.length ?? 0) - 1 && <div className="w-px h-full bg-gray-100 my-1"></div>}
                                    </div>
                                    <div className="flex-1 pb-4">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className={`text-sm font-semibold ${index === 0 ? 'text-gray-900' : 'text-gray-600'}`}>{event.title}</h3>
                                            <span className="text-[10px] font-medium text-gray-400">
                                                {new Date(event.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
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

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Items */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="bg-primary-surface/40 rounded-3xl p-8 shadow-diffusion-lg border border-primary-surface backdrop-blur-xl">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] nuclear-text opacity-40 mb-8 border-b border-primary-surface/20 pb-4">Sourcing Manifest</h2>
                            <div className="divide-y divide-gray-100">
                                {order.items?.map((item: OrderItem) => (
                                    <div key={item.id} className="flex gap-4 py-6 first:pt-0 last:pb-0">
                                        <div className="relative w-24 h-32 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                                            {item.product?.image ? (
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
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="font-medium text-gray-900">{item.product_name}</h3>
                                                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                                                    <p className="text-xs text-gray-500 font-light">Qty: {item.quantity}</p>
                                                    {item.selected_size && <p className="text-xs text-gray-500 font-light">Size: {item.selected_size}</p>}
                                                    {item.selected_color && <p className="text-xs text-gray-500 font-light">Color: {item.selected_color}</p>}
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-end">
                                                <p className="text-xs text-gray-400 font-light">GHS {(item.unit_price || 0).toLocaleString()} / unit</p>
                                                <p className="text-base font-light text-gray-900">GHS {item.total_price.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Info Grids */}
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h3 className="text-xs uppercase tracking-wider text-gray-400 font-medium mb-4">Delivery Address</h3>
                                <div className="text-sm text-gray-600 font-light space-y-1">
                                    <p className="text-gray-900 font-normal">{order.delivery_address}</p>
                                    <p>{order.delivery_city}, {order.delivery_region}</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h3 className="text-xs uppercase tracking-wider text-gray-400 font-medium mb-4">Support</h3>
                                <p className="text-sm font-light text-gray-600 mb-4">Need help with this order? Contact our concierge team.</p>
                                <a 
                                    href={`https://wa.me/${siteConfig.concierge}?text=${encodeURIComponent(`Hi London's Imports! I need help with Order #${order.order_number} (Status: ${order.state}).`)}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="inline-flex items-center gap-2 text-pink-600 text-sm font-medium hover:text-pink-700 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.996-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.29-4.739c1.53.91 3.041 1.389 4.828 1.389 5.288 0 9.589-4.301 9.593-9.59 0-2.565-1.001-4.973-2.812-6.784s-4.219-2.812-6.783-2.812c-5.276 0-9.577 4.302-9.581 9.591-.001 1.905.508 3.454 1.47 4.904l-1.026 3.738 3.837-1.006z" /></svg>
                                    WhatsApp Concierge
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-4">
                        <div className="bg-primary-surface/40 rounded-3xl p-8 shadow-diffusion-xl border border-primary-surface backdrop-blur-3xl sticky top-28">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] nuclear-text opacity-40 mb-8 border-b border-primary-surface/20 pb-4">Financial Ledger</h2>

                            <div className="space-y-4 text-sm font-light">
                                <div className="flex justify-between text-gray-500">
                                    <span>Subtotal</span>
                                    <span>GHS {order.subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-500">
                                    <span>Delivery</span>
                                    <span>GHS {order.delivery_fee.toLocaleString()}</span>
                                </div>
                                <div className="pt-6 border-t border-primary-surface/20 flex justify-between items-end">
                                    <span className="text-[10px] font-black uppercase tracking-widest nuclear-text opacity-40">Order Total</span>
                                    <span className="text-2xl font-serif font-black nuclear-text tracking-tighter leading-none tabular-nums">GHS {order.total.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 font-bold">
                                    <span className="text-[10px] uppercase tracking-widest opacity-40">Settled Amount</span>
                                    <span className="text-lg tabular-nums">GHS {(order.amount_paid || 0).toLocaleString()}</span>
                                </div>
                                {balanceDue > 0 && (
                                    <div className="flex justify-between items-center text-amber-600 font-bold pt-2">
                                        <span className="text-[10px] uppercase tracking-widest opacity-40">Outstanding</span>
                                        <span className="text-lg tabular-nums">GHS {balanceDue.toLocaleString()}</span>
                                    </div>
                                )}
                            </div>

                            {isPendingPayment && order.state !== 'CANCELLED' && (
                                <Link
                                    href={`/checkout?order=${order.order_number}`}
                                    className="w-full mt-8 py-4 bg-gray-900 text-white rounded-full font-medium hover:bg-pink-600 transition-colors shadow-sm block text-center"
                                >
                                    Proceed to Payment
                                </Link>
                            )}

                            {(order.state === 'PAID' || order.state === 'OPEN_FOR_BATCH') && (
                                <button
                                    onClick={() => {/* Cancel modal */ }}
                                    className="w-full mt-4 text-xs text-gray-400 hover:text-red-500 transition-colors py-2"
                                >
                                    Request Cancellation
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
