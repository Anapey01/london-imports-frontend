'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { sounds } from '@/lib/sounds';
import { PhoneMockup } from '@/components/how-it-works/PhoneMockup';
import { ArrowUpRight, Zap, ShieldCheck, Globe, Truck } from 'lucide-react';
import ScrollDepthTracker from '@/components/analytics/ScrollDepthTracker';

export default function HowItWorksPage() {
    const [activeStep, setActiveStep] = useState(0);

    // Auto-rotate steps (Logistics heartbeat)
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % 4);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const steps = [
        {
            id: 'STEP 01',
            title: 'Pick Your Items',
            desc: 'Find the best products from China, picked for quality and price.',
            icon: <Globe className="w-5 h-5" strokeWidth={1} />
        },
        {
            id: 'STEP 02',
            title: 'Book Your Spot',
            desc: 'Pay a small deposit to save your items. Your money is protected by our safety guarantee.',
            icon: <ShieldCheck className="w-5 h-5" strokeWidth={1} />
        },
        {
            id: 'STEP 03',
            title: 'Shipping on its Way',
            desc: 'We group your orders together for fast and safe shipping from China to Ghana.',
            icon: <Zap className="w-5 h-5 text-emerald-500" strokeWidth={1} />
        },
        {
            id: 'STEP 04',
            title: 'Inspection & Pickup',
            desc: 'Check your items at our Accra Center. Pay the final balance when you collect them.',
            icon: <Truck className="w-5 h-5" strokeWidth={1} />
        }
    ];

    const howToSchema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Import from China to Ghana",
        "description": "A 4-step process for buying and shipping products via London's Imports.",
        "step": steps.map((s, i) => ({
            "@type": "HowToStep",
            "position": i + 1,
            "name": s.title,
            "text": s.desc,
            "url": "https://londonsimports.com/how-it-works"
        })),
        "totalTime": "P56D",
        "supply": [
            { "@type": "HowToSupply", "name": "Mobile Money Payment" },
            { "@type": "HowToSupply", "name": "London's Imports Service Access" }
        ]
    };

    return (
        <div className="min-h-screen bg-white relative pb-32 selection:bg-emerald-100">
            <ScrollDepthTracker pageName="how_it_works" />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
            />

            {/* 1. ARCHITECTURAL HEADER */}
            <header className="relative z-10 pt-24 pb-16 px-6 max-w-7xl mx-auto border-b border-slate-50">
                <div className="flex items-center gap-4 mb-12">
                    <span className="h-px w-12 bg-slate-900" />
                    <span className="text-[10px] font-black tracking-[0.4em] uppercase text-slate-400">
                        How We Help You / London&apos;s
                    </span>
                </div>
                
                <h1 className="text-5xl md:text-8xl lg:text-9xl font-serif font-bold leading-[0.85] tracking-tighter text-slate-900 mb-16">
                    Direct <br />
                    To Your <br />
                    <span className="italic font-light text-slate-200">Doorstep.</span>
                </h1>

                <p className="max-w-2xl text-xl md:text-2xl text-slate-500 font-medium leading-relaxed">
                    A simple 4-step way to bring quality products from the world&apos;s biggest factories directly to you in Ghana.
                </p>
            </header>

            {/* 2. THE PROTOCOL EXECUTION (Animated Split Grid) */}
            <section className="pt-24 max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">
                    
                    {/* Left: Interactive Step Ledger */}
                    <div className="lg:col-span-7 space-y-px bg-slate-100 border border-slate-100">
                        {steps.map((item, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    sounds.click();
                                    setActiveStep(i);
                                }}
                                className={`w-full text-left p-10 md:p-14 transition-all group relative overflow-hidden ${activeStep === i 
                                    ? 'bg-white' 
                                    : 'bg-slate-50/50 hover:bg-white'
                                    }`}
                            >
                                {activeStep === i && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-900" />
                                )}
                                <div className="flex items-start gap-10">
                                    <div className="flex flex-col gap-4 pt-1">
                                        <span className={`text-[10px] font-black uppercase tracking-[0.3em] transition-colors ${activeStep === i ? 'text-emerald-500' : 'text-slate-200'}`}>
                                            {item.id}
                                        </span>
                                        <div className={`transition-opacity duration-700 ${activeStep === i ? 'opacity-100' : 'opacity-20'}`}>
                                            {item.icon}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className={`text-3xl md:text-4xl font-serif font-bold mb-6 tracking-tight leading-none transition-colors ${activeStep === i ? 'text-slate-900' : 'text-slate-300'}`}>
                                            {item.title}
                                        </h3>
                                        <p className={`text-sm md:text-base leading-relaxed font-medium transition-all duration-700 ${activeStep === i ? 'text-slate-400 opacity-100' : 'text-slate-300 opacity-0 h-0 overflow-hidden'}`}>
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Right: Phone Mockup (Strategic Anchor) */}
                    <div className="lg:col-span-5 flex justify-center lg:sticky lg:top-32 py-12 lg:py-0 border-l border-slate-50">
                        <PhoneMockup activeStep={activeStep} />
                    </div>
                </div>
            </section>

            {/* 3. ARCHITECTURAL CTA SECTION */}
            <section className="mt-48 pt-32 border-t border-slate-100 max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-px bg-slate-100 border border-slate-100 mb-24">
                    <div className="bg-white p-12 md:p-20 flex flex-col justify-between group">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mb-10 block">Step 01</span>
                            <h3 className="text-5xl md:text-7xl font-serif font-bold text-slate-900 mb-10 tracking-tighter leading-[0.85]">
                                Ready to <br /> 
                                <span className="italic font-light text-slate-200">Place an Order?</span>
                            </h3>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-12 items-start sm:items-center">
                            <Link href="/products" className="group/link inline-flex items-center gap-4 text-[11px] font-black text-slate-900 border-b border-black pb-2 hover:opacity-60 transition-all uppercase tracking-widest">
                                Browse New Items
                                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                            </Link>
                            <Link href="/register" className="text-[11px] font-black text-slate-300 hover:text-slate-900 transition-colors uppercase tracking-widest leading-none">
                                Sign Up Now
                            </Link>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-12 md:p-20 border-l border-slate-100">
                        <div className="space-y-12">
                             <div className="pb-10 border-b border-slate-100">
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-4">Our Guarantee</span>
                                <p className="text-xl font-serif font-bold text-slate-900 leading-tight">Your order is safe. We use secure payments and local insurance for every box.</p>
                             </div>
                             <div className="pb-10 border-b border-slate-100">
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-4">Direct Delivery</span>
                                <p className="text-xl font-serif font-bold text-slate-900 leading-tight">No middlemen. We go straight to the factory to bring you the best Price.</p>
                             </div>
                             <p className="text-[11px] text-slate-300 italic font-medium leading-relaxed">
                                London&apos;s Imports handles all the difficult logistics work so you can focus on growing your business.
                             </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
