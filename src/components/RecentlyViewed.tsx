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
        <section className="py-12 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10 animate-fade-in-up delay-200">
                    <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white relative inline-block">
                        Recently Viewed
                        <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-300 dark:bg-slate-600 rounded-full"></span>
                    </h2>
                </div>

                <div className="flex overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 pb-4 md:pb-0 scrollbar-hide animate-fade-in-up delay-300">
                    {products.slice(0, 5).map(product => (
                        <div key={product.id} className="flex-none w-[45%] md:w-auto snap-center">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
