/**
 * London's Imports - Cart Page
 */
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';

export default function CartPage() {
    const router = useRouter();
    const { cart, guestItems, isLoading, fetchCart, removeFromCart } = useCartStore();
    const { isAuthenticated } = useAuthStore();

    useEffect(() => {
        // Always try to fetch cart (store handles token check)
        fetchCart();
    }, [fetchCart]);

    // Unified items list
    const items = isAuthenticated ? (cart?.items || []) : guestItems;

    const handleCheckout = () => {
        if (!isAuthenticated) {
            router.push('/login?redirect=/checkout');
        } else {
            router.push('/checkout');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>

                {items.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center">
                        <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
                        <p className="text-gray-600 mb-6">Start adding products to your cart</p>
                        <Link href="/products" className="btn-primary">
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {items.map((item: any) => (
                                <div key={item.id} className="bg-white rounded-xl p-4 flex gap-4">
                                    {/* Product Image */}
                                    <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                                        {/* Handle both server 'item.product' and guest 'item.product' structure */}
                                        {(item.product?.image || item.image) ? (
                                            <Image
                                                src={item.product?.image || item.image}
                                                // Note: Server item has product.image. Guest item has product.image.
                                                // Wait, guest item structure in store: product: { image: ... }
                                                // So item.product.image is correct for both!
                                                alt={item.product?.name || item.name}
                                                width={96}
                                                height={96}
                                                className="object-cover w-full h-full"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-purple-50">
                                                <svg className="w-8 h-8 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">{item.product?.name || item.name}</h3>
                                        {item.product?.delivery_window_text && (
                                            <p className="text-sm text-gray-500">Est. delivery: {item.product.delivery_window_text}</p>
                                        )}
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    </div>

                                    {/* Price & Remove */}
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900">GHS {item.total_price?.toLocaleString()}</p>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-red-600 text-sm hover:underline mt-2"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl p-6 sticky top-24">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-medium">
                                            GHS {isAuthenticated ? cart?.subtotal?.toLocaleString() : items.reduce((sum: number, i: any) => sum + i.total_price, 0).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Delivery</span>
                                        <span className="font-medium">
                                            {/* Delivery logic might be server side only. Show TBD for guest? */}
                                            {isAuthenticated ? `GHS ${cart?.delivery_fee?.toLocaleString()}` : 'Calculated at checkout'}
                                        </span>
                                    </div>
                                    <div className="border-t pt-3 flex justify-between text-base">
                                        <span className="font-semibold">Total</span>
                                        <span className="font-bold text-purple-600">
                                            GHS {isAuthenticated ? cart?.total?.toLocaleString() : items.reduce((sum: number, i: any) => sum + i.total_price, 0).toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    className="w-full btn-primary mt-6"
                                >
                                    Proceed to Checkout
                                </button>

                                <Link href="/products" className="block text-center text-purple-600 text-sm mt-4 hover:underline">
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
