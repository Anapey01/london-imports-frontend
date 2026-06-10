import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// ISR: Revalidate homepage every 24 hours
export const revalidate = 86400;

import HeroSection from '@/components/home/HeroSection';
import ProductGridSection from '@/components/home/ProductGridSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "London's Imports | Global Sourcing & Shipping Center",
  description: "London’s Imports sources and curates products from global manufacturing markets and delivers them to customers in Ghana. Trusted by 5,000+ business owners.",
  openGraph: {
    title: "London's Imports | Premium Global Sourcing & Shipping",
    description: "Secure, global sourcing and shipping service delivering directly to your door in Ghana. Pay with Momo, track your batch in real-time.",
    url: 'https://londonsimports.com',
    siteName: "London's Imports",
    images: [
      {
        url: 'https://londonsimports.com/og-home.jpg',
        width: 1200,
        height: 630,
        alt: "London's Imports - China to Ghana Shopping & Shipping Center",
      },
    ],
    locale: 'en_GH',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@londonsimports',
    creator: '@londonsimports',
  },
};

// Lazy load below-the-fold components to reduce initial bundle
const FeaturedSection = dynamic(() => import('@/components/home/FeaturedSection'), {
  loading: () => <div className="h-64 bg-gray-50 animate-pulse rounded-lg mx-4" />,
});
const TrustSection = dynamic(() => import('@/components/home/TrustSection'), {
  loading: () => <div className="h-[400px] bg-surface animate-pulse" />,
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
 * 4. Trust Signals (Dynamic proof, reviews, stats)
 * 5. Brand Manifesto (SEO & Authority Archive)
 * 6. SEO Accordion (Deep Keyword Crawl)
 */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-surface pb-20 transition-colors duration-500">
      {/* WhatsApp Floating Button - Homepage Only */}
      <WhatsAppButton />

      {/* 1. Hero Carousel (Landing visuals) */}
      <HeroSection />

      {/* 2. SALES FIRST: Immediate Product Feed (Amazon-style grid) - STREAMED with Skeleton */}
      <Suspense fallback={<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-4 h-96 bg-surface-card animate-pulse" />}>
        <ProductGridSection />
      </Suspense>

      {/* 3. Featured Horizontal Carousel (Urgency Protocol) */}
      <Suspense fallback={<div className="h-64 bg-surface-card animate-pulse rounded-lg mx-4" />}>
        <FeaturedSection />
      </Suspense>

      {/* 4. Trust Signals: Dynamic statistics, product reviews, and delivery photos */}
      <Suspense fallback={<div className="h-[400px] bg-surface animate-pulse" />}>
        <TrustSection />
      </Suspense>

      {/* 5. Our Approach: Brand & Shipping Info (SEO Footer Position) */}
      <HomeSEOHeader />

      {/* 6. Deep Keyword SEO Accordion (Crawler Data Archive) */}
      <SEOAccordion />
      
      {/* Search Engine Optimization: Structured Data */}
      <FaqSchema />
    </div>
  );
}

import { FaqSchema } from '@/components/seo/JsonLd';
