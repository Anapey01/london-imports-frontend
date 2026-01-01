import { getCategories, getRecentProducts } from '@/lib/fetchers';
import ProductGrid from '@/components/ProductGrid';
import StatsBar from '@/components/StatsBar';

import { Metadata, ResolvingMetadata } from 'next';
import { getProducts } from '@/lib/fetchers';

type Props = {
    searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
    { searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const category = typeof searchParams.category === 'string' ? searchParams.category : undefined;

    // Default Metadata
    const defaultMeta = {
        title: 'Pre-order Products | London\'s Imports',
        description: 'Browse our latest pre-order deals from China. Authentic products, guaranteed delivery.',
    };

    if (!category) return defaultMeta;

    // Fetch category specific products for imagery
    // Uses the existing API to get products for this category
    const productsData = await getProducts({ category, limit: '1' });
    const firstProduct = productsData?.results?.[0];

    // Capitalize category for title
    const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);

    return {
        title: `${categoryTitle} Deals | London's Imports`,
        description: `Explore the best ${categoryTitle} pre-orders. ${firstProduct ? `Featuring ${firstProduct.name} and more.` : ''}`,
        openGraph: {
            title: `${categoryTitle} Collection - Pre-order Now`,
            description: `Get the best prices on imported ${categoryTitle}. Click to browse the full collection.`,
            images: firstProduct?.image ? [firstProduct.image] : [],
        },
    };
}

export default async function ProductsPage() {
    // Fetch initial data on server (SSG/ISR)
    const [categories, productsData] = await Promise.all([
        getCategories(),
        getRecentProducts(50)
    ]);

    const initialProducts = productsData?.results || [];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Pre-order Products</h1>
                    <p className="text-gray-600">Browse upcoming products and reserve yours before stock arrives</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Client Side Search/Filter Component which takes initial data */}
                <ProductGrid
                    initialProducts={initialProducts}
                    categories={categories}
                />
            </div>

            {/* Trust Badges & Stats */}
            <StatsBar />
        </div>
    );
}
