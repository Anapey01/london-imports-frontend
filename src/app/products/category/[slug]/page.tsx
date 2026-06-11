import { Suspense } from 'react';
import { getProducts, getCategories, getCategory } from '@/lib/fetchers';
import ProductGrid from '@/components/ProductGrid';
import { Metadata } from 'next';
import Link from 'next/link';
import { Package } from 'lucide-react';

// ISR: Revalidate category pages every 24 hours
export const revalidate = 604800; // 7 days

export async function generateStaticParams() {
    try {
        const categories = await getCategories();
        return Array.isArray(categories) ? categories.map((cat: { slug: string }) => ({
            slug: cat.slug,
        })) : [];
    } catch (e) {
        console.error("[Build] Failed to generate static params for categories:", e);
        return [];
    }
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

    const title = `${category.name} | Global Sourcing & Shipping | London's Imports`;
    const description = `Shop ${category.name} sourced from global manufacturing markets with reliable shipping to Accra, Kumasi, and Tema. Pay easily in GHS via Mobile Money.`;

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
            <section className="bg-slate-950 py-24 border-t border-slate-900 text-white overflow-hidden relative">
                {/* Subtle noise pattern overlay & gradient glows */}
                <div className="absolute inset-0 opacity-[0.015] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/p6.png')]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-emerald/10 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-pink-500/5 blur-[100px] rounded-full pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <span className="h-[1px] w-8 bg-brand-emerald/40" />
                        <span className="text-[9px] font-black tracking-[0.4em] uppercase text-brand-emerald">
                            Value Proposition
                        </span>
                        <span className="h-[1px] w-8 bg-brand-emerald/40" />
                    </div>
                    
                    <div 
                        role="heading" 
                        aria-level={3} 
                        className="text-3xl md:text-5xl font-bold font-sans tracking-tight text-white mb-20 leading-tight"
                    >
                        Why shop <span className="font-serif italic font-normal text-brand-emerald">{category.name}</span> with London&apos;s?
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 max-w-6xl mx-auto">
                        {/* Pillar 1 */}
                        <div className="flex flex-col items-center text-center p-8 rounded-[2rem] border border-white/[0.03] bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/[0.08] hover:shadow-2xl hover:shadow-emerald-950/10 hover:-translate-y-1 transition-all duration-500 group">
                            <div className="flex items-baseline gap-2 mb-6">
                                <span className="text-5xl font-serif font-light text-pink-500 transition-transform duration-500 group-hover:scale-110">01</span>
                                <span className="text-[9px] font-mono font-black tracking-widest text-slate-500 uppercase">/ sourcing</span>
                            </div>
                            <div 
                                role="heading" 
                                aria-level={4} 
                                className="text-lg font-bold text-white tracking-tight font-sans mb-3"
                            >
                                Direct Sourcing Links
                            </div>
                            <p className="text-slate-400 text-xs md:text-sm font-light leading-relaxed max-w-[240px]">
                                We source straight from global manufacturing hubs at wholesale rates.
                            </p>
                        </div>

                        {/* Pillar 2 */}
                        <div className="flex flex-col items-center text-center p-8 rounded-[2rem] border border-white/[0.03] bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/[0.08] hover:shadow-2xl hover:shadow-emerald-950/10 hover:-translate-y-1 transition-all duration-500 group">
                            <div className="flex items-baseline gap-2 mb-6">
                                <span className="text-5xl font-serif font-light text-pink-500 transition-transform duration-500 group-hover:scale-110">02</span>
                                <span className="text-[9px] font-mono font-black tracking-widest text-slate-500 uppercase">/ logistics</span>
                            </div>
                            <div 
                                role="heading" 
                                aria-level={4} 
                                className="text-lg font-bold text-white tracking-tight font-sans mb-3"
                            >
                                Hassle-Free Shipping
                            </div>
                            <p className="text-slate-400 text-xs md:text-sm font-light leading-relaxed max-w-[240px]">
                                No port drama. We handle customs and deliver straight to your doorstep.
                            </p>
                        </div>

                        {/* Pillar 3 */}
                        <div className="flex flex-col items-center text-center p-8 rounded-[2rem] border border-white/[0.03] bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/[0.08] hover:shadow-2xl hover:shadow-emerald-950/10 hover:-translate-y-1 transition-all duration-500 group">
                            <div className="flex items-baseline gap-2 mb-6">
                                <span className="text-5xl font-serif font-light text-pink-500 transition-transform duration-500 group-hover:scale-110">03</span>
                                <span className="text-[9px] font-mono font-black tracking-widest text-slate-500 uppercase">/ currency</span>
                            </div>
                            <div 
                                role="heading" 
                                aria-level={4} 
                                className="text-lg font-bold text-white tracking-tight font-sans mb-3"
                            >
                                Pay in GHS
                            </div>
                            <p className="text-slate-400 text-xs md:text-sm font-light leading-relaxed max-w-[240px]">
                                Pay with MTN or Vodafone Momo. No international credit card needed.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
