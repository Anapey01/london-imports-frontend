import { Suspense } from 'react';
import { getProducts, getCategories, getCategory } from '@/lib/fetchers';
import ProductGrid from '@/components/ProductGrid';
import { Metadata } from 'next';
import Link from 'next/link';
import { Package } from 'lucide-react';

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

    const title = `${category.name} | China to Ghana Shopping & Shipping | London's Imports`;
    const description = `Shop ${category.name} from China (1688, Alibaba) with easy shipping to Accra, Kumasi, and Tema. Pay with Momo, door-to-door delivery. Trusted by thousands in Ghana.`;

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
        "name": `${category.name} Collection | London's Imports`,
        "description": `Shop the curated ${category.name} collection at London's Imports. Premium products sourced from China delivered to Ghana.`,
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
            
            {/* Slim Editorial Header */}
            <div className="bg-white border-b border-slate-50 relative overflow-hidden">
                {/* Background Decorative Initial (Ultra-Faint) */}
                <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 text-[20vw] font-black text-slate-500/[0.03] select-none pointer-events-none uppercase">
                    {category.name.charAt(0)}
                </div>

                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 md:py-20 relative z-10">
                    {/* Minimalist Breadcrumbs */}
                    <nav className="flex items-center text-[9px] font-bold uppercase tracking-[0.3em] text-slate-300 mb-6 overflow-x-auto whitespace-nowrap no-scrollbar">
                        <Link href="/" className="hover:text-slate-900 transition-colors">
                            HOME
                        </Link>
                        <div className="w-1 h-1 rounded-full bg-slate-100 mx-3 shrink-0" />
                        <Link href="/products" className="hover:text-slate-900 transition-colors">
                            ALL PRODUCTS
                        </Link>
                        <div className="w-1 h-1 rounded-full bg-slate-100 mx-3 shrink-0" />
                        <span className="text-slate-900 font-black">{category.name}</span>
                    </nav>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-4">
                        <div className="space-y-3">
                            <h1 className="text-4xl md:text-6xl font-bold text-slate-950 tracking-tight leading-tight">
                                {category.name}
                                <div className="mt-1 text-xl md:text-2xl font-light text-slate-300 tracking-normal italic flex items-center gap-2">
                                    <div className="h-px w-6 bg-slate-100" /> Collection
                                </div>
                            </h1>
                        </div>
                        <div className="flex flex-col items-start md:items-end">
                            <span className="text-[9px] font-black text-slate-900 border-b border-pink-500/20 pb-0.5 uppercase tracking-widest mb-2">
                                EXCLUSIVE ACCESS
                            </span>
                            <p className="text-[13px] md:text-right text-slate-400 font-medium max-w-[240px] leading-relaxed">
                                Professional logistics and doorstep delivery across <span className="text-slate-900 font-semibold">Ghana</span>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Grid Section */}
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 md:py-16">
                {products.length > 0 ? (
                    <>
                        {/* Refined Stats Bar */}
                        <div className="flex items-center gap-3 mb-10 border-b border-slate-50 pb-4">
                            <div className="px-2.5 py-0.5 bg-slate-950 text-white text-[9px] font-black tracking-widest rounded-full">
                                {products.length} PRODUCTS
                            </div>
                            <div className="hidden sm:block h-px flex-1 bg-slate-100/50" />
                            <div className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em]">
                                UPDATED ARRIVALS
                            </div>
                        </div>

                        <Suspense fallback={<div className="h-96 animate-pulse bg-slate-50/50 rounded-[2.5rem]" />}>
                            <ProductGrid 
                                initialProducts={products} 
                                initialCategory={slug}
                                hideFilters={true} 
                            />
                        </Suspense>
                    </>
                ) : (
                    <div className="py-20 text-center bg-white rounded-[2.5rem] border border-slate-50 shadow-sm px-6 max-w-2xl mx-auto">
                         <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                            <Package className="w-6 h-6 text-slate-200" strokeWidth={1.5} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-950 mb-4 tracking-[0.2em] uppercase leading-tight">Arriving Soon</h2>
                        <p className="text-slate-400 mb-10 leading-relaxed text-[15px] font-light max-w-md mx-auto">
                            The <span className="font-semibold text-slate-900">{category.name}</span> collection is currently in transit from our mainland suppliers. New drops every week.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                            <Link 
                                href="/product-finder" 
                                className="bg-slate-950 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-200 text-[11px] tracking-widest uppercase"
                            >
                                Custom Request
                            </Link>
                            <Link 
                                href="/products" 
                                className="text-slate-300 px-8 py-4 rounded-xl font-bold hover:text-slate-950 transition-all active:scale-95 text-[10px] tracking-widest uppercase"
                            >
                                Browse All
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            {/* Why Choose Us Bar */}
            <div className="bg-slate-900 py-12 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h3 className="text-2xl font-bold mb-4">Why shop {category.name} with London&apos;s?</h3>
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
