/**
 * London's Imports - Cart Page
 * Refined Layout: Absolute Minimalist Checkout Section (Beneath the Order).
 * Hardened for WCAG 'Robust' and 'Operable' Compliance.
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
import { trackBeginCheckout, trackAddToCart, trackUserIntent } from '@/lib/analytics';

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
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        fetchCart();
        const timer = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(timer);
    }, [fetchCart]);

    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    
    // MINIMAL FIX: Ensure we use the server cart items when authenticated, otherwise guest items.
    // Removed hasToken check because HttpOnly cookies mean accessToken might be null even when authenticated.
    const items = isAuthenticated ? (cart?.items || []) : guestItems;

    // Derived totals
    const subtotal = items.reduce((sum, i) => sum + Number(i.unit_price || 0) * i.quantity, 0);
    const deliveryFee = items.reduce((sum, i) => {
        const fee = Number(i.product?.estimated_shipping_fee || 0);
        return sum + (fee * i.quantity);
    }, 0);
    const total = subtotal + deliveryFee;

    // Decision-Making Intelligence: Intent Profiling
    useEffect(() => {
        if (items.length > 0) {
            trackUserIntent(subtotal, items.length);
        }
    }, [subtotal, items.length]);

    if (!mounted) {
        return (
            <div className="min-h-screen bg-primary-surface pt-32 pb-20 flex justify-center">
                <div className="w-8 h-8 border-4 border-slate-950 dark:border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const handleCheckout = () => {
        if (cart) trackBeginCheckout(cart);
        if (!isAuthenticated) {
            router.push('/login?redirect=/checkout');
        } else {
            router.push('/checkout');
        }
    };

    return (
        <div className="min-h-screen bg-surface pb-40 transition-all duration-500">
            {/* Sticky Header */}
            <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border-standard px-4 h-16 flex items-center gap-4">
                <Link
                    href="/"
                    className="p-2 -ml-2 rounded-full hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors institutional-focus"
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
                    isLoading ? (
                        <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
                            <div className="w-8 h-8 border-4 border-slate-950 dark:border-white border-t-transparent rounded-full animate-spin opacity-20"></div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
                            <div className="mb-8 opacity-10">
                                <ShoppingBag className="w-20 h-20" strokeWidth={1} />
                            </div>
                            <h2 className="text-xl font-medium mb-4 tracking-widest uppercase text-slate-950 dark:text-white">Your basket is empty</h2>
                            <Link
                                href="/products"
                                className="inline-flex items-center gap-3 bg-slate-950 text-white px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-slate-950/20 institutional-focus"
                            >
                                Start Shopping
                            </Link>
                        </div>
                    )
                ) : (
                    <div className="space-y-0">
                        {/* CART SUMMARY */}
                        <div className="bg-surface border-b border-border-standard">
                            <div className="bg-surface px-4 py-2 border-y border-border-standard flex justify-between items-center">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-content-secondary">
                                    Summary
                                </h2>
                                <button
                                    onClick={handleCheckout}
                                    className="text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:underline institutional-focus px-2 py-1"
                                    aria-label="Quick Checkout"
                                >
                                    Checkout Now
                                </button>
                            </div>
                            
                            <div className="px-4 py-6 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-content-secondary">Items Subtotal</span>
                                    <span className="text-sm font-medium text-content-primary tabular-nums italic">GHS {subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-content-secondary">Estimated Shipping</span>
                                    <span className="text-sm font-medium text-content-primary tabular-nums italic">GHS {deliveryFee.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center py-5 border-y border-border-standard">
                                    <span className="text-sm font-black uppercase tracking-[0.25em] text-content-primary">Total</span>
                                    <span className="text-2xl font-medium text-content-primary tabular-nums italic tracking-tighter">GHS {total.toLocaleString()}</span>
                                </div>
                                
                                </div>
                            </div>

                        {/* Basket Listings Header */}
                        <div className="bg-surface px-4 py-3 border-b border-border-standard flex items-center justify-between">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-content-secondary">
                                Order Listings
                            </h3>
                            <button
                                onClick={() => clearCart()}
                                className="text-[9px] font-black uppercase tracking-widest text-content-secondary hover:text-red-500 transition-colors institutional-focus px-2 py-1"
                            >
                                Empty Basket
                            </button>
                        </div>

                        {/* Item List */}
                        <div className="divide-y divide-slate-100 dark:divide-slate-900">
                            {items.map((item) => (
                                <div key={item.id} className="p-4 py-6 flex gap-5 transition-all duration-300">
                                    <Link href={`/products/${item.product.slug}`} className="w-24 h-24 flex-shrink-0 bg-surface rounded-xl overflow-hidden relative border border-border-standard shadow-sm institutional-focus">
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
                                            <h3 className="text-sm font-medium text-content-primary line-clamp-2 leading-tight uppercase tracking-tight italic">
                                                {item.product.display_name || item.product.short_name || item.product.name}
                                            </h3>
                                            <div className="flex flex-col pt-1">
                                                <span className="text-xl font-medium text-content-primary tabular-nums leading-none tracking-tighter italic">
                                                    GHS {Number(item.unit_price).toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {item.selected_size && (
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-content-secondary bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                                                        Size: {item.selected_size}
                                                    </span>
                                                )}
                                                {item.selected_color && (
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-content-secondary bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                                                        Color: {item.selected_color}
                                                    </span>
                                                )}
                                            </div>
                                            
                                            <p className={`text-[10px] font-black uppercase tracking-[0.2em] pt-2 ${
                                                (!item.product.is_preorder && item.product.stock_quantity === 0) ? 'text-red-500' : 'text-emerald-600'
                                            }`}>
                                                {item.product.is_preorder 
                                                    ? 'Shipment Incoming'
                                                    : 'In Inventory'
                                                }
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between mt-6">
                                            <button
                                                onClick={() => {
                                                    removeFromCart(item.id);
                                                }}
                                                className="text-[10px] font-black uppercase tracking-widest text-content-secondary hover:text-red-500 transition-colors institutional-focus"
                                                title="Remove item"
                                                aria-label={`Remove ${item.product.name} from basket`}
                                            >
                                                Remove
                                            </button>
                                            
                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                    className="w-8 h-8 rounded-lg border border-border-standard flex items-center justify-center text-content-secondary hover:border-content-primary institutional-focus"
                                                    title="Decrease quantity"
                                                    aria-label="Decrease quantity"
                                                >
                                                    <Minus className="w-3.5 h-3.5" />
                                                </button>
                                                <span className="text-sm font-black w-4 text-center text-content-primary italic tabular-nums">{item.quantity}</span>
                                                <button
                                                    onClick={() => {
                                                        updateQuantity(item.id, item.quantity + 1);
                                                        trackAddToCart(item.product, 1);
                                                    }}
                                                    className="w-8 h-8 rounded-lg bg-slate-950 text-white flex items-center justify-center hover:bg-slate-800 institutional-focus"
                                                    title="Increase quantity"
                                                    aria-label="Increase quantity"
                                                >
                                                    <Plus className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* ABSOLUTE MINIMALIST CHECKOUT: BENEATH THE ORDER */}
                        <div className="mt-12 px-4 pb-20">
                            <div className="flex items-center gap-4">
                                <Link
                                    href={`https://wa.me/${siteConfig.whatsapp}`}
                                    className="w-11 h-11 rounded-none border border-border-standard flex items-center justify-center text-content-primary hover:bg-slate-50 transition-all active:scale-95 institutional-focus"
                                    title="WhatsApp Concierge"
                                    aria-label="Contact Concierge"
                                >
                                    <Phone className="w-5 h-5" strokeWidth={1.5} />
                                </Link>
                                <button
                                     onClick={handleCheckout}
                                     disabled={isLoading}
                                     className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800/50 disabled:cursor-not-allowed text-white rounded-none font-black uppercase tracking-[0.3em] text-[10px] transition-all flex items-center justify-center gap-4 active:scale-95 institutional-focus"
                                 >
                                     {isLoading ? (
                                         <>
                                             <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                             Loading...
                                         </>
                                     ) : (
                                         <>
                                             Checkout Now
                                             <span className="opacity-30">/</span>
                                             GHS {total.toLocaleString()}
                                         </>
                                     )}
                                 </button>
                            </div>
                            
                            <div className="mt-6 flex flex-col items-center gap-2">
                                <p className="text-[10px] font-black uppercase tracking-widest text-content-secondary/40 flex items-center gap-2 italic">
                                    <ShieldCheck className="w-3 h-3" />
                                    Secure Shipping
                                </p>
                                <p className="text-[9px] font-medium text-content-secondary/60 italic text-center">
                                    Delivery schedules are calculated at the Shipping Hub.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
