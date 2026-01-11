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
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
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
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                    {products.map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-pink-100">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <svg className="w-10 h-10 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-3">More Exclusive Collections Dropping Soon</h3>
                    <p className="text-gray-600 max-w-md mx-auto mb-8 leading-relaxed">
                        Our pre-order batches sell out fast. Join our community to get
                        <span className="font-semibold text-pink-600"> early access </span>
                        and be the first to know when new stock arrives.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a
                            href="https://chat.whatsapp.com/GzJtX9xJzJzJzJzJzJzJz"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-full transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.017-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                            </svg>
                            Join on WhatsApp
                        </a>
                        <span className="text-gray-400 text-sm">or</span>
                        <a
                            href="/register"
                            className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 font-bold px-8 py-3 rounded-full transition-colors"
                        >
                            Create Account
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}
