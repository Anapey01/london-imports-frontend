import Link from 'next/link';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

import HeroSection from '@/components/home/HeroSection';
import ProductGridSection from '@/components/home/ProductGridSection';
import { HeroSkeleton, ProductGridSkeleton } from '@/components/skeletons/HomeSkeletons';

// Lazy load below-the-fold components to reduce initial bundle
const FeaturedSection = dynamic(() => import('@/components/home/FeaturedSection'), {
  loading: () => <div className="h-64 bg-gray-50 animate-pulse rounded-lg mx-4" />,
});
const WhatsAppButton = dynamic(() => import('@/components/WhatsAppButton'));

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* WhatsApp Floating Button - Homepage Only */}
      <WhatsAppButton />

      {/* 1. Hero Carousel (Landing visuals) - Suspense for Immediate Shell Paint */}
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSection />
      </Suspense>

      {/* 2. Products Overlay & Main Feed (20 items, Amazon-style grid) */}
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductGridSection />
      </Suspense>

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

        <Suspense fallback={<div className="h-64 bg-gray-50 animate-pulse rounded-lg mx-4" />}>
          <FeaturedSection />
        </Suspense>
      </section>

      {/* 4. SEO Content - Mini-Importation & Consolidation Keywords */}
      <section className="py-12 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6 text-center sm:text-left">
              Import Goods from China to <span className="text-pink-600">Ghana</span> - Fast Shipping & Customs Clearance
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm sm:text-base text-gray-600 leading-relaxed">
              <div>
                <p className="mb-4">
                  Looking for reliable <strong>shipping from China to Ghana</strong>? London&apos;s Imports simplifies the process.
                  Whether you want to <strong>buy from 1688 to Ghana</strong>, Alibaba, or Taobao, we act as your trusted bridge.
                </p>
                <p>
                  We specialize in <strong>China to Ghana consolidation</strong>, allowing you to combine multiple packages into one shipment
                  to save on <strong>air freight rates</strong>. No need to worry about complex logistics or customs.
                </p>
              </div>
              <div>
                <p className="mb-4">
                  Our <strong>door to door shipping in Ghana</strong> ensures your goods arrive safely at your doorstep in Accra or Tema.
                  We handle all <strong>Ghana Customs duty</strong> and clearance processes for electronics, fashion, and general goods.
                </p>
                <p>
                  Pay securely in Cedis via <strong>Momo</strong>. Join thousands of sophisticated shoppers and business owners using
                  London&apos;s Imports for stress-free importation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

