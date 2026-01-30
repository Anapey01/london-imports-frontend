/**
 * London's Imports - Blog Page (Dynamic)
 * SEO-optimized articles fetched from API
 */
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Mini Importation Blog | London\'s Imports Ghana',
    description: 'Guides, tips, and insights on importing from China to Ghana. Learn about 1688, Alibaba, customs, and shipping.',
    openGraph: {
        title: 'Mini Importation Blog | London\'s Imports',
        description: 'Everything you need to know about importing from China to Ghana.',
    }
};

// Blog post type from API
interface BlogPost {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    category_display: string;
    featured_image: string | null;
    author_name: string;
    is_featured: boolean;
    read_time_minutes: number;
    published_at: string;
}

// Fetch blog posts from API (server-side)
async function getBlogPosts(): Promise<BlogPost[]> {
    try {
        const res = await fetch('https://london-imports-api.onrender.com/api/v1/blog/', {
            next: { revalidate: 60 } // Revalidate every minute
        });
        if (!res.ok) return [];
        return res.json();
    } catch {
        return [];
    }
}

// Fallback static articles for when API is empty
const fallbackArticles = [
    {
        id: 0,
        slug: 'how-to-buy-from-1688-in-ghana',
        title: 'How to Buy from 1688 in Ghana: Complete Guide 2024',
        excerpt: 'Learn step-by-step how to order from 1688 and have it shipped to Ghana. Pay with Mobile Money.',
        category: 'guides',
        category_display: 'Guides',
        featured_image: null,
        author_name: 'London Imports',
        is_featured: true,
        read_time_minutes: 8,
        published_at: '2024-01-05T00:00:00Z',
    },
    {
        id: 1,
        slug: 'mini-importation-beginners-guide',
        title: 'Mini Importation in Ghana: Beginner\'s Guide',
        excerpt: 'Everything you need to know about starting mini importation in Ghana.',
        category: 'guides',
        category_display: 'Guides',
        featured_image: null,
        author_name: 'London Imports',
        is_featured: true,
        read_time_minutes: 10,
        published_at: '2024-01-03T00:00:00Z',
    },
    {
        id: 2,
        slug: 'customs-duty-calculator-ghana',
        title: 'Ghana Customs Duty Calculator: How Much Will You Pay?',
        excerpt: 'Understand Ghana customs duties for electronics, phones, fashion, and more.',
        category: 'customs',
        category_display: 'Customs',
        featured_image: null,
        author_name: 'London Imports',
        is_featured: false,
        read_time_minutes: 6,
        published_at: '2023-12-28T00:00:00Z',
    },
];

const categories = ['All', 'Guides', 'Customs', 'Shipping', 'Business', 'Comparison', 'News'];

export default async function BlogPage() {
    // Fetch from API
    let articles = await getBlogPosts();

    // Use fallback if API returns empty
    if (articles.length === 0) {
        articles = fallbackArticles;
    }

    const featuredArticles = articles.filter(a => a.is_featured);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
            {/* Hero */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-100 to-pink-100 dark:from-violet-900/40 dark:to-pink-900/40"></div>
                <div className="relative px-4 py-12 text-center max-w-4xl mx-auto">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-gray-900 dark:text-white">
                        Mini Importation Blog
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-slate-300">
                        Guides, tips, and insights on importing from China to Ghana
                    </p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Category Filter (Static for now, could be made interactive with client component) */}
                <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
                    {categories.map((cat) => (
                        <span
                            key={cat}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${cat === 'All'
                                    ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/25'
                                    : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 shadow-sm'
                                }`}
                        >
                            {cat}
                        </span>
                    ))}
                </div>

                {/* Featured Section */}
                {featuredArticles.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
                            Featured Articles
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredArticles.map((article) => (
                                <Link
                                    key={article.id}
                                    href={`/blog/${article.slug}`}
                                    className="group rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all bg-white dark:bg-slate-800"
                                >
                                    <div className="h-40 bg-gradient-to-br from-violet-400 to-pink-400 dark:from-violet-600 dark:to-pink-600 flex items-center justify-center relative overflow-hidden">
                                        {article.featured_image ? (
                                            <Image
                                                src={article.featured_image}
                                                alt={article.title}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <span className="text-white text-4xl">📦</span>
                                        )}
                                    </div>
                                    <div className="p-5">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs font-medium px-2 py-1 rounded-full bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-300">
                                                {article.category_display}
                                            </span>
                                            <span className="text-xs text-gray-400 dark:text-slate-500">
                                                {article.read_time_minutes} min read
                                            </span>
                                        </div>
                                        <h3 className="font-semibold mb-2 group-hover:text-pink-500 transition-colors text-gray-900 dark:text-white">
                                            {article.title}
                                        </h3>
                                        <p className="text-sm line-clamp-2 text-gray-500 dark:text-slate-400">
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
                    <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
                        All Articles
                    </h2>
                    <div className="space-y-4">
                        {articles.map((article) => (
                            <Link
                                key={article.id}
                                href={`/blog/${article.slug}`}
                                className="flex gap-4 p-4 rounded-2xl hover:shadow-lg transition-all bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700"
                            >
                                <div className="w-20 h-20 rounded-xl flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-violet-400 to-pink-400 dark:from-violet-600 dark:to-pink-600 relative overflow-hidden">
                                    {article.featured_image ? (
                                        <Image
                                            src={article.featured_image}
                                            alt={article.title}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <span className="text-white text-2xl">📦</span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300">
                                            {article.category_display}
                                        </span>
                                        <span className="text-xs text-gray-400 dark:text-slate-500">
                                            {new Date(article.published_at).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <h3 className="font-semibold mb-1 line-clamp-1 text-gray-900 dark:text-white">
                                        {article.title}
                                    </h3>
                                    <p className="text-sm line-clamp-2 text-gray-500 dark:text-slate-400">
                                        {article.excerpt}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-12 p-8 rounded-2xl text-center bg-gradient-to-br from-pink-100 to-violet-100 dark:from-pink-900/50 dark:to-violet-900/50">
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                        Ready to Start Importing?
                    </h3>
                    <p className="mb-4 text-gray-600 dark:text-slate-300">
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
