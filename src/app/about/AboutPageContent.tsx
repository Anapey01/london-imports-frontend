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
import { api } from '@/lib/api';

interface AboutStats {
    regions: number;
    sellers: number;
    orders: number;
    authenticity: number;
}

export default function AboutPageContent() {
    const [stats, setStats] = useState<AboutStats>({
        regions: 16,
        sellers: 120,
        orders: 22,
        authenticity: 100
    });
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/orders/stats/');
                if (response.data) {
                    setStats({
                        orders: response.data.orders_fulfilled || 0,
                        sellers: response.data.verified_vendors || 0,
                        regions: response.data.regions || 16,
                        authenticity: response.data.authenticity_rate || 100,
                    });
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
        <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-orange-100 selection:text-orange-600">
            {/* 1. Welcome & Mission */}
            <section className="pt-20 pb-20 max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="w-10 h-1 bg-orange-600 mx-auto mb-6"
                    />
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight"
                    >
                        Welcome to London&apos;s Imports
                    </motion.h1>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} className="space-y-8">
                        <h2 className="text-5xl md:text-6xl font-bold text-orange-600 leading-tight tracking-tight">Our mission</h2>
                        <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-medium">
                            We believe that <span className="text-orange-600 font-bold underline decoration-orange-200 decoration-4 underline-offset-8">technology</span> has the potential to transform life in <span className="font-bold text-slate-900">Ghana</span>. We get premium stuff from China and make it available in every corner of the country.
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="relative rounded-[2rem] overflow-hidden shadow-2xl h-[400px] border border-orange-100"
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
                                alt="Abena Serwaa - Founder & CEO"
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10" />
                            <div className="absolute bottom-6 left-6 z-20 text-white">
                                <h4 className="text-xl font-bold">Abena Serwaa</h4>
                                <p className="text-orange-400 text-[10px] uppercase font-black">Founder & CEO</p>
                            </div>
                        </motion.div>
                        <div className="w-full lg:w-2/3 space-y-6">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
                            >
                                <Star className="w-3 h-3" /> Leadership
                            </motion.div>
                            <motion.h3
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-3xl font-bold text-gray-900 italic"
                            >
                                &quot;Our goal is to create a seamless link between global manufacturing and local demand.&quot;
                            </motion.h3>
                            {/* Timeline Snippet */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200"
                            >
                                <div className="space-y-1">
                                    <div className="text-orange-600 font-black text-xs">JAN 2024</div>
                                    <div className="text-[10px] text-gray-500 uppercase font-bold">Foundation & China Hub Launch</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-orange-600 font-black text-xs">JUNE 2024</div>
                                    <div className="text-[10px] text-gray-500 uppercase font-bold">Expansion to 16 Regions</div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Two Pillars */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="w-10 h-1 bg-orange-600 mx-auto mb-6" />
                    <h2 className="text-4xl font-bold mb-16 text-gray-900 italic">What we do</h2>
                    <div className="grid md:grid-cols-2 gap-10">
                        {/* Pillar 1 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 text-left group"
                        >
                            <div className="h-56 relative overflow-hidden">
                                <Image
                                    src="/assets/about/consumers.png"
                                    alt="Serving Consumers"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-orange-600/10 group-hover:bg-transparent transition-colors" />
                            </div>
                            <div className="p-8 space-y-4">
                                <h3 className="text-2xl font-bold text-gray-900">Serving Consumers</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">Connecting individuals to high-quality international products with doorstep delivery.</p>
                                <a href="#" className="inline-flex items-center gap-2 text-sm font-bold text-orange-600 transition-all">Discover more <ArrowRight className="w-4 h-4" /></a>
                            </div>
                        </motion.div>
                        {/* Pillar 2 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 text-left group"
                        >
                            <div className="h-56 relative overflow-hidden">
                                <Image
                                    src="/assets/about/businesses.png"
                                    alt="Empowering Businesses"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors" />
                            </div>
                            <div className="p-8 space-y-4">
                                <h3 className="text-2xl font-bold text-gray-900">Empowering Businesses</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">Providing retailers with factory-direct sourcing and scaling logistics.</p>
                                <a href="#" className="inline-flex items-center gap-2 text-sm font-bold text-orange-600 transition-all">Partner with us <ArrowRight className="w-4 h-4" /></a>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 4. Key Figures */}
            <section className="relative py-32 bg-gray-900 text-white text-center overflow-hidden">
                {/* Jumia-style Background Image / Overlay */}
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
                    <div className="w-10 h-1 bg-orange-600 mx-auto mb-10" />
                    <h2 className="text-3xl font-bold text-white uppercase tracking-[0.3em] mb-16 italic font-serif opacity-80">Empowerment in numbers</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-16">
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                            <div className="text-6xl font-black text-orange-600 mb-2 tabular-nums">{isLoaded ? stats.regions : '..'}</div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Regions Covered</div>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                            <div className="text-6xl font-black text-orange-600 mb-2 tabular-nums">{isLoaded ? stats.sellers + "+" : '..'}</div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Verified Suppliers</div>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                            <div className="text-6xl font-black text-orange-600 mb-2 tabular-nums">{isLoaded ? (stats.orders >= 1000 ? (stats.orders / 1000).toFixed(1) + "k+" : stats.orders) : '..'}</div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Deliveries</div>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                            <div className="text-6xl font-black text-orange-600 mb-2">{isLoaded ? stats.authenticity + "%" : '..'}</div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Authenticity Rate</div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 5. Operating Units */}
            <section className="py-24 bg-white text-center">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="w-10 h-1 bg-orange-600 mx-auto mb-6" />
                    <h2 className="text-4xl font-bold mb-16 italic uppercase tracking-tighter">Operating Units</h2>
                    <div className="flex flex-wrap justify-center gap-8">
                        {[
                            { name: "China (GZ)", color: "bg-red-600", icon: "🇨🇳", label: "Sourcing" },
                            { name: "Ghana (ACC)", color: "bg-purple-600", icon: "🇬🇭", label: "HQ" }
                        ].map((loc, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className="w-72 bg-white shadow-xl rounded-[1.5rem] overflow-hidden group hover:shadow-2xl transition-all"
                            >
                                <div className={`${loc.color} h-36 flex items-center justify-center relative transition-transform group-hover:scale-105 duration-500`}>
                                    <h3 className="text-xl font-black text-white uppercase tracking-tight">{loc.name}</h3>
                                    <div className="absolute top-2 right-4 text-3xl opacity-20">{loc.icon}</div>
                                </div>
                                <div className="h-40 bg-[#fdfdfd] flex flex-col items-center justify-center p-6 grayscale group-hover:grayscale-0 transition-opacity">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center border border-gray-200 mb-2">
                                        <Globe className="w-6 h-6 text-gray-300 group-hover:text-orange-500" />
                                    </div>
                                    <p className="text-[10px] font-black uppercase text-gray-400 group-hover:text-gray-600">{loc.label}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. Regional Presence */}
            <section className="py-24 bg-gray-900 text-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-3xl font-black uppercase tracking-widest text-orange-600 mb-4 italic"
                        >
                            Regional Presence
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-gray-400 max-w-2xl mx-auto text-sm"
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
                                className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-orange-600/20 hover:border-orange-600/50 transition-all cursor-default group"
                            >
                                <MapPin className="w-4 h-4 text-orange-600 group-hover:scale-125 transition-transform" />
                                <span className="text-xs font-bold uppercase tracking-wide text-gray-300 group-hover:text-white">{region}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. Corporate DNA / Values */}
            <section className="py-24 bg-white border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="space-y-3">
                        <Zap className="w-8 h-8 text-orange-600 mx-auto" />
                        <h4 className="font-bold text-sm uppercase">Speed</h4>
                        <p className="text-[10px] text-gray-500 leading-relaxed">Fastest lead times from Guangzhou factories.</p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-3">
                        <ShieldCheck className="w-8 h-8 text-purple-600 mx-auto" />
                        <h4 className="font-bold text-sm uppercase">Integrity</h4>
                        <p className="text-[10px] text-gray-500 leading-relaxed">100% authenticity or money back guarantee.</p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-3">
                        <Briefcase className="w-8 h-8 text-blue-600 mx-auto" />
                        <h4 className="font-bold text-sm uppercase">Empowerment</h4>
                        <p className="text-[10px] text-gray-500 leading-relaxed">Helping local SMEs scale with global inventory.</p>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
