/**
 * London's Imports - Blog Article Page (Dynamic)
 * Individual article fetched from API with SEO metadata
 */
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getImageUrl } from '@/lib/image';
import { siteConfig } from '@/config/site';

import ShareButton from '@/components/ShareButton';

// Blog post type from API
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

// Pre-generate all blog posts at build time (SSG)
// This eliminates serverless function CPU usage on Vercel
export async function generateStaticParams() {
    // Fallback slugs in case API is unavailable during build
    const fallbackSlugs = [
        'how-to-buy-from-1688-in-ghana',
        'mini-importation-beginners-guide',
        'customs-duty-calculator-ghana',
    ];

    try {
        const res = await fetch(`${siteConfig.apiUrl}/blog/`, {
            next: { revalidate: 86400 }
        });
        if (res.ok) {
            const posts = await res.json();
            if (posts.length > 0) {
                return posts.map((post: { slug: string }) => ({ slug: post.slug }));
            }
        }
    } catch {
        // Use fallbacks if API fails
    }

    return fallbackSlugs.map(slug => ({ slug }));
}

// Fallback static articles for backwards compatibility
const fallbackArticles: Record<string, BlogPost> = {
    'how-to-buy-from-1688-in-ghana': {
        id: 0,
        title: 'How to Buy from 1688 in Ghana: Complete Guide 2024',
        slug: 'how-to-buy-from-1688-in-ghana',
        excerpt: 'Learn step-by-step how to order from 1688 and have it shipped to Ghana.',
        content: `1688.com is Alibaba's wholesale marketplace in China, offering products at factory prices. Many Ghanaians don't know they can access these incredible deals.

## Why Buy from 1688?

1688 offers prices 30-50% cheaper than Alibaba because it's designed for domestic Chinese buyers. You'll find electronics, fashion, gadgets, phone accessories, kitchen items, and more at wholesale prices.

## Step 1: Find Your Products

Browse 1688.com (use Google Translate or Chrome's built-in translation). Search for products using simple keywords. Look for shops with high ratings and many orders.

## Step 2: Send Us Your Links

WhatsApp us at +233 54 109 6372 with your product links. We'll verify the seller, check quality, and give you a total price including shipping and customs to Ghana.

## Step 3: Pay with Mobile Money

No credit card needed! Pay in Ghana Cedis (GHS) using MTN Mobile Money, AirtelTigo Money, or Vodafone Cash.

## Step 4: We Handle Everything

We purchase from 1688, consolidate your items in our Guangzhou warehouse, handle shipping, clear customs at Tema Port, and deliver to your door.

## Ready to Start?

WhatsApp us today at +233 54 109 6372 or browse our pre-sourced products!`,
        category: 'guides',
        category_display: 'Guides',
        featured_image: null,
        author_name: 'London Imports',
        is_featured: true,
        read_time_minutes: 8,
        published_at: '2024-01-05T00:00:00Z',
        created_at: '2024-01-05T00:00:00Z',
        updated_at: '2024-01-05T00:00:00Z',
    },
    'mini-importation-beginners-guide': {
        id: 1,
        title: 'Mini Importation in Ghana: Beginner\'s Guide',
        slug: 'mini-importation-beginners-guide',
        excerpt: 'Everything you need to know about starting mini importation in Ghana.',
        content: `Mini importation is transforming how Ghanaians access quality products at affordable prices.

## What is Mini Importation?

Mini importation is the process of buying goods in small quantities from overseas (usually China) and having them shipped to Ghana. Unlike traditional importation, you don't need containers or huge capital.

## Benefits of Mini Importation

- **Lower costs:** Buy at factory prices, 30-70% cheaper than local retail
- **Access to variety:** Millions of products not available in Ghana
- **Flexible quantities:** Order as few as 1-10 units
- **Business opportunity:** Resell for profit

## Popular Products to Import

1. Phones and phone accessories
2. Fashion and clothing
3. Electronics and gadgets
4. Beauty products
5. Kitchen appliances

## Getting Started

The easiest way to start is with a trusted agent like London's Imports. We handle sourcing, shipping, customs clearance, and delivery.

Contact us on WhatsApp: +233 54 109 6372`,
        category: 'guides',
        category_display: 'Guides',
        featured_image: null,
        author_name: 'London Imports',
        is_featured: true,
        read_time_minutes: 10,
        published_at: '2024-01-03T00:00:00Z',
        created_at: '2024-01-03T00:00:00Z',
        updated_at: '2024-01-03T00:00:00Z',
    },
    'customs-duty-calculator-ghana': {
        id: 2,
        title: 'Ghana Customs Duty Calculator: How Much Will You Pay?',
        slug: 'customs-duty-calculator-ghana',
        excerpt: 'Understand Ghana customs duties for electronics, phones, fashion, and more.',
        content: `Understanding customs duties is crucial for calculating your true import costs.

## How Ghana Customs Duty Works

When goods arrive in Ghana, you pay:
1. **Import Duty:** 0-35% of CIF value
2. **VAT:** 15% on goods
3. **NHIL:** 2.5%
4. **GETFund Levy:** 2.5%
5. **Processing fees**

## Common Duty Rates

| Product | Total Taxes (Est.) |
|---------|-------------------|
| Phones/Electronics | 35-40% |
| Clothing/Fashion | 45-50% |
| Beauty Products | 45-50% |
| Kitchen Items | 45-50% |

## How London's Imports Helps

When you order through us, our quoted price includes all duties and taxes. No hidden fees!

Visit londonsimports.com/customs-estimator to calculate your import costs!`,
        category: 'customs',
        category_display: 'Customs',
        featured_image: null,
        author_name: 'London Imports',
        is_featured: false,
        read_time_minutes: 6,
        published_at: '2023-12-28T00:00:00Z',
        created_at: '2023-12-28T00:00:00Z',
        updated_at: '2023-12-28T00:00:00Z',
    },
};

