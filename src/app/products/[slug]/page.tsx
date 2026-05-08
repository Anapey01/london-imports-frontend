import { getProduct, getProductMetadata, getProducts } from '@/lib/fetchers';
import ProductDetailClient from './ProductDetailClient';
import { Metadata } from 'next';
import { getImageUrl } from '@/lib/image';
import { siteConfig } from '@/config/site';
import { notFound } from 'next/navigation';

// ISR: Revalidate product pages every 24 hours
export const revalidate = 86400;

// Pre-render top 50 products at build time
export async function generateStaticParams() {
    const products = await getProducts({ limit: '50' });
    return products.results.map((product: { slug: string }) => ({
        slug: product.slug,
    }));
}

type Props = {
    params: Promise<{ slug: string }>
}

// Helper to ensure absolute URL for SEO
function getAbsoluteImageUrl(imageUrl: string | null | undefined): string {
    if (!imageUrl) return `${siteConfig.baseUrl}/og-image.jpg`;
    const processedUrl = getImageUrl(imageUrl);
    if (processedUrl.startsWith('https://')) return processedUrl;
    if (processedUrl.startsWith('http://')) return processedUrl.replace('http://', 'https://');
    if (processedUrl.startsWith('/')) return `${siteConfig.baseUrl}${processedUrl}`;
    return `${siteConfig.baseUrl}/${processedUrl}`;
}

export async function generateMetadata(
    { params }: Props
): Promise<Metadata> {
    const { slug } = await params;
    let product = null;
    try {
        product = await getProductMetadata(slug);
    } catch (e) {
        console.error('Metadata fetch failed:', e);
    }

    if (!product) {
        return {
            title: 'View Product | London\'s Imports',
            description: 'Check out this product on London\'s Imports.',
            robots: { index: false, follow: true },
        };
    }

    const formattedPrice = new Intl.NumberFormat('en-GH', {
        style: 'currency',
        currency: 'GHS',
        maximumFractionDigits: 0
    }).format(product.price);

    const productTitle = `Buy ${product.name} - ${formattedPrice} | London's Imports Ghana`;
    
    // Architectural Description Refinement for Sourcing Authority
    const productDescription = product.description?.substring(0, 140) || `Buy ${product.name} from London's Imports. Ghana's #1 sourcing house for premium imports from China. Pay with Momo.`;
    const pageUrl = `${siteConfig.baseUrl}/products/${slug}`;

    return {
        metadataBase: new URL(siteConfig.baseUrl),
        title: productTitle,
        description: `${productDescription} | Sourcing from China to Accra & Kumasi: ${formattedPrice}`,
        openGraph: {
            title: productTitle,
            description: productDescription,
            url: pageUrl,
            siteName: "London's Imports Ghana",
            locale: 'en_GH',
            type: 'website',
            images: [
                {
                    url: getAbsoluteImageUrl(product.image),
                    width: 1200,
                    height: 630,
                    alt: product.name,
                }
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: productTitle,
            description: productDescription,
            creator: '@londonsimports',
            images: [getAbsoluteImageUrl(product.image)],
        },
        alternates: {
            canonical: pageUrl,
        },
        other: {
            'product:price:amount': product.price.toString(),
            'product:price:currency': 'GHS',
            'product:availability': product.preorder_status === 'READY_TO_SHIP' ? 'instock' : 'oos',
        }
    };
}

export default async function ProductDetailPage({ params }: Props) {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) notFound();

    // Consolidated Product & Breadcrumb Schema for Rich Results
    const productJsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Product',
                'name': product.name,
                'image': getAbsoluteImageUrl(product.image),
                'description': product.description,
                'sku': `LI-${product.id}`,
                'mpn': product.id?.toString() || `LI-${product.id}`,
                'brand': {
                    '@type': 'Brand',
                    'name': "London's Imports Ghana"
                },
                'offers': {
                    '@type': 'Offer',
                    'url': `${siteConfig.baseUrl}/products/${slug}`,
                    'priceCurrency': 'GHS',
                    'price': product.price,
                    'itemCondition': 'https://schema.org/NewCondition',
                    'availability': product.stock_quantity > 0 
                        ? 'https://schema.org/InStock' 
                        : 'https://schema.org/OutOfStock',
                    'seller': {
                        '@id': `${siteConfig.baseUrl}/#organization`
                    }
                },
                'aggregateRating': {
                    '@type': 'AggregateRating',
                    'ratingValue': product.rating || 5,
                    'reviewCount': product.rating_count || 1
                },
                'review': {
                    '@type': 'Review',
                    'author': { 
                        '@type': 'Person', 
                        'name': "Verified Ghanaian Importer" 
                    },
                    'publisher': {
                        '@type': 'Organization',
                        'name': "London's Imports"
                    },
                    'reviewRating': { 
                        '@type': 'Rating', 
                        'ratingValue': product.rating || 5,
                        'bestRating': '5'
                    },
                    'reviewBody': "High quality sourcing from China. Delivered safely to Accra."
                }
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": siteConfig.baseUrl
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "Products",
                        "item": `${siteConfig.baseUrl}/products`
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": product.category?.name || "Products",
                        "item": `${siteConfig.baseUrl}/products/category/${product.category?.slug || ""}`
                    },
                    {
                        "@type": "ListItem",
                        "position": 4,
                        "name": product.name,
                        "item": `${siteConfig.baseUrl}/products/${slug}`
                    }
                ]
            }
        ]
    };

    return (
        <>
            <script
                id="product-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
            />
            <ProductDetailClient initialProduct={product} slug={slug} />
        </>
    );
}
