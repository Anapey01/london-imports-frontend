/**
 * London's Imports - How It Works Bar
 * trust signal component for category pages
 */
'use client';

import { ShoppingBag, Plane, PackageCheck } from 'lucide-react';

export default function HowItWorksBar() {
    return (
        <div className="bg-gradient-to-r from-pink-50 to-white py-6 border-b border-pink-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-3 gap-2 md:gap-8 text-center divide-x divide-pink-100">
                    <div className="flex flex-col items-center">
                        <div className="bg-white p-2 md:p-3 rounded-full shadow-sm mb-2 text-pink-500">
                            <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <h4 className="text-xs md:text-sm font-bold text-gray-900">1. You Choose</h4>
                        <p className="hidden md:block text-xs text-gray-500 mt-1">Browse our London catalog</p>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="bg-white p-2 md:p-3 rounded-full shadow-sm mb-2 text-pink-500">
                            <PackageCheck className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <h4 className="text-xs md:text-sm font-bold text-gray-900">2. We Buy</h4>
                        <p className="hidden md:block text-xs text-gray-500 mt-1">Authentic goods sourced</p>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="bg-white p-2 md:p-3 rounded-full shadow-sm mb-2 text-pink-500">
                            <Plane className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <h4 className="text-xs md:text-sm font-bold text-gray-900">3. We Ship</h4>
                        <p className="hidden md:block text-xs text-gray-500 mt-1">Direct to your doorstep</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
