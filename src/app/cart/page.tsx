/**
 * London's Imports - Cart Page
 * Restored to original layout with updated Lux Sans typography.
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
import { ShoppingBag, Minus, Plus, ArrowLeft, ShieldCheck, Phone } from 'lucide-react';

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
            <div className="min-h-screen bg-primary-surface pt-32 pb-20 flex justify-center">
                <div className="w-8 h-8 border-4 border-slate-950 dark:border-white border-t-transparent rounded-full animate-spin"></div>
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
        <div className="min-h-screen bg-white dark:bg-slate-950 pb-32 transition-all duration-500">
            {/* Sticky Header */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-900 px-4 h-16 flex items-center gap-4">
                <Link
                    href="/"
                    className="p-2 -ml-2 rounded-full hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                    aria-label="Go to homepage"
                    title="Return Home"
                >
                    <ArrowLeft className="w-6 h-6 text-slate-950 dark:text-white" />
                </Link>
                <h1 className="text-xl font-black uppercase tracking-[0.25em] text-slate-950 dark:text-white">
                    Cart
                </h1>
            </header>

            <div className="max-w-3xl mx-auto">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
                        <div className="mb-8 opacity-10">
                            <ShoppingBag className="w-20 h-20" strokeWidth={1} />
                        </div>
                        <h2 className="text-xl font-medium mb-4 tracking-widest uppercase text-slate-950 dark:text-white">Your basket is empty</h2>
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-3 bg-slate-950 text-white px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-slate-950/20"
                        >
                            Start Sourcing
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-0">
                        {/* CART SUMMARY - JUMIA STYLE REF */}
                        <div className="bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-900">
                            <div className="bg-slate-50 dark:bg-slate-900 px-4 py-2 border-y border-slate-100 dark:border-slate-800">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
                                    Cart Summary
                                </h2>
                            </div>
                            
                            <div className="px-4 py-3 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Cart ({items.length})</span>
                                    <span className="text-sm font-bold text-slate-950 dark:text-white tabular-nums">GHS {subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-y border-slate-50 dark:border-slate-900">
                                    <span className="text-sm font-black uppercase tracking-[0.25em] text-slate-950 dark:text-white">Subtotal</span>
                                    <span className="text-lg font-black text-slate-950 dark:text-white tabular-nums italic">GHS {subtotal.toLocaleString()}</span>
                                </div>
                                
                                <div className="pt-1">
                                    {subtotal < siteConfig.defaults.freeShippingThreshold ? (
                                        <p className="text-[11px] font-medium text-slate-500 italic">
                                            Missing GHS {(siteConfig.defaults.freeShippingThreshold - subtotal).toLocaleString()} to reach <span className="underline decoration-emerald-500">free delivery</span>.
                                        </p>
                                    ) : (
                                        <p className="text-[11px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                                            Success! Free Delivery Unlocked
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Basket Divider Bar */}
                        <div className="bg-slate-50 dark:bg-slate-900 px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
                                Basket ({items.length})
                            </h3>
                            <button
                                onClick={() => clearCart()}
                                className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors"
                            >
                                Clear All
                            </button>
                        </div>

                        {/* Item List */}
                        <div className="divide-y divide-slate-100 dark:divide-slate-900">
                            {items.map((item) => (
                                <div key={item.id} className="p-4 flex gap-4 transition-all duration-300">
                                    <Link href={`/products/${item.product.slug}`} className="w-24 h-24 flex-shrink-0 bg-slate-50 dark:bg-slate-900 rounded-lg overflow-hidden relative border border-slate-100 dark:border-slate-800">
                                        {item.product?.image ? (
                                            <Image
                                                src={getImageUrl(item.product.image)}
                                                alt={item.product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-200">
                                                <ShoppingBag className="w-6 h-6" strokeWidth={1} />
                                            </div>
                                        )}
                                    </Link>

                                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                                        <div className="space-y-1">
                                            <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-tight uppercase tracking-tight">
                                                {item.product.name}
                                            </h3>
                                            <div className="flex flex-col pt-1">
                                                <span className="text-lg font-black text-slate-950 dark:text-white tabular-nums leading-none">
                                                    GHS {Number(item.unit_price).toLocaleString()}
                                                </span>
                                            </div>
                                            
                                            <p className={`text-[10px] font-black uppercase tracking-[0.2em] pt-1 ${
                                                (!item.product.is_preorder && item.product.stock_quantity === 0) ? 'text-red-500' : 'text-emerald-600'
                                            }`}>
                                                {item.product.is_preorder 
                                                    ? 'Pre-order'
                                                    : 'Ready'
                                                }
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between mt-4">
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors"
                                                title="Remove item"
                                                aria-label="Remove item"
                                            >
                                                Remove
                                            </button>
                                            
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                    className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500"
                                                    disabled={isLoading}
                                                    title="Decrease quantity"
                                                    aria-label="Decrease quantity"
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="text-xs font-black w-4 text-center text-slate-900 dark:text-white">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center"
                                                    disabled={isLoading}
                                                    title="Increase quantity"
                                                    aria-label="Increase quantity"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* FIXED BOTTOM NAVIGATION BAR - REFINED SIZE & SOFTER BLACK */}
            {items.length > 0 && (
                <div className="fixed md:bottom-0 bottom-[64px] left-0 right-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-t border-slate-100 dark:border-slate-900 p-3 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.04)]">
                    <div className="max-w-2xl mx-auto flex items-center gap-3">
                        <Link
                            href={`https://wa.me/${siteConfig.whatsapp}`}
                            className="w-12 h-12 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-900 dark:text-white hover:bg-slate-50 transition-colors"
                            title="Contact Concierge"
                            aria-label="WhatsApp Support"
                        >
                            <Phone className="w-5 h-5" />
                        </Link>
                        <button
                            onClick={handleCheckout}
                            disabled={isLoading}
                            className="flex-1 h-12 bg-slate-900 dark:bg-emerald-600 text-white rounded-xl font-black uppercase tracking-[0.25em] text-[10px] transition-all flex items-center justify-center gap-3 active:scale-95 shadow-lg shadow-slate-900/10"
                            title="Proceed to Logistics Hub"
                        >
                            <ShieldCheck className="w-4 h-4" />
                            Checkout (GHS {subtotal.toLocaleString()})
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
