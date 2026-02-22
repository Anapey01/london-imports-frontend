import { Suspense } from 'react';
import HowItWorksBar from '@/components/HowItWorksBar';
import { getCategories, getProducts } from '@/lib/fetchers';
import ProductGrid from '@/components/ProductGrid';
import StatsBar from '@/components/StatsBar';
import { Metadata } from 'next';

// ISR: Revalidate every 24 hours (to stay within Vercel 1,000 writes/month limit)
export const revalidate = 86400;

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
    { searchParams }: Props
): Promise<Metadata> {
    const resolvedSearchParams = await searchParams;
    const category = typeof resolvedSearchParams.category === 'string' ? resolvedSearchParams.category : undefined;
    const featured = resolvedSearchParams.featured === 'true';
    const status = typeof resolvedSearchParams.status === 'string' ? resolvedSearchParams.status : undefined;
    const isAvailableItems = status === 'READY_TO_SHIP';

    // Default Metadata
    const defaultMeta = {
        title: isAvailableItems
            ? 'Available Items | London\'s Imports'
            : featured
                ? 'Upcoming Drops | London\'s Imports'
                : 'Pre-order Products | London\'s Imports',
        description: isAvailableItems
            ? 'Shop items available for instant purchase. Fast delivery.'
            : featured
                ? 'Exclusive upcoming products dropping soon. Limited quantities available.'
                : 'Browse our latest pre-order collections. Authentic fashion and tech delivered to Ghana.',
    };

    if (!category) return defaultMeta;

    // Fetch category specific products for imagery
    const productsData = await getProducts({ category, limit: '1' });
    const firstProduct = productsData?.results?.[0];

    // Capitalize category for title
    const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);

    return {
        title: `${categoryTitle} Imports | London Pre-order Platform`,
        description: `Latest ${categoryTitle} arrivals from China. Pre-order now for the next shipment.`,
        openGraph: {
            title: `${categoryTitle} Imports - Pre-order Now`,
            description: `Latest ${categoryTitle} arrivals from China. Pre-order now for the next shipment.`,
            images: firstProduct?.image ? [firstProduct.image] : [],
        },
    };
}

export default async function ProductsPage({ searchParams }: Props) {
    const resolvedSearchParams = await searchParams;

    // Extract filters from URL
    const search = typeof resolvedSearchParams?.search === 'string' ? resolvedSearchParams.search : undefined;
    const category = typeof resolvedSearchParams?.category === 'string' ? resolvedSearchParams.category : undefined;
    const featured = resolvedSearchParams.featured === 'true';
    const status = typeof resolvedSearchParams?.status === 'string' ? resolvedSearchParams.status : undefined;
    const isAvailableItems = status === 'READY_TO_SHIP';

    // Fetch initial data on server (SSG/ISR) with filters applied
    const [categories, productsData] = await Promise.all([
        getCategories(),
        getProducts({
            category: category || '',
            status: status || '',
            featured: featured.toString(),
            limit: '50'
        })
    ]);

    const initialProducts = productsData?.results || [];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {isAvailableItems
                            ? 'Available Items'
                            : featured
                                ? 'Upcoming Drops'
                                : category
                                    ? `${category.charAt(0).toUpperCase() + category.slice(1)}`
                                    : 'Pre-order Products'}
                    </h1>
                    <p className="text-gray-600">
                        {isAvailableItems
                            ? 'Instant purchase available. Order now for quick delivery.'
                            : featured
                                ? 'Exclusive limited releases arriving soon. Reserve yours now.'
                                : 'Browse upcoming products and reserve yours before stock arrives'}
                    </p>
                </div>
            </div>

            {/* Trust Signal: How it Works */}
            <HowItWorksBar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Client Side Search/Filter Component which takes initial data */}
                <Suspense fallback={<div className="h-96 animate-pulse bg-gray-100 rounded-2xl" />}>
                    <ProductGrid
                        initialProducts={initialProducts}
                        categories={categories}
                        initialSearch={search}
                        initialCategory={category}
                        initialFeatured={featured}
                        initialStatus={status}
                    />
                </Suspense>
            </div>

            {/* Trust Badges & Stats */}
            <StatsBar />
        </div>
    );
}
