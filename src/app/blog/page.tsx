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
            next: { revalidate: 86400 } // Revalidate every 24 hours to save Vercel limits
        });
        if (!res.ok) return [];
        const data = await res.json();
        // Handle both array and paginated object responses
        if (Array.isArray(data)) return data;
        if (data && Array.isArray(data.results)) return data.results;
        return [];
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
        articles = fallbackArticles as unknown as BlogPost[];
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Blog",
                "name": "London's Imports - Mini Importation Blog",
                "description": "Guides, tips, and insights on importing from China to Ghana.",
                "url": "https://londonsimports.com/blog",
                "blogPost": articles.map((a: BlogPost) => ({
                    "@type": "BlogPosting",
                    "headline": a.title,
                    "description": a.excerpt,
                    "url": `https://londonsimports.com/blog/${a.slug}`,
                    "datePublished": a.published_at,
                    "author": {
                        "@type": "Person",
                        "name": a.author_name || "London Imports"
                    }
                }))
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": "https://londonsimports.com"
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "Blog",
                        "item": "https://londonsimports.com/blog"
                    }
                ]
            }
        ]
    };

    const featuredArticles = articles.filter(a => a.is_featured);
    const regularArticles = articles.filter(a => !a.is_featured);

    return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0f1d] font-sans selection:bg-pink-100 selection:text-pink-600">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* Premium Hero with Mesh Gradient */}
            <div className="relative pt-24 pb-16 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] opacity-30 dark:opacity-20 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[80%] rounded-full bg-pink-300 blur-[120px] animate-pulse"></div>
                    <div className="absolute bottom-0 right-[-10%] w-[50%] h-[70%] rounded-full bg-violet-300 blur-[120px] animate-pulse [animation-delay:2s]"></div>
                </div>
                
                <div className="relative max-w-5xl mx-auto px-6 text-center">
                    <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-[0.2em] uppercase text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/30 rounded-full">
                        Expert Insights
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-gray-900 dark:text-white leading-[1.1]">
                        The <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-600">Importation</span> Bible
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Master the art of mini-importation with our premium guides, logistics secrets, and custom strategies for the Ghanaian market.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 pb-24">
                {/* Modern Filter Tabs */}
                <div className="flex items-center justify-center gap-2 mb-16 overflow-x-auto py-2 no-scrollbar">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            className={`px-6 py-2.5 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all duration-300 ${cat === 'All'
                                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-xl shadow-gray-200 dark:shadow-none scale-105'
                                : 'bg-white dark:bg-slate-800/50 text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 border border-gray-100 dark:border-slate-700/50'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-12 gap-8">
                    {/* Featured Large Card */}
                    {featuredArticles.length > 0 && (
                        <div className="col-span-12 lg:col-span-7">
                            <Link
                                href={`/blog/${featuredArticles[0].slug}`}
                                className="group block relative h-full min-h-[500px] rounded-[2.5rem] overflow-hidden bg-gray-900"
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent z-10 opacity-80 group-hover:opacity-90 transition-opacity"></div>
                                {featuredArticles[0].featured_image ? (
                                    <Image
                                        src={featuredArticles[0].featured_image}
                                        alt={featuredArticles[0].title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-violet-600 opacity-80"></div>
                                )}
                                
                                <div className="absolute bottom-0 left-0 p-8 md:p-12 z-20 w-full">
                                    <div className="flex gap-3 mb-4">
                                        <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
                                            {featuredArticles[0].category_display}
                                        </span>
                                        <span className="text-white/70 text-[10px] font-bold uppercase tracking-wider self-center">
                                            {featuredArticles[0].read_time_minutes} min read
                                        </span>
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 group-hover:text-pink-300 transition-colors tracking-tight">
                                        {featuredArticles[0].title}
                                    </h2>
                                    <p className="text-gray-300 text-lg line-clamp-2 max-w-xl">
                                        {featuredArticles[0].excerpt}
                                    </p>
                                </div>
                            </Link>
                        </div>
                    )}

                    {/* Secondary Featured Stack */}
                    <div className="col-span-12 lg:col-span-5 flex flex-col gap-8">
                        {featuredArticles.slice(1, 3).map((article) => (
                            <Link
                                key={article.id}
                                href={`/blog/${article.slug}`}
                                className="group flex gap-6 p-6 rounded-[2rem] bg-white dark:bg-slate-800/40 border border-gray-100 dark:border-slate-700/50 hover:shadow-2xl hover:shadow-gray-200/50 dark:hover:shadow-none transition-all duration-500"
                            >
                                <div className="relative w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100">
                                    {article.featured_image ? (
                                        <Image src={article.featured_image} alt={article.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-pink-100 to-violet-100 flex items-center justify-center text-3xl">📝</div>
                                    )}
                                </div>
                                <div className="flex flex-col justify-center">
                                    <span className="text-xs font-bold text-pink-500 mb-2 uppercase tracking-wide">{article.category_display}</span>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-pink-600 transition-colors line-clamp-2 leading-tight">
                                        {article.title}
                                    </h3>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Regular List */}
                    <div className="col-span-12 mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {regularArticles.map((article) => (
                            <Link
                                key={article.id}
                                href={`/blog/${article.slug}`}
                                className="group flex flex-col h-full bg-white dark:bg-slate-800/30 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-slate-800 hover:scale-[1.02] transition-all duration-300 shadow-sm hover:shadow-xl"
                            >
                                <div className="relative h-60 w-full bg-gray-100">
                                    {article.featured_image ? (
                                        <Image src={article.featured_image} alt={article.title} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center text-4xl">📦</div>
                                    )}
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1.5 rounded-xl bg-white/80 dark:bg-black/50 backdrop-blur-md text-[10px] font-black uppercase text-gray-900 dark:text-white">
                                            {article.category_display}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-8 flex flex-col flex-1">
                                    <div className="text-[10px] font-bold text-gray-400 dark:text-slate-500 mb-3 uppercase tracking-[0.1em]">
                                        {new Date(article.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · {article.read_time_minutes} min
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 leading-tight group-hover:text-pink-500 transition-colors">
                                        {article.title}
                                    </h3>
                                    <p className="text-gray-500 dark:text-slate-400 text-sm line-clamp-3 leading-relaxed mb-6">
                                        {article.excerpt}
                                    </p>
                                    <div className="mt-auto pt-4 flex items-center text-pink-600 dark:text-pink-400 text-sm font-bold">
                                        Read Article <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Premium Newsletter CTA */}
                <div className="mt-24 relative p-12 rounded-[3rem] overflow-hidden bg-gray-900 text-white">
                    <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[80%] rounded-full bg-pink-500/20 blur-[100px]"></div>
                    <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
                        <div className="lg:flex-1 text-center lg:text-left">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Join the Inner Circle</h2>
                            <p className="text-gray-400 text-lg">Get exclusive hot products and shipping deals before they hit our public catalog.</p>
                        </div>
                        <div className="w-full max-w-md flex flex-col sm:flex-row gap-4">
                            <input 
                                type="email" 
                                placeholder="name@email.com" 
                                className="flex-1 px-6 py-4 rounded-2xl bg-white/10 border border-white/20 focus:outline-none focus:border-pink-500 transition-colors"
                            />
                            <button className="px-8 py-4 rounded-2xl bg-white text-gray-900 font-bold hover:bg-pink-500 hover:text-white transition-all transform hover:scale-105">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
