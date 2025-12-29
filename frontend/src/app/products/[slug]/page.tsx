/**
 * London's Imports - Product Detail Page (Redesigned)
 * Side-by-side layout: Image on left, details on right
 */
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { productsAPI } from '@/lib/api';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import ShareButton from '@/components/ShareButton';

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);

    const { addToCart } = useCartStore();
    const { isAuthenticated } = useAuthStore();

    const { data, isLoading, error } = useQuery({
        queryKey: ['product', slug],
        queryFn: () => productsAPI.detail(slug),
    });

    const product = data?.data;

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            router.push('/login?redirect=/products/' + slug);
            return;
        }

        setIsAdding(true);
        try {
            await addToCart(product.id, quantity);
            router.push('/cart');
        } finally {
            setIsAdding(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#FFF8E7] py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-16 items-start">
                        <div className="aspect-square skeleton rounded-3xl bg-white/50"></div>
                        <div className="space-y-6">
                            <div className="h-10 skeleton rounded w-3/4 bg-white/50"></div>
                            <div className="h-6 skeleton rounded w-1/2 bg-white/50"></div>
                            <div className="h-32 skeleton rounded bg-white/50"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-[#FFF8E7] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h1>
                    <p className="text-gray-600 mb-8">This product may no longer be available.</p>
                    <button
                        onClick={() => router.push('/products')}
                        className="px-6 py-3 bg-[#006B5A] text-white rounded-full font-semibold hover:bg-[#005748] transition-colors"
                    >
                        Browse Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FFF8E7]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Two Column Grid: Image Left, Details Right */}
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">

                    {/* LEFT COLUMN: Product Image */}
                    <div className="relative">
                        {/* Main Image - directly on cream background */}
                        <div className="aspect-square relative overflow-hidden">
                            {product.image ? (
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-contain drop-shadow-2xl"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <svg className="w-32 h-32 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                            )}
                        </div>

                        {/* Product Specs Row - below image */}
                        <div className="flex justify-center gap-8 mt-8">
                            <div className="flex flex-col items-center text-center">
                                <svg className="w-7 h-7 text-[#006B5A] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-sm font-bold text-gray-900">{product.delivery_window_text}</span>
                                <span className="text-xs text-gray-500">Delivery</span>
                            </div>

                            <div className="flex flex-col items-center text-center">
                                <div className="w-7 h-7 bg-[#006B5A] rounded-full flex items-center justify-center mb-2">
                                    <span className="text-white text-[10px] font-bold">PRE</span>
                                </div>
                                <span className="text-sm font-bold text-gray-900">{product.category?.name}</span>
                                <span className="text-xs text-gray-500">Category</span>
                            </div>

                            {product.reservations_count > 0 && (
                                <div className="flex flex-col items-center text-center">
                                    <svg className="w-7 h-7 text-[#F5A623] mb-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-sm font-bold text-gray-900">{product.reservations_count}+</span>
                                    <span className="text-xs text-gray-500">Reserved</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Product Info */}
                    <div>
                        {/* Title */}
                        <div className="flex items-start justify-between gap-4 mb-4">
                            <h1 className="text-4xl lg:text-5xl font-bold text-[#006B5A] leading-tight">
                                {product.name}
                            </h1>
                            <ShareButton
                                title={product.name}
                                url={typeof window !== 'undefined' ? window.location.href : ''}
                            />
                        </div>

                        {/* Rating */}
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            <div className="flex text-[#F5A623] shrink-0">
                                {[1, 2, 3, 4, 5].map((star) => {
                                    const rating = parseFloat(product.rating || '5.0');
                                    // Full star
                                    if (rating >= star) {
                                        return (
                                            <svg key={star} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        );
                                    }
                                    // Half star (approximate) - simplistic view, or just show full/empty for now
                                    // Let's stick to full stars for simplicity or implement half logic if strictly needed
                                    // Render empty star if not full
                                    return (
                                        <svg key={star} className="w-5 h-5 text-gray-300 fill-current" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    );
                                })}
                            </div>
                            <span className="text-sm text-gray-600 font-medium">
                                {product.rating || '5.0'}
                                <span className="mx-1.5 text-gray-300">|</span>
                                {product.reservations_count || 0} Pre-orders
                            </span>
                        </div>

                        {/* Price */}
                        <div className="mb-6">
                            <span className="text-4xl font-bold text-gray-900">
                                GHS {product.price?.toLocaleString()}
                            </span>
                        </div>

                        {/* Description */}
                        <div className="mb-8">
                            <p className="text-gray-700 leading-relaxed text-lg">
                                {product.description}
                            </p>
                        </div>

                        {/* Trust & Product Details */}
                        <div className="space-y-4 mb-8 bg-white/50 p-6 rounded-2xl border border-slate-100">
                            {/* Product Type/Category */}
                            <div className="flex items-center gap-3">
                                <span className="w-8 flex justify-center text-[#006B5A]">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                </span>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Product Type</p>
                                    <p className="text-gray-900 font-semibold">{product.category?.name}</p>
                                </div>
                            </div>

                            {/* Origin Country */}
                            <div className="flex items-center gap-3">
                                <span className="w-8 flex justify-center text-[#006B5A]">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </span>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Origin</p>
                                    <p className="text-gray-900 font-semibold">{product.origin_country || 'United Kingdom'}</p>
                                </div>
                            </div>

                            {/* Brand / Verification */}
                            <div className="flex items-center gap-3">
                                <span className="w-8 flex justify-center text-[#006B5A]">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </span>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Authenticity</p>
                                    <p className="text-gray-900 font-semibold">100% Authentic & Verified</p>
                                </div>
                            </div>

                            {/* Trust Badge */}
                            <div className="mt-2 pt-2 border-t border-slate-200">
                                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                                    <svg className="w-4 h-4 text-[#F5A623]" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Verified by London&apos;s Imports
                                </p>
                            </div>
                        </div>

                        {/* CTA Section */}
                        <div className="flex gap-4 items-center">
                            {/* Quantity Selector */}
                            <div className="flex items-center border-2 border-gray-200 rounded-full bg-white">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-4 py-3 text-gray-600 hover:text-gray-900 font-bold text-lg"
                                >
                                    −
                                </button>
                                <span className="px-4 py-3 font-bold text-lg min-w-[50px] text-center">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="px-4 py-3 text-gray-600 hover:text-gray-900 font-bold text-lg"
                                >
                                    +
                                </button>
                            </div>

                            {/* Pre-order Button */}
                            <button
                                onClick={handleAddToCart}
                                disabled={isAdding || product.preorder_status === 'SOLD_OUT'}
                                className="flex-1 py-4 px-8 bg-[#F5A623] text-[#006B5A] font-bold text-lg rounded-full hover:bg-[#E09000] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isAdding ? 'Adding...' :
                                    product.preorder_status === 'SOLD_OUT' ? 'Sold Out' :
                                        `Pre-order Now`}
                            </button>
                        </div>

                        {/* Vendor Info */}
                        <div className="mt-8 pt-6 border-t border-[#006B5A]/10">
                            <p className="text-sm text-gray-500">
                                Sold by <span className="font-semibold text-[#006B5A]">{product.vendor?.business_name}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
