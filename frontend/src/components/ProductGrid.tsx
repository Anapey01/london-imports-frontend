/**
 * ProductGrid.tsx
 * Feed of 10 products for the homepage
 */
'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productsAPI } from '@/lib/api';
import ProductCard from './ProductCard';
import Link from 'next/link';

export default function ProductGrid() {
    const [products, setProducts] = useState<any[]>([]);

    // Filtering state
    const [sortBy, setSortBy] = useState('newest');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const params: any = {
                    limit: 10, // User requested exactly 10 items
                    offset: 0,
                    is_active: true
                };

                // Apply sorting
                if (sortBy === 'newest') params.ordering = '-created_at';
                if (sortBy === 'price-asc') params.ordering = 'price';
                if (sortBy === 'price-desc') params.ordering = '-price';

                const response = await productsAPI.list(params);
                setProducts(response.data.results || response.data || []);

            } catch (error) {
                console.error('Failed to fetch products:', error);
            }
        };

        fetchProducts();
    }, [sortBy]);

    return (
        <section className="py-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header removed as per user request to 'remove Just For You' and show pure grid */}
                <div className="mt-4"></div>

                {/* Product Grid - 2 cols mobile */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
                    {products.map((product, index) => (
                        <ProductCard key={`${product.id}-${index}`} product={product} />
                    ))}
                </div>

                {/* Loading State */}
                {products.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        No products found.
                    </div>
                )}

                {/* See More Button */}
                <div className="mt-10 flex justify-center">
                    <Link
                        href="/products"
                        className="bg-white border border-gray-300 text-gray-700 px-8 py-3 rounded-full font-medium hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm flex items-center gap-2"
                    >
                        See More Deals
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}
