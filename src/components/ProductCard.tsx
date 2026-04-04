'use client';

import { useCartStore, Product } from '@/stores/cartStore';
import { useState, useEffect } from 'react';
import { useWishlistStore } from '@/stores/wishlistStore';
import { Heart, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { formatPrice } from '@/lib/format';
import { trackAddToCart, trackSelectItem } from '@/lib/analytics';
import Image from 'next/image';
import { getImageUrl } from '@/lib/image';
import NextLink from 'next/link';

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
    const [isAdding, setIsAdding] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // Prevent hydration mismatch for wishlist state
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const addToCart = useCartStore(state => state.addToCart);
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
    
    // Only determine wishlist status after mount to avoid server/client mismatch
    const isWishlisted = isMounted ? isInWishlist(product.id) : false;

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
        }
    };

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            setIsAdding(true);
            await addToCart({ ...product, image: product.image || "" });
            trackAddToCart(product);
        } catch (error) {
            console.error("Add to cart error:", error);
        } finally {
            setIsAdding(false);
        }
    };

    const imageUrl = getImageUrl(product.image);

    return (
        <div className="bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900 pt-6 transition-all duration-500 flex flex-col h-full group/card relative">
            
            {/* 1. ARCHITECTURAL IMAGE DISPLAY */}
            <div className="relative overflow-hidden mb-6 aspect-[4/5] bg-slate-50/30 dark:bg-slate-900/30">
                <NextLink 
                    href={`/products/${product.slug}`} 
                    className="block h-full"
                    onClick={() => trackSelectItem(product)}
                >
                    {!imageError ? (
                        <Image
                            src={imageUrl}
                            alt={`${product.name} - China Import to Ghana`}
                            fill
                            priority={priority}
                            unoptimized={imageUrl.startsWith('http')}
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                            className="object-contain group-hover/card:scale-110 transition-transform duration-700 ease-in-out px-4 py-8"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-100 dark:text-slate-800">
                             <span className="text-[10px] font-black uppercase tracking-widest">[ IMAGE_PENDING ]</span>
                        </div>
                    )}
                </NextLink>

                {/* Action Overlay (Static on Mobile, Hover on Desktop) */}
                <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-100 lg:opacity-0 lg:group-hover/card:opacity-100 transition-all duration-300">
                    <button
                        onClick={toggleWishlist}
                        title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                        className={`w-8 h-8 flex items-center justify-center rounded-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm transition-colors ${isWishlisted ? "text-rose-500" : "text-slate-400 dark:text-slate-600 hover:text-black dark:hover:text-white"}`}
                    >
                        <Heart className={`w-3.5 h-3.5 ${isWishlisted ? "fill-current" : ""}`} strokeWidth={2} />
                    </button>
                    <button
                        onClick={handleAddToCart}
                        disabled={isAdding}
                        title="Add to cart"
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm text-slate-400 dark:text-slate-600 hover:text-black dark:hover:text-white transition-colors"
                    >
                        <ShoppingBag className="w-3.5 h-3.5" strokeWidth={2} />
                    </button>
                </div>
            </div>

            {/* 2. MINIMALIST DETAILS (Left Aligned) */}
            <NextLink 
                href={`/products/${product.slug}`} 
                className={`flex flex-col gap-3 group/link ${variant === 'compact' ? 'px-1' : ''}`}
                onClick={() => trackSelectItem(product)}
            >
                <div>
                     {!hideProgress && (
                         <div className="flex items-start justify-between gap-4 mb-2">
                            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-emerald-600">Premium Import</span>
                            <ArrowUpRight className="w-3 h-3 text-slate-200 dark:text-slate-800 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                         </div>
                     )}
                     <h3 className={`font-bold text-slate-900 dark:text-white tracking-tight leading-tight line-clamp-2 ${variant === 'compact' ? 'text-xs' : 'text-sm'}`}>
                         {product.name}
                     </h3>
                </div>

                <div className={`flex flex-wrap items-baseline justify-between gap-1 pt-2 border-t border-slate-50 dark:border-slate-900 ${variant === 'compact' ? 'mt-auto' : ''}`}>
                    <div className={`font-serif font-bold text-slate-900 dark:text-white tracking-tighter ${variant === 'compact' ? 'text-lg' : 'text-xl sm:text-2xl'}`}>
                        {formatPrice(product.price)}
                    </div>
                    {!hideRating && (
                        <span className="text-[8px] sm:text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.15em] sm:tracking-[0.2em] transition-colors whitespace-nowrap">
                            {product.preorder_status === 'READY_TO_SHIP' ? 'INSTANT' : 'PRE-ORDER'}
                        </span>
                    )}
                </div>
            </NextLink>
        </div>
    );
}
