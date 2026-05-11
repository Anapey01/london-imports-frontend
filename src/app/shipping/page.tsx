import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Truck, Plane, Ship, Package, ShieldCheck, MapPin, ArrowUpRight } from 'lucide-react';

export const metadata: Metadata = {
    title: "China to Ghana Shipping Services | Air & Sea Freight | London's Imports",
    description: "Reliable shipping from China (1688, Alibaba) to Accra, Kumasi, and Tema. Affordable air freight (7-14 days) and sea freight (45 days). We handle consolidation and door-to-door delivery.",
    keywords: ["Shipping from China to Ghana", "Air freight China to Accra", "Sea shipping Guangzhou to Tema", "1688 shipping agent Ghana", "Door to door delivery Ghana"],
};

export default function ShippingPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 relative pb-32 selection:bg-emerald-100 dark:selection:bg-slate-800">
            {/* 1. ARCHITECTURAL HEADER SECTION */}
            <header className="relative z-10 pt-24 pb-16 px-6 max-w-7xl mx-auto border-b border-slate-50 dark:border-slate-900">
                <div className="flex items-center gap-4 mb-12">
                    <span className="h-px w-12 bg-slate-900 dark:bg-white" />
                    <span className="text-[10px] font-black tracking-[0.4em] uppercase text-slate-400 dark:text-slate-500">
                        Shipping Services / West Africa
                    </span>
                </div>
                
                <h1 className="text-5xl md:text-8xl lg:text-9xl font-serif font-bold leading-[0.85] tracking-tighter text-slate-900 dark:text-white mb-16">
                    Global <br />
                    <span className="italic font-light text-slate-200 dark:text-slate-800">Shipping</span>.
                </h1>

                <div className="max-w-2xl">
                    <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                        Motion creates value. We bridge the 12,000km divide between Guangzhou’s markets and the streets of Accra with careful planning.
                    </p>
                </div>
            </header>

            {/* 2. THE SERVICE LEDGER (Split Grid Architecture) */}
            <section className="relative z-10 max-w-7xl mx-auto px-6 py-24">
                <div className="grid md:grid-cols-2 gap-px bg-slate-100 dark:bg-slate-900 border border-slate-100 dark:border-slate-900 uppercase">
                    
                    {/* AIR EXPRESS - HIGH SPEED */}
                    <div className="bg-white dark:bg-slate-950 p-12 md:p-20 flex flex-col group">
                        <div className="mb-16">
                            <span className="text-[10px] font-black tracking-[0.3em] text-emerald-600 dark:text-emerald-500 mb-6 block italic">Option 01 / Rapid</span>
                            <div className="flex items-start justify-between">
                                <h2 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 dark:text-white tracking-tight leading-none">
                                    Air Express
                                </h2>
                                <Plane className="w-8 h-8 text-slate-100 dark:text-slate-800 group-hover:text-emerald-500 transition-colors" strokeWidth={1} />
                            </div>
                        </div>
 
                        <div className="space-y-12 mb-20 flex-1">
                            <div className="border-t border-slate-50 dark:border-slate-900 pt-8">
                                <span className="text-[9px] font-black text-slate-300 dark:text-slate-700 tracking-[0.2em] mb-4 block">Delivery Time</span>
                                <p className="text-xl font-bold text-slate-900 dark:text-white">7 - 14 Days Arrival</p>
                                <p className="text-[9px] text-slate-400 dark:text-slate-500 font-medium italic mt-1">Arrival in Accra</p>
                            </div>

                            <div className="border-t border-slate-50 dark:border-slate-900 pt-8">
                                <span className="text-[9px] font-black text-slate-300 dark:text-slate-700 tracking-[0.2em] mb-4 block">Best For</span>
                                <p className="text-xl font-bold text-slate-900 dark:text-white">Tech, Fashion & Medical</p>
                            </div>
                        </div>

                        <Link 
                            href="/products" 
                            className="group/link inline-flex items-center gap-4 text-[11px] font-black text-slate-900 dark:text-white border-b border-black dark:border-white pb-2 self-start hover:opacity-60 transition-all font-sans"
                        >
                            Shop to Ship
                            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                        </Link>
                    </div>

                    {/* SEA ECONOMY - HIGH VOLUME */}
                    <div className="bg-white dark:bg-slate-950 p-12 md:p-20 flex flex-col group border-l border-slate-100 dark:border-slate-900 md:mt-24">
                        <div className="mb-16">
                            <span className="text-[10px] font-black tracking-[0.3em] text-blue-500 dark:text-blue-400 mb-6 block italic">Option 02 / Volume</span>
                            <div className="flex items-start justify-between">
                                <h2 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 dark:text-white tracking-tight leading-none">
                                    Sea Economy
                                </h2>
                                <Ship className="w-8 h-8 text-slate-100 dark:text-slate-800 group-hover:text-blue-400 transition-colors" strokeWidth={1} />
                            </div>
                        </div>

                        <div className="space-y-12 mb-20 flex-1">
                            <div className="border-t border-slate-50 dark:border-slate-900 pt-8">
                                <span className="text-[9px] font-black text-slate-300 dark:text-slate-700 tracking-[0.2em] mb-4 block">Shipping Time</span>
                                <p className="text-xl font-bold text-slate-900 dark:text-white">8 - 9 Weeks Total</p>
                                <p className="text-[9px] text-slate-400 dark:text-slate-500 font-medium italic mt-1">From Departure to Final Mile</p>
                            </div>
 
                            <div className="border-t border-slate-50 dark:border-slate-900 pt-8">
                                <span className="text-[9px] font-black text-slate-300 dark:text-slate-700 tracking-[0.2em] mb-4 block">Best For</span>
                                <p className="text-xl font-bold text-slate-900 dark:text-white">Heavy Goods & Furniture</p>
                            </div>
                        </div>

                        <Link 
                            href="/contact" 
                            className="group/link inline-flex items-center gap-4 text-[11px] font-black text-slate-900 dark:text-white border-b border-black dark:border-white pb-2 self-start hover:opacity-60 transition-all font-sans"
                        >
                            Request Bulk Quote
                            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* 3. LOGISTICS INFRASTRUCTURE (Asymmetrical Grid) */}
            <section className="relative z-10 max-w-7xl mx-auto px-6 py-24 sm:mt-24 bg-slate-50/50 dark:bg-slate-900/10">
                <div className="flex items-center gap-4 mb-24 justify-center">
                    <span className="text-[10px] font-black tracking-[0.5em] text-slate-300 dark:text-slate-600 uppercase">
                        The London&apos;s Infrastructure
                    </span>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-slate-800">
                    {[
                        { 
                            icon: Package, 
                            title: "Advanced Consolidation", 
                            text: "We combine your 1688 and Alibaba orders into one shipment at our Guangzhou hub to slash your shipping fees." 
                        },
                        { 
                            icon: ShieldCheck, 
                            title: "Tracked Movement", 
                            text: "Every Kg is logged. Track your goods from our China warehouse directly to the final clearing port in Accra." 
                        },
                        { 
                            icon: MapPin, 
                            title: "Nationwide Delivery", 
                            text: "Door-to-door delivery in Accra and Tema, with convenient branch pickups in Kumasi for the northern regions." 
                        },
                        { 
                            icon: Truck, 
                            title: "Customs Clearance", 
                            text: "We handle all the paperwork. Real clearing agents in Tema ensuring smooth gate exits." 
                        }
                    ].map((item, i) => (
                        <div key={i} className="bg-white dark:bg-slate-950 p-12 transition-all hover:bg-slate-50 dark:hover:bg-slate-900 group">
                            <div className="w-12 h-12 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white group-hover:border-slate-900 dark:group-hover:border-white transition-all mb-8">
                                <item.icon className="w-5 h-5" strokeWidth={1} />
                            </div>
                            <h4 className="text-xl font-serif font-bold text-slate-900 dark:text-white mb-4 tracking-tighter">
                                {item.title}
                            </h4>
                            <p className="text-sm text-slate-400 dark:text-slate-500 font-medium leading-relaxed">
                                {item.text}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
