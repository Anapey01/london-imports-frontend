/**
 * London's Imports - Wishlist Page
 * Displays saved items using the persistent wishlist store
 */
'use client';

import { useWishlistStore } from '@/stores/wishlistStore';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function WishlistPage() {
    const { items } = useWishlistStore();
    const [mounted, setMounted] = useState(false);

    // Hydration fix
    useEffect(() => {
        const timer = setTimeout(() => {
            setMounted(true);
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    if (!mounted) {
        return <div className="min-h-screen bg-gray-50 pt-32 pb-20 flex justify-center"><div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div></div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-20 md:pt-32 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-end justify-between mb-8 border-b border-gray-200 pb-4">
                    <h1 className="text-3xl md:text-4xl font-light text-gray-900 tracking-tight">
                        My Wishlist
                        <sup className="ml-2 text-sm font-medium text-gray-500">{items.length}</sup>
                    </h1>
                </div>

                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="mb-6 opacity-30">
                            <Heart className="w-16 h-16 text-gray-900" strokeWidth={1} />
                        </div>
                        <h2 className="text-xl font-medium text-gray-900 mb-3 tracking-wide">Your wishlist is empty</h2>
                        <p className="text-gray-500 mb-8 max-w-md font-light">
                            Items you save will appear here. Start browsing to build your collection.
                        </p>
                        <Link
                            href="/products"
                            className="group inline-flex items-center gap-2 border-b border-gray-900 pb-1 text-gray-900 hover:text-pink-600 hover:border-pink-600 transition-colors uppercase text-xs tracking-widest font-medium"
                        >
                            Start Shopping
                            <ShoppingBag className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform duration-300" />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
                        {items.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
