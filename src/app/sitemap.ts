import { MetadataRoute } from 'next';
import { getProductPreviews, getCategories } from '@/lib/fetchers';
import { siteConfig } from '@/config/site';

// Cache sitemap for 24 hours to reduce Vercel CPU usage
export const revalidate = 604800;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://londonsimports.com';

    // Fetch all products and categories
    let products: any[] = [];
    let categories: any[] = [];
    try {
        const [productsData, categoriesData] = await Promise.all([
            getProductPreviews({ limit: '1000' }, 604800),
            getCategories(604800)
        ]);
        products = productsData.results || [];
        categories = Array.isArray(categoriesData) ? categoriesData : [];
    } catch (e) {
        console.warn("[Build] Failed to fetch products or categories for sitemap:", e);
    }

    const categoryUrls = categories.map((cat: { slug: string }) => ({
        url: `${baseUrl}/products/category/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    interface ProductSitemap {
        slug: string;
        updated_at?: string;
        created_at?: string;
    }

    const productUrls = products.map((product: ProductSitemap) => ({
        url: `${baseUrl}/products/${product.slug}`,
        lastModified: new Date(product.updated_at || product.created_at || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    // Fetch blog posts from API (dynamic)
    let blogPosts: { slug: string; published_at?: string }[] = [];
    try {
        const apiUrl = siteConfig.apiUrl.replace(/\/api\/v1$/, '');
        const blogRes = await fetch(`${apiUrl}/api/v1/blog/`, {
            next: { revalidate: 604800 } // Revalidate every 7 days
        });
        if (blogRes.ok) {
            const data = await blogRes.json();
            blogPosts = Array.isArray(data) ? data : (data.results || []);
        }
    } catch {
        // Fallback to static slugs if API fails
    }

    // Fallback static blog slugs if API returns empty
    const fallbackBlogSlugs = [
        'how-to-buy-from-1688-in-ghana',
        'mini-importation-beginners-guide',
        'customs-duty-calculator-ghana',
    ];

    const blogSlugs = blogPosts.length > 0
        ? blogPosts.map(p => ({ slug: p.slug, date: p.published_at }))
        : fallbackBlogSlugs.map(slug => ({ slug, date: undefined }));

    const blogUrls = blogSlugs.map(({ slug, date }) => ({
        url: `${baseUrl}/blog/${slug}`,
        lastModified: date ? new Date(date) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    // Fetch vendor store slugs for sitemap
    let vendorSlugs: { slug: string }[] = [];
    try {
        const apiUrl = siteConfig.apiUrl.replace(/\/api\/v1$/, '');
        const vendorRes = await fetch(`${apiUrl}/api/v1/vendors/`, {
            next: { revalidate: 604800 }
        });
        if (vendorRes.ok) {
            const data = await vendorRes.json();
            vendorSlugs = Array.isArray(data) ? data : (data.results || []);
        }
    } catch {
        // Vendor stores will be discovered via internal links
    }

    const vendorUrls = vendorSlugs.map((vendor) => ({
        url: `${baseUrl}/store/${vendor.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    return [
        // ── Tier 1: Core commercial pages (highest priority) ──
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/products`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/market`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },

        // ── Tier 2: High-value discovery & trust pages ──
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/reviews`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/delivery-feed`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/sell`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/checker`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.85,
        },
        {
            url: `${baseUrl}/product-finder`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },

        // ── Tier 3: Informational & service pages ──
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/how-it-works`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/guide`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/faq`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/pricing`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/shipping`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/customs`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/customs-estimator`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/track`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/delivery-returns`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/links`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },

        // ── Tier 4: Legal & policy pages ──
        {
            url: `${baseUrl}/terms`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.4,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.4,
        },
        {
            url: `${baseUrl}/shipping-policy`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.4,
        },
        {
            url: `${baseUrl}/refunds`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.4,
        },
        {
            url: `${baseUrl}/prohibited-items`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },

        // ── Dynamic URLs ──
        ...blogUrls,
        ...productUrls,
        ...categoryUrls,
        ...vendorUrls,
    ];
}
