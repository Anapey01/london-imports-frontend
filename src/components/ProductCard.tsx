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
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-slate-700 flex flex-col h-full overflow-hidden group/card relative">

            <div className="relative">
                <Link href={`/products/${product.slug}`} className="block">
                    {/* Image Section */}
                    <div className="relative aspect-[3/4] p-4 bg-white dark:bg-slate-800 flex items-center justify-center transition-colors">
                        {!imageError ? (
                            <Image
                                src={imageUrl}
                                alt={`${product.name} - China Import to Ghana`}
                                fill
                                priority={priority}
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                                className="object-contain hover:scale-105 transition-transform duration-300"
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-slate-600">
                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                        )}
                    </div>
                </Link>

                {/* Floating Action Buttons (Right Side) - Positioned over image */}
                <div className="absolute bottom-2 right-2 z-20 flex flex-col gap-2 transition-opacity duration-300">
                    {/* Wishlist Button */}
                    <button
                        onClick={toggleWishlist}
                        className="p-2 rounded-full bg-white dark:bg-slate-700 text-gray-400 hover:text-pink-500 shadow-md hover:shadow-lg transition-all"
                        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    >
                        <Heart className={`w-4 h-4 ${isWishlisted ? "fill-pink-500 text-pink-500" : ""}`} />
                    </button>

                    {/* Quick Add / View Options */}
                    {((product.available_sizes?.length ?? 0) > 0 || (product.available_colors?.length ?? 0) > 0) ? (
                        <Link
                            href={`/products/${product.slug}`}
                            className="p-2 rounded-full bg-white dark:bg-slate-700 text-gray-600 dark:text-slate-400 hover:text-black dark:hover:text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center"
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
                            className="p-2 rounded-full bg-white dark:bg-slate-700 text-gray-600 dark:text-slate-400 hover:text-pink-600 dark:hover:text-pink-400 shadow-md hover:shadow-lg transition-all flex items-center justify-center"
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
                <div className="px-3 pb-4 pt-1 flex flex-col gap-1.5 flex-1 bg-white dark:bg-slate-800 transition-colors text-center">
                    {/* Star Rating */}
                    <div className="flex items-center justify-center gap-1">
                        <StarRating size="xs" />
                        <span className="text-[10px] text-gray-500 dark:text-gray-400">({Math.floor(Math.random() * 50) + 1})</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-1 leading-tight">
                        {product.name}
                    </h3>

                    {/* Price */}
                    <div className="text-gray-900 dark:text-white font-bold text-base mt-1">
                        GH₵ {Number(product.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                </div>
            </Link>
        </div>
    );
}
