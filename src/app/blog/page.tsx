/**
 * London's Imports - Blog Page (Architectural Edition)
 * Verified Logistics Strategy & International Sourcing.
 */
import Link from 'next/link';
import NextImage from 'next/image';
import { Metadata } from 'next';
import { ArrowUpRight, Clock } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { getImageUrl } from '@/lib/image';

export const metadata: Metadata = {
    title: 'Logistics & Scaling | Editorial Publication',
    description: 'Guides, tips, and insights on importing from China to Ghana. Comprehensive strategy for international sourcing.',
};

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
            next: { revalidate: 86400 }
        });
        if (!res.ok) return [];
        const data = await res.json();
        if (Array.isArray(data)) return data;
        if (data && Array.isArray(data.results)) return data.results;
        return [];
    } catch {
        return [];
    }
}

// Global Verified Strategy Data
const fallbackArticles = [
    {
        id: 0,
        slug: 'how-to-buy-from-1688-in-ghana',
        title: 'The 1688 Framework: Sourcing from Global Production Hubs.',
        excerpt: 'A comprehensive operational guide to ordering from 1688 manufacturing centers and managing transit to the Accra Hub.',
        category: 'PROTOCOL-01',
        category_display: 'Protocol',
        featured_image: null,
        author_name: 'Strategic Sourcing',
        is_featured: true,
        read_time_minutes: 8,
        published_at: '2024-01-05T00:00:00Z',
    },
    {
        id: 1,
        slug: 'mini-importation-beginners-guide',
        title: 'Micro-Logistic Scaling: Establishing Local Infrastructure.',
        excerpt: 'Operational insights for beginners transitioning from individual sourcing to commercial-grade import pipelines in Ghana.',
        category: 'STRATEGY-02',
        category_display: 'Strategy',
        featured_image: null,
        author_name: 'Logistics Division',
        is_featured: true,
        read_time_minutes: 10,
        published_at: '2024-01-03T00:00:00Z',
    },
    {
        id: 2,
        slug: 'customs-duty-calculator-ghana',
        title: 'Fiscal Liability: Navigating the GH Common External Tariff.',
        excerpt: 'A strategic deep-dive into the statutory duty bands at Tema Port and their impact on commercial retail scaling.',
        category: 'FISCAL-03',
        category_display: 'Fiscal',
        featured_image: null,
        author_name: 'Compliance Audit',
        is_featured: false,
        read_time_minutes: 6,
        published_at: '2023-12-28T00:00:00Z',
    },
];

