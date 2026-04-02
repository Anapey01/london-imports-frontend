'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { productsAPI } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import SkeletonCard from '@/components/SkeletonCard';

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    image: string;
    category?: Category;
    status?: string;
}

interface ProductGridProps {
    initialProducts?: Product[];
    categories?: Category[];
    initialSearch?: string;
    initialCategory?: string;
    initialFeatured?: boolean;
    initialStatus?: string;
    vendorSlug?: string;
    hideFilters?: boolean;
}

export default function ProductGrid({
    initialProducts = [],
    categories = [],
    initialSearch = '',
    initialCategory = '',
    initialFeatured = false,
    initialStatus = '',
    vendorSlug = '',
    hideFilters = false
}: ProductGridProps) {
    const searchParams = useSearchParams();
    // Derived state from URL - always reactive
    const category = searchParams.get('category') || initialCategory;
    const status = searchParams.get('status') || initialStatus;
    const search = searchParams.get('search') || initialSearch;
    const featured = searchParams.get('featured') === 'true' || initialFeatured;
    const minPrice = searchParams.get('min_price') ?? '';
    const maxPrice = searchParams.get('max_price') ?? '';

    // Fetch products with filters
    const { data: productsData, isLoading } = useQuery({
        queryKey: ['products', category, status, search, featured, minPrice, maxPrice, vendorSlug],
        queryFn: () => productsAPI.list({
            category,
            status,
            search,
            featured,
            min_price: minPrice,
            max_price: maxPrice,
            vendor: vendorSlug
        }),
    });

    const router = useRouter();
    const pathname = usePathname();

    // Helper to update URL params
    const updateSearch = (paramsToUpdate: Record<string, string>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(paramsToUpdate).forEach(([name, value]) => {
            if (value) {
                params.set(name, value);
            } else {
                params.delete(name);
            }
        });
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const clearFilters = () => {
        router.push(pathname, { scroll: false });
    };

    // Helper to normalize data structure
    const getProducts = () => {
        if (productsData?.data?.results) return productsData.data.results;
        if (productsData?.data && Array.isArray(productsData.data)) return productsData.data;
        if (!category && !status && !search && !featured && !minPrice && !maxPrice) return initialProducts;
        return [];
    };

    const products = getProducts();

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters - Desktop */}
            {!hideFilters && (
                <aside className="hidden lg:block w-64 flex-shrink-0 space-y-8 sticky top-24 self-start">
                {/* Search */}
                <div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Search</h3>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Find something..."
                            defaultValue={search}
                            onBlur={(e) => updateSearch({ search: e.target.value })}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') updateSearch({ search: (e.target as HTMLInputElement).value });
                            }}
                            className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all outline-none"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                    </div>
                </div>

                {/* Categories */}
                <div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Categories</h3>
                    <div className="space-y-2">
                        <button
                            onClick={() => updateSearch({ category: '' })}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!category ? 'bg-pink-50 text-pink-600 font-bold' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            All Products
                        </button>
                        {categories.map((cat: Category) => (
                            <button
                                key={cat.id}
                                onClick={() => updateSearch({ category: cat.slug })}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${category === cat.slug ? 'bg-pink-50 text-pink-600 font-bold' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Status */}
                <div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Status</h3>
                    <div className="space-y-2">
                        {[
                            { label: 'All Items', value: '' },
                            { label: 'Pre-order', value: 'PREORDER' },
                            { label: 'Closing Soon', value: 'CLOSING_SOON' },
                            { label: 'Ready to Ship', value: 'READY_TO_SHIP' },
                        ].map((s) => (
                            <button
                                key={s.value}
                                onClick={() => updateSearch({ status: s.value })}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${status === s.value ? 'bg-pink-50 text-pink-600 font-bold' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Price Range */}
                <div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Price Range (GHS)</h3>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            placeholder="Min"
                            defaultValue={minPrice}
                            onBlur={(e) => updateSearch({ min_price: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-pink-500"
                        />
                        <span className="text-gray-400">—</span>
                        <input
                            type="number"
                            placeholder="Max"
                            defaultValue={maxPrice}
                            onBlur={(e) => updateSearch({ max_price: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-pink-500"
                        />
                    </div>
                </div>

                {/* Clear All */}
                <button
                    onClick={clearFilters}
                    className="w-full py-2.5 text-sm font-semibold text-gray-500 hover:text-pink-600 border border-gray-200 rounded-xl hover:border-pink-200 transition-colors"
                >
                    Clear All Filters
                </button>
            </aside>
            )}

            {/* Main Content Area */}
            <div className="flex-1">
                {/* Mobile Filter Header / Horizontal bar */}
                {!hideFilters && (
                    <div className="lg:hidden mb-6 flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
                    <button
                        onClick={clearFilters}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-full text-xs font-bold whitespace-nowrap"
                    >
                        All
                    </button>
                    {categories.map((cat: Category) => (
                        <button
                            key={cat.id}
                            onClick={() => updateSearch({ category: cat.slug })}
                            className={`px-4 py-2 border rounded-full text-xs font-bold whitespace-nowrap transition-colors ${category === cat.slug ? 'bg-pink-600 border-pink-600 text-white' : 'bg-white border-gray-200 text-gray-600'}`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
                )}

                {/* Active Filters Display */}
                {(category || status || search || minPrice || maxPrice) && (
                    <div className="flex flex-wrap items-center gap-2 mb-6">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mr-2">Filtered:</span>
                        {category && <span className="bg-white border border-gray-200 px-3 py-1 rounded-full text-xs font-medium text-gray-600 flex items-center gap-2">{category} <button onClick={() => updateSearch({ category: '' })} className="hover:text-pink-600">×</button></span>}
                        {status && <span className="bg-white border border-gray-200 px-3 py-1 rounded-full text-xs font-medium text-gray-600 flex items-center gap-2">{status} <button onClick={() => updateSearch({ status: '' })} className="hover:text-pink-600">×</button></span>}
                        {search && <span className="bg-white border border-gray-200 px-3 py-1 rounded-full text-xs font-medium text-gray-600 flex items-center gap-2">&quot;{search}&quot; <button onClick={() => updateSearch({ search: '' })} className="hover:text-pink-600">×</button></span>}
                        {(minPrice || maxPrice) && <span className="bg-white border border-gray-200 px-3 py-1 rounded-full text-xs font-medium text-gray-600 flex items-center gap-2">GHS {minPrice || 0} - {maxPrice || '∞'} <button onClick={() => updateSearch({ min_price: '', max_price: '' })} className="hover:text-pink-600">×</button></span>}
                    </div>
                )}

                {/* Products Grid */}
                {isLoading && !products.length ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4 lg:gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4 lg:gap-6">
                        {products.map((product: Product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No matching products</h3>
                        <p className="text-gray-500 max-w-sm mx-auto mb-8 text-sm">
                            We couldn&apos;t find what you&apos;re looking for. Try adjusting your filters or search terms.
                        </p>
                        <button
                            onClick={clearFilters}
                            className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-900 transition-all active:scale-95"
                        >
                            Reset All Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
