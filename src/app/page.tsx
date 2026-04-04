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
import HomeSEOHeader from '@/components/home/HomeSEOHeader';

/**
 * London's Imports - Home Entry Point
 * Layout Architecture:
 * 1. Hero Section (Visual Impact)
 * 2. Product Grid (SALES PRIORITY - #1 After Hero)
 * 3. Featured Drops (Urgency)
 * 4. Brand Manifesto (SEO & Authority Archive)
 * 5. SEO Accordion (Deep Keyword Crawl)
 */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-white pb-20">
      {/* WhatsApp Floating Button - Homepage Only */}
      <WhatsAppButton />

      {/* 1. Hero Carousel (Landing visuals) */}
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSection />
      </Suspense>

      {/* 2. SALES FIRST: Immediate Product Feed (Amazon-style grid) */}
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductGridSection />
      </Suspense>

      {/* 3. Featured Horizontal Carousel (Urgency Protocol) */}
      <Suspense fallback={<div className="h-64 bg-gray-50 animate-pulse rounded-lg mx-4" />}>
        <FeaturedSection />
      </Suspense>

      {/* 4. The London Protocol: Brand & Logistics Manifesto (SEO Footer Position) */}
      <HomeSEOHeader />

      {/* 5. Deep Keyword SEO Accordion (Crawler Data Archive) */}
      <SEOAccordion />
    </div>
  );
}
