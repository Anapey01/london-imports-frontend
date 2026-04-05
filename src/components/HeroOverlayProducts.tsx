/**
 * HeroOverlayProducts.tsx
 * A grid of 4 product cards that overlaps the HeroCarousel.
 * Replaces the previous "CategoryCards" to match the user's "Add to Cart" sketch.
 */
import ProductCard from './ProductCard';
import Link from 'next/link';
import { Product } from '@/stores/cartStore';

interface HeroOverlayProductsProps {
    initialProducts?: Product[];
}

export default function HeroOverlayProducts({ initialProducts = [] }: HeroOverlayProductsProps) {
    const products: Product[] = initialProducts;

    return (
        <section className="relative z-20 px-2 lg:px-4 max-w-7xl mx-auto pb-12">
            {/* 0. Semantic Section Header - Visually Hidden H2 for WCAG 1.3.1 */}
            <h2 className="sr-only">Today&apos;s Top Import Deals from China factories</h2>
            {/* 
                Unified Grid:
                - Overlaps Hero (-mt)
                - 2 Cols Mobile, 4 Cols Desktop
                - Vertical Flow (no scroll)
            */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-6 mt-4 lg:-mt-32 mb-12">
                {products.map((product: Product, index: number) => (
                    <div key={product.id} className="h-full">
                        <ProductCard product={product} priority={index < 6} />
                    </div>
                ))}
            </div>

            {/* See More Button */}
            <div className="flex justify-center mt-8">
                <Link
                    href="/products"
                    className="bg-content-primary text-surface px-10 py-4 rounded-none text-[10px] font-black uppercase tracking-[0.3em] hover:bg-brand-emerald transition-all shadow-sm flex items-center gap-4 group"
                >
                    See More Deals
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </Link>
            </div>
        </section>
    );
}
