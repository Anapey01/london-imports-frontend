/**
 * London's Imports - Homepage
 * Clean, professional design with muted color palette
 */
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { productsAPI } from '@/lib/api';
import ProductCard from '@/components/ProductCard';

import Reviews from '@/components/Reviews';
import RecentOrdersFeed from '@/components/RecentOrdersFeed';
import WhatsAppButton from '@/components/WhatsAppButton';
import PreorderCarousel from '@/components/PreorderCarousel';

export default function HomePage() {
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['upcoming-drops'],
    queryFn: () => productsAPI.list({ limit: 20 }), // Fetch all active products for the carousel
  });

  const products = productsData?.data?.results || productsData?.data || [];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Faint Pink */}
      <section className="relative min-h-[80vh] flex items-center bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-left">
              <p className="text-pink-400 font-medium mb-4 tracking-wide uppercase text-sm">
                Ghana&apos;s Pre-order Platform
              </p>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 mb-8 leading-[1.1]">
                Reserve it.
                <br />
                <span className="text-pink-500">Before it lands.</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 mb-10 leading-relaxed max-w-xl">
                Pre-order products from international suppliers.
                We handle everything. You just wait and receive.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center px-8 py-4 bg-pink-400 text-white font-semibold rounded-full hover:bg-pink-500 transition-all text-lg"
                >
                  Browse Pre-orders
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/how-it-works"
                  className="inline-flex items-center justify-center px-8 py-4 border border-slate-300 text-slate-700 font-semibold rounded-full hover:border-pink-400 hover:text-pink-500 transition-all text-lg bg-white/50"
                >
                  How it works
                </Link>
              </div>
            </div>

            {/* Hero Image */}
            <div className="hidden lg:flex justify-center animate-slide-right">
              <Image
                src="/hero-preorder.png"
                alt="Pre-order on your phone"
                width={600}
                height={400}
                className="rounded-2xl shadow-2xl animate-float"
                priority
              />
            </div>
          </div>
        </div>
      </section>





      {/* Featured Products / Upcoming Drops */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">
                Upcoming drops
              </h2>
              <p className="text-xl text-slate-500">Pre-order before they sell out.</p>
            </div>
            <Link href="/products" className="mt-4 md:mt-0 text-pink-400 hover:text-pink-500 font-semibold text-lg flex items-center gap-2">
              View all products
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-96 rounded-3xl skeleton"></div>
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
      <section className="py-20 bg-slate-800 text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to start?
          </h2>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Join hundreds of Ghanaians who trust London&apos;s Imports for their international pre-orders.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-8 py-4 bg-pink-400 text-white font-semibold rounded-full hover:bg-pink-500 transition-all text-lg"
            >
              Create free account
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-8 py-4 border border-slate-600 text-white font-semibold rounded-full hover:border-slate-400 transition-all text-lg"
            >
              Browse products
            </Link>
          </div>
        </div>
      </section>

      {/* WhatsApp Button - Only on Home Page */}
      <WhatsAppButton />
    </div>
  );
}
