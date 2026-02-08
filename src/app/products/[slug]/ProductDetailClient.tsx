/**
 * London's Imports - Product Detail Client Component
 * Handles interactivity: Add to Cart, Quantity, Rating
 */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/stores/cartStore';
import Image from 'next/image';
import ShareButton from '@/components/ShareButton';
import StarRating from '@/components/StarRating';
import { getImageUrl } from '@/lib/image';
import StickyMobileCart from '@/components/StickyMobileCart';
import { ChevronDown } from 'lucide-react';

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
    category?: { name: string };
    origin_country?: string;
    delivery_window_text?: string;
    video?: string;
    video_url?: string;
    vendor?: { business_name: string };
    preorder_status?: string;
    variants?: Variant[];
}

interface Variant {
    id: string;
    name: string;
    price: number;
    stock_quantity: number;
}

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
    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

    // Reset selection when product changes
    useEffect(() => {
        setSelectedSize('');
        setSelectedColor('');
        setSelectedVariant(null);
    }, [initialProduct]);

    // CSR State
    const [product, setProduct] = useState(initialProduct);
    const [isLoading, setIsLoading] = useState(!initialProduct);
    const [error, setError] = useState(false);

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

    const [displayedImage, setDisplayedImage] = useState<string | null>(null);

    // Ref for the main CTA section to trigger the sticky bar
    const [ctaRef, setCtaRef] = useState<HTMLDivElement | null>(null);

    useEffect(() => {
        if (product) {
            setDisplayedImage(getImageUrl(product.image));
        }
    }, [product]);

    // Gather all images: Main + Extras
    const allImages = product ? [
        { id: 'main', image: product.image, alt: product.name },
        ...(product.images || []).map((img: ProductImage) => ({
            id: img.id,
            image: img.image,
            alt: img.alt_text || product.name
        }))
    ].filter(img => img.image) : [];

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
        // Validation for variants
        if (product.variants && product.variants.length > 0 && !selectedVariant) {
            alert('Please select an option');
            return;
        }
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
            await addToCart(product, quantity, selectedSize || selectedVariant?.name, selectedColor, selectedVariant);
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
                        <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm transition-all duration-300">
                            <Image
                                src={currentImage}
                                alt={`${product.name} - China Import to Ghana`}
                                fill
                                className="object-contain drop-shadow-2xl"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority
                            />
                        </div>

                        {/* Gallery Thumbnails */}
                        {allImages.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x">
                                {allImages.map((img) => {
                                    const imgUrl = getImageUrl(img.image);
                                    const isSelected = currentImage === imgUrl;
                                    return (
                                        <button
                                            key={img.id}
                                            onClick={() => setDisplayedImage(imgUrl)}
                                            aria-label={`View image of ${img.alt || product.name}`}
                                            className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-200 snap-start
                                                ${isSelected ? 'border-pink-600 ring-2 ring-pink-100 scale-105' : 'border-gray-200 hover:border-gray-300 opacity-80 hover:opacity-100'}
                                            `}
                                        >
                                            <Image
                                                src={imgUrl}
                                                alt={img.alt}
                                                fill
                                                className="object-cover"
                                                sizes="80px"
                                            />
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {/* Product Specs Row - below image */}
                        <div className="flex justify-center gap-8 mt-4 pt-4 border-t border-gray-100">
                            <div className="flex flex-col items-center text-center">
                                <svg className={`w-7 h-7 mb-2 ${product.preorder_status === 'READY_TO_SHIP' ? 'text-green-600' : 'text-[#006B5A]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={product.preorder_status === 'READY_TO_SHIP' ? "M5 13l4 4L19 7" : "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"} />
                                </svg>
                                <span className="text-sm font-bold text-gray-900">
                                    {product.preorder_status === 'READY_TO_SHIP' ? 'Ships within 24h' : product.delivery_window_text}
                                </span>
                                <span className="text-xs text-gray-500">Delivery</span>
                            </div>

                            <div className="flex flex-col items-center text-center">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center mb-2 ${product.preorder_status === 'READY_TO_SHIP' ? 'bg-green-600' : 'bg-[#006B5A]'}`}>
                                    <span className="text-white text-[10px] font-bold">{product.preorder_status === 'READY_TO_SHIP' ? 'NOW' : 'PRE'}</span>
                                </div>
                                <span className="text-sm font-bold text-gray-900">{product.category?.name}</span>
                                <span className="text-xs text-gray-500">Category</span>
                            </div>

                            {/* Show Reserved only if not fully available or if we want social proof? Maybe hide for available items to reduce clutter? */}
                            {/* User requested differentiation, so let's keep it clean for Available Items unless high demand */}
                            {product.reservations_count > 0 && product.preorder_status !== 'READY_TO_SHIP' && (
                                <div className="flex flex-col items-center text-center">
                                    <svg className="w-7 h-7 text-[#F5A623] mb-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-sm font-bold text-gray-900">{product.reservations_count}+</span>
                                    <span className="text-xs text-gray-500">Reserved</span>
                                </div>
                            )}

                            {/* Stock Count for Ready Items */}
                            {product.preorder_status === 'READY_TO_SHIP' && (
                                <div className="flex flex-col items-center text-center">
                                    <svg className="w-7 h-7 text-green-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-sm font-bold text-gray-900">In Stock</span>
                                    <span className="text-xs text-gray-500">Available</span>
                                </div>
                            )}
                        </div>

                        {/* Video Section */}
                        {(product.video || product.video_url) && (
                            <div className="mt-8">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Product Video</h3>
                                <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-lg">
                                    {product.video ? (
                                        <video
                                            controls
                                            className="w-full h-full object-cover"
                                            poster={currentImage} // Use current displayed image as poster
                                        >
                                            <source src={product.video} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    ) : product.video_url ? (
                                        <iframe
                                            src={product.video_url.replace('watch?v=', 'embed/').split('&')[0]}
                                            title={product.name}
                                            className="w-full h-full"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    ) : null}
                                </div>
                            </div>
                        )}
                    </div>

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
                        <div className="mb-6 relative">
                            <span className="text-3xl lg:text-4xl font-bold text-gray-900">
                                GHS {selectedVariant
                                    ? selectedVariant.price.toLocaleString()
                                    : (product.variants && product.variants.length > 0
                                        ? `From ${Math.min(...product.variants.map(v => v.price)).toLocaleString()}`
                                        : product.price?.toLocaleString())}
                            </span>
                        </div>

                        {/* Variant Selectors: Premium Dropdowns */}
                        <div className="space-y-6 mb-8">
                            {/* Advanced Variants (Price differentiation) */}
                            {product.variants && product.variants.length > 0 && (
                                <PriceVariantDropdown
                                    label="Select Option"
                                    variants={product.variants}
                                    selected={selectedVariant}
                                    onSelect={setSelectedVariant}
                                />
                            )}

                            {/* Legacy Options (if no advanced variants) */}
                            {product.available_colors && product.available_colors.length > 0 && (
                                <VariantDropdown
                                    label="Color"
                                    options={product.available_colors}
                                    selected={selectedColor}
                                    onSelect={setSelectedColor}
                                />
                            )}

                            {product.available_sizes && product.available_sizes.length > 0 && (
                                <VariantDropdown
                                    label="Size"
                                    options={product.available_sizes}
                                    selected={selectedSize}
                                    onSelect={setSelectedSize}
                                />
                            )}
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

            {/* Sticky Mobile Cart - Renders only when main CTA is scrolled past */}
            <StickyMobileCart
                product={product}
                isAdding={isAdding}
                onAddToCart={handleAddToCart}
                triggerRef={{ current: ctaRef }}
            />
        </div>
    );
}

function VariantDropdown({ label, options, selected, onSelect }: { label: string, options: string[], selected: string, onSelect: (val: string) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    // Helper to clean accidental parentheses from user input (e.g. "( Green")
    const clean = (text: string) => text.replace(/[()]/g, '').trim();

    return (
        <div className="relative w-full sm:max-w-xs">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                {label}
            </label>
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all hover:border-gray-300 shadow-sm"
                >
                    <span className={`block truncate ${selected ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                        {selected ? clean(selected) : `Select ${label}`}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                        <div className="absolute z-20 mt-2 w-full bg-white shadow-xl max-h-60 rounded-xl py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm animate-in fade-in zoom-in-95 duration-100 border border-gray-100">
                            {options.map((option) => (
                                <button
                                    key={option}
                                    onClick={() => {
                                        onSelect(option);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full text-left cursor-pointer px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0
                                        ${selected === option ? 'bg-pink-50 text-pink-700 font-semibold' : 'text-gray-700'}
                                    `}
                                >
                                    {clean(option)}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

function PriceVariantDropdown({ label, variants, selected, onSelect }: { label: string, variants: Variant[], selected: Variant | null, onSelect: (val: Variant) => void }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative w-full sm:max-w-xs">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                {label}
            </label>
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all hover:border-gray-300 shadow-sm"
                >
                    <span className={`block truncate ${!selected ? 'text-gray-400' : 'text-gray-900 font-medium'}`}>
                        {selected ? `${selected.name} - GH₵${selected.price.toLocaleString()}` : 'Select an option'}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                        <svg className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </span>
                </button>

                {isOpen && (
                    <div className="absolute z-50 mt-1 w-full bg-white shadow-xl max-h-60 rounded-xl py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm animate-in fade-in zoom-in-95 duration-100">
                        {variants.map((variant) => (
                            <button
                                key={variant.id}
                                onClick={() => {
                                    onSelect(variant);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left cursor-pointer select-none relative py-3 pl-4 pr-9 hover:bg-pink-50 transition-colors
                                    ${selected?.id === variant.id ? 'text-pink-900 bg-pink-50 font-medium' : 'text-gray-900'}
                                `}
                            >
                                <div className="flex justify-between">
                                    <span className="block truncate">{variant.name}</span>
                                    <span className="block truncate text-gray-500">GH₵{variant.price.toLocaleString()}</span>
                                </div>

                                {selected?.id === variant.id && (
                                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-pink-600">
                                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            {/* Overlay to close when clicking outside */}
            {isOpen && (
                <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
            )}
        </div>
    );
}
