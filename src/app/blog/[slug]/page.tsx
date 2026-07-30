/**
 * London's Imports - Journal Entry (Architectural Editorial Edition)
 * Verified Logistics Strategy & International Sourcing.
 */
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getImageUrl, fixHtmlContent } from '@/lib/image';
import { siteConfig } from '@/config/site';
import ShareButton from '@/components/ShareButton';
import { ArrowUpRight, ArrowLeft, Clock } from 'lucide-react';

// Safe 5-minute ISR revalidate — stays 100% within Vercel Free Tier limit
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

// Fallback Articles
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

Browse the network via Chrome translation. Focus on verification: look for high-performance ratings and historical fulfillment data.`,
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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    let article = await getBlogPost(slug);
    if (!article) article = fallbackArticles[slug];
    if (!article) return { title: 'Journal Entry | London\'s Imports' };

    return {
        title: `${article.title} | London's Imports Journal`,
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
        <article className="min-h-screen bg-white relative pb-32 selection:bg-emerald-100 font-sans">
            {/* Reading Progress Indicator */}
            <div className="fixed top-0 left-0 w-full h-[1.5px] z-50 bg-slate-100">
                <div id="reading-progress" className="h-full bg-slate-900 transition-all duration-150 w-0"></div>
            </div>

            {/* 1. ARCHITECTURAL EDITORIAL HEADER */}
            <header className="max-w-4xl mx-auto pt-24 md:pt-36 pb-16 px-6 border-b border-slate-100">
                <div className="flex items-center justify-between mb-12">
                    <Link
                        href="/blog"
                        className="group inline-flex items-center gap-3 text-[10px] font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-[0.3em]"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                        Back to Journal
                    </Link>
                    
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                        {article.category_display || 'Editorial Publication'}
                    </span>
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-slate-900 mb-12 tracking-tighter leading-[0.95]">
                    {article.title}
                </h1>

                <p className="text-lg md:text-2xl text-slate-500 font-medium leading-relaxed mb-12 italic border-l border-slate-900 pl-6">
                    &quot;{article.excerpt}&quot;
                </p>

                <div className="flex flex-wrap items-center justify-between gap-6 pt-8 border-t border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                    <div className="flex items-center gap-6">
                        <span>Author: <strong className="text-slate-900 font-black">{article.author_name || 'Editorial Board'}</strong></span>
                        <span>•</span>
                        <span>{new Date(article.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3 text-slate-900" />
                            <span className="text-slate-900">{article.read_time_minutes || 5} MIN READ</span>
                        </div>
                        <ShareButton 
                            title={article.title} 
                            url={`${siteConfig.baseUrl}/blog/${slug}`} 
                        />
                    </div>
                </div>
            </header>

            {/* 2. DOCUMENT PAYLOAD */}
            <main className="max-w-3xl mx-auto px-6 py-16">
                {/* Featured Image Frame (Sharp Rectangular Editorial Frame) */}
                {article.featured_image && (
                    <div className="relative w-full aspect-[21/9] overflow-hidden mb-16 border border-slate-200 bg-slate-50">
                        <Image
                            src={getImageUrl(article.featured_image)}
                            alt={article.title}
                            fill
                            className="object-cover"
                            priority
                            unoptimized
                        />
                    </div>
                )}

                {/* Minimalist BECE / WASSCE Result Checker CTA Box */}
                {isCheckerArticle && (
                    <div className="mb-16 p-8 md:p-12 bg-slate-950 text-white border border-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400 block mb-3">
                                Official Digital Portal
                            </span>
                            <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2 tracking-tighter">
                                Buy Genuine BECE Result Checker Online
                            </h3>
                            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
                                Get authentic WAEC result checker serial &amp; PIN delivered instantly via SMS and on-screen display.
                            </p>
                        </div>
                        <Link 
                            href="/checker"
                            className="inline-flex items-center gap-3 bg-white text-slate-950 hover:bg-slate-100 px-8 py-4 text-[11px] font-black uppercase tracking-widest transition-colors shrink-0 border border-white"
                        >
                            Buy Checker GHS 17.00
                            <ArrowUpRight className="w-4 h-4 text-slate-950" />
                        </Link>
                    </div>
                )}

                {/* Article Content */}
                <div className="relative">
                    <div 
                        className="blog-content prose prose-slate max-w-none 
                        prose-p:text-slate-600 prose-p:text-base md:prose-p:text-lg prose-p:leading-relaxed prose-p:mb-8 prose-p:font-medium
                        prose-headings:font-serif prose-headings:font-bold prose-headings:tracking-tighter 
                        prose-h2:text-3xl md:prose-h2:text-4xl prose-h2:text-slate-900 prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-slate-100 prose-h2:pb-4
                        prose-h3:text-xl md:prose-h3:text-2xl prose-h3:text-slate-900 prose-h3:mt-8 prose-h3:mb-4
                        prose-strong:text-slate-900 prose-strong:font-black
                        prose-blockquote:border-l-2 prose-blockquote:border-slate-900 prose-blockquote:bg-slate-50 prose-blockquote:font-serif prose-blockquote:italic prose-blockquote:py-6 prose-blockquote:px-8
                        prose-img:border prose-img:border-slate-100 prose-img:my-10"
                        dangerouslySetInnerHTML={{ __html: fixHtmlContent(article.content) }}
                    />
                </div>

                {/* Architectural Document Footer */}
                <div className="mt-32 pt-16 border-t border-slate-100 grid md:grid-cols-2 gap-px bg-slate-100 border border-slate-100">
                    <div className="bg-white p-10 md:p-14 flex flex-col justify-between group">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-6 block">Document Index</span>
                            <h3 className="text-3xl font-serif font-bold text-slate-900 mb-6 tracking-tighter leading-tight">
                                End of <br /> 
                                <span className="italic font-light text-slate-400">Journal Entry.</span>
                            </h3>
                        </div>
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-3 text-[11px] font-black text-slate-900 border-b border-slate-900 pb-1 self-start hover:opacity-60 transition-opacity uppercase tracking-widest"
                        >
                            Return to All Articles
                            <ArrowUpRight className="w-3.5 h-3.5 text-slate-900" />
                        </Link>
                    </div>

                    <div className="bg-slate-50 p-10 md:p-14 flex flex-col justify-center border-l border-slate-100">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Publication Ref</span>
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-900 font-mono">#JOURNAL-{article.id}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Security Audit</span>
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-900 italic">Verified Logistics Strategy</span>
                            </div>
                        </div>
                    </div>
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
