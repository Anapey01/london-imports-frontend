import { getProducts, getHeroBanners } from '@/lib/fetchers';
import HeroCarousel from '@/components/HeroCarousel';

export default async function HeroSection() {
    // 1. Prioritize Dynamic Marketing Banners (Admin-controlled)
    const banners = await getHeroBanners();
    
    // 2. Fallback to Recent Products if no banners exist
    let products = [];
    if (!banners || banners.length === 0) {
        const preorderData = await getProducts({
            limit: '15',
            ordering: '-created_at'
        });
        products = preorderData?.results || [];
    }

    return <HeroCarousel initialProducts={products} initialBanners={banners} />;
}
