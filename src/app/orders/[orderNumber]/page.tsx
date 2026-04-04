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
import toast from 'react-hot-toast';
import { ordersAPI } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { getImageUrl } from '@/lib/image';
import { Order, OrderItem } from '@/types';
import ShipmentTracker from '@/components/order/ShipmentTracker';
import { siteConfig } from '@/config/site';
import { ArrowLeft, Package, Receipt, Truck, ShieldCheck } from 'lucide-react';

export default function OrderDetailPage() {
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
        const loadingToast = toast.loading('Verifying with Paystack...');
        
        try {
            const response = await ordersAPI.verifyPayment(orderNumber);
            toast.success(response.data.message || 'Payment verified!', { id: loadingToast });
            queryClient.invalidateQueries({ queryKey: ['order', orderNumber] });
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || 'Verification failed. Please try again.';
            toast.error(errorMessage, { id: loadingToast });
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

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 pt-24 pb-32 selection:bg-emerald-100">
            {/* Subtle Texture Overlay */}
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('/noise.svg')] z-0" />

            <div className="max-w-6xl mx-auto px-6 relative z-10">
                
                {/* BACK NAVIGATION */}
                <Link 
                    href="/orders" 
                    className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-12 group"
                >
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                    Logistics Index
                </Link>

                {/* ASYMMETRICAL HEADER - LUX SANS */}
                <header className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="h-px w-8 bg-emerald-600/30" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-800 dark:text-emerald-400">
                                Sourcing Manifest
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-[0.05em] uppercase text-slate-900 dark:text-white leading-none">
                            Institutional <span className="text-slate-300 dark:text-slate-700 font-light italic text-serif">Report</span>
                        </h1>
                    </div>
                    <div className="text-right border-l md:border-l-0 md:border-r border-slate-100 dark:border-slate-800 pl-6 md:pl-0 md:pr-6 py-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 block mb-1">Record ID</span>
                        <span className="text-2xl font-black text-slate-900 dark:text-white tracking-widest uppercase italic">#{order.order_number}</span>
                    </div>
                </header>

                <div className="grid lg:grid-cols-12 gap-16 items-start">
                    
                    {/* LEFT COLUMN: The Physical Manifest (8 Cols) */}
                    <div className="lg:col-span-8 space-y-20">
                        
                        {/* LOGISTICS TRACKER (The Journey) */}
                        {!['CANCELLED', 'REFUNDED', 'PENDING_PAYMENT'].includes(order.state) && (
                            <section>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 dark:text-slate-700 mb-10 pb-4 border-b border-slate-200/50 dark:border-slate-800 flex items-center gap-3">
                                    <Truck className="w-3.5 h-3.5" />
                                    Transit Intelligence
                                </h3>
                                <ShipmentTracker 
                                    currentState={order.state} 
                                    timelineEvents={order.timeline_events}
                                />
                            </section>
                        )}

                        {/* SOURCING DETAILS (The Ledger) */}
                        <section>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 dark:text-slate-700 mb-10 pb-4 border-b border-slate-200/50 dark:border-slate-800 flex items-center gap-3">
                                <Package className="w-3.5 h-3.5" />
                                Product Inventory
                            </h3>
                            <div className="divide-y divide-slate-50 dark:divide-slate-900">
                                {order.items?.map((item: OrderItem) => (
                                    <div key={item.id} className="grid grid-cols-[100px_1fr] gap-8 py-10 first:pt-0 last:pb-0 group">
                                        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                            {item.product?.image ? (
                                                <NextImage
                                                    src={getImageUrl(item.product.image)}
                                                    alt={item.product_name}
                                                    fill
                                                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                                    unoptimized
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-200">
                                                    <Package className="w-8 h-8" strokeWidth={1} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col justify-between py-1">
                                            <div className="space-y-4">
                                                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight uppercase leading-tight line-clamp-1">{item.product_name}</h3>
                                                <div className="flex flex-wrap gap-8">
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">Quantity</span>
                                                        <span className="text-sm font-bold text-slate-500 dark:text-slate-400">{item.quantity} units</span>
                                                    </div>
                                                    {item.selected_size && (
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">Spec</span>
                                                            <span className="text-sm font-bold text-slate-500 dark:text-slate-400">{item.selected_size}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-baseline pt-8">
                                                <span className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">Rate: GHS {Number(item.unit_price).toLocaleString()}</span>
                                                <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums leading-none">
                                                    GHS {Number(item.total_price).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* ADDRESSING */}
                        <div className="grid md:grid-cols-2 gap-12 pt-12 border-t border-slate-50 dark:border-slate-800">
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 dark:text-slate-700 mb-6 font-sans">Final Destination</h4>
                                <div className="space-y-4">
                                    <p className="text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
                                        {order.delivery_address}
                                    </p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                        {order.delivery_city}, {order.delivery_region}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 dark:text-slate-700 mb-6 font-sans">Concierge Reach</h4>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">
                                    Direct access to our logistics floor. Secure sourcing queries handled via the encrypted gateway.
                                </p>
                                <a 
                                    href={`https://wa.me/${siteConfig.concierge}?text=${encodeURIComponent(`Hi London's Imports! Manifest Inquiry: Order #${order.order_number}`)}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="inline-flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400 group"
                                >
                                    Sourcing Gateway <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-2 transition-transform" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Financial Ledger (4 Cols) */}
                    <aside className="lg:col-span-4 lg:sticky lg:top-32">
                        <section className="bg-slate-50 dark:bg-slate-900/50 p-10 rounded-[3.5rem] border border-slate-100 dark:border-slate-800">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 dark:text-slate-700 mb-10 flex items-center gap-3">
                                <Receipt className="w-3.5 h-3.5" />
                                Financial Summary
                            </h3>

                            <div className="space-y-6">
                                <div className="flex justify-between items-baseline">
                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Subtotal</span>
                                    <span className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">GHS {Number(order.subtotal).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-baseline">
                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Logistics Hub</span>
                                    <span className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">GHS {Number(order.delivery_fee).toLocaleString()}</span>
                                </div>
                                
                                <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
                                    <div className="flex justify-between items-end mb-8">
                                        <div>
                                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-1">Total Liability</span>
                                            <span className="text-[9px] font-medium text-slate-300 uppercase tracking-tighter">All inclusive</span>
                                        </div>
                                        <span className="text-4xl font-black text-slate-900 dark:text-white tracking-widest tabular-nums leading-none">
                                            GHS {Number(order.total).toLocaleString()}
                                        </span>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center px-6 py-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/50">
                                            <span className="text-[9px] font-black uppercase text-emerald-800 dark:text-emerald-400 tracking-widest">Settled</span>
                                            <span className="text-base font-black text-emerald-900 dark:text-emerald-100">GHS {Number(order.amount_paid).toLocaleString()}</span>
                                        </div>

                                        {balanceDue > 0 && (
                                            <div className="flex justify-between items-center px-6 py-4 bg-slate-900 dark:bg-white rounded-2xl">
                                                <span className="text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest">Arrears</span>
                                                <span className="text-base font-black text-white dark:text-slate-900">GHS {Number(balanceDue).toLocaleString()}</span>
                                            </div>
                                        )}
                                    </div>

                                    {isPendingPayment && order.state !== 'CANCELLED' && (
                                        <div className="mt-8 space-y-3">
                                            <Link
                                                href={`/checkout?order=${order.order_number}`}
                                                className="block w-full h-16 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-slate-950/20 dark:shadow-none hover:scale-[1.02] active:scale-95 transition-all text-center leading-[64px]"
                                            >
                                                Process Balance
                                            </Link>
                                            <button
                                                onClick={handleVerifyPayment}
                                                disabled={isVerifying}
                                                className="w-full text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-emerald-600 transition-colors py-2 flex items-center justify-center gap-2"
                                            >
                                                <ShieldCheck className="w-3.5 h-3.5" />
                                                {isVerifying ? 'Verifying...' : 'Re-verify Payment'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>

                        <div className="mt-12 px-8 opacity-40">
                            <p className="text-[9px] text-slate-400 leading-relaxed uppercase tracking-widest italic grayscale">
                                Institutional Procurement record. London's Imports Global Hub 2026. Data encrypted via SSL.
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
