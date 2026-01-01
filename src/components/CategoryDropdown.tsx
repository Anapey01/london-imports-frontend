/**
 * CategoryDropdown - Professional dropdown menu for category selection
 * Fetches categories dynamically from the admin API
 */
'use client';

import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { productsAPI } from '@/lib/api';

export default function CategoryDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const { data: categoriesData, isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: () => productsAPI.categories(),
        staleTime: 1000 * 60 * 5,
    });

    const categories = categoriesData?.data?.results || (Array.isArray(categoriesData?.data) ? categoriesData.data : []);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleCategorySelect = (slug: string) => {
        setIsOpen(false);
        router.push(`/products?category=${slug}`);
    };

    if (isLoading) {
        return (
            <div className="w-64 h-12 bg-white rounded-lg animate-pulse"></div>
        );
    }

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Dropdown Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between gap-4 px-6 py-3 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-slate-300 hover:shadow-md transition-all duration-200 min-w-[250px]"
            >
                <span className="text-slate-700 font-medium">Select a Category</span>
                <svg
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg z-50 overflow-hidden">
                    {/* View All Option */}
                    <button
                        onClick={() => handleCategorySelect('')}
                        className="w-full px-4 py-3 text-left text-slate-700 font-medium hover:bg-slate-50 transition-colors border-b border-slate-100"
                    >
                        All Categories
                    </button>

                    {/* Dynamic Categories */}
                    {categories.map((cat: any) => (
                        <button
                            key={cat.id}
                            onClick={() => handleCategorySelect(cat.slug)}
                            className="w-full px-4 py-3 text-left text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
