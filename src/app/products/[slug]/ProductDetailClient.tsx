/**
 * London's Imports - Product Detail Client Component
 * Handles interactivity: Add to Cart, Quantity, Rating
 */
'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/stores/cartStore';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import ShareButton from '@/components/ShareButton';
import StarRating from '@/components/StarRating';
import { getImageUrl } from '@/lib/image';
import StickyMobileCart from '@/components/StickyMobileCart';
import VariantSelector from '@/components/product/VariantSelector';
import ProductImageGallery from '@/components/product/ProductImageGallery';
import { MessageCircle, ShoppingBag, Zap, Send } from 'lucide-react';
import { formatPrice } from '@/lib/format';
import { trackViewItem, trackAddToCart } from '@/lib/analytics';
import { toast } from 'react-hot-toast';
import { GroupBuyProgress } from '@/components/GroupBuyProgress';
import { siteConfig } from '@/config/site';

// Lazy Load components to improve initial page load performance
const RelatedProducts = dynamic(() => import('@/components/RelatedProducts'), {
    loading: () => <div className="h-96 w-full bg-gray-50 animate-pulse rounded-xl my-12" />
});
const RecentlyViewed = dynamic(() => import('@/components/RecentlyViewed'), {
    loading: () => <div className="h-48 w-full bg-gray-50 animate-pulse rounded-xl my-12" />
});
const ProductReviews = dynamic(() => import('@/components/product/ProductReviews'), {
    loading: () => <div className="h-96 w-full bg-gray-50 animate-pulse rounded-xl my-12" />
});

interface Review {
    id: string;
    user_name: string;
    rating: number;
    comment: string;
    is_verified: boolean;
    created_at: string;
}

interface ProductImage {
    id: string;
    image: string;
    alt_text?: string;
}

interface ProductVariant {
    id: string;
    name: string;
    price: string;
    sku?: string;
    stock_quantity: number;
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
    variants?: ProductVariant[];
    stock_quantity: number;
    target_quantity?: number;
    rating_count?: number;
    reviews?: Review[];
}

interface ProductDetailClientProps {
    initialProduct: Product | null;
    slug: string;
}

