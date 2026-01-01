
import { getProduct, getProductMetadata, getProducts } from '@/lib/fetchers';
import ProductDetailClient from './ProductDetailClient';
import { Metadata, ResolvingMetadata } from 'next';

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

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProductMetadata(slug);

    if (!product) {
        return {
            title: 'Private Product | London\'s Imports',
            description: 'Join London\'s Imports to view exclusive products and pre-order pricing.',
        };
    }

    const previousImages = (await parent).openGraph?.images || [];

    return {
        title: `${product.name} - Pre-order from China to Ghana | London's Imports`,
        description: product.description?.substring(0, 160) || `Pre-order ${product.name} from London's Imports. Authentic products delivered to Ghana.`,
        openGraph: {
            title: `Pre-order ${product.name}`,
            description: `Get ${product.name} delivered to you in Ghana. Reserve now.`,
            images: product.image ? [product.image, ...previousImages] : previousImages,
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
                        "minValue": 14,
                        "maxValue": 21,
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
