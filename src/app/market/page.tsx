import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { getVendorMarketplaceProducts } from '@/lib/fetchers';
import ProductCard from '@/components/ProductCard';
import { ProductGridSkeleton } from '@/components/skeletons/HomeSkeletons';
import { Product } from '../../types';
import { Product as CartProduct } from '@/stores/cartStore';
import { siteConfig } from '@/config/site';

// Short ISR revalidation for active vendor stock
export const revalidate = 60;

export const metadata = {
    title: 'Local Market | London\'s Imports',
    description: 'In-stock products from verified Ghanaian merchants with immediate dispatch.',
};

async function MarketplaceGrid() {
    const data = await getVendorMarketplaceProducts(50);
    // Strict filter: Only in-stock local items, ZERO pre-orders, ZERO out-of-stock
    const products = (data?.results || []).filter((product: any) => {
        const isPreorder = product.is_preorder || product.preorder_status === 'PREORDER';
        const isOutOfStock = product.status === 'OUT_OF_STOCK' || product.stock_quantity === 0;
        return !isPreorder && !isOutOfStock && product.preorder_status === 'READY_TO_SHIP';
    });

    if (products.length === 0) {
        return (
            <div className="text-center py-24 px-4 max-w-xl mx-auto">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-content-secondary mb-3">
                    [ Inventory In Rotation ]
                </p>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-content-primary mb-3">
                    All Local Stock Allocated
                </h2>
                <p className="text-xs text-content-secondary mb-8 leading-relaxed">
                    Verified Ghanaian vendors are replenishing their ready-to-ship inventory. You can preorder directly from China factory suppliers on our main storefront.
                </p>
                <Link
                    href={process.env.NODE_ENV === 'production' ? siteConfig.baseUrl : '/'}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-xs font-semibold rounded-full hover:opacity-90 transition-opacity"
                >
                    <span>Browse China Preorders</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
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
        <div className="min-h-screen bg-surface dark:bg-slate-950 pt-20 pb-20 transition-colors">
            {/* Editorial Header & Reciprocal Catalog Route */}
            <header className="border-b border-border-standard/80 pb-8 pt-8 mb-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-2 max-w-2xl">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-content-secondary block">
                                Marketplace &middot; Ghana In-Stock
                            </span>
                            <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-content-primary">
                                Local Market
                            </h1>
                            <p className="text-xs sm:text-sm text-content-secondary leading-relaxed pt-1">
                                Ready-to-ship products from verified independent Ghanaian merchants. Immediate dispatch within Accra, Kumasi, and Tema.
                            </p>
                        </div>

                        <div className="md:text-right shrink-0">
                            <Link
                                href={process.env.NODE_ENV === 'production' ? siteConfig.baseUrl : '/'}
                                className="group inline-flex items-center gap-2 text-xs font-medium text-content-secondary hover:text-content-primary transition-colors pb-1 border-b border-border-standard hover:border-content-primary"
                            >
                                <span>Can’t find what you need locally? Preorder from China</span>
                                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* In-Stock Grid */}
            <Suspense fallback={<ProductGridSkeleton />}>
                <MarketplaceGrid />
            </Suspense>
        </div>
    );
}
