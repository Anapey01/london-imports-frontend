import { Suspense } from 'react';
import HowItWorksBar from '@/components/HowItWorksBar';
import { getCategories, getProducts } from '@/lib/fetchers';
import ProductGrid from '@/components/ProductGrid';
import StatsBar from '@/components/StatsBar';
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
        <div className="min-h-screen bg-gray-50">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* Header - Editorial Style */}
            <div className="bg-white dark:bg-slate-950 border-b border-gray-100 dark:border-slate-900 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center animate-fade-in relative">
                    {/* Background Decorative Text */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-serif font-black text-slate-50 dark:text-slate-900/40 select-none pointer-events-none whitespace-nowrap opacity-50 italic">
                        {category || 'Collection'}
                    </div>

                    <div className="relative z-10">
                        <span className="inline-block px-4 py-1.5 mb-8 text-[11px] font-black tracking-[0.8em] uppercase text-slate-400 dark:text-slate-500 border-x border-slate-100 dark:border-slate-800">
                            {isAvailableItems
                                ? 'Instant Availability'
                                : featured
                                    ? 'Exclusive Drop'
                                    : 'London\'s Imports'}
                        </span>
                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-medium text-slate-950 dark:text-white mb-8 tracking-tighter leading-[0.85]">
                            {isAvailableItems
                                ? 'Ready to Ship'
                                : featured
                                    ? <>The <span className="italic font-light">Featured</span> Drop</>
                                    : category
                                        ? <>{categoryTitle} <span className="italic font-light opacity-40 px-2">&amp;</span> Arrivals</>
                                        : <>Pre-order <span className="italic font-light opacity-40 px-2">&amp;</span> Products</>}
                        </h1>
                        <p className="text-base md:text-xl text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed font-sans font-light">
                            {isAvailableItems
                                ? 'Selected items from the London inventory, authenticated and ready for dispatch in Ghana.'
                                : featured
                                    ? 'Ultra-limited collections meticulously sourced. Reserve yours before the window closes.'
                                    : 'A bespoke selection of global retail, brought to Ghana through the Protocol.'}
                        </p>
                    </div>
                </div>
            </div>

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
            <StatsBar />
        </div>
    );
}
