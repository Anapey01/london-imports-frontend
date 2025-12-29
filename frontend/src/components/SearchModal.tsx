/**
 * London's Imports - Search Modal Component
 * Full-screen search overlay with product results
 */
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// Mock search results (in production, this would call the API)
const mockProducts = [
    { id: '1', name: 'iPhone 15 Pro Max', slug: 'iphone-15-pro-max', price: 8500, image: null },
    { id: '2', name: 'iPhone 15 Pro', slug: 'iphone-15-pro', price: 7200, image: null },
    { id: '3', name: 'Samsung S24 Ultra', slug: 'samsung-s24-ultra', price: 7800, image: null },
    { id: '4', name: 'MacBook Air M3', slug: 'macbook-air-m3', price: 9500, image: null },
    { id: '5', name: 'PlayStation 5 Slim', slug: 'playstation-5-slim', price: 4200, image: null },
];

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<typeof mockProducts>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // Focus input when modal opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
        if (!isOpen) {
            setQuery('');
            setResults([]);
        }
    }, [isOpen]);

    // Filter results based on query
    useEffect(() => {
        if (query.length >= 2) {
            const filtered = mockProducts.filter(p =>
                p.name.toLowerCase().includes(query.toLowerCase())
            );
            setResults(filtered);
        } else {
            setResults([]);
        }
    }, [query]);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const handleProductClick = (slug: string) => {
        onClose();
        router.push(`/products/${slug}`);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div
                className="max-w-2xl mx-auto mt-20 bg-white rounded-2xl shadow-2xl overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* Search Input */}
                <div className="flex items-center gap-4 p-4 border-b">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Search products..."
                        className="flex-1 text-lg outline-none placeholder:text-gray-400"
                    />
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 p-1"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Results */}
                <div className="max-h-96 overflow-y-auto">
                    {query.length >= 2 && results.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            No products found for "{query}"
                        </div>
                    )}

                    {results.map(product => (
                        <button
                            key={product.id}
                            onClick={() => handleProductClick(product.slug)}
                            className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors text-left"
                        >
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                {product.image ? (
                                    <Image src={product.image} alt={product.name} width={48} height={48} className="object-cover rounded-lg" />
                                ) : (
                                    <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 truncate">{product.name}</p>
                                <p className="text-sm text-pink-500 font-bold">GHS {product.price.toLocaleString()}</p>
                            </div>
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    ))}

                    {query.length < 2 && (
                        <div className="p-6 text-center text-gray-400 text-sm">
                            Type at least 2 characters to search
                        </div>
                    )}
                </div>

                {/* Quick Links */}
                <div className="border-t p-4 bg-gray-50">
                    <p className="text-xs text-gray-500 mb-2">Popular searches</p>
                    <div className="flex flex-wrap gap-2">
                        {['iPhone', 'Samsung', 'MacBook', 'PlayStation'].map(term => (
                            <button
                                key={term}
                                onClick={() => setQuery(term)}
                                className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-pink-300 hover:text-pink-600 transition-colors"
                            >
                                {term}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
