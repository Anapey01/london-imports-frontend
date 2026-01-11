import { getRecentProducts } from '@/lib/fetchers';
import HeroOverlayProducts from '@/components/HeroOverlayProducts';

export default async function ProductGridSection() {
    // Fetch data specifically for the main grid
    const recentData = await getRecentProducts(20);
    const products = recentData?.results || [];

    return <HeroOverlayProducts initialProducts={products} />;
}
