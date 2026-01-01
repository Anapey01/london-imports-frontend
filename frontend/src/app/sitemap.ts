import { MetadataRoute } from 'next';
import { getProducts } from '@/lib/fetchers';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://london-import-frontend.vercel.app'; // Replace with actual production domain if different

    // Fetch all products (limit to 1000 for now)
    const productsData = await getProducts({ limit: '1000' });
    const products = productsData.results || [];

    const productUrls = products.map((product: any) => ({
        url: `${baseUrl}/products/${product.slug}`,
        lastModified: new Date(product.updated_at || product.created_at || new Date()),
        changeFrequency: 'daily' as const,
        priority: 0.8,
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
        ...productUrls,
    ];
}
