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

                // Filter out current product
                const results = response.data.results || [];
                let related = results.filter((p: Product) => p.slug !== currentSlug);

                // Shuffle array (Fisher-Yates)
                for (let i = related.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [related[i], related[j]] = [related[j], related[i]];
                }

                // Limit to 4
                related = related.slice(0, 4);

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
                <div className="text-center mb-10 animate-fade-in-up">
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white relative inline-block">
                        You May Also Like
                        <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-pink-500 rounded-full"></span>
                    </h2>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="aspect-[3/4] bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
