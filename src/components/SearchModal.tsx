/**
 * London's Imports - Search Modal Component
 * Restored to stable modal structure with 'Atelier Big Space' refinements.
 */
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { productsAPI } from '@/lib/api';
import { formatPrice } from '@/lib/format';
import { Search, X, TrendingUp, Package, ArrowRight } from 'lucide-react';
import { trackSearch, trackViewSearchResults, trackSelectPromotion } from '@/lib/analytics';
import { useUIStore } from '@/stores/uiStore';

interface SearchModalProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export default function SearchModal({ isOpen: propIsOpen, onClose: propOnClose }: SearchModalProps) {
    const { isSearchModalOpen, setSearchModalOpen } = useUIStore();
    const isOpen = propIsOpen !== undefined ? propIsOpen : isSearchModalOpen;
    const onClose = propOnClose !== undefined ? propOnClose : () => setSearchModalOpen(false);

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
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-start justify-center pt-10 sm:pt-24 px-4 overflow-y-auto">
            <div
                className="w-full max-w-4xl bg-surface rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300 border border-border-standard"
                onClick={e => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
            >
                {/* ATELIER RETAIL HYBRID - PILL DESIGN */}
                <div className="p-8 sm:p-12 border-b border-border-standard">
                    <div className="flex items-center gap-6">
                        <form 
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (query.trim().length >= 2) {
                                    handleRecordSearch(query);
                                    onClose();
                                    router.push(`/products?search=${encodeURIComponent(query.trim())}`);
                                }
                            }}
                            className="flex-1 flex items-center bg-slate-100 dark:bg-white/5 rounded-full pl-6 pr-2 py-2 focus-within:ring-2 focus-within:ring-brand-emerald/20 transition-all"
                        >
                            <Search className="w-5 h-5 text-content-secondary mr-4 opacity-50" strokeWidth={2} />
                            <input
                                id="modal-search-input"
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                placeholder="Search products, brands and categories"
                                className="flex-1 bg-transparent border-none outline-none text-base sm:text-lg font-medium text-content-primary placeholder:text-content-secondary/40 py-3"
                            />
                            {query && (
                                <button type="button" onClick={() => setQuery('')} className="p-2 text-content-secondary hover:text-content-primary mr-2">
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                            <button 
                                type="submit"
                                className="bg-[#ff8a00] hover:bg-[#e67e00] text-white px-8 py-3 rounded-full text-sm font-black uppercase tracking-widest shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
                            >
                                Search
                            </button>
                        </form>
                        <button
                            onClick={onClose}
                            className="hidden lg:block text-content-secondary hover:text-content-primary text-[10px] font-black uppercase tracking-[0.4em] px-4"
                        >
                            Close
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto max-h-[60vh]">
                    <div className="p-8 sm:p-12">
                        {isSearching && (
                            <div className="py-12 text-center text-content-secondary animate-pulse text-sm uppercase tracking-widest">
                                Searching Collections...
                            </div>
                        )}

                        {!isSearching && results.length > 0 && (
                            <div className="space-y-6">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-content-secondary mb-8">Results</h3>
                                {results.map((product: any) => (
                                    <button
                                        key={product.id}
                                        onClick={() => handleProductClick(product.slug)}
                                        className="w-full flex items-center gap-6 p-4 rounded-2xl hover:bg-surface-card border border-transparent hover:border-border-standard transition-all text-left group"
                                    >
                                        <div className="w-20 h-20 bg-surface-card rounded-xl overflow-hidden border border-border-standard flex-shrink-0">
                                            {product.image ? (
                                                <Image src={product.image} alt={product.name} width={80} height={80} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center opacity-20"><Package /></div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-lg font-bold text-content-primary truncate">{product.name}</h4>
                                            <p className="text-brand-emerald font-black mt-1">{formatPrice(product.price)}</p>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-content-secondary group-hover:text-brand-emerald group-hover:translate-x-2 transition-all" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {query.length < 2 && (
                            <div>
                                <div className="flex items-center gap-3 mb-8">
                                    <TrendingUp className="w-4 h-4 text-brand-emerald" />
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-content-secondary">Market Pulse</h3>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {(trendingSearches.length > 0 ? trendingSearches.map((s:any) => s.query) : ['Solar Panels', 'Electronics', 'Fashion', 'Kitchenware']).map((term: string) => (
                                        <button
                                            key={term}
                                            onClick={() => setQuery(term)}
                                            className="px-6 py-3 bg-surface-card border border-border-standard rounded-full text-xs font-bold text-content-secondary hover:border-brand-emerald hover:text-brand-emerald transition-all shadow-sm"
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
