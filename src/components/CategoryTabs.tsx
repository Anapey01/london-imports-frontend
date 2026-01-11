/**
 * CategoryTabs - Dynamic category browsing component
 * Fetches categories from API and displays as clickable tabs
 */
'use client';

import { useQuery } from '@tanstack/react-query';
import { productsAPI } from '@/lib/api';
import Link from 'next/link';

// Category icons mapping
const categoryIcons: { [key: string]: string } = {
    shoes: '👟',
    fashion: '👗',
    electronics: '📱',
    bags: '👜',
    accessories: '💍',
    beauty: '💄',
    default: '📦'
};

interface CategoryTabsProps {
    selectedCategory?: string;
    onCategorySelect?: (slug: string) => void;
    variant?: 'tabs' | 'cards';
}

export default function CategoryTabs({
    selectedCategory = '',
    onCategorySelect,
    variant = 'tabs'
}: CategoryTabsProps) {
    const { data: categoriesData, isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: () => productsAPI.categories(),
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
        refetchOnWindowFocus: true, // Refetch when user returns to tab
    });

    // Handle both paginated (results array) and non-paginated API responses
    const categories = categoriesData?.data?.results || (Array.isArray(categoriesData?.data) ? categoriesData.data : []);

    if (isLoading) {
        return (
            <div className="flex gap-3 overflow-x-auto pb-2">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-10 w-24 rounded-full skeleton flex-shrink-0" />
                ))}
            </div>
        );
    }

    if (categories.length === 0) {
        return null;
    }

    if (variant === 'cards') {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {categories.map((cat: any) => (
                    <Link
                        key={cat.id}
                        href={`/products?category=${cat.slug}`}
                        className="group flex flex-col items-center p-6 bg-white rounded-2xl border border-slate-100 hover:border-pink-200 hover:shadow-lg transition-all duration-300"
                    >
                        <span className="text-3xl mb-3 group-hover:scale-110 transition-transform">
                            {categoryIcons[cat.slug] || categoryIcons.default}
                        </span>
                        <span className="font-medium text-slate-700 group-hover:text-pink-500 transition-colors text-center">
                            {cat.name}
                        </span>
                    </Link>
                ))}
            </div>
        );
    }

    // Default: tabs variant
    return (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
                onClick={() => onCategorySelect?.('')}
                className={`px-5 py-2.5 rounded-full font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0 ${selectedCategory === ''
                    ? 'bg-pink-400 text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-pink-50 hover:text-pink-500 border border-slate-200'
                    }`}
            >
                All Categories
            </button>
            {categories.map((cat: any) => (
                <button
                    key={cat.id}
                    onClick={() => onCategorySelect?.(cat.slug)}
                    className={`px-5 py-2.5 rounded-full font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0 flex items-center gap-2 ${selectedCategory === cat.slug
                        ? 'bg-pink-400 text-white shadow-md'
                        : 'bg-white text-slate-600 hover:bg-pink-50 hover:text-pink-500 border border-slate-200'
                        }`}
                >
                    <span>{categoryIcons[cat.slug] || categoryIcons.default}</span>
                    {cat.name}
                </button>
            ))}
        </div>
    );
}
