/**
 * London's Imports - Product Detail Client Component
 * Handles interactivity: Add to Cart, Quantity, Rating
 */
'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/stores/cartStore';
import dynamic from 'next/dynamic';
import { getImageUrl } from '@/lib/image';
import StickyMobileCart from '@/components/StickyMobileCart';
import VariantSelector from '@/components/product/VariantSelector';
import ProductImageGallery from '@/components/product/ProductImageGallery';
import { formatPrice } from '@/lib/format';
import { trackViewItem, trackAddToCart, trackWhatsAppContact, trackEvent, trackProductAffinity } from '@/lib/analytics';
import { useToast } from '@/components/Toast';
import { GroupBuyProgress } from '@/components/GroupBuyProgress';
import { siteConfig } from '@/config/site';
import PropensityTracker from '@/components/analytics/PropensityTracker';

// Imported Types & Extracted Presentation Components
import { Product, DetailProductVariant } from '@/types/product';
import { ProductBreadcrumbs } from '@/components/product/detail/ProductBreadcrumbs';
import { ProductHeader } from '@/components/product/detail/ProductHeader';
import { ProductActionPanel } from '@/components/product/detail/ProductActionPanel';
import { FormattedDescription } from '@/components/product/detail/FormattedDescription';
import { EditorialSection } from '@/components/product/detail/EditorialSection';
import { ProductMeta } from '@/components/product/detail/ProductMeta';

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

interface ProductDetailClientProps {
    initialProduct: Product | null;
    slug: string;
}

