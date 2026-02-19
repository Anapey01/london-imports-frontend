/**
 * London's Imports - Product Detail Client Component
 * Handles interactivity: Add to Cart, Quantity, Rating
 */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/stores/cartStore';
import dynamic from 'next/dynamic';
import ShareButton from '@/components/ShareButton';
import StarRating from '@/components/StarRating';
import { getImageUrl } from '@/lib/image';
import StickyMobileCart from '@/components/StickyMobileCart';
import VariantDropdown from '@/components/VariantDropdown';
import ProductImageGallery from '@/components/product/ProductImageGallery';

// Lazy Load components to improve initial page load performance
const RelatedProducts = dynamic(() => import('@/components/RelatedProducts'), {
    loading: () => <div className="h-96 w-full bg-gray-50 animate-pulse rounded-xl my-12" />
});
const RecentlyViewed = dynamic(() => import('@/components/RecentlyViewed'), {
    loading: () => <div className="h-48 w-full bg-gray-50 animate-pulse rounded-xl my-12" />
});

interface ProductImage {
    id: string;
    image: string;
    alt_text?: string;
}

interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    description: string;
    image: string;
    images?: ProductImage[];
    rating?: number;
    reservations_count: number;
    available_colors?: string[];
    available_sizes?: string[];
    category?: { name: string; slug?: string };
    origin_country?: string;
    delivery_window_text?: string;
    video?: string;
    video_url?: string;
    vendor?: { business_name: string };
    preorder_status?: string;
    variants?: { name: string; price: number }[];
    target_quantity?: number;
}

import { GroupBuyProgress } from '@/components/GroupBuyProgress';

interface ProductDetailClientProps {
    initialProduct: Product | null;
    slug: string;
}

