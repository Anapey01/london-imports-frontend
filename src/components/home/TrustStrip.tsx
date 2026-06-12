'use client';

import React from 'react';
import { Truck, ShieldCheck, Award, Smartphone } from 'lucide-react';



export default function TrustStrip() {
    const items = [
        {
            icon: Truck,
            title: 'Nationwide Delivery',
            description: 'Accra, Kumasi & all regions',
        },
        {
            icon: ShieldCheck,
            title: 'Secure Payments',
            description: 'MTN & Vodafone MoMo',
        },
        {
            icon: Award,
            title: 'Verified Quality',
            description: 'Authentication at sorting hubs',
        },
        {
            icon: Smartphone,
            title: 'Pay in GHS',
            description: 'Zero international card hurdles',
        },
    ];

    // Duplicate list to create a seamless infinite marquee effect
    const doubleItems = [...items, ...items];

    return (
        <section className="md:hidden w-full overflow-hidden bg-white dark:bg-slate-950 border-y border-slate-100/80 dark:border-slate-900/80 py-3 relative z-20 select-none opacity-50 hover:opacity-100 transition-opacity duration-300">

            <div className="w-full overflow-hidden relative">
                {/* Faded edges overlay for premium depth */}
                <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white dark:from-slate-950 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white dark:from-slate-950 to-transparent z-10 pointer-events-none" />

                {/* Marquee Track */}
                <div className="animate-marquee gap-16 md:gap-24 flex items-center">
                    {doubleItems.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <div key={index} className="flex items-center gap-3 shrink-0">
                                <div className="w-5 h-5 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-800">
                                    <Icon className="w-3 h-3 text-slate-400 dark:text-slate-500" strokeWidth={2.5} />
                                </div>
                                <div className="flex items-center gap-1.5 whitespace-nowrap">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                                        {item.title}
                                    </span>
                                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">
                                        ({item.description})
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
