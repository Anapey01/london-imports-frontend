/**
 * London's Imports - Blog Article Page (Dynamic)
 * Individual article fetched from API with SEO metadata
 */
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

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
            next: { revalidate: 60 }
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
            next: { revalidate: 3600 }
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

// Simple markdown-like renderer
function renderContent(content: string) {
    const blocks = content.split('\n\n');

    return blocks.map((block, i) => {
        // Headers
        if (block.startsWith('## ')) {
            return (
                <h2 key={i} className="text-xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">
                    {block.replace('## ', '')}
                </h2>
            );
        }

        // Lists
        if (block.includes('\n- ') || block.startsWith('- ')) {
            const items = block.split('\n').filter(line => line.startsWith('- '));
            return (
                <ul key={i} className="list-disc pl-6 mb-4 text-gray-600 dark:text-slate-300 space-y-1">
                    {items.map((item, j) => (
                        <li key={j}>{item.replace('- ', '')}</li>
                    ))}
                </ul>
            );
        }

        // Numbered lists
        if (block.match(/^\d\./)) {
            const items = block.split('\n').filter(line => line.match(/^\d\./));
            return (
                <ol key={i} className="list-decimal pl-6 mb-4 text-gray-600 dark:text-slate-300 space-y-1">
                    {items.map((item, j) => (
                        <li key={j}>{item.replace(/^\d\.\s*/, '')}</li>
                    ))}
                </ol>
            );
        }

        // Tables (simple)
        if (block.includes('|')) {
            const rows = block.split('\n').filter(row => row.includes('|'));
            return (
                <div key={i} className="overflow-x-auto mb-4">
                    <table className="min-w-full text-sm text-gray-600 dark:text-slate-300">
                        <tbody>
                            {rows.filter(row => !row.includes('---')).map((row, j) => (
                                <tr key={j} className={j === 0 ? 'font-semibold bg-gray-100 dark:bg-slate-800' : ''}>
                                    {row.split('|').filter(cell => cell.trim()).map((cell, k) => (
                                        <td key={k} className="px-3 py-2 border border-gray-200 dark:border-slate-700">
                                            {cell.trim()}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        }

        // Default paragraph
        return (
            <p key={i} className="mb-4 text-gray-600 dark:text-slate-300 leading-relaxed">
                {block}
            </p>
        );
    });
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

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
            {/* Header */}
            <div className="border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800/50">
                <div className="max-w-3xl mx-auto px-4 py-8">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-1 text-sm mb-4 text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Blog
                    </Link>

                    {/* Featured Image */}
                    {article.featured_image && (
                        <div className="relative w-full h-48 sm:h-64 rounded-xl overflow-hidden mb-6">
                            <Image
                                src={article.featured_image}
                                alt={article.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}

                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-300">
                            {article.category_display}
                        </span>
                        <span className="text-sm text-gray-400 dark:text-slate-500">
                            {new Date(article.published_at).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                            })} · {article.read_time_minutes} min read
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                        {article.title}
                    </h1>
                    {article.author_name && (
                        <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
                            By {article.author_name}
                        </p>
                    )}
                </div>
            </div>

            {/* Content */}
            <article className="max-w-3xl mx-auto px-4 py-8">
                <div className="prose prose-lg max-w-none dark:prose-invert">
                    {renderContent(article.content)}
                </div>

                {/* CTA */}
                <div className="mt-12 p-6 rounded-2xl bg-gradient-to-br from-pink-100 to-violet-100 dark:from-pink-900/50 dark:to-violet-900/50">
                    <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                        Need Help Importing?
                    </h3>
                    <p className="mb-4 text-gray-600 dark:text-slate-300">
                        London&apos;s Imports handles everything - from sourcing to doorstep delivery.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <a
                            href="https://wa.me/233545247009"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-white bg-green-500 hover:bg-green-600 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            WhatsApp Us
                        </a>
                        <Link
                            href="/products"
                            className="inline-block px-4 py-2 rounded-xl font-medium text-white bg-gradient-to-r from-pink-500 to-rose-500"
                        >
                            Browse Products
                        </Link>
                    </div>
                </div>

                {/* Related */}
                <div className="mt-12">
                    <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
                        Continue Reading
                    </h3>
                    <Link href="/blog" className="text-pink-500 hover:text-pink-600 font-medium">
                        View all articles →
                    </Link>
                </div>
            </article>
        </div>
    );
}
