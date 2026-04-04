/**
 * London's Imports - How It Works Bar
 * trust signal component for category pages
 */
'use client';

import { ShoppingBag, Plane, PackageCheck } from 'lucide-react';

export default function HowItWorksBar() {
    return (
        <div className="bg-white py-12 md:py-16 border-y border-slate-100 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="grid grid-cols-3 gap-6 md:gap-12 items-start">
                    
                    {/* 1. SELECTION */}
                    <div className="flex flex-col items-center text-center group">
                        <div className="mb-4">
                            <ShoppingBag className="w-5 h-5 text-emerald-600 transition-transform group-hover:scale-110" strokeWidth={1} />
                        </div>
                        <div className="w-full">
                            <span className="block text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em] text-slate-300 mb-2">Selection</span>
                            <h3 className="text-[11px] md:text-sm font-bold text-slate-900 uppercase tracking-widest mb-1">You Select</h3>
                            <p className="hidden md:block text-[11px] leading-relaxed text-slate-400 font-medium max-w-[150px] mx-auto">
                                Curated collections from the world&apos;s leading hubs.
                            </p>
                        </div>
                    </div>

                    {/* 2. PROTOCOL */}
                    <div className="flex flex-col items-center text-center group">
                        <div className="mb-4">
                            <PackageCheck className="w-5 h-5 text-emerald-600 transition-transform group-hover:scale-110" strokeWidth={1} />
                        </div>
                        <div className="w-full">
                            <span className="block text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em] text-slate-300 mb-2">Protocol</span>
                            <h3 className="text-[11px] md:text-sm font-bold text-slate-900 uppercase tracking-widest mb-1">We Procure</h3>
                            <p className="hidden md:block text-[11px] leading-relaxed text-slate-400 font-medium max-w-[150px] mx-auto">
                                A rigorous verification process for every piece.
                            </p>
                        </div>
                    </div>

                    {/* 3. JOURNEY */}
                    <div className="flex flex-col items-center text-center group">
                        <div className="mb-4">
                            <Plane className="w-5 h-5 text-emerald-600 transition-transform group-hover:scale-110" strokeWidth={1} />
                        </div>
                        <div className="w-full">
                            <span className="block text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em] text-slate-300 mb-2">Journey</span>
                            <h3 className="text-[11px] md:text-sm font-bold text-slate-900 uppercase tracking-widest mb-1">We Deliver</h3>
                            <p className="hidden md:block text-[11px] leading-relaxed text-slate-400 font-medium max-w-[150px] mx-auto">
                                High-performance logistics to your doorstep.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
