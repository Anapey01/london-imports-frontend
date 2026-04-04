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
        <section className="py-16 border-t border-primary-surface/40 dark:border-slate-800/40 mt-16 bg-primary-surface/40 dark:bg-slate-900/40 backdrop-blur-xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12 animate-fade-in">
                    <h2 className="text-[10px] font-black nuclear-text dark:text-white opacity-40 dark:opacity-100 uppercase tracking-[0.4em]">
                        May Also Like
                    </h2>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="aspect-[3/4] bg-primary-surface/20 rounded-lg animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="flex overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-4 gap-4 sm:gap-6 animate-fade-in pb-8 md:pb-0 scrollbar-hide">
                        {products.map(product => (
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
                )}
            </div>
        </section>
    );
}
