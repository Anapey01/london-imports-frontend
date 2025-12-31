/**
 * London's Imports - Homepage
 * Refactored to "Preorder Feed" style as requested
 */
'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { productsAPI } from '@/lib/api';

import HeroCarousel from '@/components/HeroCarousel';
import HeroOverlayProducts from '@/components/HeroOverlayProducts';
import PreorderCarousel from '@/components/PreorderCarousel';
import ProductGrid from '@/components/ProductGrid';

export default function HomePage() {
  // Fetch FEATURED products for the "Upcoming Drops" horizontal slide
  // These are admin-set items (is_featured=true)
  const { data: featuredData, isLoading: featuredLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => productsAPI.list({ limit: 10, featured: 'true', ordering: '-created_at' }),
  });

  const featuredProducts = featuredData?.data?.results || featuredData?.data || [];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 1. Hero Carousel (Landing visuals) */}
      <HeroCarousel />

      {/* 2. Products Overlay & Main Feed (20 items, Amazon-style grid) */}
      <HeroOverlayProducts />

      {/* 3. "Upcoming Drops" - Admin Curated Horizontal Carousel */}
      <section className="py-4 bg-white mt-4 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
            </svg>
            <h2 className="text-xl font-bold text-gray-900">Upcoming Drops</h2>
            <span className="bg-purple-100 text-purple-600 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Featured</span>
          </div>
          <Link href="/products?featured=true" className="text-sm font-medium text-pink-600 hover:text-pink-700">
            View All
          </Link>
        </div>

        <PreorderCarousel products={featuredProducts} />
      </section>
    </div>
  );
}
