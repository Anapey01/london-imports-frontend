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
                    <div className="text-center py-32 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm animate-fade-in">
                        <div className="w-24 h-24 bg-slate-50 dark:bg-slate-950 rounded-full flex items-center justify-center mx-auto mb-10 border border-slate-100 dark:border-slate-900 shadow-inner">
                            <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3" />
                            </svg>
                        </div>
                        <h3 className="text-3xl font-serif font-black text-slate-900 dark:text-white mb-4">Our scouts are currently in the field.</h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-10 text-sm leading-relaxed">
                            Can&apos;t find the exact piece you&apos;re looking for? Let our sourcing team find it for you directly from the source.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a
                                href={siteConfig.socials.concierge}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-8 py-4 rounded-full font-bold hover:scale-105 transition-all active:scale-95 shadow-xl flex items-center gap-2"
                            >
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.21-3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                Request Custom Sourcing
                            </a>
                            <button
                                onClick={clearFilters}
                                className="text-slate-400 hover:text-pink-600 font-black text-[10px] uppercase tracking-[0.5em] transition-all"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
