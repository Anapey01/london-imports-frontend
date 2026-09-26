import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowRight, Store } from 'lucide-react';
import { getVendorMarketplaceProducts } from '@/lib/fetchers';
import ProductCard from '@/components/ProductCard';
import { ProductGridSkeleton } from '@/components/skeletons/HomeSkeletons';
import { Product } from '../../types';
import { Product as CartProduct } from '@/stores/cartStore';

// ISR: Revalidate marketplace page
export const revalidate = 604800; // 7 days

export const metadata = {
    title: 'Local Market | London\'s Imports',
    description: 'Shop ready-to-ship products from verified Ghana-based sellers. Fast local dispatch.',
};

async function MarketplaceGrid() {
    const data = await getVendorMarketplaceProducts(50);
    const products = data?.results || [];

    if (products.length === 0) {
        return (
            <div className="text-center py-20 px-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center mx-auto mb-4 text-slate-500">
                    <Store className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Local Market Empty</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
                    Ghana sellers are currently updating their inventory. Check back soon for ready-to-ship items!
                </p>
                <Link
                    href={process.env.NODE_ENV === 'production' ? 'https://londonsimports.com' : '/'}
                    className="inline-block px-5 py-2.5 bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-xs font-semibold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
                >
                    Back to Preorder Store
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {products.map((product: Product) => (
                <ProductCard
                    key={product.id}
                    product={{
                        ...product,
                        price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
                        image: product.image || null
                    } as CartProduct}
                />
            ))}
        </div>
    );
}

export default function MarketplacePage() {
    return (
        <div className="min-h-screen bg-surface dark:bg-slate-950 pt-24 pb-20 transition-colors">
            {/* Header */}
            <div className="border-b border-slate-200 dark:border-slate-800 mb-8 bg-slate-50/50 dark:bg-slate-900/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-slate-900 text-white dark:bg-white dark:text-slate-900 mb-3">
                        Ghana Stock Only
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">
                        Local Market
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
                        Ready-to-ship products from verified Ghana-based sellers. No international shipment wait, direct local dispatch to Accra, Kumasi, and Tema.
                    </p>
                </div>
            </div>

            {/* Cross-Promotion: Preorder Store Banner */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold text-xs shrink-0 tracking-wider">
                            CN
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                                Can’t find what you’re looking for locally?
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                Pre-order directly from verified China manufacturers at wholesale rates.
                            </p>
                        </div>
                    </div>
                    <Link
                        href="https://londonsimports.com"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shrink-0"
                    >
                        <span>Preorder from China</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>

            {/* Grid */}
            <Suspense fallback={<ProductGridSkeleton />}>
                <MarketplaceGrid />
            </Suspense>
        </div>
    );
}
