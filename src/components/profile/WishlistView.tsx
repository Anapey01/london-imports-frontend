'use client';

import Link from 'next/link';
import { useWishlistStore } from '@/stores/wishlistStore';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/stores/cartStore';

// Wishlist View (uses existing store)
const WishlistView = ({ theme }: { theme: string }) => {
    const isDark = theme === 'dark';
    const { items } = useWishlistStore();

    return (
        <div className="space-y-8">
            <div className={`border-b pb-4 ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
                <div className="flex items-end justify-between">
                    <h2 className={`text-2xl font-light tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Wishlist
                        <sup className={`ml-2 text-sm font-light ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>{items.length}</sup>
                    </h2>
                    {items.length > 0 && (
                        <Link href="/wishlist" className={`text-xs font-light border-b pb-0.5 transition-colors ${isDark ? 'border-slate-500 text-slate-400 hover:text-white hover:border-white' : 'border-gray-400 text-gray-500 hover:text-gray-900 hover:border-gray-900'}`}>
                            View full page
                        </Link>
                    )}
                </div>
            </div>

            {items.length === 0 ? (
                <div className="text-center py-16">
                    <svg className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-slate-700' : 'text-gray-200'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                    <p className={`text-sm font-light ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Your wishlist is empty</p>
                    <Link href="/products" className={`inline-block mt-4 text-xs border-b pb-0.5 ${isDark ? 'border-pink-400 text-pink-400' : 'border-pink-600 text-pink-600'}`}>
                        Start shopping
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {items.slice(0, 8).map((product: Product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default WishlistView;
