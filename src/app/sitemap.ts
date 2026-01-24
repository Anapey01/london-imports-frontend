import { MetadataRoute } from 'next';
import { getProducts } from '@/lib/fetchers';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.londonsimports.com';

    // Fetch all products (limit to 1000 for now)
    const productsData = await getProducts({ limit: '1000' });
    const products = productsData.results || [];

    interface ProductSitemap {
        slug: string;
        updated_at?: string;
        created_at?: string;
    }

    const productUrls = products.map((product: ProductSitemap) => ({
        url: `${baseUrl}/products/${product.slug}`,
        lastModified: new Date(product.updated_at || product.created_at || new Date()),
        changeFrequency: 'daily' as const,
        priority: 0.8,
    }));

    // Blog articles for SEO
    const blogArticles = [
        'how-to-buy-from-1688-in-ghana',
        'mini-importation-beginners-guide',
        'customs-duty-calculator-ghana',
        'alibaba-vs-1688-which-is-better',
        'best-products-to-import-from-china-to-ghana',
        'shipping-time-china-to-ghana',
    ];

    const blogUrls = blogArticles.map((slug) => ({
        url: `${baseUrl}/blog/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    return [
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
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
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
            priority: 0.6,
        },
        {
            url: `${baseUrl}/delivery-returns`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        ...blogUrls,
        ...productUrls,
    ];
}
