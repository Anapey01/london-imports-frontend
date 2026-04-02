/**
 * London's Imports - Cart Page
 * Redesigned to match the premium, editorial aesthetic of the luxury sourcing house.
 */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { getImageUrl } from '@/lib/image';
import { ShoppingBag, Trash2, Minus, Plus, ArrowRight } from 'lucide-react';

export default function CartPage() {
    const router = useRouter();
    const { 
        cart, 
        guestItems, 
        isLoading, 
        fetchCart, 
        removeFromCart, 
        updateQuantity, 
        selectedItemIds, 
        toggleSelection, 
        selectAll 
    } = useCartStore();
    const { isAuthenticated } = useAuthStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        fetchCart();
        const timer = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(timer);
    }, [fetchCart]);

    const items = isAuthenticated ? (cart?.items || []) : guestItems;
    const selectedItems = items.filter(item => selectedItemIds.has(item.id));

    // Derived totals based on selection
    const subtotal = selectedItems.reduce((sum, i) => sum + Number(i.total_price || 0), 0);
    const allSelected = items.length > 0 && items.every(i => selectedItemIds.has(i.id));

    if (!mounted) {
        return (
            <div className="min-h-screen bg-white pt-32 pb-20 flex justify-center">
                <div className="w-8 h-8 border-4 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
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
        <div className="min-h-screen bg-white md:bg-gray-50 pt-24 pb-20 md:pt-32 px-4 sm:px-6 lg:px-8 font-sans transition-all duration-500">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-end justify-between mb-12 border-b border-slate-200 pb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-950 uppercase tracking-[0.3em]">
                        My Basket
                        <sup className="ml-2 text-[10px] font-black text-slate-400">{items.length}</sup>
                    </h1>
                    {items.length > 0 && (
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={allSelected}
                                onChange={(e) => selectAll(e.target.checked)}
                                className="w-4 h-4 rounded border-slate-300 text-slate-950 focus:ring-slate-950 cursor-pointer"
                                id="select-all"
                            />
                            <label htmlFor="select-all" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-slate-950 transition-colors">
                                {allSelected ? 'Deselect All' : 'Select All'}
                            </label>
                        </div>
                    )}
                </div>

                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="mb-8 opacity-20">
                            <ShoppingBag className="w-20 h-20 text-slate-950" strokeWidth={1} />
                        </div>
                        <h2 className="text-xl font-medium text-slate-950 mb-4 tracking-widest uppercase">Your basket is empty</h2>
                        <p className="text-slate-500 mb-10 max-w-md font-light uppercase text-[10px] tracking-widest leading-relaxed">
                            Looks like you haven&apos;t added any items yet. <br /> Start browsing our premium collection.
                        </p>
                        <Link
                            href="/products"
                            className="group inline-flex items-center gap-3 border-b border-slate-950 pb-2 text-slate-950 hover:text-green-600 hover:border-green-600 transition-all uppercase text-[10px] tracking-[0.2em] font-black"
                        >
                            Start Shopping
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-12 gap-16">
                        {/* Cart Items List */}
                        <div className="lg:col-span-8">
                            <div className="space-y-8">
                                {items.map((item) => (
                                    <div key={item.id} className={`flex gap-6 md:gap-10 py-8 border-b border-slate-100 last:border-0 transition-all duration-300 ${!selectedItemIds.has(item.id) ? 'opacity-40 grayscale-[0.5]' : ''}`}>
                                        {/* Selection Checkbox */}
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedItemIds.has(item.id)}
                                                onChange={() => toggleSelection(item.id)}
                                                className="w-5 h-5 rounded border-slate-300 text-slate-950 focus:ring-slate-950 cursor-pointer"
                                                aria-label={`Select ${item.product.name} for checkout`}
                                            />
                                        </div>
                                        {/* Image */}
                                        <div className="w-28 h-36 flex-shrink-0 bg-slate-50 rounded-xl overflow-hidden relative border border-slate-100 shadow-sm group">
                                            {item.product?.image ? (
                                                <Image
                                                    src={getImageUrl(item.product.image)}
                                                    alt={item.product.name}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-200">
                                                    <ShoppingBag className="w-8 h-8" strokeWidth={1} />
                                                </div>
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div>
                                                <div className="flex justify-between items-start mb-4">
                                                    <h3 className="font-bold text-slate-950 text-base uppercase tracking-tight leading-tight max-w-[200px] md:max-w-none">{item.product.name}</h3>
                                                    <p className="font-black text-slate-950 text-lg tabular-nums">GHS {item.total_price?.toLocaleString()}</p>
                                                </div>
                                                {item.product.delivery_window_text && (
                                                    <p className="text-[10px] text-green-600 font-black uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5">
                                                        <div className="w-1 h-1 bg-green-600 rounded-full animate-pulse" />
                                                        {item.product.delivery_window_text}
                                                    </p>
                                                )}
                                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
                                                    Unit Price: GHS {item.unit_price?.toLocaleString()}
                                                </p>
                                            </div>

                                            <div className="flex justify-between items-end mt-6">
                                                {/* Quantity Control */}
                                                <div className="flex items-center border border-slate-200 rounded-full bg-white shadow-sm overflow-hidden p-1">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                                                        className="p-2.5 hover:bg-slate-50 text-slate-400 hover:text-slate-950 transition-all rounded-full"
                                                        disabled={isLoading}
                                                        aria-label="Decrease quantity"
                                                    >
                                                        <Minus className="w-3.5 h-3.5" />
                                                    </button>
                                                    <span className="w-10 text-center text-xs font-black text-slate-950 tabular-nums">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="p-2.5 hover:bg-slate-50 text-slate-400 hover:text-slate-950 transition-all rounded-full"
                                                        disabled={isLoading}
                                                        aria-label="Increase quantity"
                                                    >
                                                        <Plus className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-slate-300 hover:text-red-500 transition-all p-3 hover:bg-red-50 rounded-full"
                                                    aria-label="Remove item"
                                                >
                                                    <Trash2 className="w-5 h-5" strokeWidth={1} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-4 mt-8 lg:mt-0">
                            <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 sticky top-32">
                                <h2 className="text-base font-bold text-slate-950 mb-10 tracking-[0.3em] uppercase">Order Summary</h2>

                                <div className="space-y-8 mb-12">
                                    <div className="flex justify-between text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                                        <span>Subtotal</span>
                                        <span className="font-black text-slate-950 tabular-nums">GHS {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="border-t border-slate-50 pt-8 flex justify-between items-end">
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pb-1.5">Total Amount</span>
                                        <div className="flex flex-col items-end">
                                            <span className="text-3xl font-black text-slate-950 tracking-tight leading-none tabular-nums">
                                                GHS {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    disabled={selectedItems.length === 0 || isLoading}
                                    className={`w-full py-6 rounded-[1.2rem] font-bold transition-all shadow-2xl active:scale-[0.98] duration-300 uppercase tracking-[0.4em] text-[10px] ${selectedItems.length === 0
                                        ? 'bg-slate-50 text-slate-300 cursor-not-allowed shadow-none'
                                        : 'bg-slate-950 text-white hover:bg-green-600 shadow-slate-950/20'
                                        }`}
                                >
                                    {selectedItems.length === 0 ? 'Select items' : 'Secure Checkout'}
                                </button>

                                <div className="mt-8 flex flex-col items-center gap-4">
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] text-center">
                                        Shipping & taxes calculated at checkout
                                    </p>
                                    <div className="flex items-center gap-2 opacity-30 grayscale scale-75">
                                        <div className="w-8 h-5 bg-slate-900 rounded-sm" />
                                        <div className="w-8 h-5 bg-slate-700 rounded-sm" />
                                        <div className="w-8 h-5 bg-slate-500 rounded-sm" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
