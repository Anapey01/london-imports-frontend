import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getVendor, getAllVendors } from '@/lib/fetchers';
import ProductGrid from '@/components/ProductGrid';
import { MapPin, ShieldCheck, Truck } from 'lucide-react';

interface Props {
    params: Promise<{
        slug: string;
    }>;
}

// Generate static params for SSG optimization
export async function generateStaticParams() {
    const vendors = await getAllVendors();
    return vendors.map((vendor: { slug: string }) => ({
        slug: vendor.slug,
    }));
}

export default async function VendorStorePage({ params }: Props) {
    const { slug } = await params;
    const vendor = await getVendor(slug);

    if (!vendor) {
        notFound();
    }

    // Parse Store Config with defaults
    const config = vendor.store_config || {};
    const primaryColor = config.primary_color || '#ec4899'; // Default Pink-500
    const bannerUrl = config.banner_url || '/assets/default_banner.jpg'; // Fallback needed
    const showBanner = !!config.banner_url;

    return (
        <div className={`min-h-screen bg-gray-50 pb-20 store-theme-root`}>
            <style dangerouslySetInnerHTML={{
                __html: `
                .store-theme-root {
                    --store-primary: ${primaryColor};
                }
            `}} />
            {/* Custom Banner Hero */}
            <div className="relative w-full h-48 md:h-80 bg-gray-900 overflow-hidden">
                {showBanner ? (
                    <Image
                        src={bannerUrl}
                        alt={`${vendor.business_name} Banner`}
                        fill
                        className="object-cover opacity-80"
                        priority
                    />
                ) : (
                    <div className="absolute inset-0 bg-[image:linear-gradient(135deg,var(--store-primary)_0%,#0f172a_100%)]">
                        {/* Subtle Pattern Overlay */}
                        <div className="absolute inset-0 bg-[image:radial-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[length:24px_24px]"></div>
                    </div>
                )}

                {/* Overlay Content */}
                <div className="absolute inset-0 flex flex-col justify-end pb-8">
                    <div className="max-w-7xl mx-auto px-4 w-full flex items-end gap-6">
                        {/* Logo */}
                        <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-white shrink-0">
                            {vendor.logo ? (
                                <Image
                                    src={vendor.logo}
                                    alt={vendor.business_name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-3xl font-bold text-gray-400">
                                    {vendor.business_name.charAt(0)}
                                </div>
                            )}
                        </div>

                        {/* Text Info (White text on banner) */}
                        <div className="mb-2 text-white drop-shadow-md hidden md:block">
                            <h1 className="text-4xl font-bold tracking-tight mb-1 flex items-center gap-2">
                                {vendor.business_name}
                                {vendor.is_verified && <ShieldCheck className="w-6 h-6 text-blue-400" />}
                            </h1>
                            <p className="text-gray-200 text-lg opacity-90">{vendor.city}, {vendor.region}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Info Bar (Below Banner) */}
            <div className="bg-white border-b border-gray-100 shadow-sm md:hidden p-4 pt-16 -mt-12 relative z-10 rounded-t-3xl">
                <h1 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                    {vendor.business_name}
                    {vendor.is_verified && <ShieldCheck className="w-5 h-5 text-blue-500" />}
                </h1>
                <div className="flex items-center text-gray-500 text-sm gap-4 mb-4">
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {vendor.city}</span>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">

                {/* Horizontal Info Bar (Scrollable on Mobile) */}
                <div className="flex flex-nowrap overflow-x-auto pb-6 -mx-4 px-4 gap-4 md:grid md:grid-cols-3 md:gap-6 md:pb-0 md:overflow-visible md:mx-0 md:px-0 mb-8 md:mb-12 snap-x snap-mandatory hide-scrollbar scroll-pl-4">
                    {/* About Section */}
                    <div className="min-w-[85vw] md:min-w-0 flex-shrink-0 bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm md:col-span-2 relative overflow-hidden group hover:shadow-md transition-all duration-300 snap-start">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-[var(--store-primary)]" />

                        <div className="flex flex-col h-full justify-between">
                            <div>
                                <h3 className="font-bold text-gray-900 mb-2 md:mb-3 text-xl md:text-2xl flex items-center gap-2">
                                    About {vendor.business_name}
                                </h3>
                                <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-2xl line-clamp-3 md:line-clamp-none">
                                    {vendor.description || `Welcome to our store. We are committed to providing you with the best quality products and service. browse our exclusive collection.`}
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 md:gap-6 mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-50">
                                {/* Reliability Badge */}
                                <div className="flex items-center gap-2 md:gap-3">
                                    <div className="p-1.5 md:p-2 rounded-lg bg-gray-50 text-gray-400">
                                        <ShieldCheck className="w-4 h-4 md:w-5 md:h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] md:text-xs text-gray-500 font-semibold uppercase tracking-wider">Reliability</p>
                                        <p className="font-bold text-gray-900 flex items-center gap-1 text-sm md:text-base">
                                            {(!vendor.fulfillment_rate || Number(vendor.fulfillment_rate) === 0) ? (
                                                <span className="text-blue-600">New Seller</span>
                                            ) : (
                                                <>
                                                    {vendor.fulfillment_rate}%
                                                    <span className="text-green-500 text-xs font-normal hidden sm:inline">Highly Rated</span>
                                                </>
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="w-px h-6 md:h-8 bg-gray-100" />

                                {/* Status Badge */}
                                <div className="flex items-center gap-2 md:gap-3">
                                    <div className="p-1.5 md:p-2 rounded-lg bg-green-50 text-green-600">
                                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500 animate-pulse" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] md:text-xs text-gray-500 font-semibold uppercase tracking-wider">Status</p>
                                        <p className="font-bold text-gray-900 text-sm md:text-base">Active Store</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Shipping & Policy (Compact) */}
                    {config.allow_returns !== false && (
                        <div className="min-w-[85vw] md:min-w-0 flex-shrink-0 rounded-2xl p-6 md:p-8 border border-gray-100 relative overflow-hidden flex flex-col justify-center bg-gray-50/50 group hover:bg-[var(--store-primary-faint)] transition-colors duration-500 snap-start"
                        /* Note: Removed inline style for pattern to use class based approach where possible or keep minimal */
                        >
                            {/* Subtle Pattern Overlay */}
                            <div className="absolute inset-0 opacity-[0.03] bg-[image:radial-gradient(currentColor_1px,transparent_1px)] bg-[length:16px_16px] text-[var(--store-primary)]"></div>

                            <div className="relative z-10 h-full flex flex-col justify-center">
                                <div className="flex items-center gap-3 mb-2 md:mb-4">
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white flex items-center justify-center shadow-sm text-[var(--store-primary)] group-hover:scale-110 transition-transform duration-300">
                                        <Truck className="w-5 h-5 md:w-6 md:h-6" />
                                    </div>
                                    <h4 className="font-bold text-gray-900 text-base md:text-lg">Shipping & Returns</h4>
                                </div>

                                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                    Orders are processed directly by <span className="font-semibold text-gray-900">{vendor.business_name}</span>.
                                </p>

                                <div className="mt-auto pt-4 border-t border-gray-200/50">
                                    <span className="text-xs font-medium text-gray-500 bg-white/60 px-2 py-1 rounded-md inline-block">
                                        Standard delivery rates apply
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Products Grid - Full Width */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                        <h2 className="text-2xl font-bold text-gray-900">Latest Products</h2>
                        {/* Optional: Add sort/filter toggle here if needed later */}
                    </div>

                    <ProductGrid
                        vendorSlug={slug}
                        initialFeatured={false}
                    />
                </div>
            </main>
        </div>
    );
}
