/**
 * London's Imports - Product Detail Client Component
 * Handles interactivity: Add to Cart, Quantity, Rating
 */
'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/stores/cartStore';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import StarRating from '@/components/StarRating';
import { getImageUrl } from '@/lib/image';
import StickyMobileCart from '@/components/StickyMobileCart';
import VariantSelector from '@/components/product/VariantSelector';
import ProductImageGallery from '@/components/product/ProductImageGallery';
import { formatPrice } from '@/lib/format';
import { trackViewItem, trackAddToCart } from '@/lib/analytics';
import { toast } from 'react-hot-toast';
import { GroupBuyProgress } from '@/components/GroupBuyProgress';
import { siteConfig } from '@/config/site';
import { ShoppingBag } from 'lucide-react';

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
                <h2 className="text-2xl font-serif font-bold text-slate-900 mb-2">Product Not Found</h2>
                <p className="text-slate-400 mb-6">Could not load product details. Please try again.</p>
                <button onClick={() => window.location.reload()} className="text-[11px] font-black uppercase tracking-widest border-b border-slate-900 pb-1">Retry View</button>
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
        <div className="bg-white dark:bg-slate-950 min-h-screen pb-20">
            <main className="max-w-7xl mx-auto px-4 py-4 sm:py-8 sm:px-6 lg:px-8">
                {/* Visual Breadcrumbs for SEO and Navigation */}
                <nav className="flex items-center text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300 dark:text-slate-700 mb-12 overflow-x-auto whitespace-nowrap scrollbar-hide py-4 border-b border-slate-50 dark:border-slate-900">
                    <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                        Home
                    </Link>
                    <span className="mx-4 text-slate-100 dark:text-slate-900">/</span>
                    <Link href="/products" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                        Products
                    </Link>
                    {product.category && (
                        <>
                            <span className="mx-4 text-slate-100 dark:text-slate-900">/</span>
                            <Link 
                                href={`/products/category/${product.category.slug || ''}`} 
                                className="hover:text-slate-900 dark:hover:text-white transition-colors"
                            >
                                {product.category.name}
                            </Link>
                        </>
                    )}
                    <span className="mx-4 text-slate-100 dark:text-slate-900">/</span>
                    <span className="text-slate-900 dark:text-white">
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
                    <div className="flex flex-col gap-12 flex-1">
                        {/* 1. Header: Source Serif Authority */}
                        <div className="space-y-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 dark:text-slate-700">Original Product / London&apos;s</span>
                            <h1 className="text-4xl lg:text-7xl font-serif font-bold text-slate-900 dark:text-white leading-[0.95] tracking-tighter">
                                {product.name}
                            </h1>
                            
                            {/* 2. Pricing Architecture (Solid Black) */}
                            <div className="flex items-center flex-wrap gap-8 pt-4">
                                <span className="text-5xl lg:text-7xl font-serif font-bold text-slate-900 dark:text-white tracking-tighter tabular-nums leading-none">
                                    {formatPrice(currentPrice)}
                                </span>
                                
                                <button 
                                    onClick={() => document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="flex items-center gap-3 py-2 hover:opacity-60 transition-all"
                                >
                                    <StarRating initialRating={Number(product.rating ?? 0)} readOnly size="sm" />
                                    <span className="text-[10px] font-black text-slate-200 dark:text-slate-800 tracking-widest tabular-nums pb-0.5">
                                        ({Number(product.rating ?? 0).toFixed(1)})
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Batch Progress - Minimal Line */}
                        <div className="border-y border-slate-50 dark:border-slate-900 py-0">
                            <GroupBuyProgress
                                current={product.reservations_count || 0}
                                target={product.target_quantity || 100}
                                variant="compact"
                            />
                        </div>

                        {/* Selection Phase: Side-by-Side Variants */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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

                        {/* 4. Action Phase: Minimal CTAs */}
                        <div className="flex flex-col sm:flex-row items-end gap-12 border-t border-slate-50 dark:border-slate-900 pt-0">
                            <div className="w-full sm:w-40">
                                <p className="text-[9px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.3em] mb-1 text-center sm:text-left">Quantity</p>
                                <div className="flex items-center h-10 w-full border border-slate-100 dark:border-slate-800 px-4">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="flex-1 h-full flex items-center justify-center text-slate-300 dark:text-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors"
                                        aria-label="Decrease quantity"
                                    >
                                        -
                                    </button>
                                    <span className="w-12 text-center font-bold text-slate-900 dark:text-white text-xs tracking-tighter">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(99, quantity + 1))}
                                        className="flex-1 h-full flex items-center justify-center text-slate-300 dark:text-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors"
                                        aria-label="Increase quantity"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            
                            <div 
                                ref={setCtaRef}
                                className="flex items-center gap-12 mt-0"
                            >
                                <button
                                    onClick={handleAddToCart}
                                    disabled={isAdding || isSoldOut}
                                    className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white border-b border-black dark:border-white pb-1 hover:opacity-60 transition-all disabled:opacity-20"
                                >
                                    {isAdding ? 'Sourcing...' : 'Add to Basket'}
                                </button>
                                
                                <button
                                    onClick={product.preorder_status === 'READY_TO_SHIP' ? handleBuyNow : handleAddToCart}
                                    disabled={isAdding || isBuyingNow || isSoldOut}
                                    className="flex items-center gap-3 text-slate-900 dark:text-white text-[11px] font-black uppercase tracking-[0.3em] border-b border-slate-900 dark:border-white pb-1 hover:opacity-60 transition-all disabled:opacity-20"
                                >
                                    {!isSoldOut && !isBuyingNow && <ShoppingBag className="w-3.5 h-3.5" strokeWidth={2.5} />}
                                    <span>{isSoldOut ? "Sold Out" : (isBuyingNow ? "Processing..." : (product.preorder_status === 'READY_TO_SHIP' ? "Buy Now" : "Order Now"))}</span>
                                </button>
                            </div>
                        </div>

                        <div className="mt-12 mb-8 group/desc">
                            <h2 className="text-[10px] font-bold text-slate-900 dark:text-white opacity-40 dark:opacity-60 uppercase tracking-[0.3em] mb-4">Description</h2>
                            <div className={`relative transition-all duration-700 ease-in-out overflow-hidden ${isDescriptionExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-6 opacity-80'}`}>
                                <p className="text-slate-900 dark:text-white opacity-60 dark:opacity-80 leading-relaxed text-sm select-none">
                                    {product.description}
                                </p>
                                {!isDescriptionExpanded && (
                                    <div className="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-t from-white via-white/40 to-transparent dark:from-slate-950 dark:via-slate-950/40 dark:to-transparent pointer-events-none" />
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
                        {/* 5. Details: Flat Architectural Grid */}
                        <div className="grid grid-cols-2 gap-px bg-slate-50 dark:bg-slate-900 border-y border-slate-50 dark:border-slate-900 mt-12 mb-12">
                            {/* Type */}
                            <div className="bg-white dark:bg-slate-950 py-10 flex flex-col gap-3">
                                <span className="text-[9px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.4em]">Category</span>
                                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">{product.category?.name}</span>
                            </div>
                            {/* Origin */}
                            <div className="bg-white dark:bg-slate-950 py-10 flex flex-col gap-3 pl-8">
                                <span className="text-[9px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.4em]">Made In</span>
                                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">{product.origin_country || 'Guangzhou, CN'}</span>
                            </div>
                            {/* Verification */}
                            <div className="bg-white dark:bg-slate-950 py-10 flex flex-col gap-3 border-t border-slate-50 dark:border-slate-900">
                                <span className="text-[9px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.4em]">Quality Check</span>
                                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                    Safe Delivery
                                </span>
                            </div>
                            {/* Secured */}
                            <div className="bg-white dark:bg-slate-950 py-10 flex flex-col gap-3 pl-8 border-t border-slate-50 dark:border-slate-900">
                                <span className="text-[9px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.4em]">Payment</span>
                                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">MOMO SECURED</span>
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

