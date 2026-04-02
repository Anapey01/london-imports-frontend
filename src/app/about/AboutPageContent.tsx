'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Globe,
    ArrowRight,
    ShieldCheck,
    Zap,
    MapPin,
    Star,
    Briefcase
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
                    console.log('About stats fetched successfully:', response.data);
                }
                setIsLoaded(true);
            } catch (error) {
                console.error('Failed to fetch stats:', error);
                setIsLoaded(true); // Still trigger animations with fallback
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
        <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-slate-100 selection:text-slate-950">
            {/* 1. Welcome & Mission */}
            <section className="pt-24 pb-20 max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="w-10 h-0.5 bg-slate-950 mx-auto mb-6"
                    />
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-4xl font-bold text-slate-950 leading-tight uppercase tracking-[0.3em]"
                    >
                        Our Story
                    </motion.h1>
                </div>

                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} className="space-y-8">
                        <h2 className="text-4xl md:text-5xl font-light text-slate-950 leading-tight tracking-tight uppercase">Our mission</h2>
                        <p className="text-lg md:text-xl text-slate-500 leading-relaxed font-light">
                            We believe that <span className="text-slate-950 font-medium">technology</span> has the potential to transform life in <span className="font-bold text-slate-950 uppercase tracking-widest text-sm">Ghana</span>. We get premium stuff from <span className="text-slate-950 underline decoration-slate-200 decoration-4 underline-offset-8">China</span> and make it available in every corner of the country.
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="relative rounded-[2rem] overflow-hidden shadow-2xl h-[400px] border border-slate-100"
                    >
                        <Image
                            src="/assets/about/logistics-tech.png"
                            alt="Logistics Technology"
                            fill
                            className="object-cover"
                        />
                    </motion.div>
                </div>
            </section>

            {/* 2. Leadership Spotlight */}
            <section className="py-20 bg-slate-50 border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="w-full lg:w-1/3 aspect-[4/5] rounded-[2rem] overflow-hidden shadow-xl border-8 border-white bg-slate-100 relative group"
                        >
                            <Image
                                src="/assets/about/ceo.png"
                                alt="Abagail - Founder & CEO"
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10" />
                            <div className="absolute bottom-6 left-6 z-20 text-white">
                                <h4 className="text-xl font-bold">Abagail</h4>
                                <p className="text-white/70 text-[10px] uppercase font-bold tracking-widest">Founder & CEO</p>
                            </div>
                        </motion.div>
                        <div className="w-full lg:w-2/3 space-y-6">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 bg-slate-950 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
                            >
                                <Star className="w-3 h-3" /> Leadership
                            </motion.div>
                            <motion.h3
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-2xl md:text-3xl font-light text-slate-950 tracking-tight"
                            >
                                &quot;Our goal is to create a seamless link between global manufacturing and local demand.&quot;
                            </motion.h3>
                            {/* Timeline Snippet */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-200"
                            >
                                <div className="space-y-1">
                                    <div className="text-slate-950 font-black text-xs uppercase tracking-widest">JAN 2024</div>
                                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Foundation & China Hub Launch</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-slate-950 font-black text-xs uppercase tracking-widest">JUNE 2024</div>
                                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Expansion to 16 Regions</div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Verticals */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="w-10 h-0.5 bg-slate-950 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold mb-16 text-slate-950 uppercase tracking-[0.3em]">Verticals</h2>
                    <div className="grid md:grid-cols-2 gap-10">
                        {/* Pillar 1 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 text-left group"
                        >
                            <div className="h-56 relative overflow-hidden">
                                <Image
                                    src="/assets/about/consumers.png"
                                    alt="Serving Consumers"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-slate-950/10 group-hover:bg-transparent transition-colors" />
                            </div>
                            <div className="p-8 space-y-4">
                                <h3 className="text-2xl font-light text-slate-950 uppercase tracking-tight">Serving Consumers</h3>
                                <p className="text-slate-500 text-sm leading-relaxed font-light">Connecting individuals to high-quality international products with doorstep delivery.</p>
                                <Link href="/products" className="inline-flex items-center gap-2 text-[10px] font-bold text-slate-950 border-b border-slate-900 pb-0.5 transition-all uppercase tracking-widest">Shop Collection <ArrowRight className="w-3.5 h-3.5" /></Link>
                            </div>
                        </motion.div>
                        {/* Pillar 2 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 text-left group"
                        >
                            <div className="h-56 relative overflow-hidden">
                                <Image
                                    src="/assets/about/businesses.png"
                                    alt="Empowering Businesses"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-slate-950/10 group-hover:bg-transparent transition-colors" />
                            </div>
                            <div className="p-8 space-y-4">
                                <h3 className="text-2xl font-light text-slate-950 uppercase tracking-tight">Enterprise Sourcing</h3>
                                <p className="text-slate-500 text-sm leading-relaxed font-light">Providing retailers with factory-direct sourcing and scaling logistics.</p>
                                <Link href="/contact" className="inline-flex items-center gap-2 text-[10px] font-bold text-slate-950 border-b border-slate-900 pb-0.5 transition-all uppercase tracking-widest">Inquire Wholesale <ArrowRight className="w-3.5 h-3.5" /></Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 4. Key Figures */}
            <section className="relative py-32 bg-gray-900 text-white text-center overflow-hidden">
                <div className="absolute inset-0 z-0 select-none pointer-events-none">
                    <Image
                        src="/banners/logistics-bg.png"
                        alt="Logistics Background"
                        fill
                        className="object-cover opacity-30 grayscale blur-[2px]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900/40 to-gray-900 z-10" />
                    <div className="absolute inset-0 flex items-center justify-center font-black text-white/[0.03] text-[18vw] uppercase italic leading-none z-0">
                        GLOBAL
                    </div>
                </div>

                 <div className="max-w-7xl mx-auto px-6 relative z-20">
                    <div className="w-10 h-0.5 bg-green-600 mx-auto mb-10" />
                    <h2 className="text-2xl font-bold text-white uppercase tracking-[0.4em] mb-16 opacity-80">Empowerment in numbers</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-16">
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                            <div className="text-6xl font-black text-white mb-2 tabular-nums">{isLoaded ? stats.regions : '..'}</div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-green-500">Regions Covered</div>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                            <div className="text-6xl font-black text-white mb-2 tabular-nums">{isLoaded ? stats.products + "+" : '..'}</div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-green-500">Sourced Products</div>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                            <div className="text-6xl font-black text-white mb-2 tabular-nums">{isLoaded ? (stats.orders >= 1000 ? (stats.orders / 1000).toFixed(1) + "k+" : stats.orders) : '..'}</div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-green-500">Orders</div>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                            <div className="text-6xl font-black text-white mb-2">{isLoaded ? stats.authenticity + "%" : '..'}</div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-green-500">Authenticity Rate</div>
                        </motion.div>
                    </div>
                </div>
            </section>

             {/* 5. Operating Units */}
            <section className="py-24 bg-white text-center">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="w-10 h-0.5 bg-slate-950 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold mb-16 uppercase tracking-[0.2em] text-slate-950">Operating Units</h2>
                    <div className="flex flex-wrap justify-center gap-8">
                        {[
                            { name: "China (GZ)", color: "bg-red-600", icon: "🇨🇳", label: "Sourcing" },
                            { name: "Ghana (ACC)", color: "bg-green-600", icon: "🇬🇭", label: "HQ" }
                        ].map((loc, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className="w-72 bg-white shadow-sm hover:shadow-xl rounded-[1.5rem] overflow-hidden group transition-all border border-slate-100"
                            >
                                <div className={`${loc.color} h-36 flex items-center justify-center relative transition-transform group-hover:scale-105 duration-500`}>
                                    <h3 className="text-xl font-black text-white uppercase tracking-tight">{loc.name}</h3>
                                    <div className="absolute top-2 right-4 text-3xl opacity-20">{loc.icon}</div>
                                </div>
                                <div className="h-40 bg-[#fdfdfd] flex flex-col items-center justify-center p-6 grayscale group-hover:grayscale-0 transition-opacity">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center border border-gray-200 mb-2">
                                        <Globe className="w-6 h-6 text-gray-300 group-hover:text-green-600" />
                                    </div>
                                    <p className="text-[10px] font-black uppercase text-gray-400 group-hover:text-slate-950 tracking-widest">{loc.label}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. Logistics Hubs */}
            <section className="py-24 bg-gray-900 text-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-2xl font-bold uppercase tracking-[0.4em] text-green-600 mb-4"
                        >
                            Logistics Hubs
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-slate-400 max-w-2xl mx-auto text-[10px] uppercase tracking-widest leading-relaxed"
                        >
                            We deliver authentic electronics and lifestyle products to all 16 regions of Ghana with guaranteed safety.
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {ghanaRegions.map((region, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ scale: 1.05 }}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: (idx % 4) * 0.1 }}
                                className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-green-600/20 hover:border-green-600/50 transition-all cursor-default group"
                            >
                                <MapPin className="w-4 h-4 text-green-600 group-hover:scale-125 transition-transform" />
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-400 group-hover:text-white">{region}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. Corporate DNA / Values */}
            <section className="py-24 bg-white border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="space-y-3">
                        <Zap className="w-8 h-8 text-green-600 mx-auto" strokeWidth={1} />
                        <h4 className="font-bold text-[10px] uppercase tracking-widest">Sourcing Speed</h4>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest leading-relaxed">Fastest lead times from Guangzhou factories.</p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-3">
                        <ShieldCheck className="w-8 h-8 text-green-600 mx-auto" strokeWidth={1} />
                        <h4 className="font-bold text-[10px] uppercase tracking-widest">Absolute Integrity</h4>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest leading-relaxed">100% authenticity or money back guarantee.</p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-3">
                        <Briefcase className="w-8 h-8 text-green-600 mx-auto" strokeWidth={1} />
                        <h4 className="font-bold text-[10px] uppercase tracking-widest">Local Empowerment</h4>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest leading-relaxed">Helping local SMEs scale with global inventory.</p>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
