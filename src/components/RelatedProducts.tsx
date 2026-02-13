'use client';

import { useEffect, useState } from 'react';
import { productsAPI } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/stores/cartStore';

interface RelatedProductsProps {
    currentSlug: string;
    categorySlug?: string;
}

export default function RelatedProducts({ currentSlug, categorySlug }: RelatedProductsProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRelated = async () => {
            // Need a category to fetch related items
            if (!categorySlug) {
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                // Fetch products by category
                const response = await productsAPI.list({ category: categorySlug });

                // Filter out current product and limit to 4
                // Note: API returns paginated response { count, next, previous, results }
                const results = response.data.results || [];
                const related = results
                    .filter((p: Product) => p.slug !== currentSlug)
                    .slice(0, 4);

                setProducts(related);
            } catch (error) {
                console.error("Failed to fetch related products", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRelated();
    }, [categorySlug, currentSlug]);

    if (!isLoading && products.length === 0) return null;

    return (
        <section className="py-12 border-t border-gray-100 dark:border-slate-800 mt-12 bg-gray-50 dark:bg-slate-900 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">You May Also Like</h2>

                {isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="aspect-[3/4] bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
