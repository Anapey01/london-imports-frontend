/**
 * London's Imports - Reviews Page
 * Customer testimonials and reviews
 */
'use client';

import Reviews from '@/components/Reviews';

export default function ReviewsPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                        Customer Reviews
                    </h1>
                    <p className="text-gray-600">
                        See what our customers say about London&apos;s Imports
                    </p>
                </div>
            </div>

            {/* Reviews Component */}
            <Reviews />

            {/* Trust Indicators */}
            <section className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="p-6">
                            <div className="text-4xl mb-4">⭐</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">4.8/5 Average Rating</h3>
                            <p className="text-gray-600">Based on customer feedback</p>
                        </div>
                        <div className="p-6">
                            <div className="text-4xl mb-4">📦</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">500+ Orders</h3>
                            <p className="text-gray-600">Successfully delivered</p>
                        </div>
                        <div className="p-6">
                            <div className="text-4xl mb-4">🇬🇭</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">100% Ghana Based</h3>
                            <p className="text-gray-600">Local customer support</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