// Generate metadata for SEO with Editorial Focus
export async function generateMetadata({
    params
}: {
    params: Promise<{ slug: string }>
}): Promise<Metadata> {
    const { slug } = await params;
    let article = await getBlogPost(slug);

    if (!article && fallbackArticles[slug]) {
        article = fallbackArticles[slug];
    }

    if (!article) {
        return {
            title: 'Journal Entry | London\'s Imports',
        };
    }

    const title = `${article.title} | London's Imports Journal`;
    const description = article.excerpt || "Professional sourcing and importation insights for the Ghanaian market.";
    const baseOgImage = article.featured_image ? getImageUrl(article.featured_image) : `${siteConfig.baseUrl}/og-image.jpg`;
    
    // High-Editorial Dynamic Social Card URL
    const dynamicOgImage = `${siteConfig.baseUrl}/api/og?title=${encodeURIComponent(article.title)}&image=${encodeURIComponent(baseOgImage)}&type=${encodeURIComponent(article.category_display || 'Journal Entry')}`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'article',
            url: `${siteConfig.baseUrl}/blog/${slug}`,
            publishedTime: article.published_at,
            authors: [article.author_name || "London's Imports Editorial"],
            images: [
                {
                    url: dynamicOgImage,
                    width: 1200,
                    height: 630,
                    alt: article.title,
                }
            ],
            siteName: "London's Imports Ghana",
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [dynamicOgImage],
            creator: '@londonsimports',
        },
    };
}

