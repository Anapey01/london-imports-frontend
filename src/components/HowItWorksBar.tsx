/**
 * London's Imports - How It Works Bar
 * trust signal component for category pages
 */
'use client';

import { ShoppingBag, Plane, PackageCheck } from 'lucide-react';

export default function HowItWorksBar() {
    return (
        <div className="bg-white py-8 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-row justify-between items-start gap-2 md:gap-4 relative">
                    {/* Connecting line for desktop */}
                    <div className="hidden md:block absolute top-1/2 left-20 right-20 h-0.5 bg-gray-50 -z-10 -translate-y-4"></div>

                    {/* Step 1 */}
                    <div className="flex flex-col items-center flex-1 z-10">
                        <div className="w-10 h-10 md:w-16 md:h-16 flex items-center justify-center bg-gray-50 rounded-2xl mb-3 md:mb-4 group transition-transform hover:scale-105 duration-300">
                            <ShoppingBag className="w-5 h-5 md:w-7 md:h-7 text-gray-800 transition-colors group-hover:text-pink-600" strokeWidth={1.5} />
                        </div>
                        <h4 className="text-xs md:text-sm font-semibold text-gray-900 uppercase tracking-wide text-center leading-tight">You Select</h4>
                        <p className="text-[10px] md:text-xs text-gray-500 mt-1 text-center max-w-[150px] leading-tight">Choose from our curated London catalog</p>
                    </div>

                    {/* Step 2 */}
                    <div className="flex flex-col items-center flex-1 z-10">
                        <div className="w-10 h-10 md:w-16 md:h-16 flex items-center justify-center bg-gray-50 rounded-2xl mb-3 md:mb-4 group transition-transform hover:scale-105 duration-300">
                            <PackageCheck className="w-5 h-5 md:w-7 md:h-7 text-gray-800 transition-colors group-hover:text-pink-600" strokeWidth={1.5} />
                        </div>
                        <h4 className="text-xs md:text-sm font-semibold text-gray-900 uppercase tracking-wide text-center leading-tight">We Procure</h4>
                        <p className="text-[10px] md:text-xs text-gray-500 mt-1 text-center max-w-[150px] leading-tight">Authentic goods sourced directly</p>
                    </div>

                    {/* Step 3 */}
                    <div className="flex flex-col items-center flex-1 z-10">
                        <div className="w-10 h-10 md:w-16 md:h-16 flex items-center justify-center bg-gray-50 rounded-2xl mb-3 md:mb-4 group transition-transform hover:scale-105 duration-300">
                            <Plane className="w-5 h-5 md:w-7 md:h-7 text-gray-800 transition-colors group-hover:text-pink-600" strokeWidth={1.5} />
                        </div>
                        <h4 className="text-xs md:text-sm font-semibold text-gray-900 uppercase tracking-wide text-center leading-tight">We Deliver</h4>
                        <p className="text-[10px] md:text-xs text-gray-500 mt-1 text-center max-w-[150px] leading-tight">Fast shipping to your doorstep</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
