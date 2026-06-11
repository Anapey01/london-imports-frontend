'use client';

import React from 'react';
import { Compass, Ship, ShieldCheck, Smartphone } from 'lucide-react';

export default function ValueProp() {
    return (
        <section className="bg-white dark:bg-slate-950 border-b border-border-standard py-12 lg:py-16 relative z-20 transition-colors duration-500">
            {/* Subtle premium background grain texture */}
            <div className="absolute inset-0 opacity-[0.015] pointer-events-none bg-[url('/noise.svg')] mix-blend-overlay" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
                    
                    {/* Value Statement */}
                    <div className="lg:col-span-7 space-y-5 text-left">
                        <div className="inline-flex items-center gap-3">
                            <span className="h-[1px] w-6 bg-brand-emerald" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-emerald">
                                Sourcing & Shipping Gateway
                            </span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-content-primary leading-[1.15]">
                            We Source Globally. <br />
                            We Deliver Directly <span className="italic text-brand-emerald">to Your Door.</span>
                        </h2>
                        <p className="text-sm sm:text-base text-content-secondary font-medium leading-relaxed max-w-xl">
                            London&apos;s Imports bridges the gap between global manufacturing hubs and your doorstep in Ghana. We source high-quality products directly from verified suppliers, manage fast air cargo shipments, clear customs, and handle local delivery. Pay securely in GHS using MTN or Vodafone MoMo.
                        </p>
                    </div>

                    {/* Operational Pillars Grid */}
                    <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Pillar 1 */}
                        <div className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-none flex flex-col gap-4 hover:border-brand-emerald/20 transition-all duration-300">
                            <div className="w-10 h-10 rounded-full bg-brand-emerald/5 flex items-center justify-center text-brand-emerald">
                                <Compass className="w-5 h-5" strokeWidth={1.5} />
                            </div>
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-wider text-content-primary mb-1">Factory Direct</h3>
                                <p className="text-[10px] text-content-secondary font-medium leading-normal">
                                    Direct product sourcing from top manufacturers.
                                </p>
                            </div>
                        </div>

                        {/* Pillar 2 */}
                        <div className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-none flex flex-col gap-4 hover:border-brand-emerald/20 transition-all duration-300">
                            <div className="w-10 h-10 rounded-full bg-brand-emerald/5 flex items-center justify-center text-brand-emerald">
                                <Ship className="w-5 h-5" strokeWidth={1.5} />
                            </div>
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-wider text-content-primary mb-1">Weekly Cargo</h3>
                                <p className="text-[10px] text-content-secondary font-medium leading-normal">
                                    Consolidated air shipping arriving weekly in Accra.
                                </p>
                            </div>
                        </div>

                        {/* Pillar 3 */}
                        <div className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-none flex flex-col gap-4 hover:border-brand-emerald/20 transition-all duration-300">
                            <div className="w-10 h-10 rounded-full bg-brand-emerald/5 flex items-center justify-center text-brand-emerald">
                                <ShieldCheck className="w-5 h-5" strokeWidth={1.5} />
                            </div>
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-wider text-content-primary mb-1">Customs Cleared</h3>
                                <p className="text-[10px] text-content-secondary font-medium leading-normal">
                                    Airport clearing and duty handling fully managed.
                                </p>
                            </div>
                        </div>

                        {/* Pillar 4 */}
                        <div className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-none flex flex-col gap-4 hover:border-brand-emerald/20 transition-all duration-300">
                            <div className="w-10 h-10 rounded-full bg-brand-emerald/5 flex items-center justify-center text-brand-emerald">
                                <Smartphone className="w-5 h-5" strokeWidth={1.5} />
                            </div>
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-wider text-content-primary mb-1">MoMo Payments</h3>
                                <p className="text-[10px] text-content-secondary font-medium leading-normal">
                                    No foreign card hurdles. Pay in GHS via Mobile Money.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
