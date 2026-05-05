'use client';

import Link from 'next/link';
import { useWishlistStore } from '@/stores/wishlistStore';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/stores/cartStore';

// Wishlist View (uses existing store)
const WishlistView = () => {
    const { items } = useWishlistStore();

    return (
        <div className="space-y-12 animate-fade-in-up">
            {/* Architectural Header Archive */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 border-b border-slate-100 pb-10">
                <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Wishlist</p>
                    <h2 className="text-4xl font-black tracking-tighter text-slate-900 uppercase leading-none">
                        My Wishlist <sup className="text-lg font-black text-slate-200 tabular-nums">{items.length}</sup>
                    </h2>
                </div>
                {items.length > 0 && (
                    <Link href="/wishlist" className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 hover:text-slate-900 transition-colors border-b border-slate-100 hover:border-slate-900 pb-1">
                        View All
                    </Link>
                )}
            </div>

            {items.length === 0 ? (
                <div className="py-24 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                    <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Your wishlist is empty</p>
                    <Link href="/products" className="inline-block mt-6 text-[9px] font-black uppercase tracking-[0.4em] text-slate-900 border-b border-slate-900 pb-1">
                        Browse Catalog
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {items.slice(0, 8).map((product: Product) => (
                        <div key={product.id} className="group transition-all duration-700">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WishlistView;