export default async function BlogPage() {
    let articles = await getBlogPosts();
    if (articles.length === 0) {
        articles = fallbackArticles as unknown as BlogPost[];
    }

    return (
        <div className="min-h-screen bg-white relative pb-32 selection:bg-emerald-100">
            {/* Structured Data: Breadcrumb */}
            <script
                id="blog-index-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        "itemListElement": [
                            { "@type": "ListItem", "position": 1, "name": "Home", "item": siteConfig.baseUrl },
                            { "@type": "ListItem", "position": 2, "name": "Journal", "item": `${siteConfig.baseUrl}/blog` }
                        ]
                    })
                }}
            />
            {/* 1. EDITORIAL HERO SECTION */}
            <header className="relative z-10 pt-24 pb-16 px-6 max-w-7xl mx-auto border-b border-slate-50">
                <div className="flex items-center gap-4 mb-12">
                    <span className="h-px w-12 bg-slate-900" />
                    <span className="text-[10px] font-black tracking-[0.4em] uppercase text-slate-400">
                        Editorial Publication / Vol. 01 
                    </span>
                </div>
                
                <h1 className="text-5xl md:text-8xl lg:text-9xl font-serif font-bold leading-[0.85] tracking-tighter text-slate-900 mb-16">
                    Logistics <br />
                    <span className="italic font-light text-slate-200">&amp;</span> <br />
                    Scaling.
                </h1>

                <p className="max-w-2xl text-xl md:text-2xl text-slate-500 font-medium leading-relaxed">
                    Strategy, compliance, and infrastructure for the high-performance sourcing house. Built for the architectural business mind.
                </p>
            </header>

            <div className="max-w-7xl mx-auto px-6 relative z-10 mt-24">
                {/* 2. THE PUBLICATION GRID (Asymmetrical Chronological Ledger) */}
                <div className="grid lg:grid-cols-12 gap-px bg-slate-100 border border-slate-100">
                    {articles.map((article, idx) => (
                        <Link 
                            key={article.id} 
                            href={`/blog/${article.slug}`} 
                            className={`bg-white group block overflow-hidden 
                                ${idx === 0 ? 'lg:col-span-8 p-12 md:p-20' : 'lg:col-span-4 p-10 md:p-14'}
                                hover:bg-slate-50/50 transition-all duration-700
                            `}
                        >
                                {idx === 0 && article.featured_image && (
                                    <div className="relative w-full aspect-[21/9] mb-12 overflow-hidden border border-slate-100 group-hover:border-slate-300 transition-all duration-700">
                                        <NextImage 
                                            src={getImageUrl(article.featured_image)} 
                                            alt={article.title}
                                            fill
                                            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                                        />
                                    </div>
                                )}

                                {/* Metadata Ledger */}
                                <div className="flex items-center justify-between mb-10 border-b border-slate-50 pb-6">
                                    <span className="text-[9px] font-black text-slate-200 uppercase tracking-widest group-hover:text-emerald-500 transition-colors">
                                        {article.category_display}
                                    </span>
                                    <div className="flex items-center gap-4 opacity-20">
                                        <Clock className="w-3 h-3 text-slate-900" />
                                        <span className="text-[9px] font-black uppercase text-slate-950 tracking-tighter">{article.read_time_minutes} MIN</span>
                                    </div>
                                </div>

                                {/* Article Content */}
                                <div className="flex-1">
                                    <div className="flex flex-col md:flex-row gap-8">
                                        <div className="flex-1">
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mb-4">
                                                {new Date(article.published_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                            </p>
                                            <h2 className={`font-serif font-bold text-slate-900 group-hover:italic transition-all duration-700 leading-[0.95] tracking-tighter mb-8 
                                                ${idx === 0 ? 'text-4xl md:text-6xl lg:text-7xl' : 'text-2xl md:text-3xl'}
                                            `}>
                                                {article.title}
                                            </h2>
                                            <p className="text-slate-400 text-sm md:text-base leading-relaxed italic border-l border-slate-50 pl-8 mb-12">
                                                &quot;{article.excerpt}&quot;
                                            </p>
                                        </div>
                                        {idx !== 0 && article.featured_image && (
                                            <div className="hidden md:block w-32 h-32 shrink-0 relative overflow-hidden border border-slate-50">
                                                <NextImage 
                                                    src={getImageUrl(article.featured_image)} 
                                                    alt={article.title}
                                                    fill
                                                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Article Interaction */}
                                <div className="mt-auto pt-8 flex items-center justify-between group/link">
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{article.author_name}</span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest pb-1 border-b border-slate-900 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                            Execute Review
                                        </span>
                                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-900 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                    </div>
                                </div>
                        </Link>
                    ))}
                </div>

                {/* 3. STRATEGY CALLOUT (Asymmetrical Protocol Ledger) */}
                <div className="mt-48 pt-32 border-t border-slate-100 grid md:grid-cols-2 gap-px bg-slate-100 border border-slate-100">
                    <div className="bg-white p-12 md:p-20 flex flex-col justify-between group">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mb-10 block font-sans">Human Interface 02</span>
                            <h3 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 mb-10 tracking-tighter leading-[0.85]">
                                Stay Refined. <br /> 
                                <span className="italic font-light text-slate-200">Stay Ahead.</span>
                            </h3>
                        </div>
                        <p className="text-sm text-slate-400 font-medium leading-relaxed mb-12 max-w-xs group-hover:text-slate-500 transition-colors">
                            Monthly logistics briefings for Ghanaian business leaders. No filler, only verified strategy.
                        </p>
                        
                        <div className="flex flex-col gap-6 max-w-sm">
                            <input 
                                type="email" 
                                title="Protocol Email"
                                placeholder="Your Industry Email..." 
                                className="bg-transparent border-b border-slate-100 text-[11px] font-black uppercase tracking-widest text-slate-900 py-4 outline-none focus:border-slate-900 transition-colors"
                            />
                            <button className="group/btn relative h-14 overflow-hidden border border-slate-900 px-10 self-start transition-all hover:bg-slate-900">
                                <span className="relative z-10 text-[11px] font-black text-slate-900 uppercase tracking-widest group-hover/btn:text-white transition-colors">Subscribe</span>
                                <div className="absolute inset-0 bg-slate-900 transition-transform translate-y-full group-hover/btn:translate-y-0" />
                            </button>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-12 md:p-20 flex flex-col justify-center border-l border-slate-100">
                         <div className="space-y-12 opacity-30">
                             <div className="pb-10 border-b border-slate-200">
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-900 block mb-4 italic">CORRIDOR SYNC</span>
                                <p className="text-xl font-serif font-bold text-slate-900 leading-tight">Direct updates from Guangzhou and Yiwu manufacturing centers.</p>
                             </div>
                             <div className="pb-10">
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-900 block mb-4 italic">LIABILITY PROTECT</span>
                                <p className="text-xl font-serif font-bold text-slate-900 leading-tight">Weekly analysis of Ghana port statutory duty variations.</p>
                             </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
