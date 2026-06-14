import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Metadata } from 'next';

// ISR: Revalidate homepage every 24 hours
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "London's Imports | Global Sourcing & Shipping Center",
  description: "London’s Imports sources and curates products from global manufacturing markets and delivers them to customers in Ghana. Trusted by businesses across Ghana.",
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

import HeroSection from '@/components/home/HeroSection';
import TrustStrip from '@/components/home/TrustStrip';
import CategoryFeatureCards from '@/components/home/CategoryFeatureCards';
import ProductCarouselShelf from '@/components/home/ProductCarouselShelf';
import { HeroSkeleton } from '@/components/skeletons/HomeSkeletons';
import { getProducts } from '@/lib/fetchers';

// Lazy load below-the-fold components to reduce initial bundle
const WhatsAppButton = dynamic(() => import('@/components/WhatsAppButton'));
const SEOAccordion = dynamic(() => import('@/components/home/SEOAccordion'));
const TrustSection = dynamic(() => import('@/components/home/TrustSection'), {
  loading: () => <div className="h-[400px] bg-surface animate-pulse" />,
});
import HomeSEOHeader from '@/components/home/HomeSEOHeader';
import { FaqSchema } from '@/components/seo/JsonLd';

export default async function HomePage() {
  // Fetch data for grids and carousels from local database categories
  const [
    fashionRes, bagsRes, lifestyleRes, accessoriesRes,
    beautyRes, shoesRes, readyRes, featuredRes,
    trendingRes, newArrivalsRes, perfumesRes
  ] = await Promise.all([
    getProducts({ category: 'fashion', limit: '15' }).catch(() => ({ results: [] })),
    getProducts({ category: 'bags', limit: '15' }).catch(() => ({ results: [] })),
    getProducts({ category: 'home-lifestyle', limit: '15' }).catch(() => ({ results: [] })),
    getProducts({ category: 'accessories', limit: '15' }).catch(() => ({ results: [] })),
    getProducts({ category: 'beauty-personal-care', limit: '15' }).catch(() => ({ results: [] })),
    getProducts({ category: 'heels-and-shoes', limit: '15' }).catch(() => ({ results: [] })),
    getProducts({ status: 'READY_TO_SHIP', limit: '15' }).catch(() => ({ results: [] })),
    getProducts({ featured: 'true', limit: '24' }).catch(() => ({ results: [] })),
    getProducts({ ordering: '-reservations_count', limit: '24' }).catch(() => ({ results: [] })),
    getProducts({ ordering: '-created_at', limit: '24' }).catch(() => ({ results: [] })),
    getProducts({ category: 'perfumes', limit: '15' }).catch(() => ({ results: [] }))
  ]);

  const seenIds = new Set<string>();
  // Helper to deduplicate items globally and limit the final array
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dedupeAndLimit = (items: any[], limit: number) => {
    const unique = [];
    for (const item of items || []) {
      if (!seenIds.has(item.id)) {
        seenIds.add(item.id);
        unique.push(item);
        if (unique.length === limit) break;
      }
    }
    return unique;
  };

  const group1Cards = [
    {
      title: "Shop Fashion for less",
      products: dedupeAndLimit(fashionRes?.results, 4),
      linkText: "See all fashion",
      linkHref: "/products?category=fashion"
    },
    {
      title: "Explore Bags collection",
      products: dedupeAndLimit(bagsRes?.results, 4),
      linkText: "See all bags",
      linkHref: "/products?category=bags"
    },
    {
      title: "Home & Lifestyle",
      products: dedupeAndLimit(lifestyleRes?.results, 4),
      linkText: "See all home & lifestyle",
      linkHref: "/products?category=home-lifestyle"
    },
    {
      title: "Accessories & Trends",
      products: dedupeAndLimit(accessoriesRes?.results, 4),
      linkText: "See all accessories",
      linkHref: "/products?category=accessories"
    }
  ];

  const group2Cards = [
    {
      title: "Level up your beauty",
      products: dedupeAndLimit(beautyRes?.results, 4),
      linkText: "See all beauty",
      linkHref: "/products?category=beauty-personal-care"
    },
    {
      title: "Heels & Shoes",
      products: dedupeAndLimit(shoesRes?.results, 4),
      linkText: "See all heels & shoes",
      linkHref: "/products?category=heels-and-shoes"
    },
    {
      title: "Arabian Perfumes",
      products: dedupeAndLimit(perfumesRes?.results, 4),
      linkText: "See all perfumes",
      linkHref: "/products?category=perfumes"
    },
    {
      title: "Instant Availability",
      products: dedupeAndLimit(readyRes?.results, 4),
      linkText: "Shop ready stock",
      linkHref: "/products?status=READY_TO_SHIP"
    }
  ];

  const featured = dedupeAndLimit(featuredRes?.results, 12);
  const trending = dedupeAndLimit(trendingRes?.results, 12);
  const newArrivals = dedupeAndLimit(newArrivalsRes?.results, 12);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* WhatsApp Floating Button - Homepage Only */}
      <WhatsAppButton />

      {/* 1. Hero Carousel (Landing visuals) - Suspense for Immediate Shell Paint */}
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSection />
      </Suspense>

      {/* 2. Visual Trust Strip */}
      <TrustStrip />

      {/* 3. Category Feature Cards (Group 1 - Overlaps Hero Carousel on Desktop) */}
      <CategoryFeatureCards cards={group1Cards} overlap={true} />


      {/* 4. Curated Picks Horizontal Carousel */}
      <ProductCarouselShelf title="Curated Picks" products={featured} />

      {/* 5. Category Feature Cards (Group 2) */}
      <CategoryFeatureCards cards={group2Cards} overlap={false} />

      {/* 6. Trending Now Horizontal Carousel */}
      <ProductCarouselShelf title="Trending Now" products={trending} />

      {/* 7. New Arrivals Horizontal Carousel */}
      <ProductCarouselShelf title="New Arrivals" products={newArrivals} />

      {/* 8. Trust Signals: Dynamic statistics, product reviews, and delivery photos */}
      <Suspense fallback={<div className="h-[400px] bg-surface animate-pulse" />}>
        <TrustSection />
      </Suspense>

      {/* 9. Our Approach: Brand & Shipping Info (SEO Footer Position) */}
      <HomeSEOHeader />

      {/* 10. Deep Keyword SEO Accordion (Crawler Data Archive) */}
      <SEOAccordion />

      {/* Search Engine Optimization: Structured Data */}
      <FaqSchema />
    </div>
  );
}


