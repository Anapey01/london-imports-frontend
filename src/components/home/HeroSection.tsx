import { getProducts, getHeroBanners } from '@/lib/fetchers';
import HeroCarousel from '@/components/HeroCarousel';

export default async function HeroSection() {
    // Fetch Banners first
    const banners = await getHeroBanners();

    let products: any[] = [];
    if (!banners || banners.length === 0) {
        const preorderData = await getProducts({ limit: '40', ordering: '-created_at' });
        products = preorderData?.results || [];
    }

    return <HeroCarousel initialProducts={products} initialBanners={banners} />;
}
