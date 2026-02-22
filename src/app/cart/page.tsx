/**
 * London's Imports - Cart Page
 * Redesigned to match the premium, editorial aesthetic of the Wishlist
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
    const { cart, guestItems, isLoading, fetchCart, removeFromCart, updateQuantity, selectedItemIds, toggleSelection, selectAll } = useCartStore();
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
    const subtotal = selectedItems.reduce((sum, i) => sum + i.total_price, 0);
    const total = subtotal + (isAuthenticated && cart?.delivery_fee && selectedItems.length > 0 ? cart.delivery_fee : 0);

    const allSelected = items.length > 0 && items.every(i => selectedItemIds.has(i.id));

    if (!mounted) {
        return <div className="min-h-screen bg-gray-50 pt-32 pb-20 flex justify-center"><div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div></div>;
    }

    const handleCheckout = () => {
        if (!isAuthenticated) {
            router.push('/login?redirect=/checkout');
        } else {
            router.push('/checkout');
        }
    };

    return (
        <div className="min-h-screen bg-white md:bg-gray-50 pt-24 pb-20 md:pt-32 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-end justify-between mb-8 border-b border-gray-200 pb-4">
                    <h1 className="text-3xl md:text-4xl font-light text-gray-900 tracking-tight">
                        My Basket
                        <sup className="ml-2 text-sm font-medium text-gray-500">{items.length}</sup>
                    </h1>
                    {items.length > 0 && (
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={allSelected}
                                onChange={(e) => selectAll(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                                id="select-all"
                            />
                            <label htmlFor="select-all" className="text-sm font-medium text-gray-600 cursor-pointer">
                                {allSelected ? 'Deselect All' : 'Select All'}
                            </label>
                        </div>
                    )}
                </div>

                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="mb-6 opacity-30">
                            <ShoppingBag className="w-16 h-16 text-gray-900" strokeWidth={1} />
                        </div>
                        <h2 className="text-xl font-medium text-gray-900 mb-3 tracking-wide">Your basket is empty</h2>
                        <p className="text-gray-500 mb-8 max-w-md font-light">
                            Looks like you haven&apos;t added any items yet.
                        </p>
                        <Link
                            href="/products"
                            className="group inline-flex items-center gap-2 border-b border-gray-900 pb-1 text-gray-900 hover:text-pink-600 hover:border-pink-600 transition-colors uppercase text-xs tracking-widest font-medium"
                        >
                            Start Shopping
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-12 gap-12">
                        {/* Cart Items List */}
                        <div className="lg:col-span-8">
                            <div className="space-y-6">
                                {items.map((item) => (
                                    <div key={item.id} className={`flex gap-4 md:gap-6 py-6 border-b border-gray-100 last:border-0 transition-opacity ${!selectedItemIds.has(item.id) ? 'opacity-60' : ''}`}>
                                        {/* Selection Checkbox */}
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedItemIds.has(item.id)}
                                                onChange={() => toggleSelection(item.id)}
                                                className="w-5 h-5 rounded border-gray-300 text-pink-600 focus:ring-pink-500 cursor-pointer"
                                                aria-label={`Select ${item.product.name} for checkout`}
                                            />
                                        </div>
                                        {/* Image */}
                                        <div className="w-24 h-32 flex-shrink-0 bg-gray-100 rounded-sm overflow-hidden relative">
                                            {item.product?.image ? (
                                                <Image
                                                    src={getImageUrl(item.product.image)}
                                                    alt={item.product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                    <ShoppingBag className="w-8 h-8" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-medium text-gray-900 text-lg">{item.product.name}</h3>
                                                    <p className="font-medium text-gray-900">GHS {item.total_price?.toLocaleString()}</p>
                                                </div>
                                                {item.product.delivery_window_text && (
                                                    <p className="text-sm text-gray-500 font-light mb-1">
                                                        Delivery: {item.product.delivery_window_text}
                                                    </p>
                                                )}
                                                <p className="text-sm text-gray-500 font-light">
                                                    Unit Price: GHS {item.unit_price?.toLocaleString()}
                                                </p>
                                            </div>

                                            <div className="flex justify-between items-end mt-4">
                                                {/* Quantity Control */}
                                                <div className="flex items-center border border-gray-200 rounded-full">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                                                        className="p-2 hover:bg-gray-50 text-gray-600 transition-colors rounded-l-full"
                                                        disabled={isLoading}
                                                        aria-label="Decrease quantity"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="w-8 text-center text-sm font-medium text-gray-900">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="p-2 hover:bg-gray-50 text-gray-600 transition-colors rounded-r-full"
                                                        disabled={isLoading}
                                                        aria-label="Increase quantity"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors p-2"
                                                    aria-label="Remove item"
                                                >
                                                    <Trash2 className="w-5 h-5" strokeWidth={1.5} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-4">
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-32">
                                <h2 className="text-xl font-light text-gray-900 mb-6 tracking-tight">Summary</h2>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-gray-600 font-light">
                                        <span>Subtotal</span>
                                        <span className="font-medium text-gray-900">GHS {subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 font-light">
                                        <span>Delivery</span>
                                        <span className="text-gray-900">
                                            {isAuthenticated && cart?.delivery_fee ? `GHS ${cart.delivery_fee}` : 'Calc. at checkout'}
                                        </span>
                                    </div>
                                    <div className="border-t border-gray-100 pt-4 flex justify-between items-end">
                                        <span className="text-lg text-gray-900 font-medium">Total</span>
                                        <span className="text-2xl font-light text-gray-900">GHS {total.toLocaleString()}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    disabled={selectedItems.length === 0 || isLoading}
                                    className={`w-full py-4 rounded-full font-medium transition-all shadow-lg transform active:scale-95 duration-200 ${selectedItems.length === 0
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                                        : 'bg-gray-900 text-white hover:bg-pink-600 hover:shadow-xl'
                                        }`}
                                >
                                    {selectedItems.length === 0 ? 'Select items to checkout' : 'Proceed to Checkout'}
                                </button>

                                <p className="text-center mt-4 text-xs text-gray-400 font-light">
                                    Shipping & taxes calculated at checkout
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
