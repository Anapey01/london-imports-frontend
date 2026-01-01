'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productsAPI } from '@/lib/api';
import ProductCard from '@/components/ProductCard';

interface ProductGridProps {
    initialProducts?: any[];
    categories?: any[];
}

export default function ProductGrid({ initialProducts = [], categories = [] }: ProductGridProps) {
    const [category, setCategory] = useState('');
    const [status, setStatus] = useState('');
    const [search, setSearch] = useState('');

    // Fetch categories dynamically (fallback to initial if simple, but here we might just re-use)
    // Actually, if we pass categories, we might not need to fetch immediately.
    // But filters are dynamic. Let's keep existing logic but use initial data.

    // Fetch products with filters
    const { data: productsData, isLoading } = useQuery({
        queryKey: ['products', category, status, search],
        queryFn: () => productsAPI.list({ category, status, search }),
    });

    // Helper to normalize data structure
    const getProducts = () => {
        // If we have query data, use it
        if (productsData?.data?.results) return productsData.data.results;
        if (productsData?.data && Array.isArray(productsData.data)) return productsData.data;
        // Fallback to initial if no filter applied (though initialData handles this)
        if (!category && !status && !search) return initialProducts;
        return [];
    };

    const products = getProducts();
    const displayCategories = categories.length > 0 ? categories : [];
    // We could also fetch categories if empty, but for now server passes them.

    return (
        <div>
            {/* Search and Filters */}
            <div className="bg-white rounded-xl p-4 mb-8 flex flex-wrap gap-4 items-center">
                {/* Search */}
                <div className="flex-1 min-w-[200px]">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                </div>

                {/* Category Filter */}
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 bg-white"
                >
                    <option value="">All Categories</option>
                    {displayCategories.map((cat: any) => (
                        <option key={cat.id} value={cat.slug}>{cat.name}</option>
                    ))}
                </select>

                {/* Status Filter */}
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 bg-white"
                >
                    <option value="">All Status</option>
                    <option value="PREORDER">Pre-order</option>
                    <option value="CLOSING_SOON">Closing Soon</option>
                    <option value="READY_TO_SHIP">Ready to Ship</option>
                </select>
            </div>

            {/* Products Grid */}
            {isLoading && !products.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="bg-white rounded-2xl overflow-hidden">
                            <div className="aspect-square skeleton"></div>
                            <div className="p-4 space-y-3">
                                <div className="h-4 skeleton rounded w-1/3"></div>
                                <div className="h-5 skeleton rounded w-2/3"></div>
                                <div className="h-4 skeleton rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white rounded-2xl">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-500">Try adjusting your filters or check back later</p>
                </div>
            )}
        </div>
    );
}
