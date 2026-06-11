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

    return (
        <section className="bg-white dark:bg-slate-950 border-y border-slate-100 dark:border-slate-900 py-4 px-4 relative z-20">
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {items.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <div key={index} className="flex items-center gap-3 px-2 py-1.5 md:justify-center">
                            <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center shrink-0 border border-slate-100/50 dark:border-slate-800/50">
                                <Icon className="w-4 h-4 text-brand-emerald" strokeWidth={2} />
                            </div>
                            <div className="text-left">
                                <p className="text-[11px] font-black uppercase tracking-wider text-slate-950 dark:text-white leading-tight">
                                    {item.title}
                                </p>
                                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium leading-none mt-0.5">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
