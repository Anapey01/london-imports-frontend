/**
 * London's Imports - Product Card Component (Redesigned)
 * Matching the screenshot design: White card, Faint Pink Button, Clean Typography
 */
'use client';

import Link from 'next/link';
import StarRating from '@/components/StarRating';
import { useCartStore, Product } from '@/stores/cartStore';
import { useState } from 'react';
import { useWishlistStore } from '@/stores/wishlistStore';
import { Heart } from 'lucide-react';
import { GroupBuyProgress } from '@/components/GroupBuyProgress';
import { formatPrice } from '@/lib/format';
import { trackAddToCart, trackSelectItem } from '@/lib/analytics';

interface ProductCardProps {
    product: Product;
    priority?: boolean;
    hideProgress?: boolean;
    hideRating?: boolean;
    variant?: 'default' | 'compact';
}

import Image from 'next/image';
import { getImageUrl } from '@/lib/image';

export default function ProductCard({ 
    product, 
    priority = false, 
    hideProgress = false, 
    hideRating = false,
    variant = 'default'
}: ProductCardProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [imageError, setImageError] = useState(false);
    const addToCart = useCartStore(state => state.addToCart);
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
    const isWishlisted = isInWishlist(product.id);

    // Review count logic removed as label is hidden

    const toggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isWishlisted) {
            removeFromWishlist(product.id);
        } else {
            // Ensure product matches expected interface
            const wishlistProduct = {
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                image: product.image || product.primary_image || ""
            };
            addToWishlist(wishlistProduct);
        }
    };

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            setIsAdding(true);
            await addToCart({
                ...product,
                image: product.image || ""
            });
            trackAddToCart(product);
        } catch (error: unknown) {
            console.error("Add to cart error:", error);
            // Safe alignment with potentially complex error objects
            interface ApiError {
                response?: {
                    data?: {
                        detail?: string;
                        error?: string;
                    };
                };
                message?: string;
            }
            const apiError = error as ApiError;
            const errorMessage = apiError.response?.data?.detail || apiError.response?.data?.error || "Failed to add to cart. Please try again.";
            alert(errorMessage);
        } finally {
            setIsAdding(false);
        }
    };

    const imageUrl = getImageUrl(product.image);

    return (
        <div className="bg-white dark:bg-slate-900 rounded-lg hover:shadow-diffusion-lg transition-all duration-500 flex flex-col h-full overflow-hidden group/card relative">

            <div className="relative overflow-hidden">
                <Link 
                    href={`/products/${product.slug}`} 
                    className="block"
                    onClick={() => trackSelectItem(product)}
                >
                    {/* Image Section */}
                    <div className={`relative aspect-[4/5] p-3 ${variant === 'compact' ? 'bg-slate-50/50' : 'bg-white'} dark:bg-slate-950 flex items-center justify-center transition-colors`}>
                        {!imageError ? (
                            <Image
                                src={imageUrl}
                                alt={`${product.name} - China Import to Ghana`}
                                fill
                                priority={priority}
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                                className="object-contain group-hover/card:scale-105 transition-transform duration-700 ease-out"
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-200 dark:text-slate-800">
                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                        )}
                    </div>
                </Link>

                {/* Pure Floating Icons - Top Right Precision */}
                {variant !== 'compact' && (
                    <div className="absolute top-3 right-3 z-20 flex flex-col items-center gap-2 opacity-100 lg:opacity-0 lg:group-hover/card:opacity-100 transition-all duration-500 ease-out">
                        {/* Wishlist Button */}
                        <button
                            onClick={toggleWishlist}
                            className={`w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 shadow-sm border border-white/40 ${isWishlisted ? "bg-red-50 text-red-500 border-red-100" : "bg-white/90 backdrop-blur-md text-slate-400 hover:text-[#006B5A] hover:bg-white"}`}
                            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                        >
                            <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} strokeWidth={1.5} />
                        </button>

                        {/* Quick Add / View Options */}
                        {((product.available_sizes?.length ?? 0) > 0 || (product.available_colors?.length ?? 0) > 0) ? (
                            <Link
                                href={`/products/${product.slug}`}
                                onClick={() => trackSelectItem(product)}
                                className="w-9 h-9 bg-white/90 backdrop-blur-md flex items-center justify-center rounded-full shadow-sm border border-white/40 text-slate-400 hover:text-[#006B5A] hover:bg-white transition-all"
                                aria-label="View options"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </Link>
                        ) : (
                            <button
                                onClick={handleAddToCart}
                                disabled={isAdding}
                                className="w-9 h-9 bg-white/90 backdrop-blur-md flex items-center justify-center rounded-full shadow-sm border border-white/40 text-slate-400 hover:text-[#006B5A] hover:bg-white transition-all"
                                aria-label="Add to cart"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </button>
                        )}
                    </div>
                )}
            </div>

            <Link 
                href={`/products/${product.slug}`} 
                className="flex-1 flex flex-col"
                onClick={() => trackSelectItem(product)}
            >
                {/* Details Section */}
                <div className={`${variant === 'compact' ? 'px-3 pb-4 pt-1 gap-1' : 'px-3.5 pb-5 pt-1.5 gap-1'} flex flex-col flex-1 bg-white dark:bg-slate-900 transition-colors text-center`}>
                    {/* Star Rating */}
                    {!hideRating && (
                        <div className="flex items-center justify-center gap-1 mb-0.5 opacity-60">
                            <StarRating size="xs" />
                        </div>
                    )}

                    {/* Title with Architectural Marquee (Desktop: Hover | Mobile: Ambient) */}
                    <div className="title-marquee-container overflow-hidden relative w-full h-5">
                        <h3 className={`
                            ${variant === 'compact' 
                                ? 'text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-slate-500' 
                                : 'text-[13px] font-sans font-bold text-slate-800 tracking-tight leading-[1.3]'
                            } 
                            dark:text-slate-100 transition-colors whitespace-nowrap
                            lg:group-hover/card:animate-[title-scroll_6s_linear_infinite_alternate] 
                            max-lg:animate-mobile-marquee w-max block
                        `}>
                            {product.name}
                        </h3>
                    </div>

                    {/* Price */}
                    <div className={`
                        text-[#006B5A] ${variant === 'compact' ? 'text-sm' : 'text-base'} 
                        dark:text-white font-bold tracking-tighter tabular-nums transition-colors
                    `}>
                        {formatPrice(product.price)}
                    </div>

                    {/* Progress Bar (Innovation) */}
                    {!hideProgress && (
                        <div className="mt-2.5">
                            <GroupBuyProgress
                                current={product.reservations_count || 0}
                                target={product.target_quantity || 100}
                                variant="micro"
                            />
                        </div>
                    )}
                </div>
            </Link>
        </div>
    );
}
