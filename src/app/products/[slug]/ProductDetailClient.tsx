/**
 * London's Imports - Product Detail Client Component
 * Handles interactivity: Add to Cart, Quantity, Rating
 */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import ShareButton from '@/components/ShareButton';
import StarRating from '@/components/StarRating';
import { getImageUrl } from '@/lib/image';

interface ProductDetailClientProps {
    initialProduct: any;
    slug: string;
}

export default function ProductDetailClient({ initialProduct, slug }: ProductDetailClientProps) {
    const router = useRouter();
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);

    // CSR State
    const [product, setProduct] = useState(initialProduct);
    const [isLoading, setIsLoading] = useState(!initialProduct);
    const [error, setError] = useState(false);

    const { addToCart } = useCartStore();
    const { isAuthenticated } = useAuthStore();

    // Client-side fetch if SSR failed
    useEffect(() => {
        if (!initialProduct && slug) {
            setIsLoading(true);
            const fetchProduct = async () => {
                try {
                    // Use the same hardcoded URL logic as fetchers.ts but for client
                    const API_BASE = 'https://london-imports-api.onrender.com/api/v1';
                    const res = await fetch(`${API_BASE}/products/${slug}/`);
                    if (!res.ok) throw new Error('Failed to fetch');
                    const data = await res.json();
                    setProduct(data);
                } catch (e) {
                    console.error("CSR Fetch Error", e);
                    setError(true);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchProduct();
        }
    }, [initialProduct, slug]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
                <p className="text-gray-600 mb-6">Could not load product details. Please try again.</p>
                <button onClick={() => window.location.reload()} className="bg-pink-600 text-white px-6 py-2 rounded-full">Retry</button>
            </div>
        );
    }

    const imageUrl = getImageUrl(product.image);

    const handleAddToCart = async () => {
        setIsAdding(true);
        try {
            await addToCart(product.id, quantity);
            router.push('/cart');
        } catch (e) {
            console.error(e);
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <div className="bg-white min-h-screen pb-20">
            <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Two Column Grid: Image Left, Details Right */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

                    {/* LEFT COLUMN: Product Image */}
                    <div className="space-y-6">
                        {/* Main Image - directly on cream background */}
                        <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
                            <img
                                src={imageUrl}
                                alt={`${product.name} - China Import to Ghana`}
                                className="w-full h-full object-contain drop-shadow-2xl"
                            />
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
                            <StarRating
                                initialRating={Number(product.rating ?? 0)}
                                readOnly={true}
                                size="md"
                            />
                            <span className="text-sm text-gray-600 font-medium">
                                {Number(product.rating ?? 0).toFixed(1)}
                                <span className="mx-1.5 text-gray-300">|</span>
                                {product.reservations_count || 0} Pre-orders
                            </span>
                        </div>

                        {/* Price - Always Visible */}
                        <div className="mb-6 relative">
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
                                    <p className="text-gray-900 font-semibold">{product.origin_country || 'China'}</p>
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
                                disabled={isAdding || (product.preorder_status === 'SOLD_OUT')}
                                className={`flex-1 py-4 px-8 font-bold text-lg rounded-full transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${isAuthenticated
                                    ? "bg-[#F5A623] text-[#006B5A] hover:bg-[#E09000]"
                                    : "bg-pink-600 text-white hover:bg-pink-700"
                                    }`}
                            >
                                {isAdding ? 'Adding to Basket...' :
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
            </main>
        </div>
    );
}
