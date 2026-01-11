import { getFeaturedProducts } from '@/lib/fetchers';
import PreorderCarousel from '@/components/PreorderCarousel';

export default async function FeaturedSection() {
    const featuredData = await getFeaturedProducts();
    const products = featuredData?.results || [];

    return <PreorderCarousel products={products} />;
}
