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
import StarRating from './StarRating'; // Optional polish

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [query, setQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // 1. Fetch Categories for "Popular Searches"
    const { data: categoriesData } = useQuery({
        queryKey: ['categories'],
        queryFn: productsAPI.categories,
        enabled: isOpen, // Only fetch when open
        staleTime: 1000 * 60 * 60, // 1 hour
    });

    // 2. Search Products (Debounced ideally, but useQuery handles caching well)
    const { data: searchData, isLoading: isSearching } = useQuery({
        queryKey: ['search', query],
        queryFn: () => productsAPI.list({ search: query, limit: 5 }), // Search param usually 'search' or 'q'
        enabled: query.length >= 2 && isOpen,
        staleTime: 0, // Always fresh for search
    });

    const categories = categoriesData?.data?.results || categoriesData?.data || [];
    const results = searchData?.data?.results || searchData?.data || [];

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
                className="w-full h-full sm:h-auto sm:max-w-2xl bg-white sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
                onClick={e => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label="Search products"
            >
                {/* Search Header */}
                <div className="flex items-center gap-3 p-4 border-b border-gray-100 bg-white">
                    <button
                        onClick={onClose}
                        className="sm:hidden -ml-2 p-2 text-gray-500 hover:text-gray-900"
                        aria-label="Close search"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <div className="flex-1 flex items-center bg-gray-100 rounded-lg px-3 py-2">
                        <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Search products..."
                            className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-500 text-base"
                        />
                        {query && (
                            <button onClick={() => setQuery('')} className="p-1 text-gray-400 hover:text-gray-600" aria-label="Clear search">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>

                    <button
                        onClick={onClose}
                        className="hidden sm:block text-gray-400 hover:text-gray-600 p-2 font-medium"
                    >
                        Cancel
                    </button>
                </div>

                {/* Results Area */}
                <div className="flex-1 overflow-y-auto bg-gray-50/50">
                    <div className="p-2">

                        {/* Loading State */}
                        {isSearching && (
                            <div className="p-8 text-center text-gray-500">
                                <div className="animate-spin w-6 h-6 border-2 border-store-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                                <p>Searching...</p>
                            </div>
                        )}

                        {/* No Results */}
                        {query.length >= 2 && !isSearching && results.length === 0 && (
                            <div className="p-12 text-center text-gray-500">
                                <p className="text-lg font-medium mb-1">No results found</p>
                                <p className="text-sm">Try searching for "{query}"</p>
                            </div>
                        )}

                        {/* Results List */}
                        {!isSearching && results.map((product: { id: string; slug: string; name: string; price: number; image?: string }) => (
                            <button
                                key={product.id}
                                onClick={() => handleProductClick(product.slug)}
                                className="w-full flex items-center gap-4 p-3 mb-2 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all text-left"
                            >
                                <div className="w-14 h-14 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-100 relative overflow-hidden">
                                    {product.image ? (
                                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                                    ) : (
                                        <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 12V8l-8-4-8 4v8l8 4 8-4M12 4v16m8-12l-8 4m0 8l8-4m-16-4l8 4" />
                                        </svg>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-gray-900 truncate">{product.name}</h4>
                                    <p className="text-store-primary font-bold text-sm">GH₵ {product.price?.toLocaleString() || '0.00'}</p>
                                </div>
                                <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        ))}

                        {/* Popular Searches (Categories) - Show if no query */}
                        {query.length < 2 && (
                            <div className="mt-4 px-2">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                    Popular Categories
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {categories.length > 0 ? (
                                        categories.slice(0, 10).map((cat: { id?: string; slug?: string; name: string }, index: number) => (
                                            <button
                                                key={cat.id || cat.slug || index}
                                                onClick={() => setQuery(cat.name)}
                                                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-600 hover:border-pink-500 hover:text-pink-600 transition-colors shadow-sm"
                                            >
                                                {cat.name}
                                            </button>
                                        ))
                                    ) : (
                                        // Fallback if no categories loaded yet
                                        ['Electronics', 'Fashion', 'Home', 'Beauty'].map(term => (
                                            <button
                                                key={term}
                                                onClick={() => setQuery(term)}
                                                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-600 hover:border-store-primary hover:text-store-primary transition-colors shadow-sm"
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