export default function ProductDetailClient({ initialProduct, slug }: ProductDetailClientProps) {
    const router = useRouter();
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);
    const [isBuyingNow, setIsBuyingNow] = useState(false);
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [product, setProduct] = useState(initialProduct);
    const [isLoading, setIsLoading] = useState(!initialProduct);
    const [error, setError] = useState(false);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

    // Image state moved here to control from parent if needed, but mostly passed to Gallery
    const [displayedImage, setDisplayedImage] = useState<string | null>(null);

    // Track last tracked product to prevent duplicate GA4 events
    const lastTrackedSlug = useRef<string | null>(null);

    // Reset selection when product changes
    useEffect(() => {
        setSelectedSize('');
        setSelectedColor('');
        setDisplayedImage(null);
    }, [initialProduct]);

    // Derived state for price and stock
    const [currentPrice, setCurrentPrice] = useState(initialProduct?.price || 0);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

    const currentStock = useMemo(() => {
        if (selectedVariant) return selectedVariant.stock_quantity;
        return product?.stock_quantity ?? 0;
    }, [product, selectedVariant]);

    const isSoldOut = useMemo(() => {
        if (product?.preorder_status === 'SOLD_OUT') return true;
        
        // Only enforce strict stock if explicitly READY_TO_SHIP
        // For pre-orders (DROPS, SOURCING), we allow infinite sales until status is changed
        if (product?.preorder_status === 'READY_TO_SHIP') {
            return currentStock <= 0;
        }
        
        return false;
    }, [product, currentStock]);

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
                setSelectedVariant(matchingVariant as unknown as ProductVariant);
            } else {
                setSelectedVariant(null);
            }
        } else {
            setSelectedVariant(null);
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
                    const API_BASE = siteConfig.apiUrl;
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
            
            // Deduplicate GA4 tracking
            if (lastTrackedSlug.current !== product.slug) {
                trackViewItem(product);
                lastTrackedSlug.current = product.slug;
            }

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
            toast.error('Please select a size');
            return;
        }
        if (product.available_colors && product.available_colors.length > 0 && !selectedColor) {
            toast.error('Please select a color');
            return;
        }

        setIsAdding(true);
        try {
            await addToCart(product, quantity, selectedSize, selectedColor, selectedVariant || undefined);
            trackAddToCart(product, quantity);
            toast.success(`Added ${quantity}x ${product.name} to cart`);
            router.push('/cart');
        } catch (e: unknown) {
            console.error("Add to Cart Failed:", e);
            let errorMessage = "Failed to add to cart. Please try again.";
            if (e && typeof e === 'object' && 'response' in e) {
                const axiosError = e as { response?: { data?: { error?: string } } };
                console.error("Backend Error Details:", axiosError.response?.data);
                errorMessage = axiosError.response?.data?.error || errorMessage;
            }
            toast.error(errorMessage);
        } finally {
            setIsAdding(false);
        }
    };

    const handleBuyNow = async () => {
        // Validation for variants
        if (product.available_sizes && product.available_sizes.length > 0 && !selectedSize) {
            alert('Please select a size');
            return;
        }
        if (product.available_colors && product.available_colors.length > 0 && !selectedColor) {
            alert('Please select a color');
            return;
        }

        setIsBuyingNow(true);
        try {
            // First add to cart, then go directly to checkout
            await addToCart(product, quantity, selectedSize, selectedColor, selectedVariant || undefined);
            trackAddToCart(product, quantity);
            toast.success(`Proceeding to checkout`);
            
            // Encode selection into URL for checkout to identify the focus product
            const params = new URLSearchParams({
                buyNow: product.slug,
            });
            router.push(`/checkout?${params.toString()}`);
        } catch (e: unknown) {
            console.error(e);
            let errorMessage = "Something went wrong. Please try again.";
             if (e && typeof e === 'object' && 'response' in e) {
                const axiosError = e as { response?: { data?: { error?: string } } };
                errorMessage = axiosError.response?.data?.error || errorMessage;
            }
            toast.error(errorMessage);
        } finally {
            setIsBuyingNow(false);
        }
    };

    return (
        <div className="bg-white min-h-screen pb-20">
            <main className="max-w-7xl mx-auto px-4 py-4 sm:py-8 sm:px-6 lg:px-8">
                {/* Visual Breadcrumbs for SEO and Navigation */}
                <nav className="flex items-center text-xs sm:text-sm text-gray-500 mb-6 overflow-x-auto whitespace-nowrap scrollbar-hide py-2">
                    <Link href="/" className="hover:text-pink-600 transition-colors flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001-1m-6 0h6" />
                        </svg>
                        Home
                    </Link>
                    <svg className="w-4 h-4 mx-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <Link href="/products" className="hover:text-pink-600 transition-colors">
                        Products
                    </Link>
                    {product.category && (
                        <>
                            <svg className="w-4 h-4 mx-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            <Link 
                                href={`/products/category/${product.category.slug || ''}`} 
                                className="hover:text-pink-600 transition-colors"
                            >
                                {product.category.name}
                            </Link>
                        </>
                    )}
                    <svg className="w-4 h-4 mx-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="text-gray-900 font-semibold truncate max-w-[150px] sm:max-w-none">
                        {product.name}
                    </span>
                </nav>

                {/* Two Column Grid: Image Left, Details Right */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

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

                    {/* RIGHT COLUMN: Product Info/Selection (Mastered Architecture) */}
                    <div className="flex flex-col gap-10 flex-1">
                        {/* High-Fidelity Header Section */}
                        <div className="space-y-8">
                            <h1 className="text-3xl lg:text-5xl font-black text-slate-900 leading-none tracking-tighter uppercase break-words">
                                {product.name}
                            </h1>
                            
                            {/* Impact Price & Rating Row */}
                            <div className="flex items-center flex-wrap gap-6 pt-2">
                                <span className="text-4xl lg:text-6xl font-black text-[#006B5A] tracking-tighter tabular-nums leading-none">
                                    {formatPrice(currentPrice)}
                                </span>
                                
                                <button 
                                    onClick={() => {
                                        const reviewsSection = document.getElementById('reviews');
                                        if (reviewsSection) {
                                            reviewsSection.scrollIntoView({ behavior: 'smooth' });
                                        }
                                    }}
                                    className="flex items-center gap-3 py-2 hover:opacity-80 transition-all group/rating"
                                >
                                    <StarRating initialRating={Number(product.rating ?? 0)} readOnly size="sm" />
                                    <span className="text-xs font-black text-slate-400 tabular-nums pb-0.5">
                                        {Number(product.rating ?? 0).toFixed(1)}
                                    </span>
                                </button>
                                
                                <div className="ml-auto hidden sm:block">
                                    <ShareButton
                                        title={product.name}
                                        url={`${siteConfig.baseUrl}/products/${slug}`}
                                        className="shrink-0"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Batch Progress - Micro Ledger */}
                        <GroupBuyProgress
                            current={product.reservations_count || 0}
                            target={product.target_quantity || 100}
                            variant="compact"
                        />

                        {/* Selection Phase: Side-by-Side Variants */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {product.available_colors && product.available_colors.length > 0 && (
                                <VariantSelector
                                    label="Color"
                                    options={product.available_colors}
                                    selected={selectedColor}
                                    onSelect={setSelectedColor}
                                />
                            )}

                            {(() => {
                                const sizeOptions = (product.available_sizes && product.available_sizes.length > 0)
                                    ? product.available_sizes
                                    : (product.variants?.map(v => v.name) || []);
                                if (sizeOptions.length === 0) return null;
                                return (
                                    <VariantSelector
                                        label="Option"
                                        options={sizeOptions}
                                        selected={selectedSize}
                                        onSelect={setSelectedSize}
                                    />
                                );
                            })()}
                        </div>

                        {/* Action Phase: Qty & CTAs - Floating Iconic Refinement */}
                        <div className="flex flex-col sm:flex-row items-end gap-10 mt-6">
                            <div className="w-full sm:w-32">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Quantity</p>
                                <div className="flex items-center h-11 w-full">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="flex-1 h-full flex items-center justify-center text-slate-300 hover:text-slate-900 transition-all duration-500"
                                        aria-label="Decrease quantity"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 12H4"/></svg>
                                    </button>
                                    <span className="w-10 text-center font-bold text-slate-900 text-xs tracking-tighter">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(99, quantity + 1))}
                                        className="flex-1 h-full flex items-center justify-center text-slate-300 hover:text-slate-900 transition-all duration-500"
                                        aria-label="Increase quantity"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v16m8-8H4"/></svg>
                                    </button>
                                </div>
                            </div>
                            
                            <div 
                                ref={setCtaRef}
                                className="flex-1 flex items-center gap-10 w-full h-11"
                            >
                                <button
                                    onClick={handleAddToCart}
                                    disabled={isAdding || isSoldOut}
                                    className="w-11 h-11 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all duration-500 group/cart"
                                    aria-label="Add to cart"
                                >
                                    <ShoppingBag className="w-5 h-5 group-hover/cart:scale-110 transition-transform" strokeWidth={1} />
                                </button>
                                <a
                                    href="/contact"
                                    className="flex items-center gap-3 h-11 px-0 text-slate-400 hover:text-slate-900 transition-all duration-500 group/chat"
                                    aria-label="Enquire about this product"
                                >
                                    <MessageCircle className="w-5 h-5 group-hover/chat:scale-110 transition-transform" strokeWidth={1} />
                                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase">
                                        Enquire
                                    </span>
                                </a>
                                <button
                                    onClick={product.preorder_status === 'READY_TO_SHIP' ? handleBuyNow : handleAddToCart}
                                    disabled={isAdding || isBuyingNow || isSoldOut}
                                    className={`flex-[3] h-full flex items-center justify-center transition-all duration-500 group/order`}
                                    aria-label={isSoldOut ? "Sold Out" : (product.preorder_status === 'READY_TO_SHIP' ? "Buy Now" : "Start Order")}
                                >
                                    {isSoldOut ? (
                                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-300">Sold Out</span>
                                    ) : (isBuyingNow || isAdding) ? (
                                        <span className="w-5 h-5 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
                                    ) : (
                                        <div className="flex items-center gap-4 relative">
                                            {product.preorder_status === 'READY_TO_SHIP' ? (
                                                <Zap className="w-5 h-5 text-pink-600 group-hover/order:scale-110 transition-transform" strokeWidth={2} fill="currentColor" />
                                            ) : (
                                                <Send className="w-4 h-4 text-[#006B5A] group-hover/order:rotate-12 transition-transform" strokeWidth={1.5} />
                                            )}
                                            <span className={`text-[10px] font-bold uppercase tracking-[0.3em] ${product.preorder_status === 'READY_TO_SHIP' ? 'text-pink-600' : 'text-[#006B5A]'}`}>
                                                {product.preorder_status === 'READY_TO_SHIP' ? 'Buy Now' : 'Start Order'}
                                            </span>
                                            <div className={`absolute -bottom-1 left-0 right-0 h-[1px] ${product.preorder_status === 'READY_TO_SHIP' ? 'bg-pink-600/30' : 'bg-[#006B5A]/30'} scale-x-0 group-hover/order:scale-x-100 transition-transform origin-left`} />
                                        </div>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Description - Precision Collapsible */}
                        <div className="mt-12 mb-8 group/desc">
                            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-4">Description</h2>
                            <div className={`relative transition-all duration-700 ease-in-out overflow-hidden ${isDescriptionExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-6 opacity-80'}`}>
                                <p className="text-slate-600 leading-relaxed text-sm select-none">
                                    {product.description}
                                </p>
                                {!isDescriptionExpanded && (
                                    <div className="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-t from-white via-white/40 to-transparent pointer-events-none" />
                                )}
                            </div>
                            <button
                                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                                className="mt-4 text-[10px] font-bold text-[#006B5A] uppercase tracking-[0.2em] hover:opacity-70 transition-all flex items-center gap-2 group/btn"
                            >
                                <span>{isDescriptionExpanded ? 'Collapse Description' : 'Read Full Description'}</span>
                                <svg className={`w-3 h-3 transition-transform duration-500 ${isDescriptionExpanded ? 'rotate-180' : 'group-hover/btn:translate-y-0.5'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>

                        {/* Trust & Product Details - Curated Horizontal Row */}
                        <div className="mb-0 bg-white/50 p-6 rounded-2xl border border-slate-100/50">
                            <div className="flex flex-wrap items-center gap-x-12 gap-y-6">
                                {/* Product Type/Category */}
                                <div className="flex items-center gap-3 group">
                                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 group-hover:text-slate-900 transition-colors duration-300">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-[8px] text-slate-400 uppercase tracking-[0.3em] mb-0.5">Product Type</p>
                                        <p className="text-slate-900 font-bold text-[11px] uppercase tracking-wide">{product.category?.name}</p>
                                    </div>
                                </div>

                                {/* Origin Country */}
                                <div className="flex items-center gap-3 group">
                                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 group-hover:text-slate-900 transition-colors duration-300">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-[8px] text-slate-400 uppercase tracking-[0.3em] mb-0.5">Origin</p>
                                        <p className="text-slate-900 font-bold text-[11px] uppercase tracking-wide">{product.origin_country || 'China'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Trust Badges - MOMO & VERIFIED (Forced Horizontal Row) */}
                            <div className="flex flex-row items-center gap-6 sm:gap-12 mt-8 pt-6 border-t border-slate-100/80 overflow-x-auto no-scrollbar whitespace-nowrap">
                                <div className="flex items-center gap-3 group/badge shrink-0">
                                    <div className="w-5 h-5 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-slate-400 group-hover/badge:text-emerald-500 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="text-[8px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em]">Verified by London&apos;s</span>
                                </div>
                                <div className="flex items-center gap-3 group/badge shrink-0">
                                    <div className="w-5 h-5 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-slate-400 group-hover/badge:text-blue-500 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" />
                                        </svg>
                                    </div>
                                    <span className="text-[8px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em]">Secured by MOMO</span>
                                </div>
                            </div>
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

            <ProductReviews
                productSlug={product.slug}
                initialReviews={product.reviews || []}
                rating={product.rating || 0}
                ratingCount={product.rating_count || 0}
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

