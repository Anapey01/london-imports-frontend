import HowItWorksBar from '@/components/HowItWorksBar';
import { getCategories, getRecentProducts, getProducts } from '@/lib/fetchers';
import ProductGrid from '@/components/ProductGrid';
import StatsBar from '@/components/StatsBar';
import { Metadata } from 'next';

// ISR: Revalidate this page every hour
export const revalidate = 3600;

type Props = {
    searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
    { searchParams }: Props
): Promise<Metadata> {
    const category = typeof searchParams.category === 'string' ? searchParams.category : undefined;

    // Default Metadata
    const defaultMeta = {
        title: 'Pre-order Products | London\'s Imports',
        description: 'Browse our latest pre-order collections. Authentic fashion and tech delivered to Ghana.',
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
    // Fetch initial data on server (SSG/ISR)
    const [categories, productsData] = await Promise.all([
        getCategories(),
        getRecentProducts(50)
    ]);

    const initialProducts = productsData?.results || [];

    // Extract filters from URL
    const search = typeof searchParams?.search === 'string' ? searchParams.search : undefined;
    const category = typeof searchParams?.category === 'string' ? searchParams.category : undefined;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Pre-order Products</h1>
                    <p className="text-gray-600">Browse upcoming products and reserve yours before stock arrives</p>
                </div>
            </div>

            {/* Trust Signal: How it Works */}
            <HowItWorksBar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Client Side Search/Filter Component which takes initial data */}
                <ProductGrid
                    initialProducts={initialProducts}
                    categories={categories}
                    initialSearch={search}
                    initialCategory={category}
                />
            </div>

            {/* Trust Badges & Stats */}
            <StatsBar />
        </div>
    );
}
