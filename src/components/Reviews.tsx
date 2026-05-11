'use client';

import React from 'react';
import { Star, CheckCircle, MessageSquare } from 'lucide-react';

const reviews = [
    {
        id: "ACT-01",
        name: "Hanneth Musah",
        role: "Verified Customer",
        title: "Legitimate & Trusted Infrastructure.",
        text: "My satisfaction with the experience is absolute. London's Imports is genuine, patient, and reliable. My all-time preferred partner for West African logistics.",
        rating: 5,
        date: "2 days ago",
        reply: "Trust is our primary asset. Thank you for the confirmation."
    },
    {
        id: "ACT-02",
        name: "Gina Addison",
        role: "Verified Customer",
        title: "Absolute Consistency and Updates.",
        text: "The reliability and patience shown throughout the process were exceptional. Continuous updates on transit status were provided without prompt.",
        rating: 5,
        date: "2 days ago",
        reply: "We maintain a policy of radical transparency."
    },
    {
        id: "ACT-03",
        name: "Yesutor Emmanuella Yovogan",
        role: "Verified Customer",
        title: "The Calm in Logistics Complexity.",
        text: "One of the most professional mini-importers in the corridor. A calm, humble, and highly efficient shopping experience. No exceptions.",
        rating: 5,
        date: "2 days ago",
        reply: "Efficiency is our benchmark. We value your collaboration."
    },
    {
        id: "ACT-04",
        name: "Eddy Nyakus",
        role: "Verified Customer",
        title: "A Benchmark for Integrity.",
        text: "Genuine, transparent, and reliable. What is ordered is truly what arrives—no misleading descriptions. Handled with architectural professionalism.",
        rating: 5,
        date: "2 days ago",
        reply: "Professionalism is non-negotiable at London's Imports."
    },
    {
        id: "ACT-05",
        name: "Wilhelmina Mensah",
        role: "Verified Customer",
        title: "Unmatched Accuracy in Sourcing.",
        text: "This is the most trusted source I know. They provide exactly what is required. In a market of uncertainty, they are the anchor.",
        rating: 5,
        date: "2 days ago"
    },
    {
        id: "ACT-06",
        name: "Kofy Smile",
        role: "Verified Customer",
        title: "Leading the Digital Corridor.",
        text: "The best mini-importation framework in Ghana right now. The Paystack integration and streamlined logistics set them apart definitively.",
        rating: 5,
        date: "3 days ago"
    }
];

export default function Reviews() {
    return (
        <section className="bg-white py-32 border-t border-slate-50 relative overflow-hidden selection:bg-emerald-100">
            <div className="max-w-7xl mx-auto px-6">
                
                {/* 1. ARCHITECTURAL HEADER SECTION */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-12 mb-32 border-b border-slate-900 pb-20">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-4 mb-8">
                            <span className="h-px w-10 bg-slate-900" />
                            <span className="text-[10px] font-black tracking-[0.4em] uppercase text-slate-400">
                                Customer Stories
                            </span>
                        </div>
                        <h2 className="text-5xl md:text-8xl lg:text-9xl font-serif font-bold leading-[0.85] tracking-tighter text-slate-900">
                            Verified <br />
                            <span className="italic font-light text-slate-200">Testimonials</span>.
                        </h2>
                    </div>

                    <div className="text-right">
                         <div className="flex items-center justify-end gap-1 mb-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} className="w-5 h-5 text-slate-900 fill-slate-900" strokeWidth={1} />
                            ))}
                         </div>
                         <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-300">
                            Verified Reviews
                         </p>
                    </div>
                </div>

                {/* 2. THE SUCCESS GRID (Asymmetrical Architectural Grid) */}
                <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-px bg-slate-100 border border-slate-100">
                    {reviews.map((review, i) => (
                        <div
                            key={i}
                            className={`bg-white p-12 md:p-16 flex flex-col group transition-all duration-700 hover:bg-slate-50/50 
                                ${i % 3 === 0 ? 'lg:col-span-4' : 'lg:col-span-4'}
                                ${i === 0 ? 'lg:col-span-8 md:border-b-0' : ''}
                                ${i === reviews.length - 1 ? 'lg:col-span-12' : ''}
                            `}
                        >
                            {/* Stars & Protocol ID */}
                            <div className="flex items-center justify-between mb-10">
                                <span className="text-[9px] font-black text-slate-200 uppercase tracking-widest group-hover:text-emerald-500 transition-colors">
                                    {review.id}
                                </span>
                                <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, starI) => (
                                        <Star key={starI} className="w-2.5 h-2.5 text-slate-100 fill-slate-100" />
                                    ))}
                                </div>
                            </div>

                            {/* Narrative Quote */}
                            <div className="flex-1">
                                <h3 className="text-2xl md:text-4xl font-serif font-bold text-slate-900 mb-8 tracking-tighter leading-[1.1] transition-all group-hover:italic">
                                    {review.title}
                                </h3>

                                <p className="text-sm md:text-base text-slate-400 font-medium leading-relaxed italic border-l border-slate-50 pl-8 mb-12">
                                    &quot;{review.text}&quot;
                                </p>

                                {/* Response Protocol (Indented Ledger) */}
                                {review.reply && (
                                    <div className="ml-8 p-6 bg-slate-50/50 border-l border-slate-900 transition-colors group-hover:bg-emerald-50/30">
                                        <div className="flex items-center gap-3 mb-4">
                                            <MessageSquare className="w-3.5 h-3.5 text-slate-300" strokeWidth={1.5} />
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                                Support Response
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-slate-500 font-bold italic leading-relaxed">
                                            &quot;{review.reply}&quot;
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Author Identification */}
                            <div className="mt-16 pt-8 border-t border-slate-50 flex items-center justify-between">
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
                                        {review.name}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <CheckCircle className="w-3 h-3 text-emerald-500" />
                                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic">{review.role}</span>
                                    </div>
                                </div>
                                <span className="text-[9px] font-black text-slate-100 uppercase tracking-widest">{review.date}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 3. ARCHITECTURAL CALLOUT (Minimalist Trust) */}
                <div className="mt-32 pt-24 border-t border-slate-100">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-12">
                         <div className="max-w-xl">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mb-6 block">Consolidated Analytics</span>
                            <p className="text-xl font-serif font-bold text-slate-400 leading-snug">
                                Over 1,200 successful deliveries independently verified.
                            </p>
                         </div>
                         <div className="flex items-center gap-12 opacity-20">
                             <div className="h-px w-24 bg-slate-900" />
                             <span className="text-[9px] font-black uppercase tracking-widest text-slate-900">Verified Business / 2026</span>
                         </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
