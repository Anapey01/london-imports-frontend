/**
 * London's Imports - Blog Article Page (Dynamic)
 * Individual article fetched from API with SEO metadata
 */
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getImageUrl } from '@/lib/image';
import { getFeaturedProducts } from '@/lib/fetchers';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types';

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
        const res = await fetch(`https://london-imports-api.onrender.com/api/v1/blog/${slug}/`, {
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
        const res = await fetch('https://london-imports-api.onrender.com/api/v1/blog/', {
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

// Generate metadata for SEO
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
            title: 'Article Not Found | London\'s Imports',
        };
    }

    return {
        title: `${article.title} | London's Imports Blog`,
        description: article.excerpt,
        openGraph: {
            title: article.title,
            description: article.excerpt,
            type: 'article',
            publishedTime: article.published_at,
            authors: [article.author_name],
            images: article.featured_image ? [article.featured_image] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title: article.title,
            description: article.excerpt,
        },
    };
}

export default async function BlogArticlePage({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params;
    const featuredProductsData = await getFeaturedProducts();
    const featuredProducts = featuredProductsData?.results || [];

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
            "name": "London's Imports",
            "url": "https://londonsimports.com",
            "logo": "https://londonsimports.com/logo.jpg"
        },
        "publisher": {
            "@type": "Organization",
            "name": "London's Imports",
            "logo": {
                "@type": "ImageObject",
                "url": "https://londonsimports.com/logo.jpg"
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
                "item": "https://londonsimports.com"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Blog",
                "item": "https://londonsimports.com/blog"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": article.title,
                "item": `https://londonsimports.com/blog/${slug}`
            }
        ]
    };

    return (
        <article className="min-h-screen bg-white dark:bg-[#0a0f1d] selection:bg-pink-100 selection:text-pink-600">
            {/* Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            {/* Elegant Header / Hero */}
            <div className="relative w-full pt-32 pb-16 px-6 border-b border-gray-100 dark:border-slate-800/50 bg-[#fafafa] dark:bg-slate-900/20">
                <div className="max-w-4xl mx-auto">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-sm font-bold mb-8 text-pink-600 dark:text-pink-400 hover:opacity-70 transition-opacity uppercase tracking-widest"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                        </svg>
                        All Articles
                    </Link>

                    <div className="flex items-center gap-3 mb-6">
                        <span className="px-3 py-1 rounded-full bg-pink-500 text-white text-[10px] font-black uppercase tracking-widest">
                            {article.category_display}
                        </span>
                        <span className="text-gray-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest">
                            {new Date(article.published_at).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                            })}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span className="text-gray-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest">
                            {article.read_time_minutes} min read
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-8 tracking-tight leading-[1.1]">
                        {article.title}
                    </h1>

                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-violet-600 flex items-center justify-center text-white font-bold text-lg">
                            {article.author_name ? article.author_name.charAt(0) : 'L'}
                        </div>
                        <div>
                            <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
                                {article.author_name || 'London Imports'}
                            </p>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Editorial Team</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Article Content */}
            <article className="max-w-4xl mx-auto px-6 py-16">
                {/* Featured Image - Premium Presentation */}
                {article.featured_image && (
                    <div className="relative w-full aspect-video rounded-[3rem] overflow-hidden mb-16 shadow-2xl shadow-pink-500/10">
                        <Image
                            src={article.featured_image}
                            alt={article.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                )}

                {/* Rich Text Content from CKEditor */}
                <div 
                    className="blog-content prose prose-lg md:prose-xl max-w-none dark:prose-invert prose-p:leading-relaxed prose-headings:font-black prose-headings:tracking-tight prose-a:text-pink-600 dark:prose-a:text-pink-400 prose-img:rounded-3xl prose-img:shadow-xl"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                />

                {/* Premium Share / CTA Section */}
                <div className="mt-24 pt-12 border-t border-gray-100 dark:border-slate-800">
                    <div className="p-10 md:p-16 rounded-[3rem] bg-gray-900 text-white relative overflow-hidden group">
                        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[100%] rounded-full bg-violet-600/20 blur-[120px] group-hover:bg-pink-600/20 transition-colors duration-1000"></div>
                        
                        <div className="relative z-10 max-w-2xl">
                            <h2 className="text-3xl md:text-4xl font-black mb-6 leading-tight">
                                Ready to import like a pro?
                            </h2>
                            <p className="text-gray-400 text-lg mb-10 leading-relaxed">
                                Don&apos;t navigate the complex world of shipping alone. We handle the sourcing, consolidation, and customs clearing while you focus on selling.
                            </p>
                            
                            <div className="flex flex-wrap gap-4">
                                <a
                                    href="https://wa.me/233545247009"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-8 py-4 rounded-2xl bg-[#25D366] text-white font-bold flex items-center gap-3 hover:scale-105 transition-transform"
                                >
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                    WhatsApp Concierge
                                </a>
                                <Link
                                    href="/products"
                                    className="px-8 py-4 rounded-2xl bg-white text-gray-900 font-bold hover:bg-pink-500 hover:text-white transition-all transform hover:scale-105"
                                >
                                    Explore Products
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Back */}
                <div className="mt-16 text-center">
                    <Link
                        href="/blog"
                        className="text-gray-400 hover:text-pink-600 font-bold uppercase tracking-widest text-sm transition-colors"
                    >
                        ← Return to Publication
                    </Link>
                </div>
            </article>


            {/* Trending Imports - Search Authority Booster */}
            <div className="max-w-4xl mx-auto px-4 mt-16 border-t pt-12 relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Trending Imports</h2>
                    <Link href="/products" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                        View all deals →
                    </Link>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {featuredProducts.slice(0, 4).map((product: Product) => (
                        <ProductCard key={product.id} product={{ ...product, price: Number(product.price) }} />
                    ))}
                </div>
                <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h3 className="font-bold text-blue-900">Start your own mini importation business</h3>
                        <p className="text-sm text-blue-700 mt-1">Join 10,000+ Ghanaians buying directly from China with London's Imports.</p>
                    </div>
                    <Link href="/register" className="whitespace-nowrap bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200">
                        Join for Free
                    </Link>
                </div>
            </div>
        </article>
    );
}
