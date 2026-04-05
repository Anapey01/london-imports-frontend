/**
 * London's Imports - Search Modal Component
 * Hardened for WCAG 'Robust' Compliance (4.1.2 & 4.1.3)
 */
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { productsAPI } from '@/lib/api';
import { formatPrice } from '@/lib/format';
import { Search, X, TrendingUp, Package, ArrowRight } from 'lucide-react';
import { trackSearch, trackViewSearchResults, trackSelectPromotion } from '@/lib/analytics';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 250);
        return () => clearTimeout(timer);
    }, [query]);

    const { data: trendingData } = useQuery({
        queryKey: ['trending-searches'],
        queryFn: productsAPI.getTrendingSearches,
        enabled: isOpen,
        staleTime: 1000 * 60 * 5,
    });

    const trendingSearches = trendingData?.data?.results || trendingData?.data || [];

    const { data: searchData, isFetching: isSearching } = useQuery({
        queryKey: ['search', debouncedQuery],
        queryFn: () => productsAPI.list({ search: debouncedQuery, limit: 5 }),
        enabled: debouncedQuery.length >= 2 && isOpen,
        staleTime: 1000 * 30,
    });

    const results = searchData?.data?.results || searchData?.data || [];
    
    // 2. Track Search Success/Refinement
    useEffect(() => {
        if (debouncedQuery.length >= 2 && !isSearching) {
            trackSearch(debouncedQuery);
            trackViewSearchResults(debouncedQuery, results.length, results);
        }
    }, [debouncedQuery, isSearching, results.length]);

    const handleRecordSearch = (searchTerm: string) => {
        if (searchTerm.trim().length >= 2) {
            productsAPI.recordSearch(searchTerm.trim()).catch(() => {});
        }
    };

    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
        if (!isOpen) {
            setQuery('');
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const handleProductClick = (slug: string) => {
        onClose();
        router.push(`/products/${slug}`);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm sm:flex sm:justify-center sm:pt-20">
            {/* Hidden Results Announcement (WCAG 4.1.3) */}
            <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
                {debouncedQuery.length >= 2 && !isSearching 
                    ? `${results.length} products found for ${debouncedQuery}`
                    : isSearching ? "Searching..." : ""
                }
            </div>

            <div
                className="w-full h-full sm:h-auto sm:max-w-2xl bg-surface sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200 border border-border-standard"
                onClick={e => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="search-modal-title"
            >
                <h2 id="search-modal-title" className="sr-only">Search our products</h2>

                {/* Search Header - 'Perceivable' Hardened */}
                <div className="flex items-center gap-3 p-6 border-b border-border-standard bg-surface">
                    <form 
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleRecordSearch(query);
                        }}
                        className="flex-1 flex items-center bg-surface-card border border-border-standard rounded-lg px-4 py-3 focus-within:border-brand-emerald transition-colors"
                    >
                        <Search className="w-4 h-4 text-content-secondary mr-3" strokeWidth={1.5} />
                        <label htmlFor="modal-search-input" className="sr-only">Keywords</label>
                        <input
                            id="modal-search-input"
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Search products..."
                            className="flex-1 bg-transparent border-none outline-none text-content-primary placeholder:text-content-secondary/40 text-base font-medium"
                        />
                        {query && (
                            <button type="button" onClick={() => setQuery('')} className="p-1 text-content-secondary hover:text-content-primary institutional-focus" aria-label="Clear search terms">
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </form>

                    <button
                        onClick={onClose}
                        className="text-content-secondary hover:text-content-primary px-4 py-2 text-xs font-black uppercase tracking-widest institutional-focus"
                        aria-label="Close search"
                    >
                        Cancel
                    </button>
                </div>

                {/* Results Area */}
                <div className="flex-1 overflow-y-auto bg-surface relative min-h-[300px]">
                    {isSearching && (
                        <div className="absolute top-0 left-0 right-0 h-0.5 z-10 overflow-hidden bg-transparent">
                            <div className="h-full bg-brand-emerald animate-progress origin-left"></div>
                        </div>
                    )}

                    <div className="p-4">
                        {debouncedQuery.length >= 2 && !isSearching && results.length === 0 && (
                            <div className="py-20 text-center">
                                <Package className="w-12 h-12 text-content-secondary/20 mx-auto mb-4" strokeWidth={1} />
                                <p className="text-lg font-bold text-content-primary mb-1 tracking-tight">No results found</p>
                                <p className="text-sm text-content-secondary">Try a different keyword for &quot;{debouncedQuery}&quot;</p>
                            </div>
                        )}

                        {/* Results List - 'Operable' Hardened Target Sizes */}
                        {results.map((product: { id: number | string; slug: string; name: string; image?: string; price: number }, index: number) => (
                            <button
                                key={product.id}
                                onClick={() => {
                                    handleRecordSearch(query);
                                    handleProductClick(product.slug);
                                }}
                                className="w-full flex items-center gap-5 p-4 mb-3 bg-surface-card rounded-xl border border-border-standard shadow-sm hover:shadow-diffusion transition-all text-left group institutional-focus"
                                aria-label={`View ${product.name}, price ${formatPrice(product.price)}`}
                            >
                                <div className="w-16 h-16 bg-surface rounded-lg flex items-center justify-center flex-shrink-0 border border-border-standard relative overflow-hidden">
                                    {product.image ? (
                                        <Image 
                                            src={product.image} 
                                            alt={product.name} 
                                            fill 
                                            className="object-cover group-hover:scale-105 transition-transform duration-500" 
                                            priority={index < 3}
                                        />
                                    ) : (
                                        <Package className="w-6 h-6 text-content-secondary opacity-20" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0" aria-hidden="true">
                                    <h4 className="font-bold text-content-primary truncate tracking-tight">{product.name}</h4>
                                    <p className="text-brand-emerald font-black text-sm mt-1">{formatPrice(product.price)}</p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-content-secondary group-hover:text-brand-emerald group-hover:translate-x-1 transition-all" strokeWidth={2} aria-hidden="true" />
                            </button>
                        ))}

                        {/* Trending Searches - 'Signature Protocol' Style */}
                        {query.length < 2 && (
                            <div className="mt-6 px-2">
                                <div className="flex items-center gap-3 mb-6">
                                    <TrendingUp className="w-4 h-4 text-brand-emerald" strokeWidth={2} aria-hidden="true" />
                                    <p className="text-[10px] font-black text-content-secondary uppercase tracking-[0.3em]">
                                        Market Pulse
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {(trendingSearches.length > 0 ? trendingSearches.map((s:any) => s.query) : ['Solar Panels', 'Electronics', 'Fashion', 'Kitchenware']).map((term: string) => (
                                        <button
                                            key={term}
                                            onClick={() => {
                                                setQuery(term);
                                                trackSelectPromotion({
                                                    id: `trending_${term.toLowerCase().replace(/\s+/g, '_')}`,
                                                    name: term,
                                                    position: 'search_modal_pulse'
                                                });
                                            }}
                                            className="px-5 py-2.5 bg-surface-card border border-border-standard rounded-full text-[11px] font-black uppercase tracking-widest text-content-secondary hover:border-brand-emerald hover:text-brand-emerald hover:bg-surface transition-all institutional-focus shadow-sm"
                                            aria-label={`Search for ${term}`}
                                        >
                                            {term}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
