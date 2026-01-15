import { Suspense } from 'react';
import Link from 'next/link';
import { getVendorMarketplaceProducts } from '@/lib/fetchers';
import ProductCard from '@/components/ProductCard';
import { ProductGridSkeleton } from '@/components/skeletons/HomeSkeletons';

export const metadata = {
    title: 'Marketplace | London\'s Imports',
    description: 'Shop ready-to-ship items from our trusted vendors.',
};

async function MarketplaceGrid() {
    const data = await getVendorMarketplaceProducts(50);
    const products = data?.results || [];

    if (products.length === 0) {
        return (
            <div className="text-center py-20 px-4">
                <div className="text-4xl mb-4">🏪</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Marketplace Empty</h2>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    Our vendors are currently restocking. Check back soon for ready-to-ship items!
                </p>
                <Link
                    href="/"
                    className="inline-block px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
                >
                    Back to Pre-orders
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}

export default function MarketplacePage() {
    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-20">
            {/* Header */}
            <div className="bg-white border-b mb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
                        Vendor Marketplace
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Discover unique, ready-to-ship items from our community of verified sellers.
                        No waiting, fast local delivery.
                    </p>
                </div>
            </div>

            {/* Grid */}
            <Suspense fallback={<ProductGridSkeleton />}>
                <MarketplaceGrid />
            </Suspense>
        </div>
    );
}
