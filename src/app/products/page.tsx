import { Suspense } from 'react';
import HowItWorksBar from '@/components/HowItWorksBar';
import { getCategories, getProducts } from '@/lib/fetchers';
import ProductGrid from '@/components/ProductGrid';
import ShopHeader from '@/components/ShopHeader';
import { Metadata } from 'next';

// ISR: Revalidate every 24 hours (to stay within Vercel 1,000 writes/month limit)
export const revalidate = 86400;

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
    { searchParams }: Props
): Promise<Metadata> {
    const resolvedSearchParams = await searchParams;
    const category = typeof resolvedSearchParams.category === 'string' ? resolvedSearchParams.category : undefined;
    const featured = resolvedSearchParams.featured === 'true';
    const status = typeof resolvedSearchParams.status === 'string' ? resolvedSearchParams.status : undefined;
    const search = typeof resolvedSearchParams.search === 'string' ? resolvedSearchParams.search : undefined;
    const isAvailableItems = status === 'READY_TO_SHIP';

    // Default Metadata
    const defaultMetaTitle = isAvailableItems
        ? 'Ready to Ship Items | Fast Delivery Ghana | London\'s Imports'
        : featured
            ? 'Upcoming Drops & Exclusive Collections | London\'s Imports'
            : 'Shop All Imports from China | Quality Pre-order Deals | London\'s Imports';

    const defaultMetaDescription = isAvailableItems
        ? 'Shop items available for instant purchase in Ghana. No waiting, fast delivery on authentic products.'
        : featured
            ? 'Exclusive upcoming products from China dropping soon. Reserve your favorites before stock runs out.'
            : 'Browse our complete catalog of authentic fashion, tech, and kitchen products. Trusted mini-importation to Ghana.';

    const defaultMeta = {
        title: search 
            ? `Buy ${search} from China to Ghana | Mini Importation Search Results | London's Imports`
            : defaultMetaTitle,
        description: search
            ? `Search results for ${search}. Quality products sourced directly from China and delivered to your doorstep in Ghana. Pay with Momo, fast shipping to Accra, Kumasi, and Tema.`
            : defaultMetaDescription,
    };

    if (!category && !search) return defaultMeta;

    // Fetch category specific products for imagery
    const productsData = category ? await getProducts({ category, limit: '1' }) : null;
    const firstProduct = productsData?.results?.[0];

    // Capitalize category for title
    const categoryTitle = category ? category.charAt(0).toUpperCase() + category.slice(1) : '';

    return {
        title: `${categoryTitle} Imports | London Pre-order Platform`,
        description: `Latest ${categoryTitle} arrivals from China. Pre-order now for the next shipment.`,
        openGraph: {
            title: `${categoryTitle} Imports - Pre-order Now`,
            description: `Latest ${categoryTitle} arrivals from China. Pre-order now for the next shipment.`,
            images: firstProduct?.image ? [firstProduct.image] : [],
        },
    };
}

export default async function ProductsPage({ searchParams }: Props) {
    const resolvedSearchParams = await searchParams;

    // Extract filters from URL
    const search = typeof resolvedSearchParams?.search === 'string' ? resolvedSearchParams.search : undefined;
    const category = typeof resolvedSearchParams?.category === 'string' ? resolvedSearchParams.category : undefined;
    const featured = resolvedSearchParams.featured === 'true';
    const status = typeof resolvedSearchParams?.status === 'string' ? resolvedSearchParams.status : undefined;
    const isAvailableItems = status === 'READY_TO_SHIP';

    // Fetch initial data on server (SSG/ISR) with filters applied
    const [categories, productsData] = await Promise.all([
        getCategories(),
        getProducts({
            category: category || '',
            status: status || '',
            featured: featured.toString(),
            limit: '50'
        })
    ]);

    const initialProducts = productsData?.results || [];

    const categoryTitle = category ? category.charAt(0).toUpperCase() + category.slice(1) : '';
    const pageDescription = isAvailableItems
        ? 'Shop items available for instant purchase in Ghana. No waiting, fast delivery on authentic products.'
        : featured
            ? 'Exclusive upcoming products from China dropping soon. Reserve your favorites before stock runs out.'
            : category
                ? `Latest ${categoryTitle} arrivals from China. Pre-order now for the next shipment.`
                : 'Browse our complete catalog of authentic fashion, tech, and kitchen products. Trusted mini-importation to Ghana.';

    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CollectionPage",
                "name": isAvailableItems
                    ? "Ready to Ship Items"
                    : featured
                        ? "Upcoming Drops"
                        : category
                            ? `${categoryTitle} Imports`
                            : "Pre-order Products",
                "description": pageDescription,
                "url": `https://londonsimports.com/products${category ? `?category=${category}` : ""}`,
                "mainEntity": {
                    "@type": "ItemList",
                    "numberOfItems": initialProducts.length,
                    "itemListElement": initialProducts.map((p: { slug: string }, i: number) => ({
                        "@type": "ListItem",
                        "position": i + 1,
                        "url": `https://londonsimports.com/products/${p.slug}`
                    }))
                }
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": "https://londonsimports.com"
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "Products",
                        "item": "https://londonsimports.com/products"
                    },
                    category ? {
                        "@type": "ListItem",
                        "position": 3,
                        "name": categoryTitle,
                        "item": `https://londonsimports.com/products/category/${category}`
                    } : undefined,
                    search ? {
                        "@type": "ListItem",
                        "position": category ? 4 : 3,
                        "name": `Search: ${search}`,
                        "item": `https://londonsimports.com/products?search=${search}`
                    } : undefined
                ].filter(Boolean)
            }
        ]
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ShopHeader 
                isAvailableItems={isAvailableItems}
                featured={featured}
                category={category}
                categoryTitle={categoryTitle}
                pageDescription={pageDescription}
            />

            {/* Trust Signal: How it Works */}
            <HowItWorksBar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Client Side Search/Filter Component which takes initial data */}
                <Suspense fallback={<div className="h-96 animate-pulse bg-gray-100 rounded-2xl" />}>
                    <ProductGrid
                        initialProducts={initialProducts}
                        categories={categories}
                        initialSearch={search}
                        initialCategory={category}
                        initialFeatured={featured}
                        initialStatus={status}
                    />
                </Suspense>
            </div>

            {/* Trust Badges & Stats */}
        </div>
    );
}
