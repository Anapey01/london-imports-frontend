/**
 * London's Imports - Order Detail Page (The Sourcing Manifest)
 * Refined 'Lux Sans' Redesign: Minimalist layout with wide-tracked sans-serif authority.
 */
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import NextImage from 'next/image';
import { useToast } from '@/components/Toast';
import { ordersAPI } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { getImageUrl } from '@/lib/image';
import { Order, OrderItem } from '@/types';
import ShipmentTracker from '@/components/order/ShipmentTracker';
import { siteConfig } from '@/config/site';
import { ArrowLeft, Package, Receipt, Truck, ShieldCheck } from 'lucide-react';

export default function OrderDetailPage() {
    const { showToast } = useToast();
    const params = useParams();
    const orderNumber = params.orderNumber as string;
    const { isAuthenticated } = useAuthStore();
    const queryClient = useQueryClient();
    const [isVerifying, setIsVerifying] = useState(false);
    const [hasCheckedAuto, setHasCheckedAuto] = useState(false);

    const { data, isLoading, error } = useQuery({
        queryKey: ['order', orderNumber],
        queryFn: () => ordersAPI.detail(orderNumber),
        enabled: isAuthenticated && !!orderNumber,
    });

    const order: Order | undefined = data?.data;

    const handleVerifyPayment = async () => {
        if (!orderNumber) return;
        
        setIsVerifying(true);
        showToast('Verifying with Paystack...', 'processing');
        
        try {
            const response = await ordersAPI.verifyPayment(orderNumber);
            showToast(response.data.message || 'Payment verified!', 'success');
            queryClient.invalidateQueries({ queryKey: ['order', orderNumber] });
        } catch (err: unknown) {
            const errorMessage = (err as any).response?.data?.error || 'Verification failed. Please try again.';
            showToast(errorMessage, 'error');
        } finally {
            setIsVerifying(false);
        }
    };

    // Institutional Robustness: Auto-Verification on Load
    useEffect(() => {
        if (order && order.state === 'PENDING_PAYMENT' && !hasCheckedAuto && !isVerifying) {
            setHasCheckedAuto(true);
            ordersAPI.verifyPayment(orderNumber)
                .then(() => {
                    queryClient.invalidateQueries({ queryKey: ['order', orderNumber] });
                })
                .catch(() => {
                    // Fail silently for background checks
                });
        }
    }, [order, orderNumber, hasCheckedAuto, isVerifying, queryClient]);

    if (isLoading) {
        return (
            <div className="max-w-5xl mx-auto px-6 py-32 animate-pulse">
                <div className="h-4 bg-slate-100 rounded w-24 mb-8"></div>
                <div className="h-12 bg-slate-100 rounded w-1/2 mb-12"></div>
                <div className="grid lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8 space-y-8">
                        <div className="h-64 bg-slate-50 rounded-3xl"></div>
                        <div className="h-96 bg-slate-50 rounded-3xl"></div>
                    </div>
                    <div className="lg:col-span-4 h-96 bg-slate-50 rounded-3xl"></div>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-3xl font-black text-slate-900 mb-6 tracking-tighter uppercase">Manifest Lost.</h1>
                <p className="text-slate-500 mb-8 max-w-xs uppercase text-[10px] tracking-widest font-bold">We couldn't locate this specific logistics record.</p>
                <Link href="/orders" className="text-[11px] font-black uppercase tracking-widest text-emerald-700 border-b border-emerald-700 pb-1">Return to Portfolio</Link>
            </div>
        );
    }

    const balanceDue = parseFloat(order.balance_due?.toString() || '0');
    const isPendingPayment = order.state === 'PENDING_PAYMENT' || balanceDue > 0;
    const statusStyles = { bg: 'bg-emerald-50', text: 'text-emerald-700' };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20 pb-32">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
                
                {/* Back Link - Minimal */}
                <Link 
                    href="/orders" 
                    className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-8"
                >
                    <ArrowLeft size={12} />
                    Back to Orders
                </Link>

                {/* Compact Header */}
                <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
                                Order Details
                            </h1>
                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-[0.1em] ${statusStyles.bg} ${statusStyles.text} shadow-sm`}>
                                {order.state}
                            </span>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest opacity-60">
                            Reference: <span className="text-slate-900 dark:text-white">#{order.order_number}</span> • Placed {new Date(order.created_at).toLocaleDateString()}
                        </p>
                    </div>
                    
                    <div className="flex gap-3">
                        <Link 
                            href={`/track?order=${order.order_number}`}
                            className="px-6 py-2.5 rounded-lg bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-sm flex items-center gap-2"
                        >
                            <Truck size={14} />
                            Track
                        </Link>
                    </div>
                </header>

                <div className="grid lg:grid-cols-12 gap-8 items-start">
                    
                    {/* LEFT COLUMN: Products & Tracking */}
                    <div className="lg:col-span-8 space-y-8">
                        
                        {/* Compact Tracker */}
                        {!['CANCELLED', 'REFUNDED', 'PENDING_PAYMENT'].includes(order.state) && (
                            <section className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white mb-8 flex items-center gap-2">
                                    <Truck size={14} className="text-emerald-600" />
                                    Shipment Journey
                                </h3>
                                <ShipmentTracker 
                                    currentState={order.state} 
                                    timelineEvents={order.timeline_events}
                                />
                            </section>
                        )}

                        {/* Compact Product Rows */}
                        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                            <div className="px-6 sm:p-8 py-6 border-b border-slate-100 dark:border-slate-800">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
                                    <Package size={14} className="text-emerald-600" />
                                    Items In Shipment
                                </h3>
                            </div>
                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {order.items?.map((item: OrderItem) => (
                                    <div key={item.id} className="p-6 sm:p-8 flex items-center gap-6 group">
                                        <div className="w-16 h-20 sm:w-20 sm:h-24 relative rounded-lg border border-slate-100 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-950 flex-shrink-0">
                                            {item.product?.image ? (
                                                <NextImage
                                                    src={getImageUrl(item.product.image)}
                                                    alt={item.product_name}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                    unoptimized
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                    <Package size={24} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white uppercase tracking-tight line-clamp-1 mb-1">
                                                {item.product_name}
                                            </h4>
                                            <div className="flex flex-wrap items-center gap-4 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                                                <span>Qty: <span className="text-slate-900 dark:text-white">{item.quantity}</span></span>
                                                {item.selected_size && (
                                                    <>
                                                        <span className="w-1 h-1 rounded-full bg-slate-200" />
                                                        <span>Size: <span className="text-slate-900 dark:text-white">{item.selected_size}</span></span>
                                                    </>
                                                )}
                                                <span className="w-1 h-1 rounded-full bg-slate-200" />
                                                <span>Rate: GHS {Number(item.unit_price).toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="text-sm sm:text-lg font-black text-slate-900 dark:text-white tabular-nums">
                                                GHS {Number(item.total_price).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                        
                        {/* Compact Delivery & Support */}
                        <div className="grid md:grid-cols-2 gap-8 py-8 px-6 sm:px-8 border-t border-border-standard">
                            <div>
                                <h4 className="text-[9px] font-black uppercase tracking-widest text-content-secondary opacity-50 mb-4">Delivery Destination</h4>
                                <div className="space-y-1">
                                    <p className="text-sm font-black text-content-primary uppercase leading-tight">
                                        {order.delivery_address}
                                    </p>
                                    <p className="text-[10px] text-content-secondary font-bold uppercase tracking-widest">
                                        {order.delivery_city}, {order.delivery_region}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-[9px] font-black uppercase tracking-widest text-content-secondary opacity-50 mb-4">Logistics Support</h4>
                                <p className="text-[10px] text-content-secondary font-medium leading-relaxed mb-4">
                                    Need assistance? Contact our dispatch hub directly for real-time shipment updates.
                                </p>
                                <a 
                                    href={`https://wa.me/${siteConfig.concierge}?text=${encodeURIComponent(`Hi London's Imports! Order Help: #${order.order_number}`)}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-emerald group"
                                >
                                    Message Support <ArrowLeft size={12} className="rotate-180 group-hover:translate-x-1 transition-transform" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Financial Summary (4 Cols) */}
                    <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
                        <section className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-border-standard shadow-sm">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-content-primary mb-8 flex items-center gap-2">
                                <Receipt size={14} className="text-brand-emerald" />
                                Financial Summary
                            </h3>

                            <div className="space-y-4">
                                <div className="flex justify-between items-baseline">
                                    <span className="text-[9px] font-black uppercase text-content-secondary opacity-50 tracking-widest">Subtotal</span>
                                    <span className="text-sm font-bold text-content-primary tabular-nums">GHS {Number(order.subtotal).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-baseline">
                                    <span className="text-[9px] font-black uppercase text-content-secondary opacity-50 tracking-widest">Shipping</span>
                                    <span className="text-sm font-bold text-content-primary tabular-nums">GHS {Number(order.delivery_fee).toLocaleString()}</span>
                                </div>
                                
                                <div className="pt-6 border-t border-border-standard">
                                    <div className="flex justify-between items-end mb-6">
                                        <span className="text-[9px] font-black uppercase text-content-secondary tracking-widest">Total Liability</span>
                                        <span className="text-2xl font-black text-content-primary tracking-tight tabular-nums leading-none">
                                            GHS {Number(order.total).toLocaleString()}
                                        </span>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center px-4 py-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-100 dark:border-emerald-900/50">
                                            <span className="text-[8px] font-black uppercase text-emerald-700 dark:text-emerald-400 tracking-widest">Settled</span>
                                            <span className="text-sm font-black text-emerald-800 dark:text-emerald-100 uppercase">GHS {Number(order.amount_paid).toLocaleString()}</span>
                                        </div>

                                        {balanceDue > 0 && (
                                            <div className="flex justify-between items-center px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-border-standard">
                                                <span className="text-[8px] font-black uppercase text-amber-600 tracking-widest">Balance Due</span>
                                                <span className="text-sm font-black text-amber-700 uppercase">GHS {Number(balanceDue).toLocaleString()}</span>
                                            </div>
                                        )}
                                    </div>

                                    {isPendingPayment && order.state !== 'CANCELLED' && (
                                        <div className="mt-6 space-y-3">
                                            <Link
                                                href={`/checkout?order=${order.order_number}`}
                                                className="block w-full py-4 bg-slate-950 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all text-center shadow-lg"
                                            >
                                                Pay Balance
                                            </Link>
                                            <button
                                                onClick={handleVerifyPayment}
                                                disabled={isVerifying}
                                                className="w-full text-[8px] font-black uppercase tracking-widest text-content-secondary hover:text-brand-emerald transition-colors py-2 flex items-center justify-center gap-2 opacity-60"
                                            >
                                                <ShieldCheck size={12} />
                                                {isVerifying ? 'Verifying...' : 'Re-verify Payment'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>

                        <p className="text-[8px] text-content-secondary leading-relaxed uppercase tracking-[0.2em] opacity-40 px-2">
                            Institutional record. London's Imports Logistics 2026. SSL Encrypted Data.
                        </p>
                    </aside>
                </div>
            </div>
        </div>
    );
}
