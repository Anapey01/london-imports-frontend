'use client';

import { useEffect, useState } from 'react';
import { productsAPI } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/stores/cartStore';
import { motion } from 'framer-motion';

export default function OrderRecommendations({ orderItems }: { orderItems?: any[] }) {
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

                let recResults: Product[] = [];

                if (categories.length > 0) {
                    // Fetch items from the same category to provide smart "You Might Also Like" recommendations
                    const recResponse = await productsAPI.list({ category: categories[0], limit: 8 });
                    recResults = recResponse.data.results || [];
                    
                    // Filter out items the user just bought
                    const orderItemIds = orderItems?.map(item => item.product?.id) || [];
                    recResults = recResults.filter(p => !orderItemIds.includes(p.id));
                }

                // Fallback to random popular items if needed to fill the list
                if (recResults.length < 4) {
                    const fallbackResponse = await productsAPI.list({ limit: 12 });
                    const fallbackResults = fallbackResponse.data.results || [];
                    
                    const existingIds = new Set(recResults.map(p => p.id));
                    const orderItemIds = orderItems?.map(item => item.product?.id) || [];
                    
                    const validFallbacks = fallbackResults.filter(p => !existingIds.has(p.id) && !orderItemIds.includes(p.id));
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
