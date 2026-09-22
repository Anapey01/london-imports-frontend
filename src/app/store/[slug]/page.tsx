import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Metadata } from 'next';
import { getVendor, getAllVendors } from '@/lib/fetchers';
import { getImageUrl } from '@/lib/image';
import ProductGrid from '@/components/ProductGrid';
import {
    MapPin,
    ShieldCheck,
    CheckCircle2,
    Truck,
    Store,
    MessageCircle,
    Lock,
    Package,
    ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';

// ISR: Revalidate every 7 days (or on on-demand revalidation)
export const revalidate = 604800;

interface Props {
    params: Promise<{
        slug: string;
    }>;
}

// Generate static params for SSG optimization
export async function generateStaticParams() {
    try {
        const vendors = await getAllVendors();
        return Array.isArray(vendors)
            ? vendors.map((vendor: { slug: string }) => ({
                  slug: vendor.slug,
              }))
            : [];
    } catch (e) {
        console.error("[Build] Failed to generate static params for store:", e);
        return [];
    }
}

// Dynamic SEO Metadata for storefront
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const vendor = await getVendor(slug);

    if (!vendor) {
        return {
            title: "Store Not Found | London's Imports",
        };
    }

    const title = `${vendor.business_name} | Official Storefront | London's Imports`;
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
    const vendor = await getVendor(slug);

    if (!vendor) {
        notFound();
    }

    // Parse Store Config with clean defaults
    const config = vendor.store_config || {};
    const primaryColor = config.primary_color || '#0f172a';
    const bannerUrl = config.banner_url || null;
    const bannerText = config.banner_text || null;

    // Sanitize WhatsApp for direct wa.me link
    const cleanWhatsapp = vendor.whatsapp
        ? vendor.whatsapp.replace(/[^0-9]/g, '')
        : null;

    const fulfillmentRateNum = parseFloat(vendor.fulfillment_rate || '100');

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 store-theme-root">
            {/* Dynamic CSS Variables */}
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                    .store-theme-root {
                        --store-primary: ${primaryColor};
                    }
                `,
                }}
            />

            {/* Custom Banner Hero */}
            <div className="relative w-full h-56 md:h-80 bg-slate-950 overflow-hidden">
                {bannerUrl ? (
                    <Image
                        src={getImageUrl(bannerUrl)}
                        alt={`${vendor.business_name} Banner`}
                        fill
                        className="object-cover opacity-75"
                        priority
                    />
                ) : (
                    <div
                        className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
                        aria-hidden="true"
                    >
                        {/* Subtle theme ambient radial glow */}
                        <div
                            className="absolute inset-0 opacity-20"
                            style={{
                                background: `radial-gradient(circle at 30% 40%, var(--store-primary) 0%, transparent 70%)`,
                            }}
                        />
                    </div>
                )}

                {/* Subtle vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

                {/* Banner Content for Desktop */}
                <div className="absolute inset-0 flex flex-col justify-end pb-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full flex items-end gap-6">
                        {/* Store Logo Container */}
                        <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border-4 border-white dark:border-slate-900 shadow-xl bg-white dark:bg-slate-900 shrink-0">
                            {vendor.logo ? (
                                <Image
                                    src={getImageUrl(vendor.logo)}
                                    alt={vendor.business_name}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-3xl font-bold text-slate-400">
                                    {vendor.business_name.charAt(0)}
                                </div>
                            )}
                        </div>

                        {/* Store Identity Info on Desktop */}
                        <div className="hidden md:block mb-1 text-white">
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
                                    {vendor.business_name}
                                </h1>
                                {vendor.is_verified && (
                                    <div
                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 backdrop-blur-md"
                                        title="Identity & Business Verified"
                                    >
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                        <span>Verified Merchant</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-4 text-sm text-slate-300">
                                {(vendor.city || vendor.region) && (
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                        {vendor.city}
                                        {vendor.city && vendor.region ? ', ' : ''}
                                        {vendor.region}
                                    </span>
                                )}
                                {bannerText && (
                                    <span className="text-slate-400 italic">
                                        &ldquo;{bannerText}&rdquo;
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Store Profile Card */}
            <div className="md:hidden max-w-7xl mx-auto px-4 -mt-2">
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-4 pt-4">
                    <div className="flex items-center justify-between gap-2 mb-2">
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight truncate">
                            {vendor.business_name}
                        </h1>
                        {vendor.is_verified && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Verified</span>
                            </span>
                        )}
                    </div>

                    {(vendor.city || vendor.region) && (
                        <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 gap-1 mb-2">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>
                                {vendor.city}
                                {vendor.city && vendor.region ? ', ' : ''}
                                {vendor.region}
                            </span>
                        </div>
                    )}

                    {bannerText && (
                        <p className="text-xs text-slate-600 dark:text-slate-300 italic">
                            &ldquo;{bannerText}&rdquo;
                        </p>
                    )}
                </div>
            </div>

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 md:pt-10">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left Sidebar: Merchant Profile & Trust */}
                    <aside className="lg:col-span-1 space-y-6">
                        {/* About Merchant Card */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-5 md:p-6 space-y-5">
                            <div>
                                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
                                    About the Store
                                </h2>
                                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                    {vendor.description ||
                                        `Welcome to ${vendor.business_name}. Browse our verified catalog of curated items available through London's Imports.`}
                                </p>
                            </div>

                            <hr className="border-slate-100 dark:border-slate-800" />

                            {/* Trust Metrics */}
                            <div className="space-y-3.5">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                    Merchant Trust Index
                                </h3>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500 dark:text-slate-400 text-xs">
                                        Fulfillment Success
                                    </span>
                                    <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 text-xs">
                                        <ShieldCheck className="w-3.5 h-3.5" />
                                        {fulfillmentRateNum > 0
                                            ? `${fulfillmentRateNum.toFixed(0)}%`
                                            : '100%'}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500 dark:text-slate-400 text-xs">
                                        Reliability Level
                                    </span>
                                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                                        {vendor.reliability_display || 'Verified Seller'}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500 dark:text-slate-400 text-xs">
                                        Merchant Standing
                                    </span>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                        Active Merchant
                                    </span>
                                </div>
                            </div>

                            {/* WhatsApp Direct Inquiry Button (If provided) */}
                            {cleanWhatsapp && (
                                <div className="pt-2">
                                    <a
                                        href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
                                            `Hello ${vendor.business_name}, I am viewing your storefront on London's Imports and have an inquiry:`
                                        )}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-sm"
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                        <span>Message on WhatsApp</span>
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Escrow Guarantee Security Card */}
                        <div className="bg-slate-100/70 dark:bg-slate-900/60 rounded-2xl border border-slate-200/70 dark:border-slate-800 p-5 space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-1">
                                        Escrow Protection
                                    </h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                        Every order from this merchant is backed by London&apos;s Imports Escrow Guarantee. Funds are safely held until your delivery is inspected and confirmed.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Shipping & Handling Card */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-5 space-y-2">
                            <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                                <Truck className="w-4 h-4 text-slate-500" />
                                <h4 className="text-xs font-bold uppercase tracking-wider">
                                    Delivery Logistics
                                </h4>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                Orders are processed directly from this seller&apos;s certified inventory and delivered via London&apos;s Imports doorstep logistics.
                            </p>
                        </div>
                    </aside>

                    {/* Right Area: Catalog Grid */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Catalog Header */}
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800">
                            <div>
                                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                                    <Package className="w-5 h-5 text-slate-400" />
                                    Store Collection
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    Browse available products from this merchant
                                </p>
                            </div>

                            {/* Dynamic Store Theme Indicator */}
                            <div
                                className="h-1.5 w-16 rounded-full"
                                style={{ backgroundColor: 'var(--store-primary)' }}
                            />
                        </div>

                        {/* Product Grid Filtered by Vendor Slug */}
                        <Suspense
                            fallback={
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                                    {[...Array(6)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="h-80 rounded-2xl animate-pulse bg-slate-200 dark:bg-slate-800"
                                        />
                                    ))}
                                </div>
                            }
                        >
                            <ProductGrid
                                vendorSlug={slug}
                                initialFeatured={false}
                            />
                        </Suspense>
                    </div>
                </div>
            </main>
        </div>
    );
}
