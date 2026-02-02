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
                    <div
                        className="absolute inset-0 opacity-90 bg-[image:linear-gradient(135deg,var(--store-primary)_0%,#111827_100%)]"
                        aria-hidden="true"
                    />
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
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar / Info */}
                    <aside className="lg:col-span-1 space-y-6">
                        {/* About Card */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-4 text-lg">About Store</h3>
                            <p className="text-gray-600 leading-relaxed text-sm">
                                {vendor.description || `Welcome to ${vendor.business_name}. Browse our exclusive collection of products.`}
                            </p>

                            <hr className="my-6 border-gray-100" />

                            {/* Metrics */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500 text-sm">Reliability</span>
                                    <span className="font-bold text-green-600 flex items-center gap-1">
                                        {(vendor.fulfillment_rate || 0)}%
                                        <ShieldCheck className="w-4 h-4" />
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500 text-sm">Status</span>
                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Active Seller</span>
                                </div>
                            </div>
                        </div>

                        {/* Store Policy / Custom Message from Config */}
                        {config.allow_returns !== false && (
                            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                                <div className="flex items-start gap-3">
                                    <Truck className="w-5 h-5 text-blue-600 mt-0.5" />
                                    <div>
                                        <h4 className="font-bold text-blue-900 text-sm mb-1">Shipping & Returns</h4>
                                        <p className="text-blue-700 text-xs leading-relaxed">
                                            Orders from this store are processed directly by the vendor. Delivery times may vary.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </aside>

                    {/* Products Grid */}
                    <div className="lg:col-span-3">
                        {/* Custom Tab Bar */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Latest Products</h2>
                            {/* Use custom color for decoration */}
                            <div className="h-1 w-20 rounded-full bg-[var(--store-primary)]" />
                        </div>

                        {/* The Grid - Filtered by Vendor Slug */}
                        <ProductGrid
                            vendorSlug={slug}
                            initialFeatured={false} // Show all
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
