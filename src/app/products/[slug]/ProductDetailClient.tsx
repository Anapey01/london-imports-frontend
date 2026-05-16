/**
 * London's Imports - Product Detail Client Component
 * Handles interactivity: Add to Cart, Quantity, Rating
 */
'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
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
import { trackViewItem, trackAddToCart, trackWhatsAppContact, trackEvent, trackProductAffinity } from '@/lib/analytics';
import { useToast } from '@/components/Toast';
import { GroupBuyProgress } from '@/components/GroupBuyProgress';
import { siteConfig } from '@/config/site';
import { ShoppingBag, Share2, Phone, Download } from 'lucide-react';
import PropensityTracker from '@/components/analytics/PropensityTracker';

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
    short_name?: string;
    display_name?: string;
    subtitle?: string;
    slug: string;
    price: number;
    description?: string;
    editorial_data?: {
        highlights: Array<{ icon: string; title: string; text: string }>;
        narrative: string;
        specs: Array<{ label: string; value: string }>;
    };
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
    is_discreet?: boolean;
}

interface ProductDetailClientProps {
    initialProduct: Product | null;
    slug: string;
}

/**
 * Premium Text Formatter
 * Translates Django Admin TextField content into structured UI
 */
function FormattedDescription({ text }: { text: string }) {
    if (!text) return null;
    
    // Split into segments, cleaning up extra whitespace
    const segments = text.split('\n').map(s => s.trim()).filter(Boolean);
    
    return (
        <div className="flex flex-col gap-4">
            {segments.map((segment, i) => {
                // 1. Handle Visual Separators (——)
                if (segment.includes('——')) {
                    return (
                        <div key={i} className="w-full py-4 flex items-center gap-4">
                            <div className="h-px flex-1 bg-border-standard opacity-50" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-content-secondary whitespace-nowrap">
                                {segment.replace(/—/g, '').trim()}
                            </span>
                            <div className="h-px flex-1 bg-border-standard opacity-50" />
                        </div>
                    );
                }

                // 2. Handle Multi-part line with | (e.g. "Title | Subtitle")
                if (segment.includes('|')) {
                    return (
                        <div key={i} className="flex flex-wrap gap-x-4 gap-y-2 mb-2">
                            {segment.split('|').map((part, pi) => (
                                <span key={pi} className="text-[11px] font-bold uppercase tracking-widest text-[#006B5A] bg-[#006B5A]/5 px-3 py-1 rounded-full border border-[#006B5A]/10">
                                    {part.trim()}
                                </span>
                            ))}
                        </div>
                    );
                }

                // 3. Handle Bullet points (*)
                if (segment.startsWith('*')) {
                    return (
                        <div key={i} className="flex items-start gap-4 pl-1 group/item transition-all">
                            <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-[#006B5A] flex-shrink-0 opacity-40 group-hover/item:opacity-100 transition-opacity" />
                            <p className="text-[13px] leading-relaxed text-content-primary/90 font-medium tracking-tight">
                                {segment.substring(1).trim()}
                            </p>
                        </div>
                    );
                }

                // 4. Handle Subheaders (e.g. "Specifications", "Product Type:")
                const isHeader = segment.endsWith(':') || 
                                (segment.length > 5 && segment.length < 40 && segment === segment.toUpperCase());
                
                if (isHeader) {
                    return (
                        <h3 key={i} className="text-[10px] font-black text-[#006B5A] uppercase tracking-[0.4em] mt-6 mb-1">
                            {segment}
                        </h3>
                    );
                }

                // 5. Default Paragraph
                return (
                    <p key={i} className="text-[13px] leading-relaxed text-content-primary/80 font-medium tracking-tight">
                        {segment}
                    </p>
                );
            })}
        </div>
    );
}

import { 
    Sparkles, Zap, ShieldCheck, Volume2, Truck, Package, 
    Leaf, Activity, Smartphone, Cpu, Watch, Star, 
    Heart, Home, Sun, Cloud, Snowflake, Thermometer, 
    Timer, Lock, Eye, Wind, Waves 
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
    Zap, ShieldCheck, Volume2, Truck, Package, 
    Leaf, Activity, Smartphone, Cpu, Watch, Star, 
    Heart, Home, Sun, Cloud, Snowflake, Thermometer, 
    Timer, Lock, Eye, Wind, Waves, Sparkles
};

/**
 * Premium Editorial Section
 * Renders the structured AI-generated content with Lucide icons
 */
function EditorialSection({ data }: { data: Product['editorial_data'] }) {
    if (!data) return null;

    const LucideIcon = ({ name, ...props }: { name: string; className?: string; size?: number | string; strokeWidth?: number | string }) => {
        const Icon = ICON_MAP[name] || Sparkles;
        return <Icon {...props} />;
    };

    // 1. Safe extraction of Highlights
    const highlights = Array.isArray(data?.highlights) ? data.highlights : [];
    
    // 2. Safe extraction of Specs (Handles both Array and Object formats)
    let specs: Array<{ label: string; value: string }> = [];
    if (Array.isArray(data?.specs)) {
        specs = data.specs;
    } else if (data?.specs && typeof data.specs === 'object') {
        specs = Object.entries(data.specs).map(([label, value]) => ({
            label: String(label),
            value: String(value)
        }));
    }

    return (
        <div className="mb-12 space-y-12">
            {/* 1. Performance Narrative (The Editorial Story) */}
            {data.narrative && (
                <div className="relative py-8 border-y border-slate-100 dark:border-slate-900">
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-surface px-6 text-[10px] font-black uppercase tracking-[0.4em] text-brand-emerald/40 italic">
                        Product Details
                    </span>
                    <p className="text-2xl lg:text-3xl font-serif font-medium text-content-primary leading-[1.3] tracking-tight text-center text-balance max-w-4xl mx-auto">
                        &ldquo;{data.narrative}&rdquo;
                    </p>
                </div>
            )}

            {/* 2. Key Highlights (The Feature Gallery) */}
            {highlights.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-16">
                    {highlights.map((item, idx) => (
                        <div key={idx} className="group/item flex flex-col items-center text-center space-y-6">
                            <div className="w-16 h-16 bg-surface border border-slate-100 dark:border-slate-800 rounded-full flex items-center justify-center shadow-sm group-hover/item:border-brand-emerald/30 transition-all duration-500">
                                <LucideIcon name={item.icon} className="w-6 h-6 text-brand-emerald" strokeWidth={1} />
                            </div>
                            <div className="space-y-3">
                                <h4 className="text-[11px] font-black text-content-primary uppercase tracking-[0.3em]">
                                    {item.title}
                                </h4>
                                <p className="text-[13px] text-content-secondary leading-relaxed max-w-[240px] mx-auto opacity-80">
                                    {item.text}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {/* 3. Core Specifications Table */}
            {specs.length > 0 && (
                <div className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden bg-surface shadow-sm">
                    <div className="bg-slate-50/50 dark:bg-slate-900/50 px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-emerald">
                            Product Details
                        </span>
                    </div>
                    <div className="divide-y divide-slate-50 dark:divide-slate-900">
                        {specs.map((spec, idx) => (
                            <div key={idx} className="flex px-6 py-4 text-[13px]">
                                <span className="font-bold text-content-secondary w-2/5 md:w-1/3 uppercase tracking-tighter">
                                    {spec.label}
                                </span>
                                <span className="text-content-primary font-medium">
                                    {spec.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
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
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

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
    const refreshProductData = useCallback(async () => {
        if (!slug) return;
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
    }, [slug, initialProduct]);

    useEffect(() => {
        if (slug) {
            // If we don't have initial product, show loading. If we do, just update in background.
            if (!initialProduct) setIsLoading(true);
            refreshProductData();
        }
    }, [initialProduct, slug, refreshProductData]);

    // Ref for the main CTA section to trigger the sticky bar
    const [ctaRef, setCtaRef] = useState<HTMLDivElement | null>(null);

    useEffect(() => {
        if (product) {
            setDisplayedImage(getImageUrl(product.image));
            
            // Deduplicate GA4 tracking
            if (lastTrackedSlug.current !== product.slug) {
                trackViewItem(product);
                lastTrackedSlug.current = product.slug;

                // Product Development: Demand Forecasting for OOS
                if (isSoldOut) {
                    trackEvent('view_out_of_stock', {
                        item_id: product.id,
                        item_name: product.name,
                        item_category: product.category?.name
                    });
                }
            }

            // ADDED: Save to Recently Viewed (unless discreet/privacy mode)
            if (product.is_discreet) {
                console.info("[Privacy] Ghost mode active. Skipping browse history for this item.");
            } else {
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
        }
    }, [product, isSoldOut]);

    const handleDownloadFlyer = async () => {
        if (!product) return;
        setIsDownloading(true);
        let processingToastId: string | null = null;
        
        try {
            // THE SOURCE OF TRUTH: Targeted dynamic OG route for this product via robust API
            processingToastId = showToast('Generating promotional flyer...', 'processing'); // Processing aura
            
            const flyerUrl = `${window.location.origin}/api/og?slug=${product.slug}&t=${Date.now()}`;
            let response = await fetch(flyerUrl);
            
            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(errorBody || `Server status ${response.status}`);
            }

            const blob = await response.blob();
            if (blob.size === 0) throw new Error('Generated flyer is empty.');

            // --- PNG BRIDGE: Convert SVG Blob to PNG for Social Sharing ---
            const svgUrl = URL.createObjectURL(blob);
            const img = new Image();
            
            // Wait for image to load
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = (e) => {
                    console.error("Flyer SVG image load failed. Check if SVG is valid:", e);
                    // Critical: If it fails, log the first 100 bytes of SVG for debugging
                    blob.text().then(t => console.debug("SVG Snapshot:", t.substring(0, 200)));
                    reject(new Error('Failed to render flyer image.'));
                };
                // img.crossOrigin = 'anonymous'; // REMOVED: Redundant for local Blob URIs and causes load failures on some browsers
                img.src = svgUrl;
            });

            // Draw to Canvas
            const canvas = document.createElement('canvas');
            canvas.width = 1200;
            canvas.height = 630;
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Canvas context failed');
            
            ctx.drawImage(img, 0, 0, 1200, 630);
            
            // Export as PNG
            const pngBlob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png', 1.0));
            if (!pngBlob) throw new Error('PNG conversion failed');

            // Trigger Download
            const url = window.URL.createObjectURL(pngBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `LondonsImports-${product.slug}.png`; // Back to shareable PNG
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            window.URL.revokeObjectURL(svgUrl); // Clean up original SVG url
            
            if (processingToastId) removeToast(processingToastId);
            showToast('Flyer ready for sharing!', 'success');
            
            trackEvent('file_download', {
                file_name: `${product.slug}-flyer`,
                file_extension: 'png',
                item_id: product.id
            });
        } catch (error) {
            console.error('Flyer download failed', error);
            // If it's a render error, one final attempt without the main image (Small/Simple Flyer)
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
        // Validation for variants
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
            await addToCart(product, quantity, selectedSize, selectedColor, selectedVariant || undefined);
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
        // Validation for variants
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
            // First add to cart, then go directly to checkout
            await addToCart(product, quantity, selectedSize, selectedColor, selectedVariant || undefined);
            trackAddToCart(product, quantity);
            showToast(`Proceeding to checkout`, 'success');
            
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
            showToast(errorMessage, 'error');
        } finally {
            setIsBuyingNow(false);
        }
    };

    const handleWhatsAppContact = () => {
        if (!product) return;
        trackWhatsAppContact(`${product.name} (${formatPrice(currentPrice)})`, 'concierge');
        
        // High-Context Conversion: Product + Price + Link
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
                {/* Visual Breadcrumbs for SEO and Navigation */}
                <nav className="flex items-center text-[10px] font-bold uppercase tracking-[0.2em] text-content-secondary mb-12 overflow-x-auto whitespace-nowrap scrollbar-hide py-4 border-b border-border-standard">
                    <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                        Home
                    </Link>
                    <span className="mx-4 text-slate-100 dark:text-slate-900">/</span>
                    <Link href="/products" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                        Products
                    </Link>
                    {product.category && (
                        <>
                    <span className="mx-4 text-border-standard">/</span>
                            <Link 
                                href={`/products/category/${product.category.slug || ''}`} 
                                className="hover:text-slate-900 dark:hover:text-white transition-colors"
                            >
                                {product.category.name}
                            </Link>
                        </>
                    )}
                    <span className="mx-4 text-border-standard">/</span>
                    <span className="text-slate-900 dark:text-white">
                        {product.display_name || product.short_name || product.name}
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
                    <div className="flex flex-col gap-8 flex-1">
                        {/* 1. Header: Source Serif Authority */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-content-secondary opacity-60">Original Product / London&apos;s</span>
                                {product.is_discreet && (
                                    <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-2">
                                        <div className="w-1 h-1 bg-emerald-500 rounded-full" />
                                        <span className="text-[7px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em]">Discreet</span>
                                    </div>
                                )}
                            </div>
                            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-serif font-atelier text-content-primary leading-[1.1] tracking-tighter text-balance">
                                {product.name}
                            </h1>
                            {product.subtitle && (
                                <p className="text-xs lg:text-sm font-medium text-content-secondary tracking-[0.2em] uppercase opacity-60 mt-1">
                                    {product.subtitle}
                                </p>
                            )}
                            
                            {/* 2. Pricing Architecture (Elegant & Subtle) */}
                            <div className="flex items-baseline flex-wrap gap-4 pt-2">
                                <span className="text-2xl sm:text-3xl lg:text-4xl font-serif font-medium text-content-primary tracking-tighter tabular-nums leading-none">
                                    {formatPrice(currentPrice)}
                                </span>
                                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-brand-emerald mb-0.5 opacity-60">
                                    Minus shipping
                                </span>
                                
                                <button 
                                    onClick={() => document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="flex items-center gap-3 py-1 hover:opacity-60 transition-all ml-auto"
                                >
                                    <StarRating initialRating={Number(effectiveRating)} readOnly size="xs" />
                                    <span className="text-[9px] font-black text-content-secondary tracking-widest tabular-nums">
                                        ({Number(effectiveRating).toFixed(1)})
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
                        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-12 border-t border-slate-50 dark:border-slate-900 pt-8 sm:pt-0">
                            <div className="w-full sm:w-40">
                                <p className="text-[9px] font-black text-content-secondary uppercase tracking-[0.3em] mb-3 text-center sm:text-left">Quantity</p>
                                <div className="flex items-center h-11 w-full border border-border-standard px-2 bg-surface-card">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="flex-1 h-full flex items-center justify-center text-content-secondary hover:text-content-primary transition-colors text-lg"
                                        aria-label="Decrease quantity"
                                    >
                                        −
                                    </button>
                                    <span className="flex-none w-12 text-center font-bold text-content-primary text-sm tabular-nums">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => setQuantity(Math.min(99, quantity + 1))}
                                        className="flex-1 h-full flex items-center justify-center text-content-secondary hover:text-content-primary transition-colors text-lg"
                                        aria-label="Increase quantity"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            
                            <div 
                                ref={setCtaRef}
                                className="flex items-center gap-8 sm:gap-12 mt-6 sm:mt-0 w-full overflow-x-auto scrollbar-hide py-2"
                            >
                                <button
                                    onClick={handleAddToCart}
                                    disabled={isAdding || isSoldOut}
                                    className="text-[11px] font-black uppercase tracking-[0.25em] text-content-primary border-b border-black dark:border-white pb-1 hover:opacity-60 transition-all disabled:opacity-20 whitespace-nowrap flex-shrink-0"
                                >
                                    {isAdding ? 'Sourcing...' : 'Add to Basket'}
                                </button>
                                
                                <button
                                    onClick={handleBuyNow}
                                    disabled={isAdding || isBuyingNow || isSoldOut}
                                    className="flex items-center gap-3 text-content-primary text-[11px] font-black uppercase tracking-[0.3em] border-b border-slate-900 dark:border-white pb-1 hover:opacity-60 transition-all disabled:opacity-20 whitespace-nowrap flex-shrink-0"
                                >
                                    {!isSoldOut && !isBuyingNow && <ShoppingBag className="w-3.5 h-3.5" strokeWidth={2.5} />}
                                    <span>{isSoldOut ? "Sold Out" : (isBuyingNow ? "Processing..." : (product.preorder_status === 'READY_TO_SHIP' ? "Buy Now" : "Order Now"))}</span>
                                </button>

                                <button
                                    onClick={handleWhatsAppContact}
                                    className="flex items-center gap-3 text-[#006B5A] text-[11px] font-black uppercase tracking-[0.3em] border-b border-[#006B5A] pb-1 hover:opacity-60 transition-all whitespace-nowrap flex-shrink-0"
                                >
                                    <Phone className="w-3.5 h-3.5" strokeWidth={2.5} />
                                    <span>Concierge</span>
                                </button>

                                <button
                                    onClick={handleDownloadFlyer}
                                    disabled={isDownloading}
                                    className={`flex items-center gap-3 text-[#006B5A] text-[11px] font-black uppercase tracking-[0.3em] border-b border-[#006B5A]/30 pb-1 hover:border-[#006B5A] transition-all disabled:opacity-50 flex-shrink-0 whitespace-nowrap ${isDownloading ? 'animate-pulse' : ''}`}
                                    title="Download professional social flyer"
                                >
                                    <Download className={`w-3.5 h-3.5 ${isDownloading ? 'animate-bounce' : ''}`} strokeWidth={2.5} />
                                    <span>{isDownloading ? 'Flyer...' : 'Flyer'}</span>
                                </button>

                                <button
                                    onClick={handleShare}
                                    className="flex items-center gap-3 text-slate-400 text-[11px] font-black uppercase tracking-[0.3em] border-b border-slate-200 dark:border-slate-800 pb-1 hover:opacity-60 transition-all flex-shrink-0"
                                    aria-label="Share product"
                                >
                                    <Share2 className="w-3.5 h-3.5" strokeWidth={2.5} />
                                </button>
                            </div>
                        </div>

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

                        {/* Trust & Product Details - Curated Horizontal Row */}
                        {/* 5. Details: Flat Architectural Grid */}
                        <div className="grid grid-cols-2 gap-px bg-border-standard border-y border-border-standard mt-4 mb-12">
                            {/* Type */}
                            <div className="bg-surface py-6 flex flex-col gap-2">
                                <span className="text-[9px] font-black text-content-secondary uppercase tracking-[0.4em]">Category</span>
                                <span className="text-xs font-bold text-content-primary uppercase tracking-widest">{product.category?.name}</span>
                            </div>
                            {/* Origin */}
                            <div className="bg-surface py-6 flex flex-col gap-2 pl-8">
                                <span className="text-[9px] font-black text-content-secondary uppercase tracking-[0.4em]">Made In</span>
                                <span className="text-xs font-bold text-content-primary uppercase tracking-widest">{product.origin_country || 'Guangzhou, CN'}</span>
                            </div>
                            {/* Verification */}
                            <div className="bg-surface py-6 flex flex-col gap-2 border-t border-border-standard">
                                <span className="text-[9px] font-black text-content-secondary uppercase tracking-[0.4em]">Quality Check</span>
                                <span className="text-xs font-bold text-content-primary uppercase tracking-widest flex items-center gap-2">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                                    Safe Delivery
                                </span>
                            </div>
                            {/* Secured */}
                            <div className="bg-surface py-6 flex flex-col gap-2 pl-8 border-t border-border-standard">
                                <span className="text-[9px] font-black text-content-secondary uppercase tracking-[0.4em]">Payment</span>
                                <span className="text-xs font-bold text-content-primary uppercase tracking-widest">MOMO SECURED</span>
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
                isDiscreet={product.is_discreet}
                onProductClick={(p) => trackProductAffinity(product.name, p)}
            />

            <ProductReviews
                productSlug={product.slug}
                initialReviews={product.reviews || []}
                rating={Number(effectiveRating)}
                ratingCount={Number(effectiveCount)}
                onReviewAdded={refreshProductData}
                autoOpen={autoOpenReview}
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

