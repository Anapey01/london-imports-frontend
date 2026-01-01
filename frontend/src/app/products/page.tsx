import { getCategories, getRecentProducts } from '@/lib/fetchers';
import ProductGrid from '@/components/ProductGrid';
import StatsBar from '@/components/StatsBar';

export const metadata = {
    title: 'Pre-order Products | London\'s Imports',
    description: 'Browse our latest pre-order deals from China. Authentic products, guaranteed delivery.',
};

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
