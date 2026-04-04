/**
 * London's Imports - Order Detail Page (The Sourcing Manifest)
 * Refined Editorial Redesign: Minimalist layout with focus on authority and clarity.
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
import { ArrowLeft, CreditCard, HelpCircle, Package, Receipt, Truck } from 'lucide-react';

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
            queryClient.invalidateQueries({ queryKey: ['order', orderNumber] });
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || 'Verification failed. Please try again.';
            toast.error(errorMessage, { id: loadingToast });
        } finally {
            setIsVerifying(false);
        }
    };

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
                <h1 className="text-3xl font-serif font-black text-slate-900 mb-6 tracking-tighter">Manifest Lost.</h1>
                <p className="text-slate-500 mb-8 max-w-xs">We couldn't locate this specific logistics record in our hub.</p>
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
                    Back to Logistics Index
                </Link>

                {/* MANIFEST HEADER: Editorial Asymmetrical Split */}
                <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="h-px w-8 bg-emerald-600/30" />
                            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-emerald-800 dark:text-emerald-400">
                                Sourcing Manifest #{order.order_number.slice(-4)}
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-8xl font-serif font-black text-slate-900 dark:text-white tracking-tighter leading-[0.9] mb-8">
                            Order <br />
                            <span className="italic font-light text-slate-300 dark:text-slate-700">#{order.order_number}</span>
                        </h1>
                        <div className="flex gap-8 items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <span className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Est. {new Date(order.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                            {order.delivery_window && (
                                <span className="flex items-center gap-2">
                                    <Truck className="w-3.5 h-3.5" />
                                    Delivery window: {order.delivery_window}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* STATUS ACTION (Floating Card) */}
                    {isPendingPayment && order.state !== 'CANCELLED' && (
                        <div className="bg-slate-900 dark:bg-white p-8 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row items-center gap-8 border border-white/5 dark:border-slate-100">
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-400 dark:text-emerald-600 mb-1">Status: Arrears Pending</h4>
                                <p className="text-white dark:text-slate-900 text-sm font-medium tracking-tight">GHS {balanceDue.toLocaleString()} remains outstanding.</p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleVerifyPayment}
                                    disabled={isVerifying}
                                    className="h-12 px-6 bg-white/10 dark:bg-slate-100 text-[10px] font-black uppercase tracking-widest text-white dark:text-slate-900 rounded-xl hover:bg-white/20 transition-all border border-white/10"
                                >
                                    {isVerifying ? 'Wait...' : 'Verify Transfer'}
                                </button>
                                <Link 
                                    href={`/checkout?order=${order.order_number}`}
                                    className="h-12 px-8 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-600 transition-all shadow-lg"
                                >
                                    Clear Balance
                                </Link>
                            </div>
                        </div>
                    )}
                </header>

                <div className="grid lg:grid-cols-12 gap-12 items-start">
                    
                    {/* LEFT COLUMN: The Physical Manifest (8 Cols) */}
                    <div className="lg:col-span-8 space-y-20">
                        
                        {/* LOGISTICS TRACKER (The Journey) */}
                        {!['CANCELLED', 'REFUNDED', 'PENDING_PAYMENT'].includes(order.state) && (
                            <section>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 dark:text-slate-700 mb-10 pb-4 border-b border-slate-50 dark:border-slate-800 flex items-center gap-3">
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
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 dark:text-slate-700 mb-10 pb-4 border-b border-slate-50 dark:border-slate-800 flex items-center gap-3">
                                <Package className="w-3.5 h-3.5" />
                                Product Manifest
                            </h3>
                            <div className="divide-y divide-slate-50 dark:divide-slate-900">
                                {order.items?.map((item: OrderItem) => (
                                    <div key={item.id} className="grid grid-cols-[100px_1fr] gap-8 py-10 first:pt-0 last:pb-0">
                                        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                            {item.product?.image ? (
                                                <NextImage
                                                    src={getImageUrl(item.product.image)}
                                                    alt={item.product_name}
                                                    fill
                                                    className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
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
                                                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{item.product_name}</h3>
                                                <div className="flex flex-wrap gap-6">
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">Qty</span>
                                                        <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{item.quantity}</span>
                                                    </div>
                                                    {item.selected_size && (
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">Size</span>
                                                            <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{item.selected_size}</span>
                                                        </div>
                                                    )}
                                                    {item.selected_color && (
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">Color</span>
                                                            <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{item.selected_color}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-baseline pt-8">
                                                <span className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">Unit Price: GHS {item.unit_price.toLocaleString()}</span>
                                                <span className="text-xl font-serif font-black text-slate-900 dark:text-white tracking-tighter">GHS {item.total_price.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* SUPPORT & ADDRESS */}
                        <div className="grid md:grid-cols-2 gap-12 pt-12 border-t border-slate-50 dark:border-slate-800">
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 dark:text-slate-700 mb-6">Delivery Target</h4>
                                <div className="space-y-4">
                                    <p className="text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
                                        {order.delivery_address}
                                    </p>
                                    <p className="text-sm text-slate-500 font-medium">
                                        {order.delivery_city}, {order.delivery_region}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 dark:text-slate-700 mb-6">Concierge Gateway</h4>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">
                                    Direct access to our logistics floor in Guangzhou. Real-time sourcing queries handled via WhatsApp.
                                </p>
                                <a 
                                    href={`https://wa.me/${siteConfig.concierge}?text=${encodeURIComponent(`Hi London's Imports! Manifest Inquiry: Order #${order.order_number}`)}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="inline-flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400 group"
                                >
                                    WhatsApp Support <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-2 transition-transform" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Financial Ledger (4 Cols) */}
                    <aside className="lg:col-span-4 lg:sticky lg:top-32">
                        <section className="bg-slate-50 dark:bg-slate-900/50 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-900">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 dark:text-slate-700 mb-10 flex items-center gap-3">
                                <Receipt className="w-3.5 h-3.5" />
                                Financial Ledger
                            </h3>

                            <div className="space-y-6">
                                <div className="flex justify-between items-baseline">
                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Subtotal</span>
                                    <span className="text-lg font-bold text-slate-900 dark:text-white">GHS {order.subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-baseline">
                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Global Logistics</span>
                                    <span className="text-lg font-bold text-slate-900 dark:text-white">GHS {order.delivery_fee.toLocaleString()}</span>
                                </div>
                                
                                <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
                                    <div className="flex justify-between items-end mb-8">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Liability Total</span>
                                            <span className="text-xs font-medium text-slate-300 lowercase">All fees inclusive</span>
                                        </div>
                                        <span className="text-4xl font-serif font-black text-slate-900 dark:text-white tracking-tighter">GHS {order.total.toLocaleString()}</span>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center px-6 py-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/50">
                                            <span className="text-[9px] font-black uppercase text-emerald-800 dark:text-emerald-400 tracking-widest">Settled</span>
                                            <span className="text-base font-black text-emerald-900 dark:text-emerald-100">GHS {order.amount_paid.toLocaleString()}</span>
                                        </div>

                                        {balanceDue > 0 && (
                                            <div className="flex justify-between items-center px-6 py-4 bg-slate-900 dark:bg-white rounded-2xl">
                                                <span className="text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest">Arrears</span>
                                                <span className="text-base font-black text-white dark:text-slate-900">GHS {balanceDue.toLocaleString()}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {isPendingPayment && order.state !== 'CANCELLED' && (
                                    <Link
                                        href={`/checkout?order=${order.order_number}`}
                                        className="block w-full h-16 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-slate-900/20 dark:shadow-none hover:scale-[1.02] active:scale-95 transition-all text-center leading-[64px] mt-12"
                                    >
                                        Finalize Payment
                                    </Link>
                                )}
                            </div>
                        </section>

                        <div className="mt-12 px-6">
                            <div className="flex items-center gap-3 mb-4 opacity-30">
                                <span className="h-px w-6 bg-slate-300 dark:bg-slate-700" />
                                <span className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-400">Institutional Protocol</span>
                            </div>
                            <p className="text-[9px] text-slate-400 dark:text-slate-600 leading-relaxed uppercase tracking-tighter grayscale italic">
                                This sourcing manifest counts as a primary logistics record. Hard copies available at our Accra Hub upon request. GH-LI-LOG-2026.
                            </p>
                        </div>
                    </aside>

                </div>
            </div>
        </div>
    );
}
