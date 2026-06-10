'use client';

import { useCartStore, Product } from '@/stores/cartStore';
import { useState } from 'react';
import { useWishlistStore } from '@/stores/wishlistStore';
import { Heart, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { formatPrice } from '@/lib/format';
import { trackAddToCart, trackSelectItem, trackAddToWishlist } from '@/lib/analytics';
import Image from 'next/image';
import { getImageUrl } from '@/lib/image';
import NextLink from 'next/link';
import { useToast } from './Toast';
import { Check } from 'lucide-react';

interface ProductCardProps {
    product: Product;
    priority?: boolean;
    variant?: 'default' | 'compact';
    hideRating?: boolean;
    hideProgress?: boolean;
}

export default function ProductCard({ 
    product, 
    priority = false, 
    variant = 'default',
    hideRating = false,
    hideProgress = false,
}: ProductCardProps) {
    const [status, setStatus] = useState<'idle' | 'adding' | 'success'>('idle');
    const [imageError, setImageError] = useState(false);
    
    const { showToast } = useToast();

    const addToCart = useCartStore(state => state.addToCart);
    const addToWishlist = useWishlistStore(state => state.addToWishlist);
    const removeFromWishlist = useWishlistStore(state => state.removeFromWishlist);
    
    // Select isWishlisted directly to prevent re-rendering when other items change.
    // Use suppressHydrationWarning on the toggle button to eliminate useEffect layout hydrations.
    const isWishlisted = useWishlistStore(state => state.items.some(item => item.id === product.id));

    const toggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isWishlisted) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist({
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                image: product.image || ""
            });
            setTimeout(() => trackAddToWishlist(product), 0);
        }
    };

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        const displayName = product.display_name || product.short_name || product.name;

        try {
            setStatus('adding');
            await addToCart({ ...product, image: product.image || "" });
            
            // Success Feedback
            setStatus('success');
            showToast(`Added ${displayName} to basket`, 'success');
            setTimeout(() => setStatus('idle'), 2000);
            setTimeout(() => trackAddToCart(product), 0);
        } catch (error: unknown) {
            const err = error as { message?: string };
            if (err.message === 'VARIANT_REQUIRED') {
                showToast("Please select a size or color", "warning");
                // Redirect to product page after a short delay
                window.location.href = `/products/${product.slug}`;
            } else {
                console.error("Add to cart error:", error);
                showToast("Failed to add to basket", "error");
            }
            setStatus('idle');
        }
    };

    const imageUrl = getImageUrl(product.image);

    return (
        <div className="bg-surface-card border-t border-border-standard pt-6 transition-[border-color,background-color] duration-300 flex flex-col h-full group/card relative">
            
            {/* 1. ARCHITECTURAL IMAGE DISPLAY */}
            <div className="relative overflow-hidden mb-6 aspect-[4/5] bg-surface/30">
                <NextLink 
                    href={`/products/${product.slug}`} 
                    className="block h-full"
                    onClick={() => {
                        // Non-blocking analytics
                        if (typeof window !== 'undefined') {
                            setTimeout(() => trackSelectItem(product), 0);
                        }
                    }}
                >
                    {/* Discreet Badge */}
                    {product.is_discreet && (
                        <div className="absolute top-4 left-4 z-20">
                            <div className="bg-black/60 dark:bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                                <span className="text-[8px] font-black text-white uppercase tracking-[0.2em]">Discreet Packaging</span>
                            </div>
                        </div>
                    )}

                    {!imageError ? (
                        <Image
                            src={imageUrl}
                            alt={`${product.name} - China Import to Ghana`}
                            fill
                            priority={priority}
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                            className="object-contain group-hover/card:scale-110 transition-transform duration-500 ease-in-out px-4 py-8"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-content-secondary">
                             <span className="text-[10px] font-black uppercase tracking-widest">[ IMAGE_PENDING ]</span>
                        </div>
                    )}
                </NextLink>

                {/* Action Overlay (Static on Mobile, Hover on Desktop) */}
                <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-100 lg:opacity-0 lg:group-hover/card:opacity-100 transition-all duration-300">
                    <button
                        onClick={toggleWishlist}
                        title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                        aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
                        className={`w-11 h-11 flex items-center justify-center rounded-full bg-surface-card border border-border-standard shadow-sm transition-all institutional-focus ${isWishlisted ? "text-rose-500" : "text-content-secondary hover:text-content-primary"}`}
                        suppressHydrationWarning
                    >
                        <Heart className={`w-3.5 h-3.5 ${isWishlisted ? "fill-current" : ""}`} strokeWidth={2} suppressHydrationWarning />
                    </button>
                    <button
                        onClick={handleAddToCart}
                        disabled={status === 'adding'}
                        title="Add to cart"
                        aria-label={status === 'success' ? `Successfully added ${product.name} to basket` : `Add ${product.name} to basket`}
                        className={`w-11 h-11 flex items-center justify-center rounded-full border shadow-sm transition-all duration-300 institutional-focus ${status === 'success' ? "bg-brand-emerald border-brand-emerald text-white" : "bg-surface-card border-border-standard text-content-secondary hover:text-content-primary"}`}
                    >
                        {status === 'success' ? (
                            <Check className="w-3.5 h-3.5 animate-in zoom-in duration-300" strokeWidth={3} />
                        ) : (
                            <ShoppingBag className="w-3.5 h-3.5" strokeWidth={2} />
                        )}
                    </button>
                </div>
            </div>

            {/* 2. MINIMALIST DETAILS (Left Aligned) */}
            <NextLink 
                href={`/products/${product.slug}`} 
                className={`flex flex-col gap-3 group/link ${variant === 'compact' ? 'px-1' : ''}`}
                onClick={() => {
                    // Non-blocking analytics
                    if (typeof window !== 'undefined') {
                        setTimeout(() => trackSelectItem(product), 0);
                    }
                }}
            >
                <div>
                     {!hideProgress && (
                         <div className="flex items-start justify-between gap-4 mb-2">
                            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-emerald-800 dark:text-emerald-400">Premium Import</span>
                            <ArrowUpRight className="w-3 h-3 text-content-secondary group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-all" />
                         </div>
                     )}
                     <h3 className={`product-name-weight text-content-primary tracking-tight leading-tight line-clamp-2 ${variant === 'compact' ? 'text-xs' : 'text-sm'}`}>
                         {product.display_name || product.short_name || product.name}
                     </h3>
                     {product.subtitle && (
                         <p className="text-[10px] text-content-secondary mt-1 font-medium italic opacity-80">
                             {product.subtitle}
                         </p>
                     )}
                </div>

                <div className={`flex flex-wrap items-baseline justify-between gap-1 pt-2 border-t border-border-standard ${variant === 'compact' ? 'mt-auto' : ''}`}>
                    <div className={`font-semibold text-content-primary tracking-tighter ${variant === 'compact' ? 'text-lg' : 'text-xl sm:text-2xl'}`}>
                        {formatPrice(product.price)}
                    </div>
                    {!hideRating && product.preorder_status === 'READY_TO_SHIP' && (
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] transition-colors whitespace-nowrap text-emerald-500">
                            INSTANT
                        </span>
                    )}
                </div>
            </NextLink>
        </div>
    );
}
