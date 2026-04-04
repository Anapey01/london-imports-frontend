'use client';

import React, { useState, useEffect } from 'react';
import {
    Globe,
    ArrowUpRight,
    ShieldCheck,
    Zap,
    Briefcase,
    Plus
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ordersAPI } from '@/lib/api';

interface AboutStats {
    regions: number;
    sellers: number;
    orders: number;
    products: number;
    authenticity: number;
}

export default function AboutPageContent() {
    const [stats, setStats] = useState<AboutStats>({
        regions: 16,
        sellers: 0,
        orders: 0,
        products: 0,
        authenticity: 100
    });
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await ordersAPI.getPublicStats();
                if (response.data) {
                    setStats({
                        orders: response.data.orders_fulfilled || 0,
                        sellers: response.data.verified_vendors || 0,
                        products: response.data.total_products || 0,
                        regions: response.data.regions || 16,
                        authenticity: response.data.authenticity_rate || 100,
                    });
                }
                setIsLoaded(true);
            } catch (error) {
                console.error('Failed to fetch stats:', error);
                setIsLoaded(true); 
            }
        };
        fetchStats();
    }, []);

    const ghanaRegions = [
        "Greater Accra", "Ashanti", "Western", "Eastern", "Central",
        "Volta", "Northern", "Upper East", "Upper West", "Bono",
        "Bono East", "Ahafo", "Savannah", "North East", "Oti", "Western North"
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-200 selection:bg-slate-100 italic-selection:bg-emerald-100">
            
            {/* 1. INSTITUTIONAL HEADER & MISSION */}
            <section className="pt-40 pb-32 border-b border-slate-50 dark:border-slate-900">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-24">
                        <div className="flex items-center gap-4 mb-12">
                            <div className="h-px w-12 bg-slate-900 dark:bg-slate-100" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">Institutional Narrative / 01</span>
                        </div>
                        <h1 className="text-7xl md:text-9xl font-serif font-bold leading-[0.85] tracking-tighter text-slate-900 dark:text-white mb-12">
                            The Sourcing <br />
                            <span className="italic font-light text-slate-200 dark:text-slate-800 uppercase tracking-widest text-[0.4em] block mt-4">Legacy.</span>
                        </h1>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-24 items-start">
                        <div className="lg:col-span-7 space-y-12">
                            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white leading-tight tracking-tighter italic">Our Mission</h2>
                            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 leading-[1.8] font-medium max-w-2xl">
                                We believe that <span className="text-slate-900 dark:text-white border-b-2 border-slate-900 dark:border-white pb-1 italic">technology</span> has the potential to transform life in Ghana. Our architecture is designed to bridge the 12,000km gap between Chinese manufacturing excellence and Ghanaian retail demand.
                            </p>
                        </div>
                        <div className="lg:col-span-5 relative">
                             <div className="aspect-square relative grayscale border border-slate-900 overflow-hidden group">
                                <Image
                                    src="/assets/about/logistics-tech.png"
                                    alt="Logistics Technology"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                                />
                             </div>
                             <div className="absolute -bottom-6 -right-6 p-8 bg-slate-900 text-white hidden md:block">
                                  <span className="text-[9px] font-black uppercase tracking-[0.5em] block mb-2 opacity-50">Node Mapping</span>
                                  <p className="text-[10px] font-bold">16 Regional Expansion Protocols Active.</p>
                             </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. LEADERSHIP AUDIT (CE Profiles) */}
            <section className="py-32 border-b border-slate-50 dark:border-slate-900 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-24">
                        <div className="w-full lg:w-1/3 aspect-[4/5] h-[600px] relative border border-slate-900 grayscale">
                            <Image
                                src="/assets/about/ceo.png"
                                alt="Abagail - Founder & CEO"
                                fill
                                className="object-cover opacity-90"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-20" />
                            <div className="absolute bottom-12 left-12">
                                <h4 className="text-3xl font-serif font-bold text-white mb-2 leading-none">Abagail</h4>
                                <p className="text-[9px] text-white/60 uppercase font-black tracking-[0.5em]">Executive Director / Founder</p>
                            </div>
                        </div>
                        
                        <div className="w-full lg:w-2/3 space-y-12">
                            <div className="flex items-center gap-4 opacity-30 dark:opacity-10">
                                <div className="h-px w-10 bg-slate-900 dark:bg-white" />
                                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-900 dark:text-white">Leadership Strategy</span>
                            </div>
                            <h3 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 dark:text-white leading-[1.1] tracking-tighter italic">
                                &quot;We guide the direct sourcing corridor between factory floors and final delivery.&quot;
                            </h3>
                            
                            {/* Timeline Ledger */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-20 border-t border-slate-50 italic uppercase">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                                        <span className="text-[10px] font-black text-slate-300 tracking-widest">JAN. 2024</span>
                                        <Plus className="w-3 h-3 text-slate-200" strokeWidth={3} />
                                    </div>
                                    <p className="text-xs font-black text-slate-900 tracking-widest leading-relaxed">Foundation & Guangzhou (GZ) Sourcing Node Launch</p>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                                        <span className="text-[10px] font-black text-slate-300 tracking-widest">JUN. 2024</span>
                                        <Plus className="w-3 h-3 text-slate-200" strokeWidth={3} />
                                    </div>
                                    <p className="text-xs font-black text-slate-900 tracking-widest leading-relaxed">Integrated 16-Region Logistics Expansion Completed</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. OPERATING PILLARS (Verticals) */}
            <section className="py-32 border-b border-slate-50 dark:border-slate-900 bg-slate-50/30 dark:bg-slate-900/10">
                <div className="max-w-7xl mx-auto px-6">
                    <header className="mb-24 flex flex-col items-center text-center">
                        <span className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-400 dark:text-slate-500 mb-8">Operational Verticals</span>
                        <h2 className="text-5xl md:text-7xl font-serif font-bold text-slate-900 dark:text-white leading-none tracking-tighter">Strategic Impact</h2>
                    </header>

                    <div className="grid md:grid-cols-2 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
                        {/* Pillar 1: Consumers */}
                        <div className="bg-white dark:bg-slate-950 p-12 md:p-20 flex flex-col group">
                            <div className="aspect-video relative overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 mb-12">
                                <Image
                                    src="/assets/about/consumers.png"
                                    alt="Serving Consumers"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-1000 opacity-30 group-hover:opacity-100"
                                />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500 mb-6 block">Target Group 01</span>
                            <h3 className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-8 italic">Verified Retail Nodes</h3>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-[1.8] mb-12 max-w-sm">
                                Connecting individual consumers directly to factory-sealed international products with verified doorstep delivery protocols.
                            </p>
                            <Link href="/products" className="group/link inline-flex items-center gap-4 text-[11px] font-black text-slate-900 dark:text-white border-b border-black dark:border-white pb-2 self-start hover:opacity-60 transition-all uppercase tracking-[0.3em]">
                                Browse Inventory Index
                                <ArrowUpRight className="w-4 h-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                            </Link>
                        </div>
                        
                        {/* Pillar 2: Businesses */}
                        <div className="bg-white dark:bg-slate-950 p-12 md:p-20 flex flex-col group border-l border-slate-50 dark:border-slate-900">
                            <div className="aspect-video relative overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 mb-12">
                                <Image
                                    src="/assets/about/businesses.png"
                                    alt="Empowering Businesses"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-1000 opacity-30 group-hover:opacity-100"
                                />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500 mb-6 block">Target Group 02</span>
                            <h3 className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-8 italic">Enterprise Sourcing</h3>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-[1.8] mb-12 max-w-sm">
                                Providing Ghanaian retailers with integrated factory-direct sourcing lanes and scalable cross-border logistics infrastructures.
                            </p>
                            <Link href="/contact" className="group/link inline-flex items-center gap-4 text-[11px] font-black text-slate-900 dark:text-white border-b border-black dark:border-white pb-2 self-start hover:opacity-60 transition-all uppercase tracking-[0.3em]">
                                Wholesale Audit Inquiry
                                <ArrowUpRight className="w-4 h-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. STATISTICAL AUDIT (High-Contrast Digital Ledger) */}
            <section className="py-40 bg-slate-900 text-white overflow-hidden relative">
                <div className="absolute inset-0 opacity-10 grayscale blur-sm pointer-events-none">
                     <Image src="/banners/logistics-bg.png" alt="Logistics Background" fill className="object-cover" />
                </div>
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <header className="mb-32">
                         <div className="h-px w-10 bg-emerald-500 mx-auto mb-10" />
                         <span className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-500 mb-6 block">Statistical Audit Ledger</span>
                         <h2 className="text-4xl md:text-6xl font-serif font-bold italic tracking-tighter leading-none opacity-80 decoration-emerald-500/20 underline underline-offset-8">Institutional Scale</h2>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-24">
                        <div className="space-y-6">
                            <span className="text-xs font-black uppercase tracking-widest text-slate-500 block">Verified Regions</span>
                            <div className="text-8xl font-serif font-black tracking-tighter text-white tabular-nums border-b border-white/10 pb-8">{isLoaded ? stats.regions : '--'}</div>
                            <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest leading-relaxed italic">Strategic Reach 100%</p>
                        </div>
                        <div className="space-y-6">
                            <span className="text-xs font-black uppercase tracking-widest text-slate-500 block">Sourced Items</span>
                            <div className="text-8xl font-serif font-black tracking-tighter text-white tabular-nums border-b border-white/10 pb-8">{isLoaded ? stats.products + "+" : '--'}</div>
                            <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest leading-relaxed italic">Direct Factory Access</p>
                        </div>
                        <div className="space-y-6">
                            <span className="text-xs font-black uppercase tracking-widest text-slate-500 block">Fulfilled Orders</span>
                            <div className="text-8xl font-serif font-black tracking-tighter text-white tabular-nums border-b border-white/10 pb-8">{isLoaded ? (stats.orders >= 1000 ? (stats.orders / 1000).toFixed(1) + "k" : stats.orders) : '--'}</div>
                            <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest leading-relaxed italic">Verified Success Rate</p>
                        </div>
                        <div className="space-y-6">
                            <span className="text-xs font-black uppercase tracking-widest text-slate-500 block">Integrity Index</span>
                            <div className="text-8xl font-serif font-black tracking-tighter text-white tabular-nums border-b border-white/10 pb-8">{isLoaded ? stats.authenticity + "%" : '--'}</div>
                            <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest leading-relaxed italic">Authentic Guarantee</p>
                        </div>
                    </div>
                </div>
            </section>

             {/* 5. OPERATING HUBS (Institutional Linear Directory) */}
            <section className="py-32 border-b border-slate-50 dark:border-slate-900">
                <div className="max-w-7xl mx-auto px-6">
                    <header className="mb-24">
                        <div className="flex items-center gap-4 mb-8">
                             <div className="h-px w-10 bg-slate-900 dark:bg-white" />
                             <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">Institutional Hubs</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-serif font-bold text-slate-900 dark:text-white leading-none tracking-tighter italic">Global Infrastructure</h2>
                    </header>
                    
                    <div className="flex flex-col border-t border-slate-900 dark:border-slate-800">
                        {[
                            { name: "Guangzhou (GZ)", status: "China Node", role: "Primary Factory Sourcing Hub", code: "GZ-001" },
                            { name: "Accra (ACC)", status: "Ghana Node", role: "Institutional Operational HQ", code: "ACC-HQ" }
                        ].map((hub, idx) => (
                            <div key={idx} className="flex flex-col md:flex-row items-start md:items-center justify-between py-12 border-b border-slate-50 dark:border-slate-900 group hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors px-6">
                                <div className="flex items-center gap-12">
                                     <span className="text-sm font-black text-slate-200 dark:text-slate-800 uppercase tracking-tighter group-hover:text-slate-900 dark:group-hover:text-white transition-colors">0{idx+1}</span>
                                     <div>
                                         <h3 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 dark:text-white italic tracking-tighter">{hub.name}</h3>
                                         <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mt-2">{hub.status}</p>
                                     </div>
                                </div>
                                <div className="mt-8 md:mt-0 flex flex-col md:items-end">
                                     <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-2">{hub.role}</span>
                                     <span className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-300 dark:text-slate-700 italic group-hover:text-slate-900 dark:group-hover:text-white">{hub.code}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. REGIONAL DIRECTORY (Vertical Minimalist Index) */}
            <section className="py-32 bg-slate-900 text-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-12 gap-24">
                        <div className="lg:col-span-4 sticky top-32 h-fit">
                             <span className="text-[9px] font-black uppercase tracking-[0.5em] text-emerald-500 mb-8 block">Operational Scope</span>
                             <h2 className="text-5xl font-serif font-bold text-white mb-8 leading-none tracking-tighter">Regional <br /> Distribution Index.</h2>
                             <p className="text-xs font-medium text-slate-400 leading-relaxed max-w-xs italic border-l border-white/10 pl-8">
                                Institutional distribution protocols active in all 16 districts of the Ghanaian republic. 
                                High-performance logistics guaranteed across every node.
                             </p>
                        </div>
                        <div className="lg:col-span-8 flex flex-col border-t border-white/10">
                            {ghanaRegions.map((region, idx) => (
                                <div key={idx} className="flex items-center justify-between py-6 border-b border-white/10 group hover:px-6 transition-all duration-500">
                                     <div className="flex items-center gap-8">
                                         <span className="text-[10px] font-black text-white/20 group-hover:text-emerald-500">{String(idx+1).padStart(2, '0')}</span>
                                         <span className="text-sm font-black uppercase tracking-widest text-slate-400 group-hover:text-white">{region}</span>
                                     </div>
                                     <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                          <div className="h-px w-12 bg-white/20" />
                                          <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500 italic">Verified Node</span>
                                     </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. INSTITUTIONAL DNA (Core Values) */}
            <section className="py-32 bg-white dark:bg-slate-950 flex flex-col md:flex-row items-start justify-between max-w-7xl mx-auto px-6 gap-24 font-sans">
                <div className="max-w-xs">
                     <span className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-400 dark:text-slate-500 mb-8 block italic">Strategic Philosophy</span>
                     <h2 className="text-4xl font-serif font-bold text-slate-900 dark:text-white leading-none tracking-tighter italic">Operational Institutional DNA.</h2>
                </div>
                <div className="grid md:grid-cols-3 gap-16 lg:col-span-9 flex-1">
                    <div className="space-y-4">
                        <Zap className="w-8 h-8 text-slate-900 dark:text-white" strokeWidth={1} />
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 dark:text-white">Sourcing Index / Speed</h4>
                        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-relaxed italic">Fastest verified lead times from GZ factory floors to Accra distribution hubs.</p>
                    </div>
                    <div className="space-y-4">
                        <ShieldCheck className="w-8 h-8 text-slate-900 dark:text-white" strokeWidth={1} />
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 dark:text-white">Absolute Integrity Audit</h4>
                        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-relaxed italic">100% authenticity guarantee verified by statutory institutional protocols.</p>
                    </div>
                    <div className="space-y-4">
                        <Briefcase className="w-8 h-8 text-slate-900 dark:text-white" strokeWidth={1} />
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 dark:text-white">Enterprise Empowerment</h4>
                        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-relaxed italic">Empowering local SMEs to scale with factory-direct global inventory access.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
