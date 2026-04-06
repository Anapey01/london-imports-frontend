/**
 * London's Imports - Journal Entry (Architectural Edition)
 * Individual article reading experience.
 */
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getImageUrl } from '@/lib/image';
import { siteConfig } from '@/config/site';
import ShareButton from '@/components/ShareButton';
import { ArrowUpRight, ArrowLeft, Clock } from 'lucide-react';

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
            next: { revalidate: 86400 }
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
        title: 'The 1688 Framework: Sourcing from Global Production Hubs.',
        slug: 'how-to-buy-from-1688-in-ghana',
        excerpt: 'A comprehensive operational guide to ordering from 1688 manufacturing centers and managing transit to the Accra Hub.',
        content: `1688.com is the primary wholesale marketplace for factory-direct sourcing in China. Operating at the 12,000km gap requires a rigorous operational framework.

## Why 1688 Protocol?

Pricing at 1688 manufacturing hubs is typically 30-50% more efficient than standard consumer portals because the architecture is designed for high-volume domestic procurement.

## Phase 01: Inventory Discovery

Browse the network via Chrome translation. Focus on verification: look for high-performance ratings and historical fulfillment data.

## Phase 02: Link Transmission

Submit your product identifiers (URLs) to the London's Imports procurement desk. We verify supplier integrity and provide total CIF valuation.

## Phase 03: Settlement & Execution

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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    let article = await getBlogPost(slug);
    if (!article) article = fallbackArticles[slug];
    if (!article) return { title: 'Journal Entry | London\'s Imports' };

    return {
        title: `${article.title} | Journal Index`,
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

    return (
        <article className="min-h-screen bg-white relative pb-32 selection:bg-emerald-100 font-sans">
            {/* Reading Progress Indicator (Architectural) */}
            <div className="fixed top-0 left-0 w-full h-[1.5px] z-[60] bg-slate-50">
                <div id="reading-progress" className="h-full bg-slate-900 transition-all duration-300 w-0"></div>
            </div>

            {/* 1. ARCHITECTURAL DOCUMENT HEADER */}
            <header className="max-w-4xl mx-auto pt-48 pb-20 px-6 text-center border-b border-slate-50">
                <Link
                    href="/blog"
                    className="group inline-flex items-center gap-4 text-[9px] font-black mb-16 text-slate-300 hover:text-slate-900 transition-colors uppercase tracking-[0.5em]"
                >
                    <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                    Archive Directory
                </Link>

                <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif font-bold text-slate-900 mb-16 tracking-tighter leading-[0.85]">
                    {article.title}
                </h1>

                <div className="flex flex-col items-center gap-8 pt-12 border-t border-slate-50">
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] font-sans">
                            Author: {article.author_name || 'Protocol Hub'}
                        </span>
                    </div>
                    <div className="flex items-center gap-8 text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">
                        <span>{new Date(article.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3" />
                            <span>{article.read_time_minutes} MIN READ</span>
                        </div>
                    </div>

                    <div className="pt-6">
                        <ShareButton 
                            title={article.title} 
                            url={`${siteConfig.baseUrl}/blog/${slug}`} 
                        />
                    </div>
                </div>
            </header>

            {/* Structured Data: Article & Breadcrumb */}
            <script
                id="blog-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@graph": [
                            {
                                "@type": "BlogPosting",
                                "@id": `${siteConfig.baseUrl}/blog/${slug}/#article`,
                                "isPartOf": { "@id": `${siteConfig.baseUrl}/blog/${slug}/` },
                                "author": {
                                    "@type": "Person",
                                    "name": article.author_name || "London's Imports Hub",
                                    "url": `${siteConfig.baseUrl}/blog`
                                },
                                "headline": article.title,
                                "datePublished": article.published_at,
                                "dateModified": article.updated_at || article.published_at,
                                "mainEntityOfPage": { "@id": `${siteConfig.baseUrl}/blog/${slug}/` },
                                "wordCount": article.content?.split(/\s+/).length,
                                "publisher": { "@id": `${siteConfig.baseUrl}/#organization` },
                                "image": article.featured_image ? getImageUrl(article.featured_image) : `${siteConfig.baseUrl}/og-image.jpg`,
                                "description": article.excerpt,
                                "articleSection": article.category_display
                            },
                            {
                                "@type": "BreadcrumbList",
                                "@id": `${siteConfig.baseUrl}/blog/${slug}/#breadcrumb`,
                                "itemListElement": [
                                    { "@type": "ListItem", "position": 1, "name": "Home", "item": siteConfig.baseUrl },
                                    { "@type": "ListItem", "position": 2, "name": "Journal", "item": `${siteConfig.baseUrl}/blog` },
                                    { "@type": "ListItem", "position": 3, "name": article.title, "item": `${siteConfig.baseUrl}/blog/${slug}` }
                                ]
                            }
                        ]
                    })
                }}
            />

            {/* 2. DOCUMENT PAYLOAD (Single Column Architecture) */}
            <main className="max-w-3xl mx-auto px-6 py-24">
                {/* Visual Anchor (Sharp Edge) */}
                {article.featured_image && (
                    <div className="relative w-full aspect-[2/1] overflow-hidden mb-24 border border-slate-100 grayscale hover:grayscale-0 transition-all duration-1000">
                        <Image
                            src={article.featured_image}
                            alt={article.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                )}

                <div className="relative">
                    <div 
                        className="blog-content prose prose-stone lg:prose-xl max-w-none 
                        prose-p:text-slate-500 prose-p:leading-[1.9] prose-p:mb-12 prose-p:font-medium
                        prose-headings:font-serif prose-headings:font-bold prose-headings:tracking-tighter 
                        prose-h2:text-4xl md:prose-h2:text-5xl prose-h2:text-slate-900 prose-h2:mb-10
                        prose-strong:text-slate-900 prose-strong:font-black
                        prose-blockquote:border-slate-900 prose-blockquote:bg-slate-50/50 prose-blockquote:font-serif prose-blockquote:italic prose-blockquote:py-8 prose-blockquote:px-10
                        prose-img:rounded-none prose-img:border prose-img:border-slate-100"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />
                </div>

                {/* 3. END OF PROTOCOL (Architectural Navigation) */}
                <div className="mt-48 pt-24 border-t border-slate-100 grid md:grid-cols-2 gap-px bg-slate-100 border border-slate-100">
                    <div className="bg-white p-12 md:p-16 flex flex-col justify-between group">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mb-8 block">Document Footer</span>
                            <h3 className="text-3xl font-serif font-bold text-slate-900 mb-6 tracking-tighter leading-none">
                                End of <br /> 
                                <span className="italic font-light text-slate-200">the Entry.</span>
                            </h3>
                        </div>
                        <Link
                            href="/blog"
                            className="group/link inline-flex items-center gap-4 text-[11px] font-black text-slate-900 border-b border-black pb-2 self-start hover:opacity-60 transition-all uppercase tracking-widest"
                        >
                            Back to Archive
                            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                        </Link>
                    </div>

                    <div className="bg-slate-50 p-12 md:p-16 flex flex-col justify-center border-l border-slate-100">
                         <div className="space-y-8 opacity-40">
                             <div className="flex items-center justify-between border-b border-slate-900/5 pb-4">
                                <span className="text-[9px] font-black uppercase tracking-widest">Entry Ref</span>
                                <span className="text-[9px] font-black uppercase tracking-widest tabular-nums">#JOURNAL-{article.id}</span>
                             </div>
                             <div className="flex items-center justify-between">
                                <span className="text-[9px] font-black uppercase tracking-widest">Digital Sign</span>
                                <span className="text-[9px] font-black uppercase tracking-widest italic">Verified Strategy</span>
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
