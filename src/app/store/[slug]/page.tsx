import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Metadata } from 'next';
import Link from 'next/link';
import { getVendor, getAllVendors, getProducts } from '@/lib/fetchers';
import { getImageUrl } from '@/lib/image';
import ProductGrid from '@/components/ProductGrid';
import {
    MapPin,
    Package
} from 'lucide-react';

export const revalidate = 60; // Keep cache fresh during review

interface Props {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateStaticParams() {
    try {
        const vendors = await getAllVendors();
        return Array.isArray(vendors)
            ? vendors.map((vendor: { slug: string }) => ({
                  slug: vendor.slug,
              }))
            : [];
    } catch (e) {
        console.error('[Build] Failed to generate static params for store:', e);
        return [];
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const vendor = await getVendor(slug);

    if (!vendor) {
        return {
            title: "Store Not Found | London's Imports",
        };
    }

    const title = `${vendor.business_name} | Verified Boutique | London's Imports`;
    const description =
        vendor.description ||
        `Shop authentic curated products directly from ${vendor.business_name} on London's Imports. Verified merchant with escrow-protected ordering.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: vendor.logo ? [{ url: getImageUrl(vendor.logo) }] : [],
        },
    };
}

export default async function VendorStorePage({ params }: Props) {
    const { slug } = await params;
    const [vendor, productsData] = await Promise.all([
        getVendor(slug),
        getProducts({ vendor: slug, limit: '50', ordering: 'price' })
    ]);

    if (!vendor) {
        notFound();
    }

    const products = productsData?.results || [];
    const bannerText = vendor.store_config?.banner_text || null;

    return (
        <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 pb-24">
            {/* Slim Editorial Boutique Header (London's Imports Design Schema) */}
            <header className="bg-white dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 relative overflow-hidden">
                {/* Background Decorative Watermark Initial */}
                <div 
                    className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 text-[20vw] font-black text-slate-500/[0.03] dark:text-white/[0.02] select-none pointer-events-none uppercase"
                    aria-hidden="true"
                >
                    {vendor.business_name.charAt(0)}
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 relative z-10">
                    {/* Minimalist Breadcrumbs */}
                    <nav className="flex items-center text-[9px] font-bold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 mb-6 overflow-x-auto whitespace-nowrap no-scrollbar">
                        <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                            HOME
                        </Link>
                        <div className="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-700 mx-3 shrink-0" />
                        <Link href="/products" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                            MERCHANTS
                        </Link>
                        <div className="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-700 mx-3 shrink-0" />
                        <span className="text-slate-900 dark:text-white font-black truncate max-w-[200px]">
                            {vendor.business_name}
                        </span>
                    </nav>

                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                        {/* Left: Brand Identity & Typography */}
                        <div className="space-y-4 max-w-2xl">

                            <div className="flex items-start gap-4">
                                {vendor.logo && (
                                    <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shrink-0 shadow-xs">
                                        <Image
                                            src={getImageUrl(vendor.logo)}
                                            alt={vendor.business_name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                                <div>
                                    <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif font-black tracking-tight text-slate-950 dark:text-white leading-[1.05]">
                                        {vendor.business_name}
                                    </h1>
                                    <div className="mt-1 text-base md:text-xl font-light text-slate-400 dark:text-slate-500 tracking-normal italic flex items-center gap-2">
                                        <div className="h-px w-6 bg-slate-200 dark:bg-slate-700" />
                                        <span>Curated Merchant Collection</span>
                                    </div>
                                </div>
                            </div>

                            {/* Bio / Description */}
                            {vendor.description && (
                                <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 font-sans leading-relaxed pt-1">
                                    {vendor.description}
                                </p>
                            )}

                            {(vendor.city || vendor.region) && (
                                <div className="flex items-center text-xs font-semibold text-slate-500 dark:text-slate-400 gap-1.5 pt-0.5">
                                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                    <span>
                                        {vendor.city}
                                        {vendor.city && vendor.region ? ', ' : ''}
                                        {vendor.region}
                                    </span>
                                </div>
                            )}

                            {bannerText && (
                                <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                                    &ldquo;{bannerText}&rdquo;
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </header>


            {/* Product Collection Section */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
                {products.length > 0 ? (
                    <>
                        {/* Refined Stats Bar */}
                        <div className="flex items-center gap-3 mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
                            <div className="px-3 py-1 bg-slate-900 text-white dark:bg-white dark:text-slate-950 text-[10px] font-black tracking-widest uppercase rounded-full">
                                {products.length} {products.length === 1 ? 'PRODUCT' : 'PRODUCTS'}
                            </div>
                            <div className="hidden sm:block h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                                OFFICIAL MERCHANT CATALOG
                            </div>
                        </div>

                        <Suspense
                            fallback={
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                                    {[...Array(8)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="h-80 rounded-2xl animate-pulse bg-slate-200 dark:bg-slate-800"
                                        />
                                    ))}
                                </div>
                            }
                        >
                            <ProductGrid
                                initialProducts={products}
                                initialCount={productsData?.count}
                                initialHasNext={!!productsData?.next}
                                vendorSlug={slug}
                                initialOrdering="price"
                                hideFilters={true}
                            />
                        </Suspense>
                    </>
                ) : (
                    <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs px-6 max-w-2xl mx-auto">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Package className="w-7 h-7 text-slate-400" strokeWidth={1.5} />
                        </div>
                        <h2 className="text-xl font-bold font-serif text-slate-950 dark:text-white mb-3 tracking-tight">
                            Boutique Catalog In Preparation
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed text-sm max-w-md mx-auto">
                            <span className="font-semibold text-slate-900 dark:text-white">{vendor.business_name}</span> is currently curating their catalog inventory for London&apos;s Imports.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                            <Link
                                href="/products"
                                className="bg-slate-900 text-white dark:bg-white dark:text-slate-950 px-6 py-3 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all text-xs tracking-wider uppercase shadow-xs"
                            >
                                Browse All London&apos;s Imports
                            </Link>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
