import { getProducts } from '@/lib/fetchers';
import HeroCarousel from '@/components/HeroCarousel';

export default async function HeroSection() {
    // Fetch data specifically for the carousel
    const preorderData = await getProducts({
        status: 'preorder',
        limit: '20',
        ordering: '-created_at'
    });

    const products = preorderData?.results || [];

    return <HeroCarousel initialProducts={products} />;
}
