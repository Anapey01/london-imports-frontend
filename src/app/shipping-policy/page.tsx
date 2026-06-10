import React from 'react';
import { Metadata } from 'next';
import { Plane, Ship, AlertTriangle, ShieldCheck, Info } from 'lucide-react';

export const revalidate = 604800; // Cache for 7 days

export const metadata: Metadata = {
    title: "Shipping Policy | NAA ATSWEI ENTERPRISE | London's Imports",
    description: "Official shipping timelines, air and sea cargo policies, customs clearance, and delivery guidelines for London's Imports.",
};

export default function ShippingPolicyPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-200 selection:bg-emerald-100">
            
            {/* 1. Header & Introduction */}
            <section className="pt-40 pb-24 border-b border-slate-50 dark:border-slate-900">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-16">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-px w-12 bg-slate-900 dark:bg-white" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">Policies / 02</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-serif font-bold leading-[0.85] tracking-tighter text-slate-900 dark:text-white mb-8">
                            Shipping <br />
                            <span className="italic font-light text-slate-200 dark:text-slate-800 uppercase tracking-widest text-[0.4em] block mt-4">Policy Ledger.</span>
                        </h1>
                    </div>
                    <div className="max-w-3xl">
                        <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 font-medium leading-[1.8]">
                            We establish clear operational guidelines for transit, customs, and delivery. Below is our official shipping framework from Guangzhou to destinations across Ghana.
                        </p>
                    </div>
                </div>
            </section>

            {/* 2. Transit Timelines Grid */}
            <section className="py-24 border-b border-slate-50 dark:border-slate-900 bg-slate-50/20 dark:bg-slate-900/10">
                <div className="max-w-7xl mx-auto px-6">
                    <header className="mb-16">
                        <span className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-400 dark:text-slate-500 mb-4 block">Transit Windows</span>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white leading-none tracking-tighter italic">Freight Timelines</h2>
                    </header>

                    <div className="grid md:grid-cols-2 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
                        {/* Air Freight */}
                        <div className="bg-white dark:bg-slate-950 p-12 md:p-16 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-8">
                                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-emerald-500">Method 01</span>
                                    <Plane className="w-6 h-6 text-slate-400" strokeWidth={1} />
                                </div>
                                <h3 className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-6 italic">Air Cargo Freight</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-8 font-medium">
                                    Ideal for high-priority shipments, electronics, clothing, and lightweight procurement items.
                                </p>
                            </div>
                            <div className="border-t border-slate-100 dark:border-slate-900 pt-8">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Estimated Window</span>
                                <span className="text-3xl font-serif font-bold text-slate-900 dark:text-white">7 – 14 Business Days</span>
                                <span className="text-[10px] text-slate-400 block mt-1 font-medium">From China Warehouse departure to Accra hub arrival.</span>
                            </div>
                        </div>

                        {/* Sea Freight */}
                        <div className="bg-white dark:bg-slate-950 p-12 md:p-16 flex flex-col justify-between border-l border-slate-200 dark:border-slate-800">
                            <div>
                                <div className="flex justify-between items-start mb-8">
                                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-blue-500">Method 02</span>
                                    <Ship className="w-6 h-6 text-slate-400" strokeWidth={1} />
                                </div>
                                <h3 className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-6 italic">Sea Cargo Freight</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-8 font-medium">
                                    Recommended for heavy cargo, bulk commercial inventory, and large home/office items.
                                </p>
                            </div>
                            <div className="border-t border-slate-100 dark:border-slate-900 pt-8">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Estimated Window</span>
                                <span className="text-3xl font-serif font-bold text-slate-900 dark:text-white">30 – 60 Business Days</span>
                                <span className="text-[10px] text-slate-400 block mt-1 font-medium">From departure vessel sailing to Tema port clearance.</span>
                            </div>
                        </div>
                    </div>

                    {/* General disclaimer banner */}
                    <div className="mt-12 p-8 border border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-950/50 flex gap-6">
                        <Info className="w-6 h-6 text-slate-900 dark:text-white flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                            <strong>Note on Timelines:</strong> Delivery timelines are estimates and may be affected by supplier processing times, customs inspections, public holidays, weather conditions, or other circumstances beyond London&apos;s Imports&apos; control.
                        </p>
                    </div>
                </div>
            </section>

            {/* 3. Delivery After Arrival */}
            <section className="py-24 border-b border-slate-50 dark:border-slate-900">
                <div className="max-w-7xl mx-auto px-6">
                    <header className="mb-16">
                        <span className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-400 dark:text-slate-500 mb-4 block">Final Mile</span>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white leading-none tracking-tighter italic">Delivery Post-Arrival</h2>
                    </header>

                    <div className="grid md:grid-cols-3 gap-12 border-t border-slate-900 dark:border-slate-800 pt-16">
                        <div className="space-y-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 block">Zone 01: Greater Accra & Tema</span>
                            <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white italic">1 – 3 Business Days</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                Doorstep delivery is coordinated through our local dispatch riders or self-pickup is available at our Accra warehouse.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 block">Zone 02: Regional Capitals</span>
                            <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white italic">3 – 5 Business Days</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                Shipped via verified regional transport hubs. Doorstep delivery or station pickup options available.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 block">Zone 03: Remote Areas</span>
                            <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white italic">5 – 7 Business Days</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                Handled through dedicated third-party logistics agents to ensure delivery to remote locations.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Critical Disclaimers */}
            <section className="py-24 bg-slate-900 text-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-12 gap-24">
                        <div className="lg:col-span-4">
                            <span className="text-[9px] font-black uppercase tracking-[0.5em] text-emerald-500 mb-8 block">Legal Ledger</span>
                            <h2 className="text-5xl font-serif font-bold text-white mb-8 leading-none tracking-tighter">Disclaimers & <br /> Conditions.</h2>
                            <p className="text-xs font-medium text-slate-400 leading-relaxed max-w-xs italic border-l border-white/10 pl-8">
                                Safe passage is our goal, but logistics involve complex international regulations and factors outside our control.
                            </p>
                        </div>

                        <div className="lg:col-span-8 space-y-12">
                            <div className="border-t border-white/10 pt-10 flex gap-6">
                                <AlertTriangle className="w-8 h-8 text-emerald-500 flex-shrink-0" strokeWidth={1} />
                                <div>
                                    <h4 className="text-xl font-serif font-bold text-white mb-4 italic">Delays Disclaimer</h4>
                                    <p className="text-xs text-slate-400 leading-relaxed font-medium">
                                        All transit windows represent estimates. Actual shipping dates may vary due to airline schedules, vessel routing adjustments, severe weather conditions, port congestion, national holidays, or global logistics chain disruptions. We will notify you immediately of any changes.
                                    </p>
                                </div>
                            </div>
                            <div className="border-t border-white/10 pt-10 flex gap-6">
                                <ShieldCheck className="w-8 h-8 text-emerald-500 flex-shrink-0" strokeWidth={1} />
                                <div>
                                    <h4 className="text-xl font-serif font-bold text-white mb-4 italic">Customs Inspection Disclaimer</h4>
                                    <p className="text-xs text-slate-400 leading-relaxed font-medium">
                                        Customs inspections, port audits, tariff revaluations, and document processing at the entry ports (Guangzhou customs or Tema Port Authority) are completely subject to state regulations and remain outside our direct control. NAA ATSWEI ENTERPRISE is not liable for cargo delayed during statutory customs checks.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
