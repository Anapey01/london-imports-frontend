import { getProduct, getProductMetadata, getProducts } from '@/lib/fetchers';
import ProductDetailClient from './ProductDetailClient';
import { Metadata } from 'next';
import { getImageUrl } from '@/lib/image';

// ISR: Revalidate product pages every 24 hours (to stay within Vercel 1,000 writes/month limit)
export const revalidate = 86400;

// Pre-render top 50 products at build time (Performance Optimization)
// The rest will be generated on-demand (ISR) when first visited
export async function generateStaticParams() {
    const products = await getProducts({ limit: '50' });
    return products.results.map((product: { slug: string }) => ({
        slug: product.slug,
    }));
}

type Props = {
    params: Promise<{ slug: string }>
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
    { params }: Props
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
    
    // Format Price for SEO
    const formattedPrice = new Intl.NumberFormat('en-GH', {
        style: 'currency',
        currency: 'GHS',
        maximumFractionDigits: 0
    }).format(product.price);

    const productTitle = `Buy ${product.name} - ${formattedPrice} | London's Imports Ghana`;

    // Dynamic Description
    const isReadyToShip = product.preorder_status === 'READY_TO_SHIP';
    const descriptionPrefix = isReadyToShip ? 'Buy' : 'Pre-order';
    const productDescription = product.description?.substring(0, 140) || `${descriptionPrefix} ${product.name} from London's Imports. Authentic products delivered to Ghana. Pay with Momo.`;

    const pageUrl = `https://londonsimports.com/products/${slug}`;

    // High-Editorial Dynamic Social Card URL
    const dynamicOgImage = `https://londonsimports.com/api/og?title=${encodeURIComponent(product.name)}&price=${encodeURIComponent(formattedPrice)}&image=${encodeURIComponent(productImageUrl)}&type=${encodeURIComponent(isReadyToShip ? 'Available Now' : 'Pre-Order')}`;

    return {
        metadataBase: new URL('https://londonsimports.com'),
        title: productTitle,
        description: `${productDescription} | Best Price in Ghana: ${formattedPrice}`,

        openGraph: {
            title: productTitle,
            description: productDescription,
            url: pageUrl,
            siteName: "London's Imports Ghana",
            images: [
                {
                    url: dynamicOgImage,
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
            images: [dynamicOgImage],
            creator: '@londonsimports',
        },

        alternates: {
            canonical: pageUrl,
        },
        
        // Advanced e-commerce tags
        other: {
            'product:price:amount': product.price.toString(),
            'product:price:currency': 'GHS',
            'product:availability': product.preorder_status === 'READY_TO_SHIP' ? 'instock' : 'oos',
            'og:price:amount': product.price.toString(),
            'og:price:currency': 'GHS',
        }
    };
}

export default async function ProductDetailPage({ params }: Props) {
    const { slug } = await params;
    const product = await getProduct(slug);

    const jsonLd = product ? {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Product",
                "name": product.name,
                "image": product.image ? getAbsoluteImageUrl(product.image) : undefined,
                "description": product.description,
                "sku": product.id,
                "brand": {
                    "@type": "Brand",
                    "name": product.vendor?.business_name || "London's Imports"
                },
                "aggregateRating": (product.rating && product.rating_count) ? {
                    "@type": "AggregateRating",
                    "ratingValue": product.rating,
                    "reviewCount": product.rating_count
                } : undefined,
                "review": product.reviews?.map((review: { user_name: string; created_at: string; rating: number; comment: string }) => ({
                    "@type": "Review",
                    "author": {
                        "@type": "Person",
                        "name": review.user_name || "Anonymous"
                    },
                    "datePublished": review.created_at,
                    "reviewRating": {
                        "@type": "Rating",
                        "ratingValue": review.rating
                    },
                    "reviewBody": review.comment
                })),
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
                    "priceValidUntil": product.cutoff_datetime || new Date(new Date().getFullYear() + 1, 0, 1).toISOString(),
                    "availability": product.preorder_status === 'READY_TO_SHIP' ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
                    "url": `https://londonsimports.com/products/${slug}`,
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
                                "minValue": product.preorder_status === 'READY_TO_SHIP' ? 1 : 14,
                                "maxValue": product.preorder_status === 'READY_TO_SHIP' ? 2 : 28,
                                "unitCode": "DAY"
                            }
                        }
                    }
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
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": product.category?.name || "Products",
                        "item": `https://londonsimports.com/products/category/${product.category?.slug || ""}`
                    },
                    {
                        "@type": "ListItem",
                        "position": 4,
                        "name": product.name,
                        "item": `https://londonsimports.com/products/${slug}`
                    }
                ]
            }
        ]
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
