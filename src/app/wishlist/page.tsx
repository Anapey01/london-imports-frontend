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
        return <div className="min-h-screen bg-primary-surface pt-32 pb-20 flex justify-center"><div className="w-8 h-8 border-4 border-slate-950 dark:border-white border-t-transparent rounded-full animate-spin"></div></div>;
    }

    return (
        <div className="min-h-screen bg-primary-surface md:bg-secondary-surface pt-24 pb-20 md:pt-32 px-4 sm:px-6 lg:px-8 font-sans transition-all duration-500">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-end justify-between mb-8 border-b border-primary-surface pb-4">
                    <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-[0.3em] nuclear-text">
                        My Wishlist
                        <sup className="ml-2 text-[10px] font-black opacity-50"> {items.length} </sup>
                    </h1>
                </div>

                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="mb-6 opacity-30">
                            <Heart className="w-16 h-16 nuclear-svg" strokeWidth={1} />
                        </div>
                        <h2 className="text-xl font-medium mb-3 tracking-wide uppercase nuclear-text">Your wishlist is empty</h2>
                        <p className="mb-8 max-w-md font-light uppercase text-[10px] tracking-widest leading-relaxed nuclear-text opacity-50">
                            Items you save will appear here. <br /> Start browsing to build your collection.
                        </p>
                        <Link
                            href="/products"
                            className="group inline-flex items-center gap-2 border-b border-primary-surface pb-1 transition-colors uppercase text-[10px] tracking-widest font-black nuclear-text hover:text-emerald-500"
                        >
                            Start Shopping
                            <ShoppingBag className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform duration-300" />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
                        {items.map((product) => (
                            <ProductCard 
                                key={product.id} 
                                product={product} 
                                hideProgress={true}
                                hideRating={true}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
