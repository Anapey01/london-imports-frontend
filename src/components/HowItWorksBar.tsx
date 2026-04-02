/**
 * London's Imports - How It Works Bar
 * trust signal component for category pages
 */
'use client';

import { ShoppingBag, Plane, PackageCheck } from 'lucide-react';

export default function HowItWorksBar() {
    return (
        <div className="bg-white dark:bg-slate-950 py-16 border-b border-gray-100 dark:border-slate-900">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-24">
                    {/* Step 1 */}
                    <div className="flex flex-col items-center text-center animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        <div className="w-12 h-12 flex items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 mb-6 group transition-all hover:bg-slate-950 hover:text-white duration-500">
                            <ShoppingBag className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" strokeWidth={1.5} />
                        </div>
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-4">The Selection</h4>
                        <h3 className="text-xl font-serif font-black text-slate-900 dark:text-white mb-3">You Select</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-[200px] leading-relaxed">
                            Curated collections from the world&apos;s leading logistics hubs.
                        </p>
                    </div>

                    {/* Step 2 */}
                    <div className="flex flex-col items-center text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        <div className="w-12 h-12 flex items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 mb-6 group transition-all hover:bg-slate-950 hover:text-white duration-500">
                            <PackageCheck className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" strokeWidth={1.5} />
                        </div>
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-4">The Protocol</h4>
                        <h3 className="text-xl font-serif font-black text-slate-900 dark:text-white mb-3">We Procure</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-[200px] leading-relaxed">
                            A rigorous verification process for every authentic piece.
                        </p>
                    </div>

                    {/* Step 3 */}
                    <div className="flex flex-col items-center text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
                        <div className="w-12 h-12 flex items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 mb-6 group transition-all hover:bg-slate-950 hover:text-white duration-500">
                            <Plane className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" strokeWidth={1.5} />
                        </div>
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-4">The Journey</h4>
                        <h3 className="text-xl font-serif font-black text-slate-900 dark:text-white mb-3">We Deliver</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-[200px] leading-relaxed">
                            High-performance logistics delivered to your doorstep.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
