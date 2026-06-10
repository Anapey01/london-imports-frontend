'use client';

import React, { useState, useEffect } from 'react';
import {
    ArrowUpRight,
    ShieldCheck,
    Zap,
    Briefcase,
    Plus
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ordersAPI, productsAPI } from '@/lib/api';

interface AboutStats {
    regions: number;
    sellers: number;
    orders: number;
    products: number;
    authenticity: number;
}

interface DeliveryPhoto {
    id: string;
    image: string;
    caption: string;
    category: string;
    order: number;
    is_active: boolean;
    created_at: string;
}

export default function AboutPageContent() {
    const [stats, setStats] = useState<AboutStats>({
        regions: 16,
        sellers: 0,
        orders: 0,
        products: 0,
        authenticity: 100
    });
    const [activeTab, setActiveTab] = useState<'ALL' | 'TEAM' | 'OFFICE' | 'WAREHOUSE' | 'PACKAGING' | 'PICKUP'>('ALL');
    const [operationalPhotos, setOperationalPhotos] = useState<DeliveryPhoto[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const fetchStatsAndPhotos = async () => {
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
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            }

            try {
                const response = await productsAPI.deliveryPhotos();
                const allPhotos = response.data.results || response.data || [];
                // Filter out 'DELIVERY' category since that goes on the homepage
                const opPhotos = allPhotos.filter((p: any) => p.category !== 'DELIVERY');
                setOperationalPhotos(opPhotos);
            } catch (error) {
                console.error('Failed to fetch operational photos:', error);
            }

            setIsLoaded(true);
        };
        fetchStatsAndPhotos();
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
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">Our Story / 01</span>
                        </div>
                        <h1 className="text-7xl md:text-9xl font-serif font-bold leading-[0.85] tracking-tighter text-slate-900 dark:text-white mb-12">
                            The Import <br />
                            <span className="italic font-light text-slate-200 dark:text-slate-800 uppercase tracking-widest text-[0.4em] block mt-4">Our Story.</span>
                        </h1>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-24 items-start">
                        <div className="lg:col-span-7 space-y-12">
                            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white leading-tight tracking-tighter italic">Our Mission</h2>
                            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 leading-[1.8] font-medium max-w-2xl">
                                We believe that <span className="text-slate-900 dark:text-white border-b-2 border-slate-900 dark:border-white pb-1 italic">technology</span> has the potential to transform life in Ghana. Our system is designed to bridge the 12,000km gap between Chinese manufacturing excellence and Ghanaian retail demand.
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
                                  <span className="text-[9px] font-black uppercase tracking-[0.5em] block mb-2 opacity-50">Shipping Status</span>
                                  <p className="text-[10px] font-bold">Delivery coverage active in all regions.</p>
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
                                alt="Miss London - Founder & CEO"
                                fill
                                className="object-cover opacity-90"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-20" />
                            <div className="absolute bottom-12 left-12">
                                <h4 className="text-3xl font-serif font-bold text-white mb-2 leading-none">Miss London</h4>
                                <p className="text-[9px] text-white/60 uppercase font-black tracking-[0.5em]">Executive Director / Founder</p>
                            </div>
                        </div>
                        
                        <div className="w-full lg:w-2/3 space-y-12">
                            <div className="flex items-center gap-4 opacity-30 dark:opacity-10">
                                <div className="h-px w-10 bg-slate-900 dark:bg-white" />
                                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-900 dark:text-white">Our Values</span>
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
                                    <p className="text-xs font-black text-slate-900 tracking-widest leading-relaxed">Foundation & China Warehouse Launch</p>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                                        <span className="text-[10px] font-black text-slate-300 tracking-widest">JUN. 2024</span>
                                        <Plus className="w-3 h-3 text-slate-200" strokeWidth={3} />
                                    </div>
                                    <p className="text-xs font-black text-slate-900 tracking-widest leading-relaxed">Full National Delivery Expansion Completed</p>
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
                        <span className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-400 dark:text-slate-500 mb-8">Our Focus</span>
                        <h2 className="text-5xl md:text-7xl font-serif font-bold text-slate-900 dark:text-white leading-none tracking-tighter">Our Impact</h2>
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
                            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500 mb-6 block">For Customers</span>
                            <h3 className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-8 italic">Premium Shopping</h3>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-[1.8] mb-12 max-w-sm">
                                Connecting you directly to genuine international products with safe doorstep delivery.
                            </p>
                            <Link href="/products" className="group/link inline-flex items-center gap-4 text-[11px] font-black text-slate-900 dark:text-white border-b border-black dark:border-white pb-2 self-start hover:opacity-60 transition-all uppercase tracking-[0.3em]">
                                Shop Products
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
                            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500 mb-6 block">For Businesses</span>
                            <h3 className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-8 italic">Wholesale Orders</h3>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-[1.8] mb-12 max-w-sm">
                                Providing Ghanaian retailers with direct factory shipping and reliable logistics.
                            </p>
                            <Link href="/contact" className="group/link inline-flex items-center gap-4 text-[11px] font-black text-slate-900 dark:text-white border-b border-black dark:border-white pb-2 self-start hover:opacity-60 transition-all uppercase tracking-[0.3em]">
                                Wholesale Inquiry
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
                         <span className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-500 mb-6 block">Our Impact</span>
                         <h2 className="text-4xl md:text-6xl font-serif font-bold italic tracking-tighter leading-none opacity-80 decoration-emerald-500/20 underline underline-offset-8">Growing Impact</h2>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-24">
                        <div className="space-y-6">
                            <span className="text-xs font-black uppercase tracking-widest text-slate-500 block">Regions Covered</span>
                            <div className="text-8xl font-serif font-black tracking-tighter text-white tabular-nums border-b border-white/10 pb-8">{isLoaded ? stats.regions : '--'}</div>
                            <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest leading-relaxed italic">Total Coverage 100%</p>
                        </div>
                        <div className="space-y-6">
                            <span className="text-xs font-black uppercase tracking-widest text-slate-500 block">Products Found</span>
                            <div className="text-8xl font-serif font-black tracking-tighter text-white tabular-nums border-b border-white/10 pb-8">{isLoaded ? stats.products + "+" : '--'}</div>
                            <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest leading-relaxed italic">Direct Factory Access</p>
                        </div>
                        <div className="space-y-6">
                            <span className="text-xs font-black uppercase tracking-widest text-slate-500 block">Orders Delivered</span>
                            <div className="text-8xl font-serif font-black tracking-tighter text-white tabular-nums border-b border-white/10 pb-8">{isLoaded ? (stats.orders >= 1000 ? (stats.orders / 1000).toFixed(1) + "k" : stats.orders) : '--'}</div>
                            <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest leading-relaxed italic">Verified Success Rate</p>
                        </div>
                        <div className="space-y-6">
                            <span className="text-xs font-black uppercase tracking-widest text-slate-500 block">Trust Score</span>
                            <div className="text-8xl font-serif font-black tracking-tighter text-white tabular-nums border-b border-white/10 pb-8">{isLoaded ? stats.authenticity + "%" : '--'}</div>
                            <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest leading-relaxed italic">Quality Guarantee</p>
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
                             <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">Our Locations</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-serif font-bold text-slate-900 dark:text-white leading-none tracking-tighter italic">Global Presence</h2>
                    </header>
                    
                    <div className="flex flex-col border-t border-slate-900 dark:border-slate-800">
                        {[
                            { name: "Guangzhou (GZ)", status: "China Office", role: "Main Shipping Center", code: "GZ-001" },
                            { name: "Accra (ACC)", status: "Ghana Office", role: "Headquarters", code: "ACC-HQ" }
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

            {/* 5.5 OPERATIONAL GALLERY (Behind the Scenes Proof) */}
            <section className="py-32 border-b border-slate-50 dark:border-slate-900 bg-slate-50/10 dark:bg-slate-900/5">
                <div className="max-w-7xl mx-auto px-6">
                    <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-px w-10 bg-slate-900 dark:bg-white" />
                                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">Operational Evidence</span>
                            </div>
                            <h2 className="text-5xl font-serif font-bold text-slate-900 dark:text-white leading-none tracking-tighter italic">Behind The Scenes</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed mt-4 max-w-xl">
                                Real business presence. See our active team, sorting offices, warehouse operations, packaging processes, and client pickups in real time.
                            </p>
                        </div>
                    </header>

                    {/* Tab Selectors */}
                    <div className="flex flex-wrap gap-3 mb-12 border-b border-slate-50 dark:border-slate-900 pb-6">
                        {[
                            { key: 'ALL', label: 'All Operations' },
                            { key: 'TEAM', label: 'Our Team' },
                            { key: 'OFFICE', label: 'Our Office' },
                            { key: 'WAREHOUSE', label: 'Warehouses' },
                            { key: 'PACKAGING', label: 'Packaging' },
                            { key: 'PICKUP', label: 'Client Pickups' }
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key as any)}
                                className={`px-5 py-2.5 text-[9px] font-black uppercase tracking-[0.2em] transition-all border ${
                                    activeTab === tab.key
                                        ? 'bg-slate-950 text-white border-slate-950'
                                        : 'bg-transparent text-slate-400 hover:text-slate-900 dark:hover:text-white border-slate-100 dark:border-slate-800'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Gallery Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Filtered Photos */}
                        {operationalPhotos.filter(p => activeTab === 'ALL' ? true : p.category === activeTab).map((photo) => (
                            <div key={photo.id} className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col justify-between group">
                                <div className="aspect-[4/3] relative w-full bg-slate-50 dark:bg-slate-900 overflow-hidden">
                                    <Image
                                        src={photo.image}
                                        alt={photo.caption || 'Operational photo'}
                                        fill
                                        className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                                    />
                                    <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 text-[8px] font-mono text-white tracking-widest uppercase">
                                        {photo.category === 'TEAM' ? 'OUR TEAM' :
                                         photo.category === 'OFFICE' ? 'OUR OFFICE' :
                                         photo.category === 'WAREHOUSE' ? 'OUR WAREHOUSE' :
                                         photo.category === 'PACKAGING' ? 'PACKAGING OP' :
                                         photo.category === 'PICKUP' ? 'CUSTOMER PICKUP' : photo.category}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <p className="text-[11px] font-black uppercase tracking-wider text-slate-900 dark:text-slate-100 line-clamp-2">
                                        {photo.caption || "London's Imports Operations"}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {/* Fallback Cards when category is empty */}
                        {operationalPhotos.filter(p => activeTab === 'ALL' ? true : p.category === activeTab).length === 0 && (
                            <div className="col-span-full py-20 text-center border border-dashed border-slate-100 dark:border-slate-800 px-6">
                                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">No Active Photos Uploaded Yet</p>
                                <p className="text-[10px] text-slate-300 font-bold uppercase tracking-tight mb-8">
                                    Real operational photos are dynamically updated by the admin team via the management panel.
                                </p>
                                <div className="max-w-md mx-auto grid grid-cols-1 gap-4">
                                    {activeTab !== 'ALL' && (
                                        <div className="bg-slate-50 dark:bg-slate-900/50 p-8 border border-slate-100 dark:border-slate-800 text-left space-y-4">
                                            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                                                {activeTab === 'TEAM' && '1. Sourcing & Support Team'}
                                                {activeTab === 'OFFICE' && '2. Sourcing Office'}
                                                {activeTab === 'WAREHOUSE' && '3. Consolidation Warehouse'}
                                                {activeTab === 'PACKAGING' && '4. Neutral Packaging & Quality Check'}
                                                {activeTab === 'PICKUP' && '5. Customer Pickup Hub'}
                                            </h4>
                                            <p className="text-xs text-slate-500 leading-relaxed">
                                                {activeTab === 'TEAM' && 'Our team consists of dedicated logistics managers and support coordinators based at our Danfa Headquarters and Guangzhou hub, directing weekly shipments.'}
                                                {activeTab === 'OFFICE' && 'Our office in Danfa, Accra, serves as the central hub for local delivery coordination, tracking updates, and manual order assistance.'}
                                                {activeTab === 'WAREHOUSE' && 'We process and consolidate goods at our secure Guangzhou facilities, checking dimensions and tracking IDs to calculate final shipping costs.'}
                                                {activeTab === 'PACKAGING' && 'Every package undergoes quality checks and is wrapped in neutral, high-durability packaging to shield it from cargo handling.'}
                                                {activeTab === 'PICKUP' && 'Customers are welcome to visit our Danfa outlet for manual pickups, saving on local shipping couriers.'}
                                            </p>
                                        </div>
                                    )}
                                    {activeTab === 'ALL' && (
                                        <div className="text-[10px] font-mono text-slate-300 dark:text-slate-700">
                                            ADD PHOTOS VIA [ADMIN DASHBOARD &gt; GALLERY] TO POPULATE THIS VIEW
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* 6. BUSINESS TRANSPARENCY (Corporate Ledger) */}
            <section className="py-32 border-b border-slate-50 dark:border-slate-900">
                <div className="max-w-7xl mx-auto px-6">
                    <header className="mb-24">
                        <div className="flex items-center gap-4 mb-8">
                             <div className="h-px w-10 bg-slate-900 dark:bg-white" />
                             <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">Corporate Registry</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-serif font-bold text-slate-900 dark:text-white leading-none tracking-tighter italic">Business Transparency</h2>
                    </header>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 border-t border-slate-900 dark:border-slate-800 pt-16">
                        {/* Column 1: Registered Name */}
                        <div className="space-y-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 block">Registered Entity</span>
                            <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white italic">NAA ATSWEI ENTERPRISE</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                Officially registered under the Registration of Business Names Act, 1962 (No. 151) of the Republic of Ghana.
                            </p>
                        </div>
                        
                        {/* Column 2: Registry Ledger */}
                        <div className="space-y-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 block">Registry details</span>
                            <div className="space-y-2">
                                <p className="text-xs font-black text-slate-900 dark:text-white tracking-widest uppercase">
                                    REG. NO: <span className="font-mono font-medium text-slate-600 dark:text-slate-400 ml-2">BN516170426</span>
                                </p>
                                <p className="text-xs font-black text-slate-900 dark:text-white tracking-widest uppercase">
                                    TIN: <span className="font-mono font-medium text-slate-600 dark:text-slate-400 ml-2">P0067185401</span>
                                </p>
                                <p className="text-xs font-black text-slate-900 dark:text-white tracking-widest uppercase">
                                    ESTABLISHED: <span className="font-mono font-medium text-slate-600 dark:text-slate-400 ml-2">2024 (Registered 2026)</span>
                                </p>
                            </div>
                        </div>

                        {/* Column 3: Contact & Support */}
                        <div className="space-y-4 md:col-span-2 lg:col-span-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 block">Contact & Support</span>
                            <div className="space-y-4 text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                                <div>
                                    <strong className="text-slate-900 dark:text-white tracking-widest uppercase text-[10px] block mb-1">Office Headquarters</strong>
                                    <span>Danfa Road near Twinkle Angle School, Danfa, Accra, Ghana</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <strong className="text-slate-900 dark:text-white tracking-widest uppercase text-[10px] block mb-1">Email Support</strong>
                                        <a href="mailto:info@londonsimports.com" className="hover:text-slate-900 dark:hover:text-white transition-colors">info@londonsimports.com</a>
                                    </div>
                                    <div>
                                        <strong className="text-slate-900 dark:text-white tracking-widest uppercase text-[10px] block mb-1">Phone / WhatsApp</strong>
                                        <a href="tel:+233545247009" className="hover:text-slate-900 dark:hover:text-white transition-colors">+233 54 524 7009</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. REGIONAL DIRECTORY (Vertical Minimalist Index) */}
            <section className="py-32 bg-slate-900 text-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-12 gap-24">
                        <div className="lg:col-span-4 sticky top-32 h-fit">
                             <span className="text-[9px] font-black uppercase tracking-[0.5em] text-emerald-500 mb-8 block">Coverage</span>
                             <h2 className="text-5xl font-serif font-bold text-white mb-8 leading-none tracking-tighter">Where we <br /> deliver.</h2>
                             <p className="text-xs font-medium text-slate-400 leading-relaxed max-w-xs italic border-l border-white/10 pl-8">
                                Delivery coverage active in all 16 regions of Ghana. 
                                Safe shipping guaranteed across the country.
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
                                          <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500 italic">Delivery Area</span>
                                     </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* OUR VALUES */}
            <section className="py-32 bg-white dark:bg-slate-950 flex flex-col md:flex-row items-start justify-between max-w-7xl mx-auto px-6 gap-24 font-sans">
                <div className="max-w-xs">
                     <span className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-400 dark:text-slate-500 mb-8 block italic">Our Approach</span>
                     <h2 className="text-4xl font-serif font-bold text-slate-900 dark:text-white leading-none tracking-tighter italic">What makes us different.</h2>
                </div>
                <div className="grid md:grid-cols-3 gap-16 lg:col-span-9 flex-1">
                    <div className="space-y-4">
                        <Zap className="w-8 h-8 text-slate-900 dark:text-white" strokeWidth={1} />
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 dark:text-white">Shipping Speed</h4>
                        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-relaxed italic">Fastest shipping times from China to our Ghana distribution centers.</p>
                    </div>
                    <div className="space-y-4">
                        <ShieldCheck className="w-8 h-8 text-slate-900 dark:text-white" strokeWidth={1} />
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 dark:text-white">Quality Guarantee</h4>
                        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-relaxed italic">100% authenticity guarantee verified by our quality standards.</p>
                    </div>
                    <div className="space-y-4">
                        <Briefcase className="w-8 h-8 text-slate-900 dark:text-white" strokeWidth={1} />
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 dark:text-white">Business Support</h4>
                        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-relaxed italic">Empowering local shops to grow with direct factory prices.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
