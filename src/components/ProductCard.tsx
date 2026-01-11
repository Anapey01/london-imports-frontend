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
                image: product.image || ""
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
            const anyError = error as any;
            const errorMessage = anyError?.response?.data?.detail || anyError?.response?.data?.error || "Failed to add to cart. Please try again.";
            alert(errorMessage);
        } finally {
            setIsAdding(false);
        }
    };

    const imageUrl = getImageUrl(product.image);

    return (
        <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 flex flex-col h-full overflow-hidden">
            <Link href={`/products/${product.slug}`} className="flex-1 flex flex-col">
                {/* Image Section */}
                <div className="relative aspect-square p-4 bg-white flex items-center justify-center">
                    {(product.reservations_count || 0) > 0 && (
                        <div className="absolute top-2 right-2 bg-yellow-50 text-orange-800 px-2 py-0.5 rounded text-xs font-bold border border-yellow-100 z-10">
                            {product.reservations_count || 0} reserved
                        </div>
                    )}

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
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                    )}

                    {/* Wishlist Button */}
                    <button
                        onClick={toggleWishlist}
                        className="absolute top-2 left-2 z-20 p-1.5 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white text-gray-400 hover:text-pink-500 transition-all shadow-sm group"
                        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    >
                        <Heart className={`w-5 h-5 transition-colors ${isWishlisted ? "fill-pink-500 text-pink-500" : "group-hover:text-pink-500"}`} />
                    </button>
                </div>

                {/* Details Section */}
                <div className="p-3 flex flex-col gap-1 flex-1">
                    <h3 className="text-sm font-normal text-gray-700 line-clamp-2 min-h-[40px] leading-tight">
                        {product.name}
                    </h3>

                    <div className="mt-1">
                        {/* Price - Always Visible for Guests */}
                        <span className="text-black font-bold text-lg">
                            GH₵ {Number(product.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    </div>

                    <div className="text-xs text-yellow-500 flex items-center gap-1 mb-2">
                        <StarRating size="sm" />
                        <span className="text-gray-500">({Math.floor(Math.random() * 50) + 1})</span>
                    </div>
                </div>
            </Link>

            {/* Add to cart icon button */}
            <div className="px-3 pb-3 flex justify-center">
                <button
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className="flex flex-col items-center gap-0.5 px-4 py-2 text-gray-600 hover:text-pink-600 transition-colors"
                    aria-label="Add to cart"
                >
                    <div className="relative">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-gray-700 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                            +
                        </span>
                    </div>
                    <span className="text-[10px] whitespace-nowrap">Add to cart</span>
                </button>
            </div>
        </div>
    );
}
