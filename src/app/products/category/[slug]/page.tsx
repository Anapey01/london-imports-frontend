import { Suspense } from 'react';
import { getProducts, getCategories, getCategory } from '@/lib/fetchers';
import ProductGrid from '@/components/ProductGrid';
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Home, Package } from 'lucide-react';

// ISR: Revalidate category pages every 24 hours
export const revalidate = 86400;

export async function generateStaticParams() {
    const categories = await getCategories();
    return Array.isArray(categories) ? categories.map((cat: { slug: string }) => ({
        slug: cat.slug,
    })) : [];
}

type Props = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata(
    { params }: Props
): Promise<Metadata> {
    const { slug } = await params;
    const category = await getCategory(slug);

    if (!category) {
        return {
            title: 'Product Category | London\'s Imports',
            description: 'Browse our specialized product collections imported from China to Ghana.',
        };
    }

    const title = `${category.name} Imports Ghana | Quality Sourced from China | London's Imports`;
    const description = `Shop our curated ${category.name} collection. High-quality imports from China (1688, Alibaba) delivered to Accra, Kumasi, and Tema. Pay with Momo, door-to-door delivery.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: `https://londonsimports.com/products/category/${slug}`,
            siteName: "London's Imports",
            locale: 'en_GH',
            type: 'website',
        },
        alternates: {
            canonical: `https://londonsimports.com/products/category/${slug}`,
        }
    };
}

export default async function CategoryPage({ params }: Props) {
    const { slug } = await params;
    const [category, productsData] = await Promise.all([
        getCategory(slug),
        getProducts({ category: slug, limit: '100' })
    ]);

    if (!category) return null;

    const products = productsData.results || [];

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": `${category.name} Imports Ghana`,
        "description": `Premium ${category.name} products imported from China to Ghana.`,
        "url": `https://londonsimports.com/products/category/${slug}`,
        "breadcrumb": {
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
                    "name": category.name,
                    "item": `https://londonsimports.com/products/category/${slug}`
                }
            ]
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            
            {/* Header / Hero */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Breadcrumbs UI */}
                    <nav className="flex items-center text-sm text-gray-500 mb-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
                        <Link href="/" className="hover:text-pink-500 transition-colors flex items-center gap-1">
                            <Home className="w-3 h-3" /> Home
                        </Link>
                        <ChevronRight className="w-4 h-4 mx-2" />
                        <Link href="/products" className="hover:text-pink-500 transition-colors">
                            Products
                        </Link>
                        <ChevronRight className="w-4 h-4 mx-2" />
                        <span className="text-gray-900 font-medium">{category.name}</span>
                    </nav>

                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 flex items-center gap-3">
                        <Package className="text-pink-500" />
                        {category.name} <span className="text-pink-400">Hub</span>
                    </h1>
                    <p className="text-lg text-slate-600 max-w-3xl">
                        Shop high-quality <span className="font-bold">{category.name}</span> products directly from suppliers in China. 
                        We handle all shipping, customs, and delivery to <span className="text-pink-500 font-semibold">Accra, Kumasi, and Tema</span>.
                    </p>
                </div>
            </div>

            {/* Product Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Available Collections</h2>
                        <p className="text-gray-500 font-medium">{products.length} products found in this category</p>
                    </div>
                </div>

                <Suspense fallback={<div className="h-96 animate-pulse bg-gray-100 rounded-2xl" />}>
                    <ProductGrid 
                        initialProducts={products} 
                        hideFilters={true} // Clean view for category hub
                    />
                </Suspense>
            </div>

            {/* Why Choose Us Bar */}
            <div className="bg-slate-900 py-12 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h3 className="text-2xl font-bold mb-4">Why source {category.name} with London's?</h3>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div>
                            <div className="text-pink-400 font-bold text-4xl mb-2">01</div>
                            <h4 className="font-semibold text-lg mb-2">Direct Supplier Links</h4>
                            <p className="text-gray-400 text-sm">We buy straight from the source in China at wholesale prices.</p>
                        </div>
                        <div>
                            <div className="text-pink-400 font-bold text-4xl mb-2">02</div>
                            <h4 className="font-semibold text-lg mb-2">Hassle-Free Shipping</h4>
                            <p className="text-gray-400 text-sm">No port drama. We handle customs and deliver to your doorstep.</p>
                        </div>
                        <div>
                            <div className="text-pink-400 font-bold text-4xl mb-2">03</div>
                            <h4 className="font-semibold text-lg mb-2">Pay in GHS</h4>
                            <p className="text-gray-400 text-sm">Pay with MTN or Vodafone Momo. No international card needed.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
