/**
 * London's Imports - Homepage
 * Amazon-style design with animated carousel and category cards
 */
'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { productsAPI } from '@/lib/api';

import HeroCarousel from '@/components/HeroCarousel';
import CategoryCards from '@/components/CategoryCards';
import PreorderCarousel from '@/components/PreorderCarousel';
import Reviews from '@/components/Reviews';
import RecentOrdersFeed from '@/components/RecentOrdersFeed';
import WhatsAppButton from '@/components/WhatsAppButton';

export default function HomePage() {
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['upcoming-drops'],
    queryFn: () => productsAPI.list({ limit: 20 }),
  });

  const products = productsData?.data?.results || productsData?.data || [];

  return (
    <div className="min-h-screen bg-gray-200">
      {/* Hero Carousel - Large with product images */}
      <HeroCarousel />

      {/* Category Cards - Sitting BELOW hero (not overlapping) */}
      <CategoryCards />

      {/* Featured Products / Upcoming Drops */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                Upcoming Drops
              </h2>
              <p className="text-gray-500">Pre-order before they sell out</p>
            </div>
            <Link href="/products" className="mt-2 md:mt-0 text-pink-500 hover:text-pink-600 font-semibold flex items-center gap-1">
              View all
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-64 rounded-xl skeleton"></div>
              ))}
            </div>
          ) : (
            <PreorderCarousel products={products} />
          )}
        </div>
      </section>

      {/* Reviews */}
      <Reviews />

      {/* Recent Orders Feed */}
      <RecentOrdersFeed />

      {/* CTA Banner */}
      <section className="py-12 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to start?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Join hundreds of Ghanaians who trust London&apos;s Imports for their international pre-orders.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-pink-600 font-semibold rounded-full hover:bg-gray-100 transition-all"
            >
              Create free account
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-all"
            >
              Browse products
            </Link>
          </div>
        </div>
      </section>

      {/* WhatsApp Button */}
      <WhatsAppButton />
    </div>
  );
}
