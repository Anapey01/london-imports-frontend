/**
 * London's Imports - Blog Page
 * SEO-optimized articles for mini-importation in Ghana
 */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/providers/ThemeProvider';

// Blog articles data
const articles = [
    {
        slug: 'how-to-buy-from-1688-in-ghana',
        title: 'How to Buy from 1688 in Ghana: Complete Guide 2024',
        excerpt: 'Learn step-by-step how to order from 1688 (Alibaba\'s wholesale platform) and have it shipped to Ghana. Pay with Mobile Money, no credit card needed.',
        category: 'Guides',
        readTime: '8 min read',
        date: 'Jan 5, 2024',
        featured: true,
        image: '/blog/1688-guide.jpg',
    },
    {
        slug: 'mini-importation-beginners-guide',
        title: 'Mini Importation in Ghana: Beginner\'s Guide',
        excerpt: 'Everything you need to know about starting mini importation in Ghana. From finding suppliers to clearing customs at Tema Port.',
        category: 'Guides',
        readTime: '10 min read',
        date: 'Jan 3, 2024',
        featured: true,
        image: '/blog/beginners-guide.jpg',
    },
    {
        slug: 'customs-duty-calculator-ghana',
        title: 'Ghana Customs Duty Calculator: How Much Will You Pay?',
        excerpt: 'Understand Ghana customs duties for electronics, phones, fashion, and more. Use our free calculator to estimate your total import costs.',
        category: 'Customs',
        readTime: '6 min read',
        date: 'Dec 28, 2023',
        featured: false,
        image: '/blog/customs.jpg',
    },
    {
        slug: 'alibaba-vs-1688-which-is-better',
        title: 'Alibaba vs 1688: Which is Better for Ghana Importers?',
        excerpt: 'Compare Alibaba and 1688 for mini importation. Learn which platform offers better prices, MOQs, and shipping options to Ghana.',
        category: 'Comparison',
        readTime: '7 min read',
        date: 'Dec 20, 2023',
        featured: false,
        image: '/blog/alibaba-vs-1688.jpg',
    },
    {
        slug: 'best-products-to-import-from-china-to-ghana',
        title: 'Top 10 Best Products to Import from China to Ghana 2024',
        excerpt: 'Discover the most profitable products to import from China. From electronics to fashion, these items sell fast in Ghana.',
        category: 'Business',
        readTime: '9 min read',
        date: 'Dec 15, 2023',
        featured: true,
        image: '/blog/best-products.jpg',
    },
    {
        slug: 'shipping-time-china-to-ghana',
        title: 'How Long Does Shipping from China to Ghana Take?',
        excerpt: 'Air freight vs sea freight: Compare shipping times and costs. Learn what affects delivery speed and how to track your package.',
        category: 'Shipping',
        readTime: '5 min read',
        date: 'Dec 10, 2023',
        featured: false,
        image: '/blog/shipping-time.jpg',
    },
];

const categories = ['All', 'Guides', 'Customs', 'Shipping', 'Business', 'Comparison'];

export default function BlogPage() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [selectedCategory, setSelectedCategory] = useState('All');

    const filteredArticles = selectedCategory === 'All'
        ? articles
        : articles.filter(a => a.category === selectedCategory);

    const featuredArticles = articles.filter(a => a.featured);

    return (
        <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
            {/* Hero */}
            <div className="relative overflow-hidden">
                <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-violet-900/40 to-pink-900/40' : 'bg-gradient-to-br from-violet-100 to-pink-100'}`}></div>
                <div className="relative px-4 py-12 text-center max-w-4xl mx-auto">
                    <h1 className={`text-3xl sm:text-4xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Mini Importation Blog
                    </h1>
                    <p className={`text-lg ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                        Guides, tips, and insights on importing from China to Ghana
                    </p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Category Filter */}
                <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === cat
                                    ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/25'
                                    : isDark
                                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                        : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Featured Section */}
                {selectedCategory === 'All' && (
                    <div className="mb-12">
                        <h2 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Featured Articles
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredArticles.map((article) => (
                                <Link
                                    key={article.slug}
                                    href={`/blog/${article.slug}`}
                                    className={`group rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all ${isDark ? 'bg-slate-800' : 'bg-white'}`}
                                >
                                    <div className={`h-40 ${isDark ? 'bg-gradient-to-br from-violet-600 to-pink-600' : 'bg-gradient-to-br from-violet-400 to-pink-400'} flex items-center justify-center`}>
                                        <span className="text-white text-4xl">📦</span>
                                    </div>
                                    <div className="p-5">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${isDark ? 'bg-pink-900/50 text-pink-300' : 'bg-pink-100 text-pink-600'}`}>
                                                {article.category}
                                            </span>
                                            <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                                                {article.readTime}
                                            </span>
                                        </div>
                                        <h3 className={`font-semibold mb-2 group-hover:text-pink-500 transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {article.title}
                                        </h3>
                                        <p className={`text-sm line-clamp-2 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                            {article.excerpt}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* All Articles */}
                <div>
                    <h2 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {selectedCategory === 'All' ? 'All Articles' : `${selectedCategory} Articles`}
                    </h2>
                    <div className="space-y-4">
                        {filteredArticles.map((article) => (
                            <Link
                                key={article.slug}
                                href={`/blog/${article.slug}`}
                                className={`flex gap-4 p-4 rounded-2xl hover:shadow-lg transition-all ${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:bg-gray-50'}`}
                            >
                                <div className={`w-20 h-20 rounded-xl flex-shrink-0 flex items-center justify-center ${isDark ? 'bg-gradient-to-br from-violet-600 to-pink-600' : 'bg-gradient-to-br from-violet-400 to-pink-400'}`}>
                                    <span className="text-white text-2xl">📦</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-600'}`}>
                                            {article.category}
                                        </span>
                                        <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                                            {article.date}
                                        </span>
                                    </div>
                                    <h3 className={`font-semibold mb-1 line-clamp-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        {article.title}
                                    </h3>
                                    <p className={`text-sm line-clamp-2 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                        {article.excerpt}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className={`mt-12 p-8 rounded-2xl text-center ${isDark ? 'bg-gradient-to-br from-pink-900/50 to-violet-900/50' : 'bg-gradient-to-br from-pink-100 to-violet-100'}`}>
                    <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Ready to Start Importing?
                    </h3>
                    <p className={`mb-4 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                        Browse our products and experience hassle-free mini importation.
                    </p>
                    <Link
                        href="/products"
                        className="inline-block px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-500 to-rose-500 shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition-all"
                    >
                        Browse Products
                    </Link>
                </div>
            </div>
        </div>
    );
}
