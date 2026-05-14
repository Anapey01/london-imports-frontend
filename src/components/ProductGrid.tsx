/**
 * London's Imports - Product Grid
 * Hardened for WCAG 'Understandable' & 'Operable' Compliance
 */
'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useInfiniteQuery } from '@tanstack/react-query';
import { productsAPI } from '@/lib/api';
import { siteConfig } from '@/config/site';
import ProductCard from '@/components/ProductCard';
import SkeletonCard from '@/components/SkeletonCard';
import { trackViewItemList, trackViewSearchResults } from '@/lib/analytics';
import { useEffect, useRef } from 'react';
import { Zap, ArrowRight, Search, ListFilter, Loader2 } from 'lucide-react';

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

    // Advanced Pagination Logic: Infinite Batching
    const PAGE_SIZE = 50;
    
    const { 
        data: infiniteData, 
        fetchNextPage, 
        hasNextPage, 
        isFetchingNextPage, 
        isLoading 
    } = useInfiniteQuery({
        queryKey: ['products-paginated', category, status, search, featured, minPrice, maxPrice, vendorSlug],
        queryFn: ({ pageParam = 1 }) => productsAPI.list({
            category,
            status,
            search,
            featured,
            min_price: minPrice,
            max_price: maxPrice,
            vendor: vendorSlug,
            limit: PAGE_SIZE,
            page: pageParam
        }).then(res => res.data),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            // Check if there are more results based on the 'next' URL from backend
            return lastPage.next ? allPages.length + 1 : undefined;
        },
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

    const products = infiniteData 
        ? infiniteData.pages.flatMap(page => page.results || page) 
        : initialProducts;

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
                if (search) trackViewSearchResults(search as string, products.length, products);
                lastTrackedParams.current = currentParams;
            }
        }
    }, [products, isLoading, category, status, search, featured, vendorSlug]);

    return (
        <div className="flex flex-col lg:flex-row gap-16 py-12">
            {/* 1. MINIMALIST SIDEBAR (Editorial Pro) */}
            {!hideFilters && (
                <aside className="hidden lg:block w-72 flex-shrink-0 space-y-16 sticky top-32 self-start max-h-[calc(100vh-160px)] overflow-y-auto no-scrollbar pr-4">
                    
                    {/* Search Registry Hardened for Understandability */}
                    <div className="pb-10 border-b border-border-standard group">
                        <label 
                            htmlFor="grid-search"
                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-content-secondary opacity-40 group-focus-within:opacity-100 transition-opacity mb-6"
                        >
                            <Search className="w-3 h-3" />
                            Search Collection
                        </label>
                        <div className="relative">
                            <input
                                id="grid-search"
                                type="text"
                                placeholder="FIND PIECE..."
                                defaultValue={search}
                                onBlur={(e) => updateSearch({ search: e.target.value })}
                                onKeyDown={(e) => { if (e.key === 'Enter') updateSearch({ search: (e.target as HTMLInputElement).value }); }}
                                className="w-full bg-transparent border-b border-border-standard focus:border-brand-emerald rounded-none text-xs font-bold uppercase tracking-widest py-2 outline-none transition-all placeholder:opacity-20 text-content-primary institutional-focus"
                            />
                        </div>
                    </div>

                    {/* Collections - Hardened Labels */}
                    <div className="pb-10 border-b border-border-standard">
                        <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-content-secondary opacity-40 mb-8">
                            <ListFilter className="w-3 h-3" />
                            Product Categories
                        </h3>
                        <div className="space-y-4">
                            <button
                                onClick={() => updateSearch({ category: '' })}
                                className={`block w-full text-left text-[11px] font-bold uppercase tracking-widest transition-all institutional-focus rounded-sm py-1.5 ${!category ? 'text-brand-emerald border-l-2 border-brand-emerald pl-4' : 'text-content-secondary opacity-40 hover:opacity-100 hover:text-content-primary hover:pl-2 pl-0'}`}
                            >
                                All Arrivals
                            </button>
                            {categories.map((cat: any) => (
                                <button
                                    key={cat.id}
                                    onClick={() => updateSearch({ category: cat.slug })}
                                    className={`block w-full text-left text-[11px] font-bold uppercase tracking-widest transition-all institutional-focus rounded-sm py-1.5 ${category === cat.slug ? 'text-brand-emerald border-l-2 border-brand-emerald pl-4' : 'text-content-secondary opacity-40 hover:opacity-100 hover:text-content-primary hover:pl-2 pl-0'}`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Pipeline / Status - Hardened Labels */}
                    <div className="pb-10 border-b border-border-standard">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-content-secondary opacity-40 mb-8">Order Status</h3>
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
                                    className={`block w-full text-left text-[11px] font-bold uppercase tracking-widest transition-all institutional-focus rounded-sm py-1.5 ${status === s.value ? 'text-brand-emerald border-l-2 border-brand-emerald pl-4' : 'text-content-secondary opacity-40 hover:opacity-100 hover:text-content-primary hover:pl-2 pl-0'}`}
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Valuation (Price Range) - Hardened Labels & Links */}
                    <div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-content-secondary opacity-40 mb-8">Price Range (GHS)</h3>
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <label htmlFor="price-min" className="sr-only">Minimum Price</label>
                                <input
                                    id="price-min"
                                    type="number"
                                    placeholder="MIN"
                                    defaultValue={minPrice}
                                    onBlur={(e) => updateSearch({ min_price: e.target.value })}
                                    className="w-full bg-transparent border-b border-border-standard focus:border-brand-emerald rounded-none text-xs font-bold py-1 outline-none transition-colors text-content-primary institutional-focus"
                                />
                            </div>
                            <span className="text-content-secondary opacity-20" aria-hidden="true">/</span>
                            <div className="flex-1">
                                <label htmlFor="price-max" className="sr-only">Maximum Price</label>
                                <input
                                    id="price-max"
                                    type="number"
                                    placeholder="MAX"
                                    defaultValue={maxPrice}
                                    onBlur={(e) => updateSearch({ max_price: e.target.value })}
                                    className="w-full bg-transparent border-b border-border-standard focus:border-brand-emerald rounded-none text-xs font-bold py-1 outline-none transition-colors text-content-primary institutional-focus"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Reset Action */}
                    <button
                        onClick={clearFilters}
                        className="w-full pt-10 text-[9px] font-black uppercase tracking-[0.4em] text-content-secondary opacity-20 hover:opacity-100 hover:text-brand-emerald transition-all text-left institutional-focus rounded-sm"
                    >
                        [ Reset Filters ]
                    </button>
                </aside>
            )}

            {/* 2. PRODUCT GRID (Editorial Layout) */}
            <main className="flex-1" id="main-content">
                {/* Mobile Collections Bar */}
                {!hideFilters && (
                    <div className="lg:hidden mb-12 flex items-center gap-6 overflow-x-auto pb-4 no-scrollbar border-b border-border-standard">
                        <button
                            onClick={clearFilters}
                            className={`text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all institutional-focus px-2 py-1 rounded ${!category ? 'text-brand-emerald' : 'text-content-secondary opacity-40'}`}
                        >
                            All
                        </button>
                        {categories.map((cat: Category) => (
                            <button
                                key={cat.id}
                                onClick={() => updateSearch({ category: cat.slug })}
                                className={`text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all institutional-focus px-2 py-1 rounded ${category === cat.slug ? 'text-brand-emerald' : 'text-content-secondary opacity-40'}`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                )}

                {/* Filter Breadcrumbs - Hardened for Robust Status Announcements */}
                {(category || status || search || minPrice || maxPrice) && (
                    <div 
                        className="flex flex-wrap items-center gap-3 mb-10 text-[10px] font-bold uppercase tracking-widest text-content-secondary opacity-40" 
                        role="status"
                        aria-live="polite"
                        aria-atomic="true"
                    >
                        <span>Active Filters:</span>
                        {category && <span className="text-content-primary border-b border-current">{category.toUpperCase()}</span>}
                        {status && <span className="text-content-primary border-b border-current">{status.replace("_", " ")}</span>}
                        {search && <span className="text-content-primary border-b border-current">&quot;{search}&quot;</span>}
                        <button onClick={clearFilters} className="ml-4 text-brand-emerald hover:text-content-primary transition-colors text-xs institutional-focus">[ × ]</button>
                    </div>
                )}

                {/* The Grid */}
                {isLoading && !products.length ? (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                        {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
                    </div>
                ) : products.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 animate-fade-in">
                            {products.map((product: Product, index: number) => (
                                <ProductCard 
                                    key={product.id} 
                                    product={product} 
                                    priority={index < 6} 
                                />
                            ))}
                        </div>

                        {/* Pagination Action: The 'Load More' Rectangle */}
                        {hasNextPage && (
                            <div className="mt-20 flex justify-center border-t border-border-standard pt-20">
                                <button
                                    onClick={() => fetchNextPage()}
                                    disabled={isFetchingNextPage}
                                    className="w-full sm:w-80 h-16 border border-content-primary hover:bg-content-primary hover:text-surface transition-all duration-500 text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 group disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isFetchingNextPage ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>FETCHING PIECES...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>VIEW MORE PIECES</span>
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        {!hasNextPage && products.length > PAGE_SIZE && (
                            <div className="mt-20 text-center py-10 opacity-20">
                                <p className="text-[9px] font-black uppercase tracking-[0.5em]">End of Collection</p>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-40 bg-surface-card/50 border border-border-standard rounded-2xl">
                         <Zap className="w-10 h-10 text-content-secondary mx-auto mb-8 opacity-10" />
                         <h3 className="text-2xl font-serif font-bold text-content-primary mb-4">No results found.</h3>
                         <p className="text-xs text-content-secondary font-medium max-w-xs mx-auto leading-relaxed mb-10 opacity-60">
                            Our scouts are currently in the field. Let our shopping team find your specific piece directly.
                         </p>
                         <div className="flex justify-center">
                            <a
                                href={siteConfig.socials.concierge}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-content-primary border-b-2 border-content-primary pb-2 hover:text-brand-emerald hover:border-brand-emerald transition-all institutional-focus group"
                            >
                                Find a Product for Me
                                <ArrowRight className="w-4 h-4 translate-x-0 group-hover:translate-x-2 transition-transform" />
                            </a>
                         </div>
                    </div>
                )}
            </main>
        </div>
    );
}
