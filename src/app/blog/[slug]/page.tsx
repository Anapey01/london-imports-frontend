/**
 * London's Imports - Journal Entry (Architectural Edition)
 * Individual article reading experience.
 */
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getImageUrl, fixHtmlContent } from '@/lib/image';
import { siteConfig } from '@/config/site';
import ShareButton from '@/components/ShareButton';
import { ArrowUpRight, ArrowLeft, Clock } from 'lucide-react';

// Safe 5-minute ISR revalidate — stays 100% within Vercel Free Tier 10k limit while auto-refreshing articles
export const revalidate = 300;

interface BlogPost {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    category_display: string;
    featured_image: string | null;
    author_name: string;
    is_featured: boolean;
    read_time_minutes: number;
    published_at: string;
    created_at: string;
    updated_at: string;
}

// Fetch blog post from API
async function getBlogPost(slug: string): Promise<BlogPost | null> {
    try {
        const res = await fetch(`${siteConfig.apiUrl}/blog/${slug}/`, {
            next: { revalidate: 300 }
        });
        if (!res.ok) return null;
        return res.json();
    } catch {
        return null;
    }
}

// Fallback Strategy Ledgers
const fallbackArticles: Record<string, BlogPost> = {
    'how-to-buy-from-1688-in-ghana': {
        id: 0,
        title: 'How to Buy from 1688: A Complete Guide for Ghana.',
        slug: 'how-to-buy-from-1688-in-ghana',
        excerpt: 'A comprehensive guide to ordering from 1688 and managing your shipments to Accra and Kumasi.',
        content: `1688.com is the primary wholesale marketplace for factory-direct sourcing in China. Operating at the 12,000km gap requires a rigorous operational framework.

## Why 1688 Process?

Pricing at 1688 manufacturing hubs is typically 30-50% more efficient than standard consumer portals because the architecture is designed for high-volume domestic procurement.

## Phase 01: Inventory Discovery

Browse the network via Chrome translation. Focus on verification: look for high-performance ratings and historical fulfillment data.

## Phase 02: Sharing Links

Submit your product identifiers (URLs) to the London's Imports procurement desk. We verify supplier integrity and provide total CIF valuation.

## Phase 03: Payment & Ordering

Execute payment via the local digital gateway (Momo/Card). No international credit facility required.

## Phase 04: Consolidation & Arrival

We purchase, consolidate in Guangzhou, manage the air/sea corridor, and finalize clearance at the Accra Hub for doorstep delivery.`,
        category: 'PROTOCOL-01',
        category_display: 'Protocol',
        featured_image: null,
        author_name: 'Logistics Division',
        is_featured: true,
        read_time_minutes: 8,
        published_at: '2024-01-05T00:00:00Z',
        created_at: '2024-01-05T00:00:00Z',
        updated_at: '2024-01-05T00:00:00Z',
    },
};
import BlogImage from '@/components/BlogImage';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    let article = await getBlogPost(slug);
    if (!article) article = fallbackArticles[slug];
    if (!article) return { title: 'Journal Entry | London\'s Imports' };

    return {
        title: `${article.title} | London's Imports Blog`,
        description: article.excerpt,
        alternates: {
            canonical: `${siteConfig.baseUrl}/blog/${slug}`,
        }
    };
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    let article = await getBlogPost(slug);
    if (!article) article = fallbackArticles[slug];
    if (!article) notFound();

    const isCheckerArticle = article.title.toLowerCase().includes('bece') || 
                             article.title.toLowerCase().includes('wassce') || 
                             article.title.toLowerCase().includes('waec');

    return (
        <article className="min-h-screen bg-slate-50/30 relative pb-32 selection:bg-emerald-100 font-sans">
            {/* Reading Progress Indicator */}
            <div className="fixed top-0 left-0 w-full h-[2px] z-50 bg-slate-100">
                <div id="reading-progress" className="h-full bg-emerald-600 transition-all duration-150 w-0"></div>
            </div>

            {/* 1. ELEGANT EDITORIAL HEADER */}
            <header className="max-w-4xl mx-auto pt-32 md:pt-40 pb-16 px-6 text-center">
                <div className="flex items-center justify-center gap-3 mb-8">
                    <Link
                        href="/blog"
                        className="group inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                        Back to Journal
                    </Link>
                    {article.category_display && (
                        <span className="inline-block px-3 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider rounded-full border border-emerald-200">
                            {article.category_display}
                        </span>
                    )}
                </div>

                <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-slate-900 mb-8 tracking-tight leading-[1.15]">
                    {article.title}
                </h1>

                <p className="text-lg md:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto mb-10 italic">
                    &quot;{article.excerpt}&quot;
                </p>

                <div className="flex flex-wrap items-center justify-center gap-6 pt-8 border-t border-slate-200/80 text-xs font-bold text-slate-500 uppercase tracking-widest">
                    <span>Author: <strong className="text-slate-900">{article.author_name || 'Editorial Team'}</strong></span>
                    <span>•</span>
                    <span>{new Date(article.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{article.read_time_minutes || 5} MIN READ</span>
                    </div>
                </div>

                <div className="pt-6 flex justify-center">
                    <ShareButton 
                        title={article.title} 
                        url={`${siteConfig.baseUrl}/blog/${slug}`} 
                    />
                </div>
            </header>

            {/* 2. DOCUMENT PAYLOAD */}
            <main className="max-w-3xl mx-auto px-6">
                {/* Featured Image Header Component */}
                <div className="mb-16">
                    <BlogImage 
                        src={getImageUrl(article.featured_image)} 
                        alt={article.title} 
                        priority 
                    />
                </div>

                {/* BECE / WASSCE Checker Action Box */}
                {isCheckerArticle && (
                    <div className="mb-12 p-6 md:p-8 bg-gradient-to-r from-emerald-900 to-slate-900 rounded-2xl text-white shadow-xl border border-emerald-800/60 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-widest rounded-full mb-3 border border-emerald-500/30">
                                Instant Digital Delivery
                            </span>
                            <h3 className="text-xl md:text-2xl font-serif font-bold tracking-tight text-white mb-2">
                                Check Your BECE Result Online Now
                            </h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Get authentic WAEC BECE Result Checker serial &amp; PIN instantly via SMS and instant screen view.
                            </p>
                        </div>
                        <Link 
                            href="/checker"
                            className="shrink-0 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg hover:scale-105"
                        >
                            Buy Checker GHS 17.00 →
                        </Link>
                    </div>
                )}

                {/* Main Article Body */}
                <div className="bg-white p-8 md:p-14 rounded-2xl border border-slate-200/80 shadow-sm relative">
                    <div 
                        className="blog-content prose prose-slate max-w-none 
                        prose-p:text-slate-700 prose-p:text-base md:prose-p:text-lg prose-p:leading-relaxed prose-p:mb-6
                        prose-headings:font-serif prose-headings:font-bold prose-headings:tracking-tight 
                        prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:text-slate-900 prose-h2:mt-10 prose-h2:mb-5 prose-h2:border-b prose-h2:border-slate-100 prose-h2:pb-3
                        prose-h3:text-xl md:prose-h3:text-2xl prose-h3:text-slate-900 prose-h3:mt-8 prose-h3:mb-4
                        prose-strong:text-slate-900 prose-strong:font-black
                        prose-blockquote:border-l-4 prose-blockquote:border-emerald-500 prose-blockquote:bg-emerald-50/40 prose-blockquote:font-serif prose-blockquote:italic prose-blockquote:py-6 prose-blockquote:px-8 prose-blockquote:rounded-r-xl
                        prose-img:rounded-xl prose-img:shadow-md prose-img:my-8"
                        dangerouslySetInnerHTML={{ __html: fixHtmlContent(article.content) }}
                    />
                </div>

                {/* Bottom Article Navigation */}
                <div className="mt-16 pt-12 border-t border-slate-200 flex items-center justify-between">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 uppercase tracking-widest"
                    >
                        ← Back to all articles
                    </Link>
                    <ShareButton 
                        title={article.title} 
                        url={`${siteConfig.baseUrl}/blog/${slug}`} 
                    />
                </div>
            </main>

            {/* Reading Progress Client-Side Logic */}
            <script
                dangerouslySetInnerHTML={{
                    __html: `
                        window.onscroll = function() {
                            var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
                            var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                            var scrolled = (winScroll / height) * 100;
                            var progress = document.getElementById("reading-progress");
                            if (progress) progress.style.width = scrolled + "%";
                        };
                    `
                }}
            />
        </article>
    );
}
