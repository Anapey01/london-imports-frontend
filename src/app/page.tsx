import { Suspense } from 'react';
import dynamic from 'next/dynamic';

import HeroSection from '@/components/home/HeroSection';
import TrustStrip from '@/components/home/TrustStrip';
import CategoryFeatureCards from '@/components/home/CategoryFeatureCards';
import ProductCarouselShelf from '@/components/home/ProductCarouselShelf';
import { HeroSkeleton } from '@/components/skeletons/HomeSkeletons';
import { getProducts } from '@/lib/fetchers';

// Lazy load below-the-fold components to reduce initial bundle
const WhatsAppButton = dynamic(() => import('@/components/WhatsAppButton'));
const SEOAccordion = dynamic(() => import('@/components/home/SEOAccordion'));

export default async function HomePage() {
  // Fetch data for grids and carousels from local database categories
  const [
    fashionRes, bagsRes, electronicsRes, accessoriesRes,
    beautyRes, shoesRes, readyRes, featuredRes,
    trendingRes, newArrivalsRes
  ] = await Promise.all([
    getProducts({ category: 'fashion', limit: '4' }).catch(() => ({ results: [] })),
    getProducts({ category: 'bags', limit: '4' }).catch(() => ({ results: [] })),
    getProducts({ category: 'electronics', limit: '4' }).catch(() => ({ results: [] })),
    getProducts({ category: 'accessories', limit: '4' }).catch(() => ({ results: [] })),
    getProducts({ category: 'beauty', limit: '4' }).catch(() => ({ results: [] })),
    getProducts({ category: 'shoes', limit: '4' }).catch(() => ({ results: [] })),
    getProducts({ status: 'READY_TO_SHIP', limit: '4' }).catch(() => ({ results: [] })),
    getProducts({ featured: 'true', limit: '12' }).catch(() => ({ results: [] })),
    getProducts({ ordering: '-reservations_count', limit: '12' }).catch(() => ({ results: [] })),
    getProducts({ ordering: '-created_at', limit: '12' }).catch(() => ({ results: [] }))
  ]);

  const group1Cards = [
    {
      title: "Shop Fashion for less",
      products: fashionRes?.results || [],
      linkText: "See all fashion",
      linkHref: "/products/category/fashion"
    },
    {
      title: "Explore Bags collection",
      products: bagsRes?.results || [],
      linkText: "See all bags",
      linkHref: "/products/category/bags"
    },
    {
      title: "Top Electronics picks",
      products: electronicsRes?.results || [],
      linkText: "See all electronics",
      linkHref: "/products/category/electronics"
    },
    {
      title: "Accessories & Trends",
      products: accessoriesRes?.results || [],
      linkText: "See all accessories",
      linkHref: "/products/category/accessories"
    }
  ];

  const group2Cards = [
    {
      title: "Level up your beauty routine",
      products: beautyRes?.results || [],
      linkText: "See all beauty",
      linkHref: "/products/category/beauty"
    },
    {
      title: "Step into Shoes",
      products: shoesRes?.results || [],
      linkText: "See all shoes",
      linkHref: "/products/category/shoes"
    },
    {
      title: "Accessories & Gadgets",
      products: accessoriesRes?.results || [],
      linkText: "Discover more",
      linkHref: "/products/category/accessories"
    },
    {
      title: "Available stock ready to ship",
      products: readyRes?.results || [],
      linkText: "Shop available items",
      linkHref: "/products?status=READY_TO_SHIP"
    }
  ];

  const featured = featuredRes?.results || [];
  const trending = trendingRes?.results || [];
  const newArrivals = newArrivalsRes?.results || [];

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

      {/* 8. SEO Content - Mini-Importation & Consolidation Keywords */}
      <SEOAccordion />
    </div>
  );
}


