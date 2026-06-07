import { getProducts, getHeroBanners } from '@/lib/fetchers';
import HeroCarousel from '@/components/HeroCarousel';

export default async function HeroSection() {
    // Fetch Banners first
    const banners = await getHeroBanners();

    let products: any[] = [];
    if (!banners || banners.length === 0) {
        const preorderData = await getProducts({ limit: '40', ordering: '-created_at' });
        const allProducts = preorderData?.results || [];
        // Shuffle on the server to prevent hydration mismatches
        products = [...allProducts].sort(() => 0.5 - Math.random()).slice(0, 7);
    }

    return <HeroCarousel initialProducts={products} initialBanners={banners} />;
}
