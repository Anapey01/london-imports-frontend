import { getProducts, getHeroBanners } from '@/lib/fetchers';
import HeroCarousel from '@/components/HeroCarousel';
import { getImageUrl, cloudinaryLoader } from '@/lib/image';

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

    const firstImage = banners?.[0]?.image || products?.[0]?.image;
    const preloadUrl = firstImage ? cloudinaryLoader({ src: getImageUrl(firstImage), width: 1200, quality: 80 }) : null;

    return (
        <>
            {preloadUrl && (
                <link rel="preload" as="image" href={preloadUrl} fetchPriority="high" />
            )}
            <HeroCarousel initialProducts={products} initialBanners={banners} />
        </>
    );
}