export default function ProductDetailClient({ initialProduct, slug }: ProductDetailClientProps) {
    const router = useRouter();
    const { showToast, removeToast } = useToast();
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);
    const [isBuyingNow, setIsBuyingNow] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
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

    // AUTO-OPEN REVIEW MODAL LOGIC
    const [autoOpenReview, setAutoOpenReview] = useState(false);
    useEffect(() => {
        if (typeof window !== 'undefined' && window.location.hash === '#review') {
            setAutoOpenReview(true);
        }
    }, []);

    // Reset selection when product changes
    useEffect(() => {
        setSelectedSize('');
        setSelectedColor('');
        setDisplayedImage(null);
        if (initialProduct) {
            setProduct(initialProduct);
        }
    }, [initialProduct]);

    // Derived state for price and stock
    const [currentPrice, setCurrentPrice] = useState(initialProduct?.price || 0);
    const [selectedVariant, setSelectedVariant] = useState<DetailProductVariant | null>(null);

    const currentStock = useMemo(() => {
        if (selectedVariant) return selectedVariant.stock_quantity;
        return product?.stock_quantity ?? 0;
    }, [product, selectedVariant]);

    // CLIENT-SIDE AGGREGATE (Safe Fallback)
    // If backend fields are 0 but reviews exist, we calculate the truth here
    const effectiveRating = useMemo(() => {
        if (!product) return 0;
        if ((product.rating ?? 0) > 0) return product.rating ?? 0;
        if (product.reviews && product.reviews.length > 0) {
            return product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;
        }
        return 0;
    }, [product]);

    const effectiveCount = useMemo(() => {
        if (!product) return 0;
        if ((product.rating_count ?? 0) > 0) return product.rating_count ?? 0;
        return product.reviews?.length || 0;
    }, [product]);

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
                setSelectedVariant(matchingVariant);
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
    const refreshProductData = useCallback(async () => {
        if (!slug) return;
        try {
            const API_BASE = siteConfig.apiUrl;
            const res = await fetch(`${API_BASE}/products/${slug}/?t=${Date.now()}`);
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setProduct(data);
            setCurrentPrice(Number(data.price));
        } catch (e) {
            console.error("CSR Fetch Error", e);
            if (!initialProduct) setError(true);
        } finally {
            setIsLoading(false);
        }
    }, [slug, initialProduct]);

    useEffect(() => {
        if (slug) {
            if (!initialProduct) setIsLoading(true);
            refreshProductData();
        }
    }, [initialProduct, slug, refreshProductData]);

    const [ctaRef, setCtaRef] = useState<HTMLDivElement | null>(null);

    useEffect(() => {
        if (product) {
            setDisplayedImage(getImageUrl(product.image));
            
            if (lastTrackedSlug.current !== product.slug) {
                trackViewItem(product);
                lastTrackedSlug.current = product.slug;

                if (isSoldOut) {
                    trackEvent('view_out_of_stock', {
                        item_id: product.id,
                        item_name: product.name,
                        item_category: product.category?.name
                    });
                }
            }

            if (product.is_discreet) {
                console.info("[Privacy] Ghost mode active. Skipping browse history for this item.");
            } else {
                try {
                    const stored = localStorage.getItem('recently_viewed');
                    let history: Product[] = stored ? JSON.parse(stored) : [];
                    history = history.filter(p => p.slug !== product.slug);
                    history.unshift(product);
                    if (history.length > 10) history.pop();
                    localStorage.setItem('recently_viewed', JSON.stringify(history));
                } catch (e) {
                    console.error("Failed to save recently viewed", e);
                }
            }
        }
    }, [product, isSoldOut]);

    const handleDownloadFlyer = async () => {
        if (!product) return;
        setIsDownloading(true);
        let processingToastId: string | null = null;
        
        try {
            processingToastId = showToast('Generating promotional flyer...', 'processing');
            
            const flyerUrl = `${window.location.origin}/api/og?slug=${product.slug}&t=${Date.now()}`;
            let response = await fetch(flyerUrl);
            
            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(errorBody || `Server status ${response.status}`);
            }

            const blob = await response.blob();
            if (blob.size === 0) throw new Error('Generated flyer is empty.');

            const svgUrl = URL.createObjectURL(blob);
            const img = new Image();
            
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = (e) => {
                    console.error("Flyer SVG image load failed. Check if SVG is valid:", e);
                    blob.text().then(t => console.debug("SVG Snapshot:", t.substring(0, 200)));
                    reject(new Error('Failed to render flyer image.'));
                };
                img.src = svgUrl;
            });

            const canvas = document.createElement('canvas');
            canvas.width = 1200;
            canvas.height = 630;
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Canvas context failed');
            
            ctx.drawImage(img, 0, 0, 1200, 630);
            
            const pngBlob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png', 1.0));
            if (!pngBlob) throw new Error('PNG conversion failed');

            const url = window.URL.createObjectURL(pngBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `LondonsImports-${product.slug}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            window.URL.revokeObjectURL(svgUrl);
            
            if (processingToastId) removeToast(processingToastId);
            showToast('Flyer ready for sharing!', 'success');
            
            trackEvent('file_download', {
                file_name: `${product.slug}-flyer`,
                file_extension: 'png',
                item_id: product.id
            });
        } catch (error) {
            console.error('Flyer download failed', error);
            if (error instanceof Error && error.message.includes('render')) {
                showToast('Image too large. Generating compact flyer...', 'processing');
                window.open(`${window.location.origin}/api/og?slug=${product.slug}&image=none`, '_blank');
            } else {
                showToast('Failed to generate flyer. Please try again.', 'error');
            }
        } finally {
            if (processingToastId) removeToast(processingToastId);
            setIsDownloading(false);
        }
    };

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
        if (product.available_sizes && product.available_sizes.length > 0 && !selectedSize) {
            showToast('Please select a size', 'error');
            return;
        }
        if (product.available_colors && product.available_colors.length > 0 && !selectedColor) {
            showToast('Please select a color', 'error');
            return;
        }

        setIsAdding(true);
        try {
            const displayName = product.display_name || product.short_name || product.name;
            await addToCart(product as any, quantity, selectedSize, selectedColor, selectedVariant || undefined);
            trackAddToCart(product, quantity);
            showToast(`Added ${quantity}x ${displayName} to cart`, 'success');
            router.push('/cart');
        } catch (e: unknown) {
            console.error("Add to Cart Failed:", e);
            let errorMessage = "Failed to add to cart. Please try again.";
            if (e && typeof e === 'object' && 'response' in e) {
                const axiosError = e as { response?: { data?: { error?: string } } };
                console.error("Backend Error Details:", axiosError.response?.data);
                errorMessage = axiosError.response?.data?.error || errorMessage;
            }
            showToast(errorMessage, 'error');
        } finally {
            setIsAdding(false);
        }
    };

    const handleBuyNow = async () => {
        if (product.available_sizes && product.available_sizes.length > 0 && !selectedSize) {
            showToast('Please select a size', 'error');
            return;
        }
        if (product.available_colors && product.available_colors.length > 0 && !selectedColor) {
            showToast('Please select a color', 'error');
            return;
        }

        setIsBuyingNow(true);
        try {
            await addToCart(product as any, quantity, selectedSize, selectedColor, selectedVariant || undefined);
            trackAddToCart(product, quantity);
            showToast(`Proceeding to checkout`, 'success');
            
            const params = new URLSearchParams({ buyNow: product.slug });
            router.push(`/checkout?${params.toString()}`);
        } catch (e: unknown) {
            console.error(e);
            let errorMessage = "Something went wrong. Please try again.";
             if (e && typeof e === 'object' && 'response' in e) {
                const axiosError = e as { response?: { data?: { error?: string } } };
                errorMessage = axiosError.response?.data?.error || errorMessage;
            }
            showToast(errorMessage, 'error');
        } finally {
            setIsBuyingNow(false);
        }
    };

    const handleWhatsAppContact = () => {
        if (!product) return;
        trackWhatsAppContact(`${product.name} (${formatPrice(currentPrice)})`, 'concierge');
        
        const message = encodeURIComponent(
            `Hi London's Imports! I'm interested in the ${product.name} priced at ${formatPrice(currentPrice)}.\n\n` + 
            `Product Link: ${window.location.origin}/products/${product.slug}\n\n` +
            `Can you help me with the shipping details?`
        );
        
        window.open(`https://wa.me/${siteConfig.concierge}?text=${message}`, '_blank');
    };

    const handleShare = async () => {
        if (!product) return;
        const shareData = {
            title: product.name,
            text: `Check out this ${product.name} on London's Imports!`,
            url: window.location.href
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
                trackEvent('product_share', { item_id: product.id, item_name: product.name, method: 'native_share' });
            } else {
                await navigator.clipboard.writeText(window.location.href);
                showToast('Link copied to clipboard', 'success');
                trackEvent('product_share', { item_id: product.id, item_name: product.name, method: 'copy_link' });
            }
        } catch (err) {
            console.debug('Share failed', err);
        }
    };

    return (
        <div className="bg-surface min-h-screen pb-20">
            <PropensityTracker 
                productId={product.id} 
                productName={product.name} 
                category={product.category?.name} 
            />
            <main className="max-w-7xl mx-auto px-4 pt-8 pb-12 sm:pt-12 sm:pb-8 sm:px-6 lg:px-8">
                
                <ProductBreadcrumbs product={product} />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
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

                    <div className="flex flex-col gap-8 flex-1">
                        
                        <ProductHeader 
                            product={product} 
                            currentPrice={currentPrice} 
                            effectiveRating={Number(effectiveRating)} 
                        />

                        <div className="border-y border-slate-50 dark:border-slate-900 py-0">
                            <GroupBuyProgress
                                current={product.reservations_count || 0}
                                target={product.target_quantity || 100}
                                variant="compact"
                            />
                        </div>

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

                        <ProductActionPanel
                            product={product}
                            quantity={quantity}
                            setQuantity={setQuantity}
                            isAdding={isAdding}
                            isBuyingNow={isBuyingNow}
                            isSoldOut={isSoldOut}
                            isDownloading={isDownloading}
                            handleAddToCart={handleAddToCart}
                            handleBuyNow={handleBuyNow}
                            handleWhatsAppContact={handleWhatsAppContact}
                            handleDownloadFlyer={handleDownloadFlyer}
                            handleShare={handleShare}
                            setCtaRef={setCtaRef}
                        />

                        <div className="mt-12 mb-4 group/desc">
                            <h2 className="text-[10px] font-bold text-content-secondary uppercase tracking-[0.3em] mb-4">Description</h2>
                            <div className={`relative transition-all duration-700 ease-in-out overflow-hidden ${isDescriptionExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-32'}`}>
                                <div className="text-content-primary leading-relaxed text-sm select-none">
                                    {product.editorial_data ? (
                                        <EditorialSection data={product.editorial_data} />
                                    ) : (
                                        <FormattedDescription text={product.description || ''} />
                                    )}
                                </div>
                                {!isDescriptionExpanded && (
                                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-surface via-surface/80 to-transparent backdrop-blur-[1px] pointer-events-none" />
                                )}
                            </div>
                            <button
                                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                                className="mt-4 text-[10px] font-bold text-[#006B5A] uppercase tracking-widest hover:opacity-70 transition-all flex items-center gap-2 group/btn"
                            >
                                <span>{isDescriptionExpanded ? 'Collapse' : 'Read Full Description'}</span>
                                <svg className={`w-3 h-3 transition-transform duration-500 ${isDescriptionExpanded ? 'rotate-180' : 'group-hover/btn:translate-y-0.5'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>

                        <ProductMeta product={product} />

                        <div className="mt-8 pt-6 border-t border-[#006B5A]/10">
                            <p className="text-sm text-gray-500">
                                Sold by <span className="font-semibold text-[#006B5A]">{product.vendor?.business_name}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <RelatedProducts
                currentSlug={product.slug}
                categorySlug={product.category?.slug}
                isDiscreet={product.is_discreet}
                onProductClick={(p: any) => trackProductAffinity(product.name, p)}
            />

            <ProductReviews
                productSlug={product.slug}
                initialReviews={product.reviews || []}
                rating={Number(effectiveRating)}
                ratingCount={Number(effectiveCount)}
                onReviewAdded={refreshProductData}
                autoOpen={autoOpenReview}
            />

            <RecentlyViewed />

            <StickyMobileCart
                product={product as any}
                isAdding={isAdding}
                onAddToCart={handleAddToCart}
                triggerRef={{ current: ctaRef }}
            />
        </div>
    );
}
