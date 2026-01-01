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

export default function ProductCard({ product }: ProductCardProps) {
    const router = useRouter();
    const [isAdding, setIsAdding] = useState(false);
    const addToCart = useCartStore(state => state.addToCart);

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation to details page
        e.stopPropagation();

        // Lazy Auth: No token check needed here. 
        // Store handles guest vs server cart.

        // Add to cart logic
        try {
            setIsAdding(true);
            await addToCart(product);
            // In a real app, we'd update global cart state here
            // alert("Added to cart!"); // Removed alert for smoother UX, maybe toast later
        } catch (error) {
            console.error(error);
            alert("Failed to add to cart. Please try again.");
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 flex flex-col h-full overflow-hidden">
            <Link href={`/products/${product.slug}`} className="flex-1 flex flex-col">
                {/* Image Section */}
                <div className="relative aspect-square p-4 bg-white flex items-center justify-center">
                    {/* Discount Badge (Mockup logic based on price diff if available, else static for now) */}
                    {/* <div className="absolute top-2 right-2 bg-orange-100 text-orange-600 px-2 py-0.5 rounded text-xs font-bold">
                        -40%
                    </div> */}

                    {product.reservations_count > 0 && (
                        <div className="absolute top-2 right-2 bg-yellow-50 text-orange-600 px-2 py-0.5 rounded text-xs font-bold border border-yellow-100">
                            {product.reservations_count} reserved
                        </div>
                    )}

                    {product.image ? (
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain hover:scale-105 transition-transform"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.parentElement!.innerHTML = `
                                    <div class="w-full h-full flex items-center justify-center text-gray-300">
                                        <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </div>
                                `;
                            }}
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
                        <span className="text-black font-bold text-lg">
                            GH₵ {product.price.toLocaleString()}.00
                        </span>
                    </div>

                    <div className="text-xs text-yellow-500 flex items-center gap-1 mb-2">
                        <StarRating size="sm" />
                        <span className="text-gray-400">({Math.floor(Math.random() * 50) + 1})</span>
                    </div>
                </div>
            </Link>

            {/* Faint Pink "Add to cart" button */}
            <div className="px-3 pb-3">
                <button
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className="w-full bg-pink-50 hover:bg-pink-100 text-pink-600 border border-pink-200 font-bold py-2 rounded text-sm transition-colors shadow-sm disabled:opacity-50"
                >
                    {isAdding ? 'Adding...' : 'Add to cart'}
                </button>
            </div>
        </div>
    );
}
