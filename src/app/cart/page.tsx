/**
 * London's Imports - Cart Page
 * Redesigned to match the premium, editorial aesthetic of London's Imports.
 * Utilizing Source Serif 4 and Slate-500 for high-end consistency.
 */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { getImageUrl } from '@/lib/image';
import { siteConfig } from '@/config/site';
import { ShoppingBag, Minus, Plus, ArrowLeft, ShieldCheck, Phone, Trash2 } from 'lucide-react';

export default function CartPage() {
    const router = useRouter();
    const { 
        cart, 
        guestItems, 
        isLoading, 
        fetchCart, 
        removeFromCart, 
        updateQuantity,
        clearCart
    } = useCartStore();
    const { isAuthenticated } = useAuthStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        fetchCart();
        const timer = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(timer);
    }, [fetchCart]);

    const items = isAuthenticated ? (cart?.items || []) : guestItems;

    // Derived totals
    const subtotal = items.reduce((sum, i) => sum + Number(i.unit_price || 0) * i.quantity, 0);

    if (!mounted) {
        return (
            <div className="min-h-screen bg-white pt-32 pb-20 flex justify-center selection:bg-emerald-100">
                <div className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const handleCheckout = () => {
        if (!isAuthenticated) {
            router.push('/login?redirect=/checkout');
        } else {
            router.push('/checkout');
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 pb-32 transition-all duration-500 selection:bg-emerald-100">
            {/* Subtle Texture Overlay */}
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('/noise.svg')] z-0" />

            {/* EDITORIAL HEADER */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-900 px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link
                        href="/"
                        className="p-2 -ml-2 rounded-full hover:bg-slate-50 transition-colors group"
                        aria-label="Go to homepage"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-900 dark:text-white group-hover:-translate-x-1 transition-transform" />
                    </Link>
                    <h1 className="text-2xl font-serif font-black tracking-tighter text-slate-900 dark:text-white leading-none">
                        Procurement <span className="italic font-light text-slate-300 dark:text-slate-700">Intake</span>
                    </h1>
                </div>
                {items.length > 0 && (
                    <button
                        onClick={() => clearCart()}
                        className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-red-600 transition-colors flex items-center gap-2"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        Clear Manifest
                    </button>
                )}
            </header>

            <div className="max-w-6xl mx-auto px-6 pt-12 relative z-10">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <div className="w-24 h-24 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-8">
                            <ShoppingBag className="w-10 h-10 text-slate-200" strokeWidth={1} />
                        </div>
                        <h2 className="text-3xl font-serif font-black mb-4 tracking-tighter text-slate-900 dark:text-white">Empty Manifest.</h2>
                        <p className="text-slate-500 mb-12 max-w-xs font-medium">Your sourcing list is currently blank. Start your procurement journey today.</p>
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-4 bg-slate-900 text-white px-10 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/20 hover:bg-emerald-600 transition-all hover:scale-[1.02]"
                        >
                            Explore Portfolio <ArrowLeft className="w-4 h-4 rotate-180" />
                        </Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-12 gap-16 items-start">
                        
                        {/* ITEM LISTING (8 Cols) */}
                        <div className="lg:col-span-8 space-y-12">
                            <div className="flex items-center gap-3 mb-8">
                                <span className="h-px w-8 bg-emerald-600/30" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-800 dark:text-emerald-400">
                                    Pending Procurement ({items.length} units)
                                </span>
                            </div>

                            <div className="divide-y divide-slate-50 dark:divide-slate-900">
                                {items.map((item) => (
                                    <div key={item.id} className="grid grid-cols-[120px_1fr] gap-8 py-10 first:pt-0 last:pb-0 group">
                                        <Link href={`/products/${item.product.slug}`} className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                            {item.product?.image ? (
                                                <Image
                                                    src={getImageUrl(item.product.image)}
                                                    alt={item.product.name}
                                                    fill
                                                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                                    unoptimized
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-200">
                                                    <ShoppingBag className="w-8 h-8" strokeWidth={1} />
                                                </div>
                                            )}
                                        </Link>

                                        <div className="flex flex-col justify-between py-1">
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-start">
                                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight uppercase line-clamp-1">
                                                        {item.product.name}
                                                    </h3>
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                                                        aria-label="Remove item"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                
                                                <div className="flex flex-wrap gap-8 items-center">
                                                    <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-800">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                            className="text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-20"
                                                            disabled={isLoading || item.quantity <= 1}
                                                        >
                                                            <Minus className="w-3.5 h-3.5" strokeWidth={3} />
                                                        </button>
                                                        <span className="text-xs font-black min-w-[20px] text-center text-slate-900 dark:text-white">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                                            disabled={isLoading}
                                                        >
                                                            <Plus className="w-3.5 h-3.5" strokeWidth={3} />
                                                        </button>
                                                    </div>
                                                    
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">Base Rate</span>
                                                        <span className="text-sm font-bold text-slate-500 dark:text-slate-400">GHS {Number(item.unit_price).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-baseline pt-8">
                                                <span className="text-[10px] font-black text-emerald-700/40 uppercase tracking-widest flex items-center gap-2">
                                                    <ShieldCheck className="w-3.5 h-3.5" />
                                                    Verified SKU
                                                </span>
                                                <div className="text-right">
                                                    <span className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest block mb-1">Item Total</span>
                                                    <span className="text-2xl font-serif font-black text-slate-900 dark:text-white tracking-tighter tabular-nums">
                                                        GHS {(Number(item.unit_price) * item.quantity).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* FINANCIAL SUMMARY (4 Cols) */}
                        <aside className="lg:col-span-4 lg:sticky lg:top-32">
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-10 rounded-[3.5rem] border border-slate-100 dark:border-slate-800/50 shadow-sm relative overflow-hidden">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 dark:text-slate-700 mb-10 pb-4 border-b border-slate-200/50 dark:border-slate-800 flex items-center gap-3">
                                    Financial Summary
                                </h3>

                                <div className="space-y-6">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Sourcing Subtotal</span>
                                        <span className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">GHS {subtotal.toLocaleString()}</span>
                                    </div>
                                    
                                    <div className="pt-8 border-t border-slate-200/50 dark:border-slate-800">
                                        <div className="flex justify-between items-end mb-10">
                                            <div>
                                                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-1">Estimated Liability</span>
                                                <span className="text-[9px] font-medium text-slate-300 uppercase tracking-tighter">Logistics fees updated at checkout</span>
                                            </div>
                                            <span className="text-4xl font-serif font-black text-slate-900 dark:text-white tracking-tighter tabular-nums leading-none">
                                                GHS {subtotal.toLocaleString()}
                                            </span>
                                        </div>

                                        <button
                                            onClick={handleCheckout}
                                            disabled={isLoading}
                                            className="w-full h-16 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-slate-950/20 dark:shadow-none hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4"
                                        >
                                            <ShieldCheck className="w-4 h-4" />
                                            Proceed to Sourcing
                                        </button>
                                        
                                        <Link 
                                            href={`https://wa.me/${siteConfig.whatsapp}`}
                                            className="w-full mt-6 h-14 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all group"
                                        >
                                            <Phone className="w-3.5 h-3.5" />
                                            Concierge Inquiry <ArrowLeft className="w-3 h-3 rotate-180 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>

                                {subtotal < siteConfig.defaults.freeShippingThreshold && (
                                    <div className="mt-8 px-4 py-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                                        <p className="text-[10px] font-bold text-slate-400 leading-relaxed italic text-center">
                                            Source GHS {(siteConfig.defaults.freeShippingThreshold - subtotal).toLocaleString()} more for <span className="text-emerald-600 underline">Free Global Logistics</span>.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-12 px-8 opacity-40">
                                <p className="text-[9px] text-slate-400 leading-relaxed uppercase tracking-widest italic grayscale">
                                    Institutional Procurement record. London's Imports Global Hub 2026. Data encrypted via SSL.
                                </p>
                            </div>
                        </aside>
                    </div>
                )}
            </div>
        </div>
    );
}