export default async function BlogArticlePage({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params;

    // Try API first, then fallback
    let article = await getBlogPost(slug);

    if (!article && fallbackArticles[slug]) {
        article = fallbackArticles[slug];
    }

    if (!article) {
        notFound();
    }

    // JSON-LD Structured Data for Blog
    const blogSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": article.title,
        "description": article.excerpt,
        "image": article.featured_image ? [getImageUrl(article.featured_image)] : [],
        "author": {
            "@type": "Organization",
            "name": siteConfig.name,
            "url": siteConfig.baseUrl,
            "logo": `${siteConfig.baseUrl}/logo.jpg`
        },
        "publisher": {
            "@type": "Organization",
            "name": siteConfig.name,
            "logo": {
                "@type": "ImageObject",
                "url": `${siteConfig.baseUrl}/logo.jpg`
            }
        },
    } as Record<string, unknown>;

    // Video Detection Logic
    const youtubeMatch = article.content.match(/youtube\.com\/embed\/([^"&?/ ]+)/) || article.content.match(/youtu\.be\/([^"&?/ ]+)/);
    if (youtubeMatch) {
        const videoId = youtubeMatch[1];
        blogSchema.video = {
            "@type": "VideoObject",
            "name": article.title,
            "description": article.excerpt,
            "thumbnailUrl": [
                `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
            ],
            "uploadDate": article.published_at,
            "embedUrl": `https://www.youtube.com/embed/${videoId}`
        };
    }

    // TikTok Detection (Simple match for embeds)
    if (article.content.includes("tiktok.com")) {
        // If we find a tiktok link, we at least signal it exists
        // Actual embedding usually provides more metadata, but this helps the crawler
        if (!blogSchema.video) {
           blogSchema.video = {
               "@type": "VideoObject",
               "name": `${article.title} (Social Feed)`,
               "description": `Watch related mini importation content on our TikTok.`,
               "thumbnailUrl": [getImageUrl(article.featured_image)],
               "uploadDate": article.published_at,
               "contentUrl": "https://www.tiktok.com/@londons_imports1"
           };
        }
    }

    // Semantic Entity Linking - Beast Mode SEO
    const entities = [
        { key: '1688', name: '1688.com', sameAs: 'https://en.wikipedia.org/wiki/Alibaba_Group' },
        { key: 'Alibaba', name: 'Alibaba Group', sameAs: 'https://en.wikipedia.org/wiki/Alibaba_Group' },
        { key: 'Guangzhou', name: 'Guangzhou', sameAs: 'https://en.wikipedia.org/wiki/Guangzhou' },
        { key: 'Tema Port', name: 'Tema Port', sameAs: 'https://en.wikipedia.org/wiki/Tema_Port' },
        { key: 'Ghana Revenue Authority', name: 'Ghana Revenue Authority', sameAs: 'https://gra.gov.gh/' },
        { key: 'Mobile Money', name: 'Mobile Money', sameAs: 'https://en.wikipedia.org/wiki/Mobile_payment' }
    ];

    const mentions = entities
        .filter(e => article.content.toLowerCase().includes(e.key.toLowerCase()) || article.title.toLowerCase().includes(e.key.toLowerCase()))
        .map(e => ({
            "@type": "Thing",
            "name": e.name,
            "sameAs": e.sameAs
        }));

    if (mentions.length > 0) {
        blogSchema.mentions = mentions;
    }

    // Breadcrumb Schema
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": siteConfig.baseUrl
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Blog",
                "item": `${siteConfig.baseUrl}/blog`
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": article.title,
                "item": `${siteConfig.baseUrl}/blog/${slug}`
            }
        ]
    };

    return (
        <article className="min-h-screen bg-white dark:bg-[#0a0f1d] selection:bg-pink-100 selection:text-pink-600 font-sans">
            {/* Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />

            {/* Subtle Reading Progress */}
            <div className="fixed top-0 left-0 w-full h-[2px] z-[60] bg-gray-50/50 dark:bg-slate-900/30">
                <div id="reading-progress" className="h-full bg-pink-600 transition-all duration-150 w-0"></div>
            </div>

            {/* Craft-Style 'Document' Header */}
            <header className="max-w-3xl mx-auto pt-48 pb-20 px-6 text-center">
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-[9px] font-bold mb-12 text-gray-400 hover:text-pink-600 transition-colors uppercase tracking-[0.5em]"
                >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                    Journal Index
                </Link>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-black text-gray-900 dark:text-white mb-10 tracking-tight leading-[1.05]">
                    {article.title}
                </h1>

                <div className="flex flex-col items-center gap-6 pt-10 border-t border-gray-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white font-bold text-xs">
                            {article.author_name ? article.author_name.charAt(0) : 'L'}
                        </div>
                        <span className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-[0.2em]">
                            {article.author_name || 'Editorial Team'}
                        </span>
                    </div>
                    <div className="flex items-center gap-4 text-[9px] font-bold text-gray-400 uppercase tracking-[0.3em]">
                        <span>{new Date(article.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-200"></span>
                        <span>{article.read_time_minutes} min read</span>
                    </div>

                    {/* Minimalist Editorial Share */}
                    <div className="pt-4">
                        <ShareButton 
                            title={article.title} 
                            url={`${siteConfig.baseUrl}/blog/${slug}`} 
                        />
                    </div>
                </div>
            </header>

            {/* Document Content Area */}
            <main className="max-w-3xl mx-auto px-6 py-20">
                {/* Clean Visual Anchor */}
                {article.featured_image && (
                    <div className="relative w-full aspect-[2/1] rounded-lg overflow-hidden mb-24 shadow-[0_30px_60px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-slate-800">
                        <Image
                            src={article.featured_image}
                            alt={article.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                )}

                {/* Craft-Style Body */}
                <div className="relative">
                    <div 
                        className="blog-content prose prose-stone lg:prose-lg dark:prose-invert max-w-none 
                        prose-p:text-gray-600 dark:prose-p:text-slate-400 prose-p:leading-[1.9] prose-p:mb-10
                        prose-headings:font-serif prose-headings:font-black prose-headings:tracking-tight 
                        prose-strong:text-gray-900 dark:prose-strong:text-white
                        prose-blockquote:border-pink-600 prose-blockquote:bg-gray-50/50 dark:prose-blockquote:bg-slate-900/20
                        prose-img:rounded-md prose-img:border prose-img:border-gray-100 dark:prose-img:border-slate-800"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />
                </div>

                {/* Refined Back Link */}
                <div className="mt-40 text-center pb-32 border-t border-gray-100 dark:border-slate-800 pt-20">
                    <Link
                        href="/blog"
                        className="text-gray-400 hover:text-pink-600 font-bold uppercase tracking-[0.5em] text-[9px] transition-colors"
                    >
                        End of Entry
                    </Link>
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
