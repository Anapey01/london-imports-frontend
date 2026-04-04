'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { productsAPI } from '@/lib/api';
import { siteConfig } from '@/config/site';
import ProductCard from '@/components/ProductCard';
import SkeletonCard from '@/components/SkeletonCard';
import { trackViewItemList, trackViewSearchResults } from '@/lib/analytics';
import { useEffect, useRef } from 'react';
import { Zap, ArrowRight } from 'lucide-react';

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
    const router = useRouter();
    const pathname = usePathname();

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

    // Helpers
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

    const getProducts = () => {
        if (productsData?.data?.results) return productsData.data.results;
        if (productsData?.data && Array.isArray(productsData.data)) return productsData.data;
        if (!category && !status && !search && !featured && !minPrice && !maxPrice) return initialProducts;
        return [];
    };

    const products = getProducts();

    // GA4 Tracking
    const lastTrackedParams = useRef('');
    useEffect(() => {
        if (!isLoading && products.length > 0) {
            const currentParams = `${category}-${status}-${search}-${featured}-${vendorSlug}`;
            if (lastTrackedParams.current !== currentParams) {
                let listName = 'General Product List';
                if (category) listName = `Category: ${category}`;
                if (featured) listName = 'Featured Products';
                if (status === 'READY_TO_SHIP') listName = 'Ready to Ship';
                if (vendorSlug) listName = `Vendor: ${vendorSlug}`;

                trackViewItemList(products, listName);
                if (search) trackViewSearchResults(search as string, products.length);
                lastTrackedParams.current = currentParams;
            }
        }
    }, [products, isLoading, category, status, search, featured, vendorSlug]);

    return (
        <div className="flex flex-col lg:flex-row gap-16 py-12">
            {/* 1. MINIMALIST SIDEBAR (Editorial Pro) */}
            {!hideFilters && (
                <aside className="hidden lg:block w-72 flex-shrink-0 space-y-16 sticky top-32 self-start">
                    
                    {/* Search Registry */}
                    <div className="pb-10 border-b border-slate-100 group">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-6">Search Registry</h3>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="FIND PIECE..."
                                defaultValue={search}
                                onBlur={(e) => updateSearch({ search: e.target.value })}
                                onKeyDown={(e) => { if (e.key === 'Enter') updateSearch({ search: (e.target as HTMLInputElement).value }); }}
                                className="w-full bg-transparent border-b border-slate-200 focus:border-black dark:border-slate-800 dark:focus:border-white rounded-none text-xs font-bold uppercase tracking-widest py-2 outline-none transition-colors placeholder:opacity-20 dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Collections */}
                    <div className="pb-10 border-b border-slate-100">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-8">Collections</h3>
                        <div className="space-y-4">
                            <button
                                onClick={() => updateSearch({ category: '' })}
                                className={`block w-full text-left text-[11px] font-bold uppercase tracking-widest transition-all ${!category ? 'text-emerald-600 dark:text-emerald-400 border-l-2 border-emerald-600 dark:border-emerald-400 pl-4' : 'text-slate-400 dark:text-slate-600 hover:text-black dark:hover:text-white hover:pl-2 pl-0'}`}
                            >
                                All Arrivals
                            </button>
                            {categories.map((cat: Category) => (
                                <button
                                    key={cat.id}
                                    onClick={() => updateSearch({ category: cat.slug })}
                                    className={`block w-full text-left text-[11px] font-bold uppercase tracking-widest transition-all ${category === cat.slug ? 'text-emerald-600 dark:text-emerald-400 border-l-2 border-emerald-600 dark:border-emerald-400 pl-4' : 'text-slate-400 dark:text-slate-600 hover:text-black dark:hover:text-white hover:pl-2 pl-0'}`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Pipeline / Status */}
                    <div className="pb-10 border-b border-slate-100">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-8">Pipeline</h3>
                        <div className="space-y-4">
                            {[
                                { label: 'All Items', value: '' },
                                { label: 'Pre-order', value: 'PREORDER' },
                                { label: 'Closing Soon', value: 'CLOSING_SOON' },
                                { label: 'Ready to Ship', value: 'READY_TO_SHIP' },
                            ].map((s) => (
                                <button
                                    key={s.value}
                                    onClick={() => updateSearch({ status: s.value })}
                                    className={`block w-full text-left text-[11px] font-bold uppercase tracking-widest transition-all ${status === s.value ? 'text-emerald-600 dark:text-emerald-400 border-l-2 border-emerald-600 dark:border-emerald-400 pl-4' : 'text-slate-400 dark:text-slate-600 hover:text-black dark:hover:text-white hover:pl-2 pl-0'}`}
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Valuation (Price Range) */}
                    <div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-8">Valuation (GHS)</h3>
                        <div className="flex items-center gap-4">
                            <input
                                type="number"
                                placeholder="MIN"
                                defaultValue={minPrice}
                                onBlur={(e) => updateSearch({ min_price: e.target.value })}
                                className="w-full bg-transparent border-b border-slate-100 dark:border-slate-800 focus:border-black dark:focus:border-white rounded-none text-xs font-bold py-1 outline-none transition-colors dark:text-white"
                            />
                            <span className="text-slate-200">/</span>
                            <input
                                type="number"
                                placeholder="MAX"
                                defaultValue={maxPrice}
                                onBlur={(e) => updateSearch({ max_price: e.target.value })}
                                className="w-full bg-transparent border-b border-slate-100 dark:border-slate-800 focus:border-black dark:focus:border-white rounded-none text-xs font-bold py-1 outline-none transition-colors dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Reset Action */}
                    <button
                        onClick={clearFilters}
                        className="w-full pt-10 text-[9px] font-black uppercase tracking-[0.4em] text-slate-300 dark:text-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors text-left"
                    >
                        [ Reset Archives ]
                    </button>
                </aside>
            )}

            {/* 2. PRODUCT GRID (Editorial Layout) */}
            <main className="flex-1">
                {/* Mobile Collections Bar */}
                {!hideFilters && (
                    <div className="lg:hidden mb-12 flex items-center gap-6 overflow-x-auto pb-4 no-scrollbar border-b border-slate-100">
                        <button
                            onClick={clearFilters}
                            className={`text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${!category ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-600'}`}
                        >
                            All
                        </button>
                        {categories.map((cat: Category) => (
                            <button
                                key={cat.id}
                                onClick={() => updateSearch({ category: cat.slug })}
                                className={`text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${category === cat.slug ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-600'}`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                )}

                {/* Filter Breadcrumbs */}
                {(category || status || search || minPrice || maxPrice) && (
                    <div className="flex flex-wrap items-center gap-3 mb-10 text-[10px] font-bold uppercase tracking-widest text-slate-300 dark:text-slate-700">
                        <span>Registry:</span>
                        {category && <span className="text-slate-900 dark:text-white border-b border-slate-900 dark:border-white">CAT_{category}</span>}
                        {status && <span className="text-slate-900 dark:text-white border-b border-slate-900 dark:border-white">STS_{status}</span>}
                        {search && <span className="text-slate-900 dark:text-white border-b border-slate-900 dark:border-white">&quot;{search}&quot;</span>}
                        <button onClick={clearFilters} className="ml-4 text-emerald-600 dark:text-emerald-400 hover:text-black dark:hover:text-white transition-colors">[ Clear ]</button>
                    </div>
                )}

                {/* The Grid */}
                {isLoading && !products.length ? (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                        {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 animate-fade-in">
                        {products.map((product: Product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-40 bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                         <Zap className="w-10 h-10 text-slate-200 dark:text-slate-800 mx-auto mb-8 opacity-40" />
                         <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-4">Archives Empty.</h3>
                         <p className="text-xs text-slate-400 dark:text-slate-600 font-medium max-w-xs mx-auto leading-relaxed mb-10">
                            Our scouts are currently in the field. Let our sourcing team find your specific piece directly.
                         </p>
                         <div className="flex justify-center">
                            <a
                                href={siteConfig.socials.concierge}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 dark:text-white border-b-2 border-black dark:border-white pb-2 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-600 dark:hover:border-emerald-400 transition-all group"
                            >
                                Request Custom Sourcing
                                <ArrowRight className="w-4 h-4 translate-x-0 group-hover:translate-x-2 transition-transform" />
                            </a>
                         </div>
                    </div>
                )}
            </main>
        </div>
    );
}
