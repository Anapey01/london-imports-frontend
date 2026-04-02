/**
 * London's Imports - Blog Page (Dynamic)
 * SEO-optimized articles fetched from API
 */
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { siteConfig } from '@/config/site';

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
        const res = await fetch(`${siteConfig.apiUrl}/blog/`, {
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

// const categories = ['All', 'Guides', 'Customs', 'Shipping', 'Business', 'Comparison', 'News'];

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

    // const regularArticles = articles.filter(a => !a.is_featured);

    return (
        <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0a0f1d] font-sans selection:bg-pink-100 selection:text-pink-600">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            
            {/* Craft-Style Centered Hero */}
            <div className="relative pt-48 pb-32 overflow-hidden bg-white dark:bg-slate-950 border-b border-gray-100 dark:border-slate-900">
                <div className="max-w-4xl mx-auto px-6 text-center animate-fade-in">
                    <span className="inline-block px-4 py-1.5 mb-10 text-[10px] font-black tracking-[0.5em] uppercase text-slate-400 dark:text-slate-500">
                        Editorial Publication
                    </span>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-black mb-10 tracking-tight text-slate-950 dark:text-white leading-[1.05]">
                        Logistics <span className="italic opacity-20 px-2">&amp;</span> <br />
                        <span className="text-pink-600">Scaling</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-12">
                        Everything you need to build a high-performance importation business from China to Ghana. Built for the curious.
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <div className="h-[1px] w-12 bg-gray-200 dark:bg-slate-800"></div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em]">Editorial Publication</p>
                        <div className="h-[1px] w-12 bg-gray-200 dark:bg-slate-800"></div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-32">
                {/* Ultra-Clean Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                    {articles.map((article, idx) => (
                        <Link 
                            key={article.id} 
                            href={`/blog/${article.slug}`} 
                            className={`group block ${idx === 0 ? 'md:col-span-2' : ''}`}
                        >
                            <div className={`relative mb-10 overflow-hidden bg-white dark:bg-slate-900 rounded-lg shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-gray-100 dark:border-slate-800 transition-all duration-700 hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)] ${idx === 0 ? 'aspect-[2/1]' : 'aspect-[16/9]'}`}>
                                <Image 
                                    src={article.featured_image || "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop"} 
                                    alt={article.title}
                                    fill
                                    className="object-cover transition-all duration-1000 group-hover:scale-[1.03]"
                                />
                                <div className="absolute top-6 left-6">
                                    <span className="px-4 py-2 rounded-md bg-white/95 dark:bg-black/60 backdrop-blur-md text-[9px] font-bold uppercase tracking-widest text-gray-900 dark:text-white border border-gray-100 dark:border-slate-800">
                                        {article.category_display}
                                    </span>
                                </div>
                            </div>
                            
                            <div className={`${idx === 0 ? 'max-w-3xl mx-auto text-center' : ''}`}>
                                <p className="text-[10px] font-bold text-pink-600 uppercase tracking-[0.4em] mb-4">
                                    {new Date(article.published_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </p>
                                <h2 className={`${idx === 0 ? 'text-3xl md:text-5xl' : 'text-2xl md:text-3xl'} font-serif font-black text-gray-900 dark:text-white group-hover:text-pink-600 transition-colors leading-[1.1]`}>
                                    {article.title}
                                </h2>
                                <p className="mt-6 text-gray-500 dark:text-slate-500 text-sm leading-relaxed max-w-2xl mx-auto">
                                    {article.excerpt}
                                </p>
                                <div className="mt-8 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-600">Read Article</span>
                                    <svg className="w-3 h-3 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Minimalist Centered CTA */}
                <div className="mt-56 max-w-4xl mx-auto py-32 px-12 rounded-[2rem] bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-center shadow-[0_20px_80px_rgba(0,0,0,0.03)] relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-full bg-[radial-gradient(circle_at_center,rgba(219,39,119,0.03),transparent_70%)]"></div>
                    <div className="relative z-10">
                        <span className="inline-block px-4 py-1.5 mb-10 text-[9px] font-black tracking-[0.5em] uppercase text-pink-600 bg-pink-50 dark:bg-pink-900/20 rounded-full">
                            The Weekly Protocol
                        </span>
                        <h2 className="text-4xl md:text-6xl font-serif font-black mb-8 text-gray-900 dark:text-white leading-[1]">
                            Stay Refined. <br />
                            Stay Ahead.
                        </h2>
                        <p className="text-lg text-gray-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed mb-12">
                            Join 5,000+ Ghanaian business leaders receiving our monthly logistics briefing.
                        </p>
                        <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
                            <input 
                                type="email" 
                                placeholder="Your industry email..." 
                                className="flex-1 px-8 py-5 rounded-xl bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 focus:outline-none focus:border-pink-500 transition-all font-sans text-xs"
                            />
                            <button className="px-10 py-5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-950 font-black text-[10px] uppercase tracking-[0.4em] transition-all hover:bg-pink-600 hover:text-white">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
