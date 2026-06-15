'use client';

import { useEffect, useState } from 'react';
import { productsAPI } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/stores/cartStore';
import { motion } from 'framer-motion';

export default function OrderRecommendations({ orderItems }: { orderItems?: Array<Record<string, any>> }) {
    const [recommendations, setRecommendations] = useState<Product[]>([]);
    const [trending, setTrending] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Determine user's recent shopping behavior from their order
                const categories = orderItems 
                    ? [...new Set(orderItems.map(item => item.product?.category?.slug || item.product?.category).filter(Boolean))]
                    : [];

                const productNames = orderItems
                    ? orderItems.map(item => item.product_name || item.product?.name).filter(Boolean)
                    : [];

                let recResults: Product[] = [];
                const orderItemIds = orderItems?.map(item => item.product?.id) || [];

                // 1. Ultra-Smart Match: Search by Brand/Keyword (Usually the first word of the product name)
                if (productNames.length > 0) {
                    // Extract the first word of the first item (typically the brand name like "Gucci", "Nike", etc.)
                    const mainKeyword = productNames[0].split(' ')[0];
                    if (mainKeyword && mainKeyword.length > 2) {
                        try {
                            const searchResponse = await productsAPI.list({ search: mainKeyword, limit: 8 });
                            const searchHits = searchResponse.data.results || [];
                            recResults = searchHits.filter((p: Product) => !orderItemIds.includes(p.id));
                        } catch (e) {
                            console.error("Smart keyword search failed", e);
                        }
                    }
                }

                // 2. Category Match: If keyword match didn't yield enough results, fill with same-category items
                if (recResults.length < 4 && categories.length > 0) {
                    const recResponse = await productsAPI.list({ category: categories[0], limit: 8 });
                    const catResults = recResponse.data.results || [];
                    
                    const existingIds = new Set(recResults.map(p => p.id));
                    const validCatHits = catResults.filter((p: Product) => !existingIds.has(p.id) && !orderItemIds.includes(p.id));
                    recResults = [...recResults, ...validCatHits];
                }

                // 3. Global Fallback: If still not enough, fetch random popular items
                if (recResults.length < 4) {
                    const fallbackResponse = await productsAPI.list({ limit: 12 });
                    const fallbackResults = fallbackResponse.data.results || [];
                    
                    const existingIds = new Set(recResults.map(p => p.id));
                    const validFallbacks = fallbackResults.filter((p: Product) => !existingIds.has(p.id) && !orderItemIds.includes(p.id));
                    recResults = [...recResults, ...validFallbacks];
                }
                
                // Shuffle to keep it fresh and pick 4
                const shuffledRec = recResults.sort(() => 0.5 - Math.random()).slice(0, 4);
                setRecommendations(shuffledRec);

                // Fetch trending/featured for "Viewed by Most"
                const trendResponse = await productsAPI.list({ featured: 'true', limit: 4 });
                setTrending(trendResponse.data.results || []);
            } catch (error) {
                console.error("Failed to fetch success page recommendations", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!isLoading && recommendations.length === 0 && trending.length === 0) return null;

const Section = ({ title, products }: { title: string, products: Product[] }) => (
    <div className="space-y-8">
        <h2 className="text-[10px] font-semibold uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500 text-center">
            {title}
        </h2>
        <div className="flex overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-4 gap-4 sm:gap-6 pb-4 md:pb-0 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
            {products.map(product => (
                <div key={product.id} className="flex-none w-[75%] md:w-auto snap-center">
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
);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-20 space-y-24"
        >
            {recommendations.length > 0 && (
                <Section title="You Might Also Like" products={recommendations} />
            )}
            
            {trending.length > 0 && (
                <Section title="Viewed by Most Customers" products={trending} />
            )}
        </motion.div>
    );
}
