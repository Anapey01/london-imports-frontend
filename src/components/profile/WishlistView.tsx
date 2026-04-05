'use client';

import Link from 'next/link';
import { useWishlistStore } from '@/stores/wishlistStore';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/stores/cartStore';

// Wishlist View (uses existing store)
const WishlistView = () => {
    const { items } = useWishlistStore();

    return (
        <div className="space-y-8">
            <div className="border-b pb-4 border-border-standard">
                <div className="flex items-end justify-between">
                    <h2 className="text-2xl font-black tracking-tight text-content-primary uppercase">
                        Wishlist
                        <sup className="ml-2 text-sm font-black text-content-secondary">{items.length}</sup>
                    </h2>
                    {items.length > 0 && (
                        <Link href="/wishlist" className="text-[10px] font-black uppercase tracking-widest border-b pb-0.5 border-border-standard text-content-secondary hover:text-content-primary hover:border-content-primary transition-all">
                            View full page
                        </Link>
                    )}
                </div>
            </div>

            {items.length === 0 ? (
                <div className="text-center py-16">
                    <svg className="w-12 h-12 mx-auto mb-4 text-content-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                    <p className="text-[10px] font-black uppercase tracking-widest text-content-secondary">Your wishlist is empty</p>
                    <Link href="/products" className="inline-block mt-4 text-[10px] font-black uppercase tracking-widest border-b pb-0.5 border-content-primary text-content-primary">
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
