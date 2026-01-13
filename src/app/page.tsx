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
const SEOAccordion = dynamic(() => import('@/components/home/SEOAccordion'));

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
      {/* 3. "Upcoming Drops" - Admin Curated Horizontal Carousel */}
      <Suspense fallback={<div className="h-64 bg-gray-50 animate-pulse rounded-lg mx-4" />}>
        <FeaturedSection />
      </Suspense>

      {/* 4. SEO Content - Mini-Importation & Consolidation Keywords */}
      {/* 4. SEO Content - Mini-Importation & Consolidation Keywords */}
      <SEOAccordion />
    </div>
  );
}

