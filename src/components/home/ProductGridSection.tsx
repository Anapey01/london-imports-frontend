import { getRecentProducts } from '@/lib/fetchers';
import HeroOverlayProducts from '@/components/HeroOverlayProducts';

export default async function ProductGridSection() {
    // Fetch data specifically for the main grid
    const recentData = await getRecentProducts(20);
    const products = recentData?.results || [];
    
    // SERVER-SIDE LOG: Definitively confirming product arrival
    console.log(`[SSR] Home Product Grid: Found ${products.length} items`);

    return <HeroOverlayProducts initialProducts={products} />;
}
