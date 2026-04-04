/**
 * London's Imports - Search Modal Component
 * Full-screen responsive search overlay with REAL API integration
 */
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { productsAPI } from '@/lib/api';
import { formatPrice } from '@/lib/format';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [query, setQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // 1. Fetch Trending Searches for "People are searching for..."
    const { data: trendingData } = useQuery({
        queryKey: ['trending-searches'],
        queryFn: productsAPI.getTrendingSearches,
        enabled: isOpen,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const trendingSearches = trendingData?.data?.results || trendingData?.data || [];

    // 2. Search Products (Debounced ideally, but useQuery handles caching well)
    const { data: searchData, isLoading: isSearching } = useQuery({
        queryKey: ['search', query],
        queryFn: () => productsAPI.list({ search: query, limit: 5 }), // Search param usually 'search' or 'q'
        enabled: query.length >= 2 && isOpen,
        staleTime: 0, // Always fresh for search
    });

    const results = searchData?.data?.results || searchData?.data || [];

    const handleRecordSearch = (searchTerm: string) => {
        if (searchTerm.trim().length >= 2) {
            productsAPI.recordSearch(searchTerm.trim()).catch(() => {});
        }
    };

    // Focus input when modal opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
        if (!isOpen) {
            setQuery('');
        }
    }, [isOpen]);

    // Handle Escape key
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm sm:flex sm:justify-center sm:pt-20">
            {/* Mobile: Full Screen, Desktop: Modal */}
            <div
                className="w-full h-full sm:h-auto sm:max-w-2xl bg-primary-surface sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
                onClick={e => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label="Search products"
            >
                {/* Search Header */}
                <div className="flex items-center gap-3 p-4 border-b border-primary-surface bg-primary-surface">
                    <button
                        onClick={onClose}
                        className="sm:hidden -ml-2 p-2 nuclear-text opacity-50 hover:opacity-100"
                        aria-label="Close search"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <form 
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleRecordSearch(query);
                        }}
                        className="flex-1 flex items-center bg-primary-surface/10 border border-primary-surface rounded-lg px-3 py-2"
                    >
                        <svg className="w-5 h-5 nuclear-text opacity-40 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Search products..."
                            className="flex-1 bg-transparent border-none outline-none nuclear-text placeholder:nuclear-text placeholder:opacity-30 text-base"
                        />
                        {query && (
                            <button type="button" onClick={() => setQuery('')} className="p-1 nuclear-text opacity-40 hover:opacity-80" aria-label="Clear search">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </form>

                    <button
                        onClick={onClose}
                        className="hidden sm:block text-gray-400 hover:text-gray-600 p-2 font-medium"
                    >
                        Cancel
                    </button>
                </div>

                {/* Results Area */}
                <div className="flex-1 overflow-y-auto bg-primary-surface">
                    <div className="p-2">

                        {/* Loading State */}
                        {isSearching && (
                            <div className="p-8 text-center text-gray-500">
                                <div className="animate-spin w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                                <p>Searching...</p>
                            </div>
                        )}

                        {/* No Results */}
                        {query.length >= 2 && !isSearching && results.length === 0 && (
                            <div className="p-12 text-center text-gray-500">
                                <p className="text-lg font-medium mb-1">No results found</p>
                                <p className="text-sm">Try searching for &quot;{query}&quot;</p>
                            </div>
                        )}

                        {/* Results List */}
                        {!isSearching && results.map((product: { id: number | string; slug: string; name: string; image?: string; price: number }) => (
                            <button
                                key={product.id}
                                onClick={() => {
                                    handleRecordSearch(query);
                                    handleProductClick(product.slug);
                                }}
                                className="w-full flex items-center gap-4 p-3 mb-2 bg-primary-surface/10 rounded-xl border border-primary-surface/20 shadow-sm hover:shadow-diffusion transition-all text-left group"
                            >
                                <div className="w-14 h-14 bg-primary-surface/20 rounded-lg flex items-center justify-center flex-shrink-0 border border-primary-surface relative overflow-hidden">
                                    {product.image ? (
                                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                                    ) : (
                                        <svg className="w-6 h-6 nuclear-text opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 12V8l-8-4-8 4v8l8 4 8-4M12 4v16m8-12l-8 4m0 8l8-4m-16-4l8 4" />
                                        </svg>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold nuclear-text truncate">{product.name}</h4>
                                    <p className="text-emerald-500 font-bold text-sm">{formatPrice(product.price)}</p>
                                </div>
                                <svg className="w-5 h-5 nuclear-text opacity-20 group-hover:opacity-100 group-hover:text-emerald-500 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        ))}

                        {/* Trending Searches - Show if no query */}
                        {query.length < 2 && (
                            <div className="mt-4 px-2">
                                <div className="flex items-center gap-2 mb-3">
                                    <svg className="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Trending Now
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {trendingSearches.length > 0 ? (
                                        trendingSearches.map((item: { query: string }, index: number) => (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    setQuery(item.query);
                                                    handleRecordSearch(item.query);
                                                }}
                                                className="px-4 py-2 bg-primary-surface border border-primary-surface/40 rounded-full text-sm font-medium nuclear-text opacity-60 hover:opacity-100 hover:border-emerald-500 hover:text-emerald-500 transition-all shadow-sm"
                                            >
                                                {item.query}
                                            </button>
                                        ))
                                    ) : (
                                        // Real-World Sourcing Discovery Fallbacks
                                        ['Compressed Mattresses', 'Solar Panels', 'Furniture', 'Laptops', 'Home Appliances'].map(term => (
                                            <button
                                                key={term}
                                                onClick={() => setQuery(term)}
                                                className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-xs font-black uppercase tracking-widest text-slate-900 hover:border-slate-300 hover:bg-slate-100 transition-all shadow-sm"
                                            >
                                                {term}
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
