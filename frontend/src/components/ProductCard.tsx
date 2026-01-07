/**
 * London's Imports - Product Card Component (Redesigned)
 * Matching the screenshot design: White card, Faint Pink Button, Clean Typography
 */
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import StarRating from '@/components/StarRating';
import { useCartStore } from '@/stores/cartStore';
import { useState } from 'react';

interface ProductCardProps {
    product: {
        id: string;
        name: string;
        slug: string;
        image: string | null;
        price: number;
        deposit_amount: number;
        preorder_status: string;
        delivery_window_text: string;
        reservations_count: number;
        vendor_name: string;
        cutoff_date?: string;
    };
}

import { useAuthStore } from '@/stores/authStore';

import Image from 'next/image';
import { getImageUrl } from '@/lib/image';

export default function ProductCard({ product }: ProductCardProps) {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const [isAdding, setIsAdding] = useState(false);
    const [imageError, setImageError] = useState(false);
    const addToCart = useCartStore(state => state.addToCart);

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Guest Checkout: Allow adding to cart without login
        // if (!isAuthenticated) { ... } REMOVED

        try {
            setIsAdding(true);
            await addToCart(product);
        } catch (error) {
            console.error(error);
            alert("Failed to add to cart. Please try again.");
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
                    {product.reservations_count > 0 && (
                        <div className="absolute top-2 right-2 bg-yellow-50 text-orange-600 px-2 py-0.5 rounded text-xs font-bold border border-yellow-100 z-10">
                            {product.reservations_count} reserved
                        </div>
                    )}

                    {!imageError ? (
                        <Image
                            src={imageUrl}
                            alt={`${product.name} - China Import to Ghana`}
                            fill
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
