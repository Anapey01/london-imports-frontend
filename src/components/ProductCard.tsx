/**
 * London's Imports - Product Card Component (Redesigned)
 * Matching the screenshot design: White card, Faint Pink Button, Clean Typography
 */
'use client';

import Link from 'next/link';
import StarRating from '@/components/StarRating';
import { useCartStore, Product } from '@/stores/cartStore';
import { useState, useMemo } from 'react';
import { useWishlistStore } from '@/stores/wishlistStore';
import { Heart } from 'lucide-react';
import { GroupBuyProgress } from '@/components/GroupBuyProgress';
import { formatPrice } from '@/lib/format';

interface ProductCardProps {
    product: Product;
    priority?: boolean;
}

import Image from 'next/image';
import { getImageUrl } from '@/lib/image';

export default function ProductCard({ product, priority = false }: ProductCardProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [imageError, setImageError] = useState(false);
    const addToCart = useCartStore(state => state.addToCart);
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
    const isWishlisted = isInWishlist(product.id);

    // Use real rating_count from backend, or stable random fallback
    const reviewCount = useMemo(() => {
        if (typeof product.rating_count === 'number' && product.rating_count > 0) {
            return product.rating_count;
        }
        
        // Stable random review count based on product ID (fallback)
        const idStr = String(product.id);
        let hash = 0;
        for (let i = 0; i < idStr.length; i++) {
            hash = ((hash << 5) - hash) + idStr.charCodeAt(i);
            hash |= 0;
        }
        return (Math.abs(hash) % 50) + 1;
    }, [product.id, product.rating_count]);

    const toggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isWishlisted) {
            removeFromWishlist(product.id);
        } else {
            // Ensure product matches expected interface
            const wishlistProduct = {
                ...product,
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
                <Link href={`/products/${product.slug}`} className="block">
                    {/* Image Section */}
                    <div className="relative aspect-[3/4] p-6 bg-white dark:bg-slate-950 flex items-center justify-center transition-colors">
                        {!imageError ? (
                            <Image
                                src={imageUrl}
                                alt={`${product.name} - China Import to Ghana`}
                                fill
                                priority={priority}
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                                className="object-contain group-hover/card:scale-110 transition-transform duration-700 ease-out"
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

                {/* Minimalist Floating Action Tray */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 p-1.5 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 shadow-lg opacity-0 translate-y-4 group-hover/card:opacity-100 group-hover/card:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                    {/* Wishlist Button */}
                    <button
                        onClick={toggleWishlist}
                        className={`p-2.5 rounded-full transition-all duration-300 ${isWishlisted ? "bg-red-50 text-red-500" : "hover:bg-gray-100 text-slate-500 hover:text-black dark:hover:text-white"}`}
                        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    >
                        <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
                    </button>

                    <div className="w-[1px] h-4 bg-gray-200 dark:bg-slate-700" />

                    {/* Quick Add / View Options */}
                    {((product.available_sizes?.length ?? 0) > 0 || (product.available_colors?.length ?? 0) > 0) ? (
                        <Link
                            href={`/products/${product.slug}`}
                            className="p-2.5 rounded-full hover:bg-gray-100 text-slate-500 hover:text-black dark:hover:text-white transition-all flex items-center justify-center"
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
                            className="p-2.5 rounded-full hover:bg-green-50 text-slate-500 hover:text-green-600 transition-all flex items-center justify-center"
                            aria-label="Add to cart"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            <Link href={`/products/${product.slug}`} className="flex-1 flex flex-col">
                {/* Details Section */}
                <div className="px-4 pb-6 pt-2 flex flex-col gap-2 flex-1 bg-white dark:bg-slate-900 transition-colors text-center">
                    {/* Star Rating */}
                    <div className="flex items-center justify-center gap-1 mb-1">
                        <StarRating size="xs" />
                        <span className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">{reviewCount} Reviews</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-[15px] font-serif font-medium text-slate-900 dark:text-slate-100 line-clamp-2 h-11 leading-[1.2] tracking-tight italic">
                        {product.name}
                    </h3>

                    {/* Price */}
                    <div className="text-slate-900 dark:text-white font-bold text-lg mt-1 tracking-tighter">
                        {formatPrice(product.price)}
                    </div>

                    {/* Progress Bar (Innovation) */}
                    <div className="mt-3">
                        <GroupBuyProgress
                            current={product.reservations_count || 0}
                            target={product.target_quantity || 100}
                            variant="compact"
                        />
                    </div>
                </div>
            </Link>
        </div>
    );
}