export default function ProductDetailClient({ initialProduct, slug }: ProductDetailClientProps) {
    const router = useRouter();
    const [quantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [product, setProduct] = useState(initialProduct);
    const [isLoading, setIsLoading] = useState(!initialProduct);
    const [error, setError] = useState(false);

    // Image state moved here to control from parent if needed, but mostly passed to Gallery
    const [displayedImage, setDisplayedImage] = useState<string | null>(null);

    // Reset selection when product changes
    useEffect(() => {
        setSelectedSize('');
        setSelectedColor('');
        setDisplayedImage(null);
    }, [initialProduct]);

    // Derived state for price display
    const [currentPrice, setCurrentPrice] = useState(initialProduct?.price || 0);

    // Update price when variants are selected
    useEffect(() => {
        if (!product) return;

        // Reset to base price first
        let newPrice = Number(product.price);

        if (product.variants && product.variants.length > 0) {
            // Try to find matching variant
            // Logic matches backend: 
            // 1. Exact Size
            // 2. Exact Color
            // 3. Size + Color combo

            let matchingVariant = null;

            if (selectedSize) {
                matchingVariant = product.variants.find(v => v.name.toLowerCase() === selectedSize.toLowerCase());
            }

            if (!matchingVariant && selectedColor) {
                matchingVariant = product.variants.find(v => v.name.toLowerCase() === selectedColor.toLowerCase());
            }

            if (!matchingVariant && selectedSize && selectedColor) {
                const combo1 = `${selectedColor} ${selectedSize}`.toLowerCase();
                const combo2 = `${selectedSize} ${selectedColor}`.toLowerCase();
                matchingVariant = product.variants.find(v =>
                    v.name.toLowerCase() === combo1 || v.name.toLowerCase() === combo2
                );
            }

            if (matchingVariant) {
                newPrice = Number(matchingVariant.price);
            }
        }

        setCurrentPrice(newPrice);
    }, [product, selectedSize, selectedColor]);

    const { addToCart } = useCartStore();

    // Client-side fetch to ensure fresh data (e.g. reservation counts)
    useEffect(() => {
        if (slug) {
            // If we don't have initial product, show loading. If we do, just update in background.
            if (!initialProduct) setIsLoading(true);

            const fetchProduct = async () => {
                try {
                    const API_BASE = 'https://london-imports-api.onrender.com/api/v1';
                    // Add timestamp to prevent browser caching
                    const res = await fetch(`${API_BASE}/products/${slug}/?t=${Date.now()}`);
                    if (!res.ok) throw new Error('Failed to fetch');
                    const data = await res.json();
                    setProduct(data);
                    // Ensure price updates if new data loads
                    setCurrentPrice(Number(data.price));
                } catch (e) {
                    console.error("CSR Fetch Error", e);
                    if (!initialProduct) setError(true);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchProduct();
        }
    }, [initialProduct, slug]);

    // Ref for the main CTA section to trigger the sticky bar
    const [ctaRef, setCtaRef] = useState<HTMLDivElement | null>(null);

    useEffect(() => {
        if (product) {
            setDisplayedImage(getImageUrl(product.image));

            // ADDED: Save to Recently Viewed
            try {
                const stored = localStorage.getItem('recently_viewed');
                let history: Product[] = stored ? JSON.parse(stored) : [];

                // Remove if duplicate (so we can move it to top)
                history = history.filter(p => p.slug !== product.slug);

                // Add current to top
                history.unshift(product);

                // Limit to 10
                if (history.length > 10) history.pop();

                localStorage.setItem('recently_viewed', JSON.stringify(history));
            } catch (e) {
                console.error("Failed to save recently viewed", e);
            }
        }
    }, [product]);

    const currentImage = displayedImage || getImageUrl(product?.image);

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

    const handleAddToCart = async () => {
        // Validation for variants
        if (product.available_sizes && product.available_sizes.length > 0 && !selectedSize) {
            alert('Please select a size');
            return;
        }
        if (product.available_colors && product.available_colors.length > 0 && !selectedColor) {
            alert('Please select a color');
            return;
        }

        setIsAdding(true);
        try {
            await addToCart(product, quantity, selectedSize, selectedColor);
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

                    {/* LEFT COLUMN: Product Image Gallery */}
                    <ProductImageGallery
                        mainImage={product.image}
                        productName={product.name}
                        images={product.images}
                        video={product.video}
                        videoUrl={product.video_url}
                        currentImage={currentImage}
                        onImageSelect={setDisplayedImage}
                        preorderStatus={product.preorder_status}
                        deliveryWindowText={product.delivery_window_text}
                        categoryName={product.category?.name}
                        reservationsCount={product.reservations_count}
                    />

                    {/* RIGHT COLUMN: Product Info */}
                    <div>
                        {/* Title */}
                        <div className="flex items-start justify-between gap-4 mb-4">
                            <h1 className="text-3xl lg:text-5xl font-bold text-[#006B5A] leading-tight">
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
                                {product.preorder_status === 'READY_TO_SHIP' ? 'Ready to Ship' : `${product.reservations_count || 0} Pre-orders (minus shipping fees)`}
                            </span>
                        </div>

                        {/* Price - Always Visible */}
                        <div className="mb-4 relative">
                            <span className="text-3xl lg:text-4xl font-bold text-gray-900">
                                GHS {currentPrice.toLocaleString()}
                            </span>
                        </div>

                        {/* Progress Tracker (Detailed) */}
                        <div className="mb-8 p-4 bg-accent-50 rounded-2xl border border-accent-100">
                            <GroupBuyProgress
                                current={product.reservations_count || 0}
                                target={product.target_quantity || 10}
                                variant="detailed"
                            />
                        </div>

                        {/* Variant Selectors: Premium Dropdowns */}
                        <div className="space-y-6 mb-8">
                            {/* Color Dropdown */}
                            {product.available_colors && product.available_colors.length > 0 && (
                                <VariantDropdown
                                    label="Color"
                                    options={product.available_colors}
                                    selected={selectedColor}
                                    onSelect={setSelectedColor}
                                />
                            )}

                            {/* Size / Variant Dropdown */}
                            {(() => {
                                // Unified logic: Use explicit sizes if available, otherwise fallback to variant names
                                const sizeOptions = (product.available_sizes && product.available_sizes.length > 0)
                                    ? product.available_sizes
                                    : (product.variants?.map(v => v.name) || []);

                                if (sizeOptions.length === 0) return null;

                                return (
                                    <VariantDropdown
                                        label="Option"
                                        options={sizeOptions}
                                        selected={selectedSize}
                                        onSelect={setSelectedSize}
                                    />
                                );
                            })()}
                        </div>

                        {/* Description */}
                        <div className="mb-8">
                            <p className="text-gray-700 leading-relaxed text-base lg:text-lg">
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

                        {/* CTA Section - Responsive */}
                        <div
                            ref={setCtaRef}
                            className="flex items-center gap-2 sm:gap-4"
                        >
                            {/* Add to cart icon button */}
                            <button
                                onClick={handleAddToCart}
                                disabled={isAdding}
                                className="flex flex-col items-center gap-1 px-3 sm:px-4 py-2 text-gray-600 hover:text-pink-600 transition-colors min-w-[60px]"
                                aria-label="Add to cart"
                            >
                                <div className="relative">
                                    <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    {/* Plus badge */}
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-gray-700 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                        +
                                    </span>
                                </div>
                                <span className="text-[10px] sm:text-xs whitespace-nowrap">Add to cart</span>
                            </button>

                            {/* Chat now button */}
                            <a
                                href="/contact"
                                className="flex-1 py-3 px-4 sm:px-6 font-semibold text-center text-sm sm:text-base border-2 border-gray-800 text-gray-800 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                Chat now
                            </a>

                            {/* Start order button */}
                            <button
                                onClick={handleAddToCart}
                                disabled={isAdding || (product.preorder_status === 'SOLD_OUT')}
                                className={`flex-1 py-3 px-4 sm:px-6 font-semibold text-center text-sm sm:text-base ${product.preorder_status === 'READY_TO_SHIP' ? 'bg-pink-600 hover:bg-pink-700' : 'bg-orange-500 hover:bg-orange-600'} text-white rounded-full transition-colors disabled:opacity-50`}
                            >
                                {product.preorder_status === 'READY_TO_SHIP' ? 'Buy Now' : 'Start Order'}
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

            {/* Related Products Section (Lazy Loaded) */}
            <RelatedProducts
                currentSlug={product.slug}
                categorySlug={product.category?.slug}
            />

            {/* Recently Viewed Section (Lazy Loaded) */}
            <RecentlyViewed />

            {/* Sticky Mobile Cart */}
            <StickyMobileCart
                product={product}
                isAdding={isAdding}
                onAddToCart={handleAddToCart}
                triggerRef={{ current: ctaRef }}
            />
        </div>
    );
}

