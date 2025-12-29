/**
 * London's Imports - Product Card Component (Redesigned)
 * Matching the new design style with warm colors
 */
'use client';

import Link from 'next/link';
import StarRating from '@/components/StarRating';

interface ProductCardProps {
    product: {
        id: string;
        name: string;
        slug: string;
        image: string | null;
        price: number;
        deposit_amount: number;
        preorder_status: string;
        delivery_window_text: string;
        reservations_count: number;
        vendor_name: string;
        cutoff_date?: string;
    };
}

const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
    PREORDER: { bg: 'bg-[#006B5A]', text: 'text-white', label: 'Pre-order' },
    CLOSING_SOON: { bg: 'bg-[#F5A623]', text: 'text-[#006B5A]', label: 'Closing Soon' },
    READY_TO_SHIP: { bg: 'bg-green-500', text: 'text-white', label: 'Ready to Ship' },
    SOLD_OUT: { bg: 'bg-gray-400', text: 'text-white', label: 'Sold Out' },
};

export default function ProductCard({ product }: ProductCardProps) {
    const status = statusStyles[product.preorder_status] || statusStyles.PREORDER;

    return (
        <Link href={`/products/${product.slug}`}>
            <div className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                {/* Image Container */}
                <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-6">
                    {/* Status Badge */}
                    <div className="absolute top-4 left-4 z-10">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${status.bg} ${status.text}`}>
                            {status.label}
                        </span>
                    </div>

                    {/* Demand Signal */}
                    {product.reservations_count > 0 && (
                        <div className="absolute top-4 right-4 z-10">
                            <span className="bg-white/90 backdrop-blur px-2.5 py-1.5 rounded-full text-xs font-bold text-[#F5A623] shadow-sm flex items-center gap-1">
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                                </svg>
                                {product.reservations_count}
                            </span>
                        </div>
                    )}

                    {/* Product Image */}
                    <div className="aspect-square flex items-center justify-center">
                        {product.image ? (
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <svg className="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                        )}
                    </div>
                </div>

                {/* Details */}
                <div className="p-5 bg-white">
                    {/* Vendor */}
                    <div className="flex justify-between items-start mb-1">
                        <p className="text-xs text-gray-400 uppercase tracking-wide">
                            {product.vendor_name}
                        </p>
                        <StarRating size="sm" />
                    </div>

                    {/* Name */}
                    <h3 className="font-bold text-[#006B5A] text-lg mb-2 line-clamp-2 group-hover:text-[#004D40] transition-colors">
                        {product.name}
                    </h3>

                    {/* Delivery Window */}
                    <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-3">
                        <svg className="w-4 h-4 text-[#F5A623]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{product.delivery_window_text}</span>
                    </div>

                    {/* Price & CTA Row */}
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-2xl font-bold text-gray-900">
                                GHS {product.price.toLocaleString()}
                            </span>
                            {product.deposit_amount > 0 && (
                                <p className="text-xs text-gray-400 mt-0.5">
                                    or GHS {product.deposit_amount} deposit
                                </p>
                            )}
                        </div>

                        {/* Quick View Button */}
                        <div className="bg-[#F5A623] text-[#006B5A] px-4 py-2 rounded-full text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            View →
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
