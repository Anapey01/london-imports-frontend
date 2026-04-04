/**
 * London's Imports - Cart Page
 * Redesigned to match the premium, editorial aesthetic of London's Imports.
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
                <h1 className="text-xl font-black tracking-tighter text-slate-950 dark:text-white uppercase italic">
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
                                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                                    Cart Summary
                                </h2>
                            </div>
                            
                            <div className="px-4 py-3 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Cart ({items.length})</span>
                                    <span className="text-sm font-bold text-slate-950 dark:text-white tabular-nums">GHS {subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-y border-slate-50 dark:border-slate-900">
                                    <span className="text-sm font-black uppercase tracking-widest text-slate-950 dark:text-white">Subtotal</span>
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
                                    <div className="mt-2 flex items-center gap-1 opacity-80">
                                        <div className="bg-emerald-600/10 text-emerald-600 px-2 py-0.5 rounded text-[8px] font-black italic tracking-widest border border-emerald-600/20">
                                            LONDON <ArrowLeft className="w-2 h-2 rotate-180 inline-block" /> EXPRESS
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Basket Divider Bar */}
                        <div className="bg-slate-50 dark:bg-slate-900 px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
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
                                                    GHS {item.unit_price?.toLocaleString()}
                                                </span>
                                                {item.product.old_price && Number(item.product.old_price) > Number(item.unit_price) && (
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[10px] text-slate-400 line-through tabular-nums">
                                                            GHS {Number(item.product.old_price).toLocaleString()}
                                                        </span>
                                                        {item.product.discount_percentage !== undefined && item.product.discount_percentage > 0 && (
                                                            <span className="bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest">
                                                                -{item.product.discount_percentage}%
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <p className={`text-[10px] font-black uppercase tracking-[0.2em] pt-1 ${
                                                (!item.product.is_preorder && item.product.stock_quantity === 0) ? 'text-red-500' : 'text-emerald-600'
                                            }`}>
                                                {item.product.is_preorder 
                                                    ? (item.product.preorder_status === 'CLOSING_SOON' ? 'Cutoff Soon' : 'Pre-order')
                                                    : (item.product.stock_quantity !== undefined && item.product.stock_quantity > 0 
                                                        ? 'Ready' 
                                                        : 'FEW UNITS LEFT')
                                                }
                                            </p>
                                            
                                            <div className="flex items-center gap-2 opacity-80 pt-1">
                                                <div className="bg-emerald-600/10 text-emerald-600 px-2 py-0.5 rounded-[4px] text-[8px] font-black italic tracking-widest flex items-center gap-1 border border-emerald-600/20">
                                                    LONDON <ArrowLeft className="w-2 h-2 rotate-180" /> EXPRESS
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-4">
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-red-500 transition-colors"
                                                aria-label="Remove item"
                                                title="Remove item"
                                            >
                                                Remove
                                            </button>
                                            
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                    className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all"
                                                    disabled={isLoading}
                                                    title="Decrease quantity"
                                                    aria-label="Decrease quantity"
                                                >
                                                    <Minus className="w-3 h-3" strokeWidth={3} />
                                                </button>
                                                <span className="text-xs font-black w-4 text-center text-slate-950 dark:text-white">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-7 h-7 rounded-lg bg-slate-950 text-white flex items-center justify-center hover:bg-emerald-600 transition-all shadow-lg shadow-slate-950/10"
                                                    disabled={isLoading}
                                                    title="Increase quantity"
                                                    aria-label="Increase quantity"
                                                >
                                                    <Plus className="w-3 h-3" strokeWidth={3} />
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

            {/* 4. FIXED BOTTOM NAVIGATION BAR (Signature Graduation) */}
            {items.length > 0 && (
                <div className="fixed md:bottom-0 bottom-[64px] left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-lg border-t border-slate-100 dark:border-slate-900 p-4 pb-safe shadow-[0_-8px_30px_rgb(0,0,0,0.05)]">
                    <div className="max-w-3xl mx-auto flex items-center gap-4">
                        <Link
                            href={`https://wa.me/${siteConfig.whatsapp}`}
                            className="w-14 h-14 rounded-2xl border-2 border-slate-950 dark:border-white flex items-center justify-center text-slate-950 dark:text-white hover:bg-slate-50 transition-all active:scale-95"
                            title="Chat with Sourcing Agent"
                            aria-label="Chat with Sourcing Agent on WhatsApp"
                        >
                            <Phone className="w-6 h-6" />
                        </Link>
                        <button
                            onClick={handleCheckout}
                            disabled={isLoading}
                            className="flex-1 h-14 bg-slate-950 dark:bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-slate-950/20 active:scale-95 transition-all flex items-center justify-center gap-3"
                            title="Proceed to payment"
                            aria-label="Proceed to checkout"
                        >
                            <ShieldCheck className="w-5 h-5" />
                            Checkout (GHS {subtotal.toLocaleString()})
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
