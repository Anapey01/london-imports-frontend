import Link from 'next/link';
import { getAvailableProducts } from '@/lib/fetchers';
import PreorderCarousel from '@/components/PreorderCarousel';

export default async function FeaturedSection() {
    const featuredData = await getAvailableProducts();
    const products = featuredData?.results || [];

    if (products.length === 0) {
        return null;
    }

    return (
        <section className="py-4 bg-white mt-4 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <h2 className="text-xl font-bold text-gray-900">Available Items</h2>
                    <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">In Stock</span>
                </div>
                <Link href="/products?status=READY_TO_SHIP" className="text-sm font-medium text-pink-600 hover:text-pink-700">
                    View All
                </Link>
            </div>
            <PreorderCarousel products={products} />
        </section>
    );
}
