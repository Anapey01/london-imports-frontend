import React from 'react';
import { Compass, Ship, Globe, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

/**
 * London's Imports - Home SEO Header (The London Protocol)
 * Hardened for WCAG 'Perceivable' compliance.
 */
export default function HomeSEOHeader() {
    return (
        <section className="relative bg-surface pt-16 pb-12 overflow-hidden border-b border-border-standard">
            {/* Subtle Grainy Overlay for Premium Texture */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('/noise.svg')] mix-blend-overlay" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
                    
                    {/* LEFT COLUMN: The London Charter (Main SEO H1) */}
                    <div className="max-w-2xl flex flex-col items-start text-left">
                        
                        {/* Institutional Annotation - 'Perceivable' Hardened */}
                        <div className="flex items-center gap-3 mb-6 group cursor-default">
                            <span className="h-[1px] w-8 bg-brand-emerald/40 transition-all duration-700 group-hover:w-12" />
                            <span className="text-[9px] font-black tracking-[0.4em] uppercase text-brand-emerald">
                                Sourcing & Logistics Protocol
                            </span>
                        </div>

                        {/* Refined H2: High-Contrast Editorial Size */}
                        <h2 className="text-3xl md:text-5xl font-bold leading-[1.1] tracking-tight text-content-primary mb-6">
                            Mini Importation <span className="italic font-light text-content-secondary/40 mx-1">&amp;</span> <br className="hidden md:block" />
                            Chinese Logistics for <span className="relative">
                                Accra.
                                <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-brand-emerald/10" />
                            </span>
                        </h2>

                        {/* Compressed Value Prop - 'Perceivable' Hardened */}
                        <p className="text-sm md:text-base text-content-secondary font-medium leading-relaxed max-w-lg mb-8">
                            Bridging the 12,000km distance between <span className="text-content-primary font-bold italic">China’s factory floors</span> and your doorstep in Ghana. Weekly air freight shells from Guangzhou. Secure 1688 sourcing. 
                        </p>

                        {/* Minimalist CTA - 'Perceivable' Hardened */}
                        <Link href="/shipping" className="group inline-flex items-center gap-6 text-content-primary focus-visible:ring-2 focus-visible:ring-brand-emerald focus-visible:ring-offset-2 focus-visible:ring-offset-surface rounded-sm">
                             <span className="text-[10px] font-black uppercase tracking-[0.3em] border-b border-content-primary pb-1 group-hover:text-brand-emerald transition-colors">
                                Explore Rates
                             </span>
                             <div className="w-8 h-8 rounded-full border border-border-standard flex items-center justify-center group-hover:scale-110 group-hover:bg-content-primary transition-all duration-500">
                                <ArrowUpRight className="w-3 h-3 group-hover:text-surface" />
                             </div>
                        </Link>
                    </div>

                    {/* RIGHT COLUMN: Service Authority (Compressed Horizontal Strip) */}
                    <div className="flex flex-wrap gap-8 lg:gap-12 lg:border-l lg:border-border-standard lg:pl-12 pt-8 lg:pt-0">
                        {/* Authority 1: Sourcing */}
                        <div className="flex flex-col gap-3 max-w-[140px]">
                            <Compass className="w-5 h-5 text-brand-emerald/40" strokeWidth={1} />
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-content-primary mb-1">Native Sourcing</h4>
                                <p className="text-[10px] text-content-secondary leading-tight">Direct WeChat Pay integration.</p>
                            </div>
                        </div>

                        {/* Authority 2: Cargo */}
                        <div className="flex flex-col gap-3 max-w-[140px]">
                            <Ship className="w-5 h-5 text-brand-emerald/40" strokeWidth={1} strokeLinecap="round" />
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-content-primary mb-1">Weekly Shells</h4>
                                <p className="text-[10px] text-content-secondary leading-tight">Consolidated GZ air freight.</p>
                            </div>
                        </div>

                        {/* Authority 3: Customs */}
                        <div className="flex flex-col gap-3 max-w-[140px]">
                            <Globe className="w-5 h-5 text-brand-emerald/40" strokeWidth={1} />
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-content-primary mb-1">Ghana Cleared</h4>
                                <p className="text-[10px] text-content-secondary leading-tight">Tema & KIA KIA protocol.</p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Logistics Accent: Operational Protocol Line - 'Perceivable' Hardened */}
                <div className="mt-16 flex items-center justify-between border-t border-border-standard pt-8">
                     <span className="text-[8px] font-black uppercase tracking-[0.5em] text-content-secondary/40">Guangzhou Hub // GZ.ACC-SHELL-2026</span>
                     <div className="flex items-center gap-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald animate-pulse" />
                        <span className="text-[8px] font-black uppercase tracking-[0.5em] text-content-secondary/40">Active Pipeline</span>
                     </div>
                </div>
            </div>
        </section>
    );
}
