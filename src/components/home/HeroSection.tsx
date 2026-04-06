import { getProducts, getHeroBanners } from '@/lib/fetchers';
import HeroCarousel from '@/components/HeroCarousel';

export default async function HeroSection() {
    // 1. Fetch Banners and Fallback Products concurrently to reduce blocking TTFB
    const [banners, preorderData] = await Promise.all([
        getHeroBanners(),
        getProducts({ limit: '40', ordering: '-created_at' })
    ]);

    const products = (!banners || banners.length === 0) ? (preorderData?.results || []) : [];

    return <HeroCarousel initialProducts={products} initialBanners={banners} />;
}
