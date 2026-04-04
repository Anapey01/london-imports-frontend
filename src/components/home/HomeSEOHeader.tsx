import React from 'react';
import { Compass, Ship, Globe, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

/**
 * London's Imports - Home SEO Header (The London Protocol)
 * Sleek, institutional Brand Manifesto that maintains SEO authority
 * while matching the product-first aesthetics of Jumia and Amazon.
 */
export default function HomeSEOHeader() {
    return (
        <section className="relative bg-white dark:bg-slate-950 pt-16 pb-12 overflow-hidden border-b border-slate-50 dark:border-slate-900">
            {/* Subtle Grainy Overlay for Premium Texture */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('/noise.svg')] mix-blend-overlay" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
                    
                    {/* LEFT COLUMN: The London Charter (Main SEO H1) */}
                    <div className="max-w-2xl flex flex-col items-start text-left">
                        
                        {/* Institutional Annotation */}
                        <div className="flex items-center gap-3 mb-6 group cursor-default">
                            <span className="h-[1px] w-8 bg-emerald-700/40 dark:bg-emerald-400/30 transition-all duration-700 group-hover:w-12" />
                            <span className="text-[9px] font-black tracking-[0.4em] uppercase text-emerald-800/60 dark:text-emerald-400/60">
                                Sourcing & Logistics Protocol
                            </span>
                        </div>

                        {/* Refined H1: High-Contrast Editorial Size */}
                        <h1 className="text-3xl md:text-5xl font-serif font-black leading-[1.1] tracking-tight text-slate-900 dark:text-white mb-6">
                            Mini Importation <span className="italic font-light text-slate-300 dark:text-slate-600 mx-1">&amp;</span> <br className="hidden md:block" />
                            Chinese Logistics for <span className="relative">
                                Accra.
                                <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-emerald-500/10 dark:bg-emerald-400/20" />
                            </span>
                        </h1>

                        {/* Compressed Value Prop */}
                        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-lg mb-8">
                            Bridging the 12,000km distance between <span className="text-slate-900 dark:text-white font-bold italic">China’s factory floors</span> and your doorstep in Ghana. Weekly air freight shells from Guangzhou. Secure 1688 sourcing. 
                        </p>

                        {/* Minimalist CTA */}
                        <Link href="/shipping" className="group inline-flex items-center gap-6 text-slate-900 dark:text-white">
                             <span className="text-[10px] font-black uppercase tracking-[0.3em] border-b border-slate-900 dark:border-white pb-1 group-hover:opacity-50 transition-opacity">
                                Explore Rates
                             </span>
                             <div className="w-8 h-8 rounded-full border border-slate-100 dark:border-slate-800 flex items-center justify-center group-hover:scale-110 group-hover:bg-slate-900 dark:group-hover:bg-white transition-all duration-500">
                                <ArrowUpRight className="w-3 h-3 group-hover:text-white dark:group-hover:text-slate-900" />
                             </div>
                        </Link>
                    </div>

                    {/* RIGHT COLUMN: Service Authority (Compressed Horizontal Strip) */}
                    <div className="flex flex-wrap gap-8 lg:gap-12 lg:border-l lg:border-slate-50 lg:dark:border-slate-900 lg:pl-12 pt-8 lg:pt-0">
                        {/* Authority 1: Sourcing */}
                        <div className="flex flex-col gap-3 max-w-[140px]">
                            <Compass className="w-5 h-5 text-emerald-600/40 dark:text-emerald-400/40" strokeWidth={1} />
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white mb-1">Native Sourcing</h4>
                                <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight">Direct WeChat Pay integration.</p>
                            </div>
                        </div>

                        {/* Authority 2: Cargo */}
                        <div className="flex flex-col gap-3 max-w-[140px]">
                            <Ship className="w-5 h-5 text-emerald-600/40 dark:text-emerald-400/40" strokeWidth={1} />
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white mb-1">Weekly Shells</h4>
                                <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight">Consolidated GZ air freight.</p>
                            </div>
                        </div>

                        {/* Authority 3: Customs */}
                        <div className="flex flex-col gap-3 max-w-[140px]">
                            <Globe className="w-5 h-5 text-emerald-600/40 dark:text-emerald-400/40" strokeWidth={1} />
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white mb-1">Ghana Cleared</h4>
                                <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight">Tema & KIA KIA protocol.</p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Logistics Accent: Operational Protocol Line */}
                <div className="mt-16 flex items-center justify-between border-t border-slate-50 dark:border-slate-900 pt-8 opacity-40">
                     <span className="text-[8px] font-black uppercase tracking-[0.5em] text-slate-400">Guangzhou Hub // GZ.ACC-SHELL-2026</span>
                     <div className="flex gap-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[8px] font-black uppercase tracking-[0.5em] text-slate-400">Active Pipeline</span>
                     </div>
                </div>
            </div>
        </section>
    );
}
