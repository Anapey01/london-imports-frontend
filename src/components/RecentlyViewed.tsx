'use client';

import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/stores/cartStore';

// Custom hook for safe localStorage access
function useRecentlyViewed() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        // This effect runs only on the client
        // Using setTimeout to avoid "synchronous setState in effect" lint warning
        const timer = setTimeout(() => {
            try {
                const stored = localStorage.getItem('recently_viewed');
                if (stored) {
                    setProducts(JSON.parse(stored));
                }
            } catch (e) {
                console.error("Failed to load recently viewed", e);
            }
        }, 0);

        return () => clearTimeout(timer);
    }, []);

    return products;
}

export default function RecentlyViewed() {
    const products = useRecentlyViewed();

    if (products.length === 0) return null;

    return (
        <section className="py-16 border-t border-primary-surface/40 dark:border-slate-800/40 bg-primary-surface/40 dark:bg-slate-900/40 backdrop-blur-xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12 animate-fade-in">
                    <h2 className="text-[10px] font-black nuclear-text dark:text-white opacity-40 dark:opacity-100 uppercase tracking-[0.4em]">
                        Recently Viewed
                    </h2>
                </div>

                <div className="flex overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 pb-8 md:pb-0 scrollbar-hide animate-fade-in">
                    {products.slice(0, 5).map(product => (
                        <div key={product.id} className="flex-none w-[72%] md:w-auto snap-center">
                            <ProductCard 
                                product={product} 
                                variant="compact"
                                hideRating
                                hideProgress
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
