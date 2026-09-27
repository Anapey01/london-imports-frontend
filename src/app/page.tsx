import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Metadata } from 'next';

// ISR: Revalidate homepage every 24 hours to preserve Vercel Free Tier Data Cache limits
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

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { siteConfig } from '@/config/site';
import HeroSection from '@/components/home/HeroSection';
import TrustStrip from '@/components/home/TrustStrip';
import CategoryFeatureCards from '@/components/home/CategoryFeatureCards';
import ProductCarouselShelf from '@/components/home/ProductCarouselShelf';
import { HeroSkeleton } from '@/components/skeletons/HomeSkeletons';
import { getProducts, getActiveCollections } from '@/lib/fetchers';


// Lazy load below-the-fold components to reduce initial bundle
const SEOAccordion = dynamic(() => import('@/components/home/SEOAccordion'));
const TrustSection = dynamic(() => import('@/components/home/TrustSection'), {
  loading: () => <div className="h-[400px] bg-surface animate-pulse" />,
});
import HomeSEOHeader from '@/components/home/HomeSEOHeader';
import { FaqSchema } from '@/components/seo/JsonLd';

export default async function HomePage() {
  // Fetch data for grids and carousels from local database categories
  const [
    fashionRes, bagsRes, lifestyleRes, kitchenRes,
    beautyRes, shoesRes, readyRes, featuredRes,
    trendingRes, newArrivalsRes, perfumesRes,
    activeCollections
  ] = await Promise.all([
    getProducts({ category: 'womens-fashion', limit: '15' }).catch(() => ({ results: [] })),
    getProducts({ category: 'womens-bags-handbags', limit: '15' }).catch(() => ({ results: [] })),
    getProducts({ category: 'home-living', limit: '15' }).catch(() => ({ results: [] })),
    getProducts({ category: 'kitchen', limit: '15' }).catch(() => ({ results: [] })),
    getProducts({ category: 'beauty-personal-care', limit: '15' }).catch(() => ({ results: [] })),
    getProducts({ category: 'womens-heels', limit: '15' }).catch(() => ({ results: [] })),
    getProducts({ is_vendor: 'false', status: 'READY_TO_SHIP', limit: '10' }).catch(() => ({ results: [] })),
    getProducts({ featured: 'true', limit: '24' }).catch(() => ({ results: [] })),
    getProducts({ ordering: '-reservations_count', limit: '24' }).catch(() => ({ results: [] })),
    getProducts({ ordering: '-created_at', limit: '24' }).catch(() => ({ results: [] })),
    getProducts({ category: 'fragrances', limit: '15' }).catch(() => ({ results: [] })),
    getActiveCollections().catch(() => [])
  ]);

  // Strict Global Deduplication Registry across the entire homepage
  const seenProductIds = new Set<string>();

  const isSeen = (item: any) => {
    if (!item) return true;
    if (item.id && seenProductIds.has(String(item.id))) return true;
    if (item.slug && seenProductIds.has(String(item.slug))) return true;
    return false;
  };

  const markSeen = (item: any) => {
    if (!item) return;
    if (item.id) seenProductIds.add(String(item.id));
    if (item.slug) seenProductIds.add(String(item.slug));
  };

  // Helper to extract strictly unique items for a section without fallback contamination
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getUniqueProducts = (items: any[], limit: number) => {
    const unique = [];
    for (const item of items || []) {
      if (item.slug === 'sesa-oil' || item.name?.toLowerCase().includes('sesa')) {
        continue;
      }
      if (!isSeen(item)) {
        markSeen(item);
        unique.push(item);
        if (unique.length === limit) break;
      }
    }
    return unique;
  };

  // 1. Process Seasonal / Curated Collections (Christmas Gift Sets, Holiday Footwear & Bags, etc.)
  // We register seasonal products first so these hand-picked collections show their curated items
  const seasonalCollections = (activeCollections || []).map((collection: any) => {
    const uniqueItems: any[] = [];
    for (const p of collection.products || []) {
      if (!isSeen(p) && p.slug !== 'sesa-oil' && !p.name?.toLowerCase().includes('sesa')) {
        markSeen(p);
        uniqueItems.push(p);
      }
    }
    return {
      ...collection,
      products: uniqueItems
    };
  }).filter((c: any) => c.products.length > 0);

  // 2. Category Feature Cards (Group 1: Fashion, Bags, Home, Kitchen)
  const group1Cards = [
    {
      title: "Shop Fashion for less",
      products: getUniqueProducts(fashionRes?.results, 4),
      linkText: "See all fashion",
      linkHref: "/products?category=womens-fashion"
    },
    {
      title: "Explore Bags collection",
      products: getUniqueProducts(bagsRes?.results, 4),
      linkText: "See all bags",
      linkHref: "/products?category=womens-bags-handbags"
    },
    {
      title: "Home & Lifestyle",
      products: getUniqueProducts(lifestyleRes?.results, 4),
      linkText: "See all home & lifestyle",
      linkHref: "/products?category=home-living"
    },
    {
      title: "Kitchen & Dining",
      products: getUniqueProducts(kitchenRes?.results, 4),
      linkText: "See all kitchen",
      linkHref: "/products?category=kitchen"
    }
  ];

  // 3. Category Feature Cards (Group 2: Beauty, Shoes, Perfumes, Instant Availability)
  const group2Cards = [
    {
      title: "Level up your beauty",
      products: getUniqueProducts(beautyRes?.results, 4),
      linkText: "See all beauty",
      linkHref: "/products?category=beauty-personal-care"
    },
    {
      title: "Heels & Shoes",
      products: getUniqueProducts(shoesRes?.results, 4),
      linkText: "See all heels & shoes",
      linkHref: "/products?category=womens-heels"
    },
    {
      title: "Arabian Perfumes",
      products: getUniqueProducts(perfumesRes?.results, 4),
      linkText: "See all perfumes",
      linkHref: "/products?category=fragrances"
    },
    {
      title: "Instant Availability",
      products: getUniqueProducts(
        (readyRes?.results || []).filter((p: any) => {
          // Strictly admin items set via api.londonsimports.com (no vendor products)
          if (p.vendor && !p.is_staff && !p.vendor_is_staff) return false;
          const isPreorder = p.is_preorder || p.preorder_status === 'PREORDER';
          const isOutOfStock = p.status === 'OUT_OF_STOCK' || p.stock_quantity === 0;
          return !isPreorder && !isOutOfStock && p.preorder_status === 'READY_TO_SHIP';
        }),
        4
      ),
      linkText: "Shop ready stock",
      linkHref: "/products?status=READY_TO_SHIP"
    }
  ];

  // 4. Horizontal Carousels: Curated Picks, Trending Now, New Arrivals
  const featured = getUniqueProducts(featuredRes?.results, 12);
  const trending = getUniqueProducts(trendingRes?.results, 12);
  const newArrivals = getUniqueProducts(newArrivalsRes?.results, 12);

  return (
    <div className="min-h-screen bg-surface dark:bg-slate-950 pb-20 transition-colors">

      {/* 1. Hero Carousel (Landing visuals) - Suspense for Immediate Shell Paint */}
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSection />
      </Suspense>

      {/* 2. Visual Trust Strip */}
      <TrustStrip />

      {/* 3. Category Feature Cards (Group 1 - Overlaps Hero Carousel on Desktop) */}
      <CategoryFeatureCards cards={group1Cards} overlap={true} />

      {/* Editorial Notice: Local Market Cross-Link */}
      <div className="max-w-[1800px] mx-auto px-4 md:px-12 my-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 px-6 border border-border-standard rounded-2xl bg-surface-card transition-colors">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <p className="text-xs font-medium text-content-primary">
              Looking for items available in Ghana now? <span className="text-content-secondary">Shop ready-to-ship stock from verified local merchants with same-day dispatch.</span>
            </p>
          </div>
          <Link
            href={process.env.NODE_ENV === 'production' ? siteConfig.marketUrl : '/market'}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-content-primary hover:text-brand-emerald transition-colors shrink-0"
          >
            <span>Explore Local Market</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Active Seasonal / Curated Collections (Rendered only when active collections exist) */}
      {seasonalCollections && seasonalCollections.length > 0 && seasonalCollections.map((collection: any) => (
        <ProductCarouselShelf
          key={collection.id}
          title={collection.name}
          products={collection.products}
        />
      ))}

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


