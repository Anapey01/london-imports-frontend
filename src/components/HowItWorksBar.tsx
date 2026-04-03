/**
 * London's Imports - How It Works Bar
 * trust signal component for category pages
 */
'use client';

import { ShoppingBag, Plane, PackageCheck } from 'lucide-react';

export default function HowItWorksBar() {
    return (
        <div className="bg-white dark:bg-slate-950 py-20 border-b border-gray-100 dark:border-slate-900 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="grid grid-cols-3 gap-4 md:gap-8 lg:gap-24 items-start">
                    {/* Step 1 */}
                    <div className="flex flex-col items-center text-center animate-fade-in [animation-delay:0.1s]">
                        <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full border border-slate-100 dark:border-slate-800 mb-6 group transition-all hover:border-[#006B5A]/30 duration-700">
                            <ShoppingBag className="w-4 h-4 md:w-5 md:h-5 text-[#006B5A] opacity-70 group-hover:scale-110 transition-transform" strokeWidth={1} />
                        </div>
                        <h4 className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Selection</h4>
                        <h3 className="text-xs md:text-xl font-bold text-slate-900 dark:text-white mb-3 tracking-tighter">You Select</h3>
                        <p className="hidden md:block text-sm text-slate-500 dark:text-slate-400 max-w-[180px] leading-relaxed">
                            Curated collections from the world&apos;s leading logistics hubs.
                        </p>
                    </div>

                    {/* Step 2 */}
                    <div className="flex flex-col items-center text-center animate-fade-in [animation-delay:0.2s]">
                        <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full border border-slate-100 dark:border-slate-800 mb-6 group transition-all hover:border-[#006B5A]/30 duration-700">
                            <PackageCheck className="w-4 h-4 md:w-5 md:h-5 text-[#006B5A] opacity-70 group-hover:scale-110 transition-transform" strokeWidth={1} />
                        </div>
                        <h4 className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Protocol</h4>
                        <h3 className="text-xs md:text-xl font-bold text-slate-900 dark:text-white mb-3 tracking-tighter">We Procure</h3>
                        <p className="hidden md:block text-sm text-slate-500 dark:text-slate-400 max-w-[180px] leading-relaxed">
                            A rigorous verification process for every authentic piece.
                        </p>
                    </div>

                    {/* Step 3 */}
                    <div className="flex flex-col items-center text-center animate-fade-in [animation-delay:0.3s]">
                        <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full border border-slate-100 dark:border-slate-800 mb-6 group transition-all hover:border-[#006B5A]/30 duration-700">
                            <Plane className="w-4 h-4 md:w-5 md:h-5 text-[#006B5A] opacity-70 group-hover:scale-110 transition-transform" strokeWidth={1} />
                        </div>
                        <h4 className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Journey</h4>
                        <h3 className="text-xs md:text-xl font-bold text-slate-900 dark:text-white mb-3 tracking-tighter">We Deliver</h3>
                        <p className="hidden md:block text-sm text-slate-500 dark:text-slate-400 max-w-[180px] leading-relaxed">
                            High-performance logistics delivered to your doorstep.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
