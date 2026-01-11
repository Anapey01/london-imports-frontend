import { getProduct, getProductMetadata, getProducts } from '@/lib/fetchers';
import ProductDetailClient from './ProductDetailClient';
import { Metadata, ResolvingMetadata } from 'next';
import { getImageUrl } from '@/lib/image';

// ISR: Revalidate product pages every hour
export const revalidate = 3600;

// Pre-render all products at build time
export async function generateStaticParams() {
    const products = await getProducts({ limit: '1000' });
    return products.results.map((product: any) => ({
        slug: product.slug,
    }));
}

type Props = {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// Helper to ensure absolute URL
function getAbsoluteImageUrl(imageUrl: string | null | undefined): string {
    if (!imageUrl) return 'https://londonsimports.com/og-image.jpg';

    const processedUrl = getImageUrl(imageUrl);

    // If already absolute, return as-is
    if (processedUrl.startsWith('https://')) return processedUrl;
    if (processedUrl.startsWith('http://')) return processedUrl.replace('http://', 'https://');

    // If relative, make absolute
    if (processedUrl.startsWith('/')) {
        return `https://londonsimports.com${processedUrl}`;
    }

    return `https://londonsimports.com/${processedUrl}`;
}


export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    // 1. Resolve Params (Next.js 15 requirement)
    const { slug } = await params;

    // 2. Fetch Product Data
    let product = null;
    try {
        product = await getProductMetadata(slug);
    } catch (e) {
        console.error('Metadata fetch failed:', e);
    }

    // 3. Fallback if product not found or API fails
    if (!product) {
        return {
            title: 'View Product | London\'s Imports',
            description: 'Check out this product on London\'s Imports.',
            robots: { index: false, follow: true },
        };
    }

    // 4. Construct Metadata
    const productImageUrl = getAbsoluteImageUrl(product.image);
    const productTitle = `${product.name} - London's Imports`;
    const productDescription = product.description?.substring(0, 160) || `Pre-order ${product.name} from London's Imports. Authentic products delivered to Ghana.`;
    const pageUrl = `https://londonsimports.com/products/${slug}`;

    return {
        metadataBase: new URL('https://londonsimports.com'),
        title: productTitle,
        description: productDescription,

        openGraph: {
            title: productTitle,
            description: productDescription,
            url: pageUrl,
            siteName: "London's Imports",
            images: [
                {
                    url: productImageUrl,
                    width: 1200,
                    height: 630,
                    alt: productTitle,
                },
            ],
            locale: 'en_GH',
            type: 'website',
        },

        twitter: {
            card: 'summary_large_image',
            title: productTitle,
            description: productDescription,
            images: [productImageUrl],
            creator: '@londonsimports',
        },

        alternates: {
            canonical: pageUrl,
        },
    };
}

export default async function ProductDetailPage({ params }: Props) {
    const { slug } = await params;
    const product = await getProduct(slug);

    // If product is null, we pass null to client component
    // The client component will attempt a CSR fetch (Hybrid Resilience)
    // This avoids blocking the user if SSR fails due to timeouts/network


    const jsonLd = product ? {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "image": product.image,
        "description": product.description,
        "sku": product.id,
        "subjectOf": (product.video || product.video_url) ? {
            "@type": "VideoObject",
            "name": product.name,
            "description": product.description,
            "thumbnailUrl": getAbsoluteImageUrl(product.image),
            "uploadDate": product.created_at,
            "contentUrl": product.video || undefined,
            "embedUrl": product.video_url || undefined
        } : undefined,
        "offers": {
            "@type": "Offer",
            "priceCurrency": "GHS",
            "price": product.price,
            "availability": "https://schema.org/PreOrder",
            "shippingDetails": {
                "@type": "OfferShippingDetails",
                "shippingDestination": {
                    "@type": "DefinedRegion",
                    "addressCountry": "GH",
                    "addressRegion": ["Accra", "Kumasi", "Tema"]
                },
                "deliveryTime": {
                    "@type": "ShippingDeliveryTime",
                    "handlingTime": {
                        "@type": "QuantitativeValue",
                        "minValue": 56,
                        "maxValue": 63,
                        "unitCode": "DAY"
                    }
                }
            }
        }
    } : null;

    return (
        <>
            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}
            <ProductDetailClient initialProduct={product} slug={slug} />
        </>
    );
}
